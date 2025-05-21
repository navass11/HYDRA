# archivo: mapa_interactivo.py

from ipyleaflet import Map, DrawControl
from ipywidgets import Output, VBox
from IPython.display import display

## Create Interactive Maps in notebooks ##
def interactive_map(zoom=2, center=(0, 0)):
    # Crear un mapa centrado en una localización inicial
    m = Map(center=center, zoom=zoom, scroll_wheel_zoom=True)

    # Control de dibujo
    draw_control = DrawControl()

    # Configuración de la herramienta de dibujo solo para rectángulos
    draw_control.rectangle = {
        "shapeOptions": {
            "color": "#6bc2e5",
            "fillOpacity": 0.5
        }
    }
    draw_control.marker = {
        "shapeOptions": {"color": "#ff0000"}
    }

    # Deshabilitar las otras herramientas de dibujo
    draw_control.circle = {}
    draw_control.polyline = {}
    draw_control.polygon = {}
    draw_control.circlemarker = {}

    # Widget de salida para mostrar coordenadas
    output = Output()

    # Lista para almacenar las coordenadas seleccionadas
    coordinates_list = []

    # Función para manejar el evento de dibujo
    def handle_draw(self, action, geo_json):
        nonlocal coordinates_list
        with output:
            geometry_type = geo_json['geometry']['type']
            coordinates = geo_json['geometry']['coordinates']
            output.clear_output()
            if action == 'created':
                if geometry_type == 'Polygon':
                    # Extraer las coordenadas de la estructura
                    north_latitude = coordinates[0][1][1]  # y de la esquina superior izquierda
                    west_longitude = coordinates[0][0][0]  # x de la esquina superior izquierda
                    south_latitude = coordinates[0][0][1]  # y de la esquina inferior izquierda
                    east_longitude = coordinates[0][2][0]  # x de la esquina inferior derecha
                    
                    # Crear el área [north_latitude, west_longitude, south_latitude, east_longitude]
                    area = [north_latitude, west_longitude, south_latitude, east_longitude]
                    coordinates_list.append(area)
                    
                    # Mostrar las coordenadas en el widget de salida
                    print(f"Área seleccionada: {area}")
                elif geometry_type == 'Point':
                    lat, lon = coordinates[1], coordinates[0]
                    coordinates_list.append({'type': 'point', 'value': [lat, lon]})
                    print(f"Punto seleccionado: lat={lat}, lon={lon}")

    # Conectar el evento de dibujo con la función
    draw_control.on_draw(handle_draw)

    # Añadir el control de dibujo al mapa
    m.add_control(draw_control)

    # Mostrar el mapa y el widget de salida
    display(VBox([m, output]))
    
    # Retornar las coordenadas cuando se complete la interacción
    return coordinates_list
