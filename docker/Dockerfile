FROM python:3.12-slim

# System dependencies needed for compiling some packages
RUN apt-get update && apt-get install -y --no-install-recommends \
        git \
        build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /hydra

# Install Python dependencies first (cached layer — only re-runs if requirements.txt changes)
COPY docker/requirements.txt /tmp/requirements.txt
# pySWATPlus uses legacy setup.py that requires setuptools at build time but doesn't declare it.
RUN pip install --no-cache-dir --upgrade setuptools && \
    pip install --no-cache-dir --no-build-isolation pySWATPlus && \
    pip install --no-cache-dir -r /tmp/requirements.txt

# Install CoSMoS_py from GitHub. The old bundled wheel is not committed,
# so CI builds must fetch the package from its source repository.
RUN pip install --no-cache-dir git+https://github.com/navass11/CoSMoS_py.git

# Copy the full repo and install pyhydra
COPY . .
RUN pip install --no-cache-dir -e .

# Jupyter configuration: disable token for local use, allow all origins
RUN jupyter lab --generate-config && \
    echo "c.ServerApp.token = ''" >> /root/.jupyter/jupyter_lab_config.py && \
    echo "c.ServerApp.password = ''" >> /root/.jupyter/jupyter_lab_config.py && \
    echo "c.ServerApp.allow_origin = '*'" >> /root/.jupyter/jupyter_lab_config.py && \
    echo "c.ServerApp.open_browser = False" >> /root/.jupyter/jupyter_lab_config.py

EXPOSE 8888

CMD ["jupyter", "lab", \
     "--ip=0.0.0.0", \
     "--port=8888", \
     "--no-browser", \
     "--allow-root", \
     "--notebook-dir=/hydra/notebooks"]
