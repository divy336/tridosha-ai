from flask import abort
from sqlalchemy.orm import Session
from auth.model import User
from report.model import Assessment


def get_total_assesment(db: Session):
    """Return the total number of users in the database."""
    total_users = db.query(User).count()
    total_assessment = db.query(Assessment).count()
    total_vata_dominant = db.query(Assessment).filter(Assessment.dominant_dosha == "vata").count()
    total_pitta_dominant = db.query(Assessment).filter(Assessment.dominant_dosha == "pitta").count()
    total_kapha_dominant = db.query(Assessment).filter(Assessment.dominant_dosha == "kapha").count()
    
    return {
        "total_users": total_users,
        "total_assessments": total_assessment,
        "vata_dominant": total_vata_dominant,
        "pitta_dominant": total_pitta_dominant,
        "kapha_dominant": total_kapha_dominant,
    }

def get_total_users(db : Session):
    final_data = []
    total_assessment = db.query(Assessment).all()
    if not total_assessment:
        abort(400, description = "No assessment founded")
    for assessment in total_assessment:
        user_data = list(db.query(User.id,User.full_name, User.email).join(Assessment, Assessment.user_id == User.id).all())
        assessment_data =list( db.query(Assessment.dominant_dosha, Assessment.vata_percentage, Assessment.pitta_percentage, Assessment.kapha_percentage, Assessment.wellness_score, Assessment.created_at).filter(Assessment.id == assessment.id).first())
        final_data.extend(user_data)
        final_data.extend(assessment_data)
    return final_data

def find_user(db : Session, mail):
    data = []
    uid = db.query(User.id).filter(User.email == mail).scalar()
    if not uid:
        abort(404, description = "No user founded with given mailId")
    user_data = db.query(User.id,User.full_name, User.email).filter(User.email == mail).first()
    if not user_data:
        abort(404, description = "No user founded with given mailId")
    data.extend(user_data)
    assessment_data =  db.query(Assessment.dominant_dosha, Assessment.vata_percentage, Assessment.pitta_percentage, Assessment.kapha_percentage, Assessment.wellness_score, Assessment.created_at).filter(Assessment.user_id == uid).first()
    if not assessment_data:
        abort(404, description = "No Assessment founded with given mailId")
    data.extend(assessment_data)
    return data