from setuptools import setup, find_packages
from pathlib import Path
this_directory = Path(__file__).parent
#long_description = (this_directory / "README.md").read_text()
with open(this_directory / "README.md", encoding="utf-8") as f:
    long_description = f.read()


setup(  name='HYDRA',
        packages = find_packages(),
        license = "GPLv3",
        version='0.0.1',
        description='🌎 A modular Python library for hydroclimatic data management, bias correction, and hydrological modeling — designed for climate change impact studies and water balance analysis.',
        long_description=long_description,
        long_description_content_type='text/markdown',
        author='Salvador Navas <salvador.navas@unican.es>, Manuel del Jesus <manuel.deljesus@unican.es>',
        author_email='salvador.navas@unican.es, manuel.deljesus@unican.es',
        maintainer       = 'Salvador Navas',
        maintainer_email = 'salvador.navas@unican.es',
        url = 'https://github.com/navass11/HYDRA',

        include_package_data = True,
        python_requires='>=3.7, <4',
        install_requires=[
            'numpy',
            'pandas',
            'scipy',
            'datetime',
            'matplotlib',
            'pyyaml',
        ],
        extras_require={'plotting': ['matplotlib>=2.2.0']}
        )
