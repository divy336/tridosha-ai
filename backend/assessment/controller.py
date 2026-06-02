import json
from sqlalchemy import text
from db import conn, cur


def _to_jsonable(row):
    if row is None:
        return None

    data = dict(row._mapping)

    # Convert datetime values to strings
    for key, value in list(data.items()):
        if hasattr(value, "isoformat"):
            data[key] = value.isoformat()

    # Parse symptoms if stored as comma-separated string
    symptoms = data.get("symptoms")
    if isinstance(symptoms, str):
        data["symptoms"] = [s.strip() for s in symptoms.split(",") if s.strip()]

    # Parse JSON / JSONB recommendations safely
    recommendations = data.get("recommendations")
    if isinstance(recommendations, str):
        try:
            data["recommendations"] = json.loads(recommendations)
        except Exception:
            pass

    return data

def get_total_assesment(db):
    query = text("SELECT COUNT(*) AS total_assessments FROM assessments")
    result = db.execute(query).fetchone()
    return {"total_assessments": int(result.total_assessments or 0)}

# alias for spelling consistency
get_total_assessment = get_total_assesment

def get_total_users(db):
    query = text("SELECT COUNT(*) AS total_users FROM users")
    result = db.execute(query).fetchone()
    return {"total_users": int(result.total_users or 0)}

def find_user(db, email):
    query = text("""
        SELECT id, email
        FROM users
        WHERE email = :email
        LIMIT 1
    """)
    row = db.execute(query, {"email": email}).fetchone()

    if not row:
        return {"found": False, "message": "User not found"}

    return {
        "found": True,
        "user": _to_jsonable(row)
    }

def get_all_assessments(db):
    query = text("""
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
        ORDER BY a.created_at DESC
    """)

    rows = db.execute(query).fetchall()
    return [_to_jsonable(row) for row in rows]

def get_assessment_details(db, assessment_id):
    query = text("""
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
    """)

    row = db.execute(query, {"id": assessment_id}).fetchone()

    if not row:
        return {"found": False, "message": "Assessment not found"}

    return {
        "found": True,
        "assessment": _to_jsonable(row)
    }