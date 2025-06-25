# File: interactive_map.py

from ipyleaflet import Map, DrawControl
from ipywidgets import Output, VBox
from IPython.display import display

## Create Interactive Maps in Notebooks ##
def interactive_map(zoom=2, center=(0, 0)):
    # Create a map centered at a specified location
    m = Map(center=center, zoom=zoom, scroll_wheel_zoom=True)

    # Drawing control for the map
    draw_control = DrawControl()

    # Enable drawing of rectangles only
    draw_control.rectangle = {
        "shapeOptions": {
            "color": "#6bc2e5",
            "fillOpacity": 0.5
        }
    }

    # Optional: allow adding a single marker
    draw_control.marker = {
        "shapeOptions": {"color": "#ff0000"}
    }

    # Disable other drawing tools
    draw_control.circle = {}
    draw_control.polyline = {}
    draw_control.polygon = {}
    draw_control.circlemarker = {}

    # Output widget to display selected coordinates
    output = Output()

    # List to store selected coordinate areas or points
    coordinates_list = []

    # Function to handle the drawing event
    def handle_draw(self, action, geo_json):
        nonlocal coordinates_list
        with output:
            geometry_type = geo_json['geometry']['type']
            coordinates = geo_json['geometry']['coordinates']
            output.clear_output()

            if action == 'created':
                if geometry_type == 'Polygon':
                    # Extract bounding box coordinates from rectangle corners
                    north_latitude = coordinates[0][1][1]  # y-coordinate of top-left corner
                    west_longitude = coordinates[0][0][0]  # x-coordinate of top-left corner
                    south_latitude = coordinates[0][0][1]  # y-coordinate of bottom-left corner
                    east_longitude = coordinates[0][2][0]  # x-coordinate of bottom-right corner
                    
                    # Format: [North, West, South, East]
                    area = [north_latitude, west_longitude, south_latitude, east_longitude]
                    coordinates_list.append(area)

                    # Display the selected area with labeled directions
                    print(f"Selected area:\n"
                          f"  North Latitude: {north_latitude}\n"
                          f"  South Latitude: {south_latitude}\n"
                          f"  West Longitude: {west_longitude}\n"
                          f"  East Longitude: {east_longitude}")

                elif geometry_type == 'Point':
                    # Extract and display the coordinates of a point
                    lat, lon = coordinates[1], coordinates[0]
                    coordinates_list.append({'type': 'point', 'value': [lat, lon]})
                    print(f"Selected point:\n"
                          f"  Latitude: {lat}\n"
                          f"  Longitude: {lon}")

    # Link the draw event to the handler function
    draw_control.on_draw(handle_draw)

    # Add drawing controls to the map
    m.add_control(draw_control)

    # Display the map and output widget
    display(VBox([m, output]))
    
    # Return the list of selected coordinates (areas or points)
    return coordinates_list