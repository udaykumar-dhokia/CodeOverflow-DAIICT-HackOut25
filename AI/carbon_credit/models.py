from datetime import datetime
from database import db

class CountryEmission(db.Model):
    __tablename__ = "country_emissions"
    id = db.Column(db.Integer, primary_key=True)
    country = db.Column(db.String(100), unique=True, nullable=False)
    grid_emission_factor = db.Column(db.Float, nullable=False)  # kg CO2 per kWh
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)

class Project(db.Model):
    __tablename__ = "projects"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)  # link to auth system later
    country = db.Column(db.String(100), nullable=False)
    energy_generated = db.Column(db.Float, nullable=False)  # in kWh
    technology = db.Column(db.String(50), nullable=False)   # solar, wind, hydro
    carbon_credits = db.Column(db.Float, default=0.0)
    status = db.Column(db.String(20), default="Pending")  # Pending, Approved, Rejected
    document_path = db.Column(db.String(200), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class AdminAction(db.Model):
    __tablename__ = "admin_actions"
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey("projects.id"), nullable=False)
    action = db.Column(db.String(20), nullable=False)  # Approved/Rejected
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
