from flask import Blueprint, request, jsonify
from admin.controller import (
    handle_admin_signup,
    handle_admin_verify_otp,
    handle_admin_login,
    handle_admin_forgot_password,
    handle_admin_forgot_verify_otp,
    handle_admin_reset_password,
)

admin = Blueprint("admin", __name__)


@admin.route("/api/admin/signup", methods=["POST"])
def admin_signup():
    data = request.get_json()
    response, status = handle_admin_signup(data)
    return jsonify(response), status


@admin.route("/api/admin/verify-otp", methods=["POST"])
def admin_verify_otp():
    data = request.get_json()
    response, status = handle_admin_verify_otp(data)
    return jsonify(response), status


@admin.route("/api/admin/login", methods=["POST"])
def admin_login():
    data = request.get_json()
    response, status = handle_admin_login(data)
    return jsonify(response), status


@admin.route("/api/admin/forgot-password", methods=["POST"])
def admin_forgot_password():
    data = request.get_json()
    response, status = handle_admin_forgot_password(data)
    return jsonify(response), status


@admin.route("/api/admin/forgot-password/verify-otp", methods=["POST"])
def admin_forgot_verify_otp():
    data = request.get_json()
    response, status = handle_admin_forgot_verify_otp(data)
    return jsonify(response), status


@admin.route("/api/admin/reset-password", methods=["POST"])
def admin_reset_password():
    data = request.get_json()
    response, status = handle_admin_reset_password(data)
    return jsonify(response), status