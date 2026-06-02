import cdsapi
import datetime
import os
from calendar import monthrange
from concurrent.futures import ThreadPoolExecutor, as_completed
import zipfile
import xarray as xr
import glob
import shutil

def download_era5(
    folder_out,
    api_key,
    url,
    area,
    variables_list,
    years,
    months=range(1, 13),
    max_workers=5,
    file_format='netcdf',
    frequency='hourly'  # 'hourly' or 'monthly'
):
    """
    Downloads ERA5 (Copernicus) data for a range of years and months.

    Parameters:
    - folder_out: output folder.
    - api_key: Copernicus API key.
    - url: Copernicus API URL.
    - area: bounding box [N, W, S, E].
    - variables_list: list of variables to download.
    - years: list or range of years.
    - months: list or range of months (default: 1-12).
    - max_workers: number of parallel threads (default: 5).
    - file_format: output format (default: 'netcdf').
    - frequency: 'hourly' or 'monthly'.
    """

    today_minus_10 = datetime.date.today() - datetime.timedelta(days=10)
    os.makedirs(folder_out, exist_ok=True)

    if frequency == 'hourly':
        times = [f'{h:02d}:00' for h in range(24)]
    elif frequency == 'monthly':
        times = ['00:00']
    else:
        raise ValueError("frequency must be 'hourly' or 'monthly'.")

    def download_task(year, month, day=None):
        if frequency == 'hourly':
            task_date = datetime.date(year, month, day)
            if task_date > today_minus_10:
                print(f"⏩ {task_date} is too recent (last 10 days). Skipped.")
                return
            base_filename = f"ERA5_hourly_{year}_{month:02d}_{day:02d}"
            date_str = f"{year}-{month:02d}-{day:02d}"
        else:  # monthly
            base_filename = f"ERA5_monthly_{year}_{month:02d}"
            date_str = f"{year}-{month:02d}"

        combined_path = os.path.join(folder_out, base_filename + '_combined.nc')
        temp_folder = os.path.join(folder_out, base_filename + '_tmp')
        os.makedirs(temp_folder, exist_ok=True)
        zip_path = os.path.join(temp_folder, base_filename + '.zip')

        if os.path.exists(combined_path):
            print(f"✅ Already exists: {combined_path}")
            shutil.rmtree(temp_folder, ignore_errors=True)
            return

        print(f"⬇️ Downloading {date_str} ({frequency}) ...")
        start = datetime.datetime.now()

        try:
            c = cdsapi.Client(url=url, key=api_key)

            request_dict = {
                'variable': variables_list,
                'year': [str(year)],
                'month': [f"{month:02d}"],
                'area': area,  # [N, W, S, E]
                'format': file_format,
            }

            if frequency == 'hourly':
                request_dict.update({
                    'product_type': ['reanalysis'],
                    'day': [f"{day:02d}"],
                    'time': times,
                })
                dataset = 'reanalysis-era5-single-levels'
            else:  # monthly
                request_dict.update({
                    'product_type': ['monthly_averaged_reanalysis'],
                    'time': times,
                })
                dataset = 'reanalysis-era5-single-levels-monthly-means'

            c.retrieve(dataset, request_dict, zip_path)

            # Unzip into temporary folder
            with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                zip_ref.extractall(temp_folder)
            os.remove(zip_path)
            print(f"✅ Unzipped and removed zip: {zip_path}")

            # Find extracted netcdf files
            nc_files = glob.glob(os.path.join(temp_folder, '*.nc'))

            # Load and merge all NetCDF files
            datasets = [xr.open_dataset(f) for f in nc_files]
            combined_ds = xr.merge(datasets)

            # Save combined NetCDF in output folder
            combined_ds.to_netcdf(combined_path)
            print(f"✅ Combined and saved: {combined_path}")

            # Close datasets
            for ds in datasets:
                ds.close()

            # Remove temporary folder
            shutil.rmtree(temp_folder, ignore_errors=True)

            print(f"🧹 Cleanup done. Total time: {datetime.datetime.now() - start}")

        except Exception as e:
            print(f"❌ Error on {date_str}: {str(e)}")
            with open(os.path.join(folder_out, 'download_errors.log'), 'a') as f:
                f.write(f"{datetime.datetime.now()}: Error {date_str} - {str(e)}\n")
            shutil.rmtree(temp_folder, ignore_errors=True)

    # Create task list
    tasks = []
    if frequency == 'hourly':
        for year in years:
            for month in months:
                n_days = monthrange(year, month)[1]
                for day in range(1, n_days + 1):
                    tasks.append((year, month, day))
    elif frequency == 'monthly':
        for year in years:
            for month in months:
                tasks.append((year, month, None))

    # Parallel downloads
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = [executor.submit(download_task, *t) for t in tasks]
        for future in as_completed(futures):
            future.result()
