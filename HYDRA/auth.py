"""
Author: Salvador Navas
Date: 2025-06-27
"""

import getpass
import os
import stat
import platform
from pathlib import Path

def request_earthdata_credentials():
    user = input("🔑 Usuario Earthdata: ")
    pwd = getpass.getpass("🔒 Contraseña (oculta): ")
    return user, pwd



def create_netrc(username: str, password: str):
    """
    Crea un archivo .netrc válido para autenticación con Earthdata.
    Detecta automáticamente el sistema operativo y aplica permisos seguros.
    """
    netrc_content = f"""machine urs.earthdata.nasa.gov
login {username}
password {password}
"""

    # Determinar ruta HOME
    home = Path.home()
    netrc_path = home / '.netrc'

    # Escribir el archivo
    with open(netrc_path, 'w') as f:
        f.write(netrc_content)

    # Establecer permisos (solo en sistemas tipo Unix)
    if platform.system() != 'Windows':
        os.chmod(netrc_path, stat.S_IRUSR | stat.S_IWUSR)  # chmod 600

    print(f"✅ Archivo .netrc creado en: {netrc_path}")
    return netrc_path

# Puedes añadir otros métodos: CDS API (ERA5), ESGF, etc.