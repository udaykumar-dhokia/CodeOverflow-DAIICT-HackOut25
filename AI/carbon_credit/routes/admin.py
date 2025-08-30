from flask import Blueprint, request, jsonify
from database import db
from models import Project, AdminAction

admin_bp = Blueprint("admin", __name__)

@admin_bp.route("/review/<int:project_id>", methods=["POST"])
def review_project(project_id):
    action = request.json.get("action")  # Approved / Rejected
    project = Project.query.get(project_id)
    if not project:
        return jsonify({"error": "Project not found"}), 404

    project.status = action
    db.session.add(AdminAction(project_id=project_id, action=action))
    db.session.commit()

    return jsonify({"message": f"Project {action}"})
