from flask import Blueprint, jsonify
from database import db
from models import CountryEmission
from services.emission_fetcher import fetch_emission_factor

emissions_bp = Blueprint("emissions", __name__)

@emissions_bp.route("/update/<country>", methods=["POST"])
def update_emission(country):
    factor = fetch_emission_factor(country)
    emission = CountryEmission.query.filter_by(country=country).first()
    if emission:
        emission.grid_emission_factor = factor
    else:
        emission = CountryEmission(country=country, grid_emission_factor=factor)
        db.session.add(emission)
    db.session.commit()
    return jsonify({"country": country, "factor": factor})
