from db import Base
from sqlalchemy import Column, Integer, String, Boolean, TIMESTAMP
from sqlalchemy.sql import func
from typing import ClassVar, Any, Tuple

class User(Base):
    __tablename__ : ClassVar[str] = "users"
    __table_args__ : ClassVar[dict[str,any]] = {"extend_existing": True}
    id          = Column(Integer, primary_key=True)
    full_name   = Column(String(100), nullable=False)
    email       = Column(String(150), unique=True, nullable=False)
    password    = Column(String(255), nullable=False)
    is_verified = Column(Boolean, default=False)
    created_at  = Column(TIMESTAMP, server_default=func.now())