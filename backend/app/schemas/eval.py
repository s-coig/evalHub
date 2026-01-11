from pydantic import BaseModel
from typing import Optional, Any
from datetime import datetime
from uuid import UUID
from enum import Enum


class EvalStatusEnum(str, Enum):
    UPLOADED = "uploaded"
    CONFIGURED = "configured"
    GENERATED = "generated"


class RecommendationEnum(str, Enum):
    SHIP = "ship"
    NEEDS_WORK = "needs_work"
    BLOCK = "block"


class EvalUploadRequest(BaseModel):
    project_name: str
    run_name: str
    metrics: dict[str, Any]
    test_cases: Optional[list[dict[str, Any]]] = None
    test_cases_total: Optional[int] = None
    test_cases_passed: Optional[int] = None
    baseline_metrics: Optional[dict[str, Any]] = None


class EvalUploadResponse(BaseModel):
    id: UUID
    project_name: str
    run_name: str
    status: EvalStatusEnum
    created_at: datetime

    class Config:
        from_attributes = True


class ContextConfig(BaseModel):
    project_description: str
    success_criteria: dict[str, Any]
    baseline_comparison: Optional[dict[str, Any]] = None
    stakeholder_concerns: Optional[list[str]] = None
    business_impact: Optional[str] = None


class EvalConfigRequest(BaseModel):
    context: ContextConfig


class EvalConfigResponse(BaseModel):
    id: UUID
    eval_run_id: UUID
    context: dict[str, Any]
    created_at: datetime

    class Config:
        from_attributes = True


class GenerateReportResponse(BaseModel):
    id: UUID
    eval_run_id: UUID
    summary: str
    recommendation: Optional[RecommendationEnum]
    key_findings: Optional[list[str]]
    risk_assessment: Optional[str]
    trade_offs: Optional[str]
    generated_at: datetime
    shareable_token: str

    class Config:
        from_attributes = True


class ReportResponse(BaseModel):
    id: UUID
    eval_run_id: UUID
    project_name: str
    run_name: str
    summary: str
    recommendation: Optional[RecommendationEnum]
    key_findings: Optional[list[str]]
    risk_assessment: Optional[str]
    trade_offs: Optional[str]
    generated_at: datetime
    shareable_token: str
    metrics: dict[str, Any]
    config: Optional[dict[str, Any]]


class EvalRunResponse(BaseModel):
    id: UUID
    project_name: str
    run_name: str
    eval_type: Optional[str]
    status: EvalStatusEnum
    created_at: datetime
    has_report: bool

    class Config:
        from_attributes = True
