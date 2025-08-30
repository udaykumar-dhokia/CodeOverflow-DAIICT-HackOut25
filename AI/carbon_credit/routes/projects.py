from flask import Blueprint, request, jsonify, current_app
import os
from database import db
from models import Project, CountryEmission
from services.carbon_clac import calculate_carbon_credits

projects_bp = Blueprint("projects", __name__)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in current_app.config["ALLOWED_EXTENSIONS"]

@projects_bp.route("/submit", methods=["POST"])
def submit_project():
    data = request.form
    file = request.files.get("document")

    if not file or not allowed_file(file.filename):
        return jsonify({"error": "Invalid document"}), 400

    filename = file.filename
    filepath = os.path.join(current_app.config["UPLOAD_FOLDER"], filename)
    file.save(filepath)

    country = data.get("country")
    energy = float(data.get("energy_generated"))
    technology = data.get("technology")

    emission = CountryEmission.query.filter_by(country=country).first()
    if not emission:
        return jsonify({"error": "Emission factor not available"}), 400

    credits = calculate_carbon_credits(energy, emission.grid_emission_factor)

    project = Project(
        user_id=1,  # TODO: link with auth
        country=country,
        energy_generated=energy,
        technology=technology,
        carbon_credits=credits,
        document_path=filepath
    )
    db.session.add(project)
    db.session.commit()

    return jsonify({"message": "Project submitted", "credits": credits})
