"""Regression coverage for calendar aggregation in the trend API."""
import asyncio
import io
import json
import unittest

import numpy as np
import pandas as pd
from fastapi import HTTPException, UploadFile

from api.routers.trend import _aggregate_series, _load_series_async, trend_analyze


class TrendAggregationTests(unittest.TestCase):
    def analyze(self, aggregation, file=None, variable="precipitation"):
        return asyncio.run(trend_analyze(file=file, demo="false" if file else "true", variable=variable, aggregation=aggregation))

    def test_demo_has_distinct_monthly_and_annual_series_with_same_rainfall_total(self):
        annual = self.analyze("annual")
        monthly = self.analyze("monthly")
        self.assertEqual(annual["summary"]["n_values"], 50)
        self.assertEqual(monthly["summary"]["n_values"], 600)
        self.assertEqual(annual["summary"]["start"], "1974")
        self.assertEqual(monthly["summary"]["start"], "1974-01")
        self.assertAlmostEqual(annual["series"][0]["value"], sum(p["value"] for p in monthly["series"][:12]), places=3)
        self.assertNotEqual(annual["sens_slope"]["slope"], monthly["sens_slope"]["slope"])

    def test_numeric_years_are_not_parsed_as_unix_timestamps_or_invented_months(self):
        raw = b"year,value\n2000,10\n2001,20\n2002,30\n"
        series = asyncio.run(_load_series_async(UploadFile(io.BytesIO(raw), filename="annual.csv"), False))
        self.assertEqual(list(series.index.year), [2000, 2001, 2002])
        with self.assertRaises(HTTPException) as caught:
            _aggregate_series(series, "monthly", "precipitation")
        self.assertEqual(caught.exception.status_code, 400)

    def test_calendar_aggregation_uses_sum_or_mean_and_excludes_empty_months(self):
        series = pd.Series([10., 20., 40.], index=pd.to_datetime(["2020-01-01", "2020-01-02", "2020-03-01"]))
        rain = _aggregate_series(series, "monthly", "precipitation")
        temp = _aggregate_series(series, "monthly", "temperature")
        self.assertEqual(list(rain), [30., 40.])
        self.assertEqual(list(temp), [15., 40.])
        self.assertEqual(list(rain.index.month), [1, 3])

    def test_sen_uses_elapsed_years_when_the_record_has_gaps(self):
        years = [2000, 2001, 2003, 2004, 2006, 2007, 2009, 2010, 2012, 2013]
        csv = "year,value\n" + "\n".join(f"{year},{2 * (year - 2000) + 5}" for year in years)
        result = self.analyze("annual", UploadFile(io.BytesIO(csv.encode()), filename="gaps.csv"))
        self.assertEqual(result["sens_slope"]["slope"], 2.)
        self.assertEqual(result["sen_line"][-1]["value"], 31.)

    def test_constant_series_returns_valid_json(self):
        csv = "year,value\n" + "\n".join(f"{year},10" for year in range(2000, 2010))
        result = self.analyze("annual", UploadFile(io.BytesIO(csv.encode()), filename="constant.csv"))
        self.assertEqual(result["mann_kendall"]["p_value"], 1.)
        json.dumps(result, allow_nan=False)


if __name__ == "__main__":
    unittest.main()
