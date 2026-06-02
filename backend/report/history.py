from flask import Blueprint, jsonify, request
from sqlalchemy import text

from db import get_db

history = Blueprint("history_api", __name__)

@history.route("/api/user/history", methods=["GET"])
def user_history():
    email = request.args.get("email")

    if not email:
        return jsonify({"error": "Email is required"}), 400

    with get_db() as db:
        user_row = db.execute(
            text("SELECT id, email FROM users WHERE email = :email LIMIT 1"),
            {"email": email}
        ).fetchone()

        if not user_row:
            return jsonify({"error": "User not found"}), 404

        rows = db.execute(
            text("""
                SELECT
                    id,
                    dominant_dosha,
                    constitution_type,
                    vata_percentage,
                    pitta_percentage,
                    kapha_percentage,
                    wellness_score,
                    created_at
                FROM assessments
                WHERE user_id = :user_id
                ORDER BY created_at DESC
            """),
            {"user_id": user_row.id}
        ).fetchall()

        reports = []
        for row in rows:
            reports.append({
                "id": row.id,
                "dominant_dosha": row.dominant_dosha,
                "constitution_type": row.constitution_type,
                "vata_percentage": row.vata_percentage,
                "pitta_percentage": row.pitta_percentage,
                "kapha_percentage": row.kapha_percentage,
                "wellness_score": row.wellness_score,
                "created_at": row.created_at.isoformat() if row.created_at else None
            })

    return jsonify({
        "user": {
            "id": user_row.id,
            "email": user_row.email
        },
        "reports": reports
    }), 200

@history.route("/api/history/<int:id>", methods=["GET"])
def history_details(id):
    with get_db() as db:
        row = db.execute(
            text("""
                SELECT
                    a.id,
                    a.user_id,
                    u.email,
                    a.body_frame,
                    a.skin_type,
                    a.hair_type,
                    a.weight_pattern,
                    a.appetite,
                    a.digestion,
                    a.thirst,
                    a.mind_state,
                    a.sleep_pattern,
                    a.climate_preference,
                    a.symptoms,
                    a.dominant_dosha,
                    a.constitution_type,
                    a.vata_percentage,
                    a.pitta_percentage,
                    a.kapha_percentage,
                    a.wellness_score,
                    a.recommendations,
                    a.created_at
                FROM assessments a
                LEFT JOIN users u ON u.id = a.user_id
                WHERE a.id = :id
                LIMIT 1
            """),
            {"id": id}
        ).fetchone()

        if not row:
            return jsonify({"error": "Report not found"}), 404

        data = dict(row._mapping)
        if isinstance(data.get("symptoms"), str):
            data["symptoms"] = [s.strip() for s in data["symptoms"].split(",") if s.strip()]
        if hasattr(data.get("created_at"), "isoformat"):
            data["created_at"] = data["created_at"].isoformat()

    return jsonify(data), 200