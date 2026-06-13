"""
Jupyter server config — local development.
Launch JupyterLab from the repo root and these settings take effect:
  jupyter lab --config jupyter_server_config.py
"""

# Hide non-notebook directories from the file browser
c.ContentsManager.hide_globs = [
    "papers", "thesis", "web", "api", "deploy", "infra", "docs",
    "*.egg-info", "__pycache__", ".git", ".env", ".venv", "venv",
    "build", "dist", "site", ".cache", ".pytest_cache",
    "mkdocs.yml", "*.pdf",
]

# Keep Azure/Jupyter sessions from accumulating idle kernels until websockets
# start timing out. Long notebook executions are still allowed while connected.
c.MappingKernelManager.cull_idle_timeout = 1800
c.MappingKernelManager.cull_interval = 300
c.MappingKernelManager.cull_connected = False
c.MappingKernelManager.shutdown_wait_time = 10
