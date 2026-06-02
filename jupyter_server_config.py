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
