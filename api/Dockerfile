FROM python:3.11-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
        git build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install pyhydra dependencies + API dependencies
COPY docker/requirements.txt /tmp/hydra-requirements.txt
COPY api/requirements.txt /tmp/api-requirements.txt
# setuptools<80: >=80 drops pkg_resources, breaking pystan and other legacy packages.
# pySWATPlus uses legacy setup.py requiring setuptools at build time (no-build-isolation).
RUN pip install --no-cache-dir "setuptools<80" && \
    pip install --no-cache-dir --no-build-isolation pySWATPlus && \
    pip install --no-cache-dir \
        -r /tmp/hydra-requirements.txt \
        -r /tmp/api-requirements.txt

# Install CoSMoS_py from the bundled wheel.
COPY docker/cosmos_py-0.1.0-py3-none-any.whl /tmp/
RUN pip install --no-cache-dir /tmp/cosmos_py-0.1.0-py3-none-any.whl

# Copy project and install pyhydra
COPY . .
RUN pip install --no-cache-dir -e .

EXPOSE 8000
CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000"]
