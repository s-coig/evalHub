import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.database import Base
import enum


class Recommendation(str, enum.Enum):
    SHIP = "ship"
    NEEDS_WORK = "needs_work"
    BLOCK = "block"


class GeneratedReport(Base):
    __tablename__ = "generated_reports"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    eval_run_id = Column(UUID(as_uuid=True), ForeignKey("eval_runs.id"), nullable=False)
    summary = Column(Text, nullable=False)
    recommendation = Column(SQLEnum(Recommendation), nullable=True)
    key_findings = Column(JSONB, nullable=True)
    risk_assessment = Column(Text, nullable=True)
    trade_offs = Column(Text, nullable=True)
    generated_at = Column(DateTime, default=datetime.utcnow)
    shareable_token = Column(String(255), unique=True, nullable=True)

    eval_run = relationship("EvalRun", back_populates="report")
