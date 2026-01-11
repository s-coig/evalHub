import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.database import Base
import enum


class EvalStatus(str, enum.Enum):
    UPLOADED = "uploaded"
    CONFIGURED = "configured"
    GENERATED = "generated"


class EvalRun(Base):
    __tablename__ = "eval_runs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    created_at = Column(DateTime, default=datetime.utcnow)
    project_name = Column(String(255), nullable=False)
    run_name = Column(String(255), nullable=False)
    eval_type = Column(String(100), nullable=True)
    raw_data = Column(JSONB, nullable=False)
    user_id = Column(UUID(as_uuid=True), nullable=True)
    status = Column(SQLEnum(EvalStatus), default=EvalStatus.UPLOADED)

    config = relationship("EvalConfig", back_populates="eval_run", uselist=False)
    report = relationship("GeneratedReport", back_populates="eval_run", uselist=False)
