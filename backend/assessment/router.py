from flask import Blueprint, jsonify, request
from db import conn, cur

from db import get_db
from assessment.controller import (
    get_total_assesment,
    get_total_users,
    find_user,
    get_all_assessments,
    get_assessment_details,
)

# Unique blueprint name
assessment = Blueprint("assessment_api", __name__)

@assessment.route("/api/assessment/get_total_assessment", methods=["GET"])
def get_total_assessment_route():
    with get_db() as db:
        result = get_total_assesment(db)
    return jsonify(result), 200

@assessment.route("/api/assessment/get_total_user", methods=["GET"])
def get_total_user_route():
    with get_db() as db:
        result = get_total_users(db)
    return jsonify(result), 200

@assessment.route("/api/assessment/find_user/<email>", methods=["POST"])
def find_users(email):
    with get_db() as db:
        result = find_user(db, email)
    return jsonify(result), 200

@assessment.route("/api/assessment/get_all_assessments", methods=["GET"])
def get_all_assessments_route():
    with get_db() as db:
        result = get_all_assessments(db)
    return jsonify(result), 200

@assessment.route("/api/assessment/details/<int:id>", methods=["GET"])
def assessment_details_route(id):
    with get_db() as db:
        result = get_assessment_details(db, id)
    return jsonify(result), 200