import uuid
from datetime import datetime
from sqlalchemy import Column, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.database import Base


class EvalConfig(Base):
    __tablename__ = "eval_configs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    eval_run_id = Column(UUID(as_uuid=True), ForeignKey("eval_runs.id"), nullable=False)
    context = Column(JSONB, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    eval_run = relationship("EvalRun", back_populates="config")
