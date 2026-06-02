from importlib.metadata import PackageNotFoundError, version

try:
    __version__ = version("pyhydra")
except PackageNotFoundError:
    __version__ = "unknown"
