from flask import Blueprint, request, jsonify
from db import get_db
from sqlalchemy.orm import session
from Assessment.controller import get_total_users

assessment = Blueprint("assessment", __name__)

@assessment.route("/api/assessment/get_total", methods = ["get"] )
def get_total():
    with get_db() as db:
        result = get_total_users(db)
    return jsonify(result)