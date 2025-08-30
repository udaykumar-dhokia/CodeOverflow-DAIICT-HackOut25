from flask import Flask
from config import Config
from database import db
from routes.projects import projects_bp
from routes.admin import admin_bp
from routes.emissions import emissions_bp
import os

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)

    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

    app.register_blueprint(projects_bp, url_prefix="/projects")
    app.register_blueprint(admin_bp, url_prefix="/admin")
    app.register_blueprint(emissions_bp, url_prefix="/emissions")

    with app.app_context():
        db.create_all()

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
