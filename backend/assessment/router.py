from flask import Blueprint, request, jsonify
from db import get_db
from sqlalchemy.orm import session
from Assessment.controller import get_total_assesment, get_total_users, find_user

assessment = Blueprint("assessment", __name__)

@assessment.route("/api/assessment/get_total_assessment", methods = ["get"] )
def get_total():
    with get_db() as db:
        result = get_total_assesment(db)
    return jsonify(result)

@assessment.route("/api/assessment/get_total_user", methods = ["get"])
def get_total_user():
    with get_db() as db:
        result = get_total_users(db)
    return jsonify(result)

@assessment.route("/api/assessment/find_user/<email>", methods=["POST"])
def find_users(email):
    with get_db() as db:
        result = find_user(db, email)
    return jsonify(result)