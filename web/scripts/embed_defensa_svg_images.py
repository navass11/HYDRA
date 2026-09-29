from base64 import b64encode
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "public/defensa/figures"

pairs = [
    (ROOT / "besaya_fig05_hydraulic_bifurcation_es.svg", ROOT / "besaya_fig05_hydraulic_bifurcation.png", "/defensa/figures/besaya_fig05_hydraulic_bifurcation.png"),
    (ROOT / "fig_iahr2022_comparativa_es.svg", ROOT / "fig_iahr2022_comparativa.png", "/defensa/figures/fig_iahr2022_comparativa.png"),
]

for svg_path, image_path, placeholder in pairs:
    svg = svg_path.read_text(encoding="utf-8")
    data_uri = "data:image/png;base64," + b64encode(image_path.read_bytes()).decode("ascii")
    if placeholder in svg:
        svg_path.write_text(svg.replace(placeholder, data_uri), encoding="utf-8")
        print(f"Imagen científica incrustada: {svg_path.name}")
    elif "data:image/png;base64," in svg:
        print(f"Ya estaba incrustada: {svg_path.name}")
    else:
        raise RuntimeError(f"No se encontró el marcador de imagen en {svg_path}")
