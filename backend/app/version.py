"""
Aequitas LV-COP Backend - Version Information
=============================================

Single source of truth for version number.
"""

__version__ = "1.0.0"
__version_info__ = tuple(map(int, __version__.split(".")))

# Build metadata
BUILD_DATE = "2026-02-04"
GIT_COMMIT = ""  # Set by CI/CD pipeline
