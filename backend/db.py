# db.py
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
from contextlib import contextmanager
from dotenv import load_dotenv
import psycopg2
import os

load_dotenv()

DB_HOST     = os.getenv("DB_HOST")
DB_NAME     = os.getenv("DB_NAME")
DB_USER     = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_PORT     = os.getenv("DB_PORT")

DB_CONNECTION = (
    f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}"
    f"@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)

# ─── SQLALCHEMY SETUP (your new ORM layer) ───────────────────────────────────

Base = declarative_base()

engine = create_engine(
    url=DB_CONNECTION,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,   # auto-recover dropped connections
)

SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)


@contextmanager
def get_db():
    """
    Use this for ALL new controllers going forward.

    Usage:
        with get_db() as db:
            user = db.query(User).filter_by(email=email).first()
    """
    session = SessionLocal()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


def check_db_connection() -> bool:
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        print("Database Connected Successfully")
        return True
    except Exception as e:
        print(f"Database Connection Failed: {e}")
        return False


# ─── LEGACY PSYCOPG2 (keeps your teammate's existing controllers working) ────
# TODO: remove this block once all controllers are migrated to get_db()

conn = psycopg2.connect(
    host=DB_HOST,
    database=DB_NAME,
    user=DB_USER,
    password=DB_PASSWORD,
    port=DB_PORT
)
cur = conn.cursor()