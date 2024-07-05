from app.models import User, Product
from flask import Blueprint, render_template

# Define la blueprint principal
main_bp = Blueprint('main', __name__)

# Define las rutas y funciones para la blueprint principal


@main_bp.route('/')
def index():
    return render_template('home.html')


@main_bp.route('/about')
def about():
    return render_template('about.html')


@main_bp.route('/menu')
def menu():
    # Lógica para mostrar el menú del restaurante
    return render_template('menu.html')


@main_bp.route('/reservation')
def reservation():
    # Lógica para manejar reservas
    return render_template('reservation.html')

# Agrega más rutas y funciones según sea necesario


# Si necesitas importar modelos o bases de datos, hazlo aquí fuera de las rutas para evitar importaciones circulares

# Puedes definir más lógica aquí según las necesidades de tu aplicación
