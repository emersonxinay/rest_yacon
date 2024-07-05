from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager

db = SQLAlchemy()
login_manager = LoginManager()


def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')

    db.init_app(app)
    login_manager.init_app(app)
    login_manager.login_view = 'auth.login'

    # Importa las blueprints y modelos después de inicializar db para evitar importaciones circulares
    from app.main import main_bp
    from app.auth import auth_bp
    from app.admin import admin_bp

    app.register_blueprint(main_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(admin_bp)

    # Importa los modelos dentro de la función de la aplicación para evitar importaciones circulares
    from app.models import User, Category, Product

    with app.app_context():
        db.create_all()

    return app


@login_manager.user_loader
def load_user(user_id):
    from app.models import User  # Importa el modelo User aquí si es necesario
    return User.query.get(int(user_id))
