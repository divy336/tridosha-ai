from sqlalchemy.orm import Session

from auth.model import User
from report.model import Assessment


def get_total_users(db: Session):
    """Return the total number of users in the database."""
    total = []
    total_users = db.query(User).count()
    total_assessment = db.query(Assessment).count()
    total_vata_dominant = db.query(Assessment).filter(Assessment.dominant_dosha == "vata").count()
    total_pitta_dominant = db.query(Assessment).filter(Assessment.dominant_dosha == "pitta").count()
    total_kapha_dominant = db.query(Assessment).filter(Assessment.dominant_dosha == "kapha").count()
    total.append(total_users)
    total.append(total_assessment)
    total.append(total_vata_dominant)
    total.append(total_pitta_dominant)
    total.append(total_kapha_dominant)
    return {"total_users": total_users}
