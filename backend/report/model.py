from sqlalchemy.orm import mapped_column, Mapped
from db import Base
from sqlalchemy import String, Text, Float, TIMESTAMP, ForeignKey
from sqlalchemy.sql import func
from datetime import datetime

class Assessment(Base):
    __tablename__ = "assessments"

    id                 : Mapped[int]            = mapped_column(primary_key=True)
    user_id            : Mapped[int]            = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    body_frame         : Mapped[str | None]     = mapped_column(String(10))
    skin_type          : Mapped[str | None]     = mapped_column(String(10))
    hair_type          : Mapped[str | None]     = mapped_column(String(10))
    weight_pattern     : Mapped[str | None]     = mapped_column(String(10))
    appetite           : Mapped[str | None]     = mapped_column(String(10))
    digestion          : Mapped[str | None]     = mapped_column(String(10))
    thirst             : Mapped[str | None]     = mapped_column(String(10))
    mind_state         : Mapped[str | None]     = mapped_column(String(10))
    sleep_pattern      : Mapped[str | None]     = mapped_column(String(10))
    climate_preference : Mapped[str | None]     = mapped_column(String(10))
    symptoms           : Mapped[str | None]     = mapped_column(Text)
    dominant_dosha     : Mapped[str | None]     = mapped_column(String(50))
    constitution_type  : Mapped[str | None]     = mapped_column(String(50))
    vata_percentage    : Mapped[float | None]   = mapped_column(Float)
    pitta_percentage   : Mapped[float | None]   = mapped_column(Float)
    kapha_percentage   : Mapped[float | None]   = mapped_column(Float)
    wellness_score     : Mapped[float | None]   = mapped_column(Float)
    created_at         : Mapped[datetime | None] = mapped_column(TIMESTAMP, server_default=func.now())