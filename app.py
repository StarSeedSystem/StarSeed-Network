# app.py
from flask import Flask

# Crear una instancia de la aplicación Flask
# __name__ es una variable especial en Python que obtiene el nombre del módulo actual.
# Flask lo usa para encontrar recursos como plantillas y archivos estáticos.
app = Flask(__name__)

# Definir una ruta para la URL raíz ('/')
# Cuando alguien visite la dirección principal de tu sitio web, se ejecutará esta función.
@app.route('/')
def hola_mundo():
    """Esta función se ejecuta cuando se accede a la ruta '/'."""
    return '¡Hola, StarSeed Network desde Flask!'

# Esta condición asegura que el servidor de desarrollo solo se ejecute
# cuando el script es ejecutado directamente (no cuando es importado como módulo).
if __name__ == '__main__':
    # app.run() inicia el servidor de desarrollo de Flask.
    # debug=True activa el modo de depuración, que es útil durante el desarrollo
    # porque muestra errores detallados en el navegador y recarga automáticamente
    # el servidor cuando haces cambios en el código.
    # ¡NUNCA uses debug=True en un entorno de producción!
    app.run(debug=True)