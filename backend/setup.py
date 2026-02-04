#!/usr/bin/env python
# ==============================================================================
# AEQUITAS LV-COP BACKEND - SETUP.PY
# ==============================================================================
# Package setup for pip installation
# ==============================================================================

from pathlib import Path

from setuptools import find_packages, setup


def read_requirements(filename: str) -> list[str]:
    """Read requirements from file."""
    requirements_path = Path(__file__).parent / filename
    if requirements_path.exists():
        return [
            line.strip()
            for line in requirements_path.read_text().splitlines()
            if line.strip() and not line.startswith("#") and not line.startswith("-r")
        ]
    return []


# Read long description from README
readme_path = Path(__file__).parent / "docs" / "README.md"
long_description = readme_path.read_text() if readme_path.exists() else ""

setup(
    name="aequitas-backend",
    version="1.0.0",
    author="Aequitas Engineering",
    author_email="engineering@aequitas.ai",
    description="Crisis-resilient intraday liquidity forecasting API",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/aequitas/aequitas-mvp",
    project_urls={
        "Bug Tracker": "https://github.com/aequitas/aequitas-mvp/issues",
        "Documentation": "https://docs.aequitas.ai",
        "Source Code": "https://github.com/aequitas/aequitas-mvp",
    },
    license="MIT",
    packages=find_packages(exclude=["tests", "tests.*", "scripts", "scripts.*"]),
    include_package_data=True,
    python_requires=">=3.11",
    install_requires=read_requirements("requirements.txt"),
    extras_require={
        "dev": read_requirements("requirements-dev.txt"),
        "ml": read_requirements("requirements-ml.txt"),
    },
    entry_points={
        "console_scripts": [
            "aequitas=app.main:main",
            "aequitas-worker=app.tasks.celery_app:main",
        ],
    },
    classifiers=[
        "Development Status :: 4 - Beta",
        "Environment :: Web Environment",
        "Framework :: FastAPI",
        "Intended Audience :: Financial and Insurance Industry",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3.12",
        "Topic :: Office/Business :: Financial",
        "Topic :: Scientific/Engineering :: Artificial Intelligence",
        "Typing :: Typed",
    ],
    keywords=[
        "fintech",
        "liquidity",
        "forecasting",
        "trading",
        "machine-learning",
        "fastapi",
        "hedge-fund",
        "treasury",
    ],
)
