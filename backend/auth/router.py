from flask import Blueprint, request, jsonify
from auth.controller import (
    handle_signup,
    handle_verify_otp,
    handle_login,
    handle_forgot_password,
    handle_reset_password,
)

auth = Blueprint("auth", __name__)


@auth.route("/api/signup", methods=["POST"])
def signup():
    data = request.get_json()
    response, status = handle_signup(data)
    return jsonify(response), status


@auth.route("/api/verify-otp", methods=["POST"])
def verify_otp():
    data = request.get_json()
    response, status = handle_verify_otp(data)
    return jsonify(response), status


@auth.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    response, status = handle_login(data)
    return jsonify(response), status


@auth.route("/api/forgot-password", methods=["POST"])
def forgot_password():
    data = request.get_json()
    response, status = handle_forgot_password(data)
    return jsonify(response), status


@auth.route("/api/reset-password", methods=["POST"])
def reset_password():
    data = request.get_json()
    response, status = handle_reset_password(data)
    return jsonify(response), status