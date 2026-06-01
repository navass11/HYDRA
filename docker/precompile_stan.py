"""
Pre-compile the GEV Stan model during the Docker image build.
httpstan caches the compiled C++ extension under ~/.cache/httpstan/<version>/models/<hash>/.
At runtime, stan.build() finds the cache and skips compilation entirely.
"""
import asyncio
import numpy as np

_GEV_STAN_CODE = """
data {
    int<lower=1> N;
    vector[N] y;
    real y_mean;
    real<lower=0> y_sd;
}
parameters {
    real mu_raw;
    real<lower=0> sigma;
    real<lower=-1, upper=1> xi;
}
transformed parameters {
    real mu = y_mean + y_sd * mu_raw;
}
model {
    mu_raw ~ normal(0, 1);
    sigma  ~ lognormal(log(y_sd), 1);
    xi     ~ normal(0, 0.5);
    for (n in 1:N) {
        real z = (y[n] - mu) / sigma;
        if (abs(xi) > 1e-6) {
            real t = 1.0 + xi * z;
            if (t > 0)
                target += -log(sigma) - (1.0 + 1.0/xi) * log(t)
                          - pow(t, -1.0/xi);
            else
                target += negative_infinity();
        } else {
            target += -log(sigma) - z - exp(-z);
        }
    }
}
"""

dummy = [10.0, 20.0, 30.0, 40.0, 50.0, 60.0, 70.0, 80.0, 90.0, 100.0]
data = {"N": len(dummy), "y": dummy, "y_mean": float(np.mean(dummy)), "y_sd": float(np.std(dummy, ddof=1))}

print("Pre-compiling GEV Stan model (this takes a few minutes)...")
import stan
model = stan.build(_GEV_STAN_CODE, data=data)
print("GEV Stan model compiled and cached successfully.")
