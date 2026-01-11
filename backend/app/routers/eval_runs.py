import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
import json

from app.database import get_db
from app.models.eval_run import EvalRun, EvalStatus
from app.models.eval_config import EvalConfig
from app.models.generated_report import GeneratedReport
from app.schemas.eval import (
    EvalUploadRequest,
    EvalUploadResponse,
    EvalConfigRequest,
    EvalConfigResponse,
    GenerateReportResponse,
    EvalRunResponse,
)
from app.services.claude_service import generate_summary

router = APIRouter(prefix="/api/eval-runs", tags=["eval-runs"])


@router.get("", response_model=list[EvalRunResponse])
def list_eval_runs(db: Session = Depends(get_db)):
    runs = db.query(EvalRun).order_by(EvalRun.created_at.desc()).limit(50).all()
    return [
        EvalRunResponse(
            id=run.id,
            project_name=run.project_name,
            run_name=run.run_name,
            eval_type=run.eval_type,
            status=run.status.value,
            created_at=run.created_at,
            has_report=run.report is not None,
        )
        for run in runs
    ]


@router.post("/upload", response_model=EvalUploadResponse)
def upload_eval(data: EvalUploadRequest, db: Session = Depends(get_db)):
    eval_run = EvalRun(
        project_name=data.project_name,
        run_name=data.run_name,
        raw_data=data.model_dump(),
        status=EvalStatus.UPLOADED,
    )
    db.add(eval_run)
    db.commit()
    db.refresh(eval_run)

    return EvalUploadResponse(
        id=eval_run.id,
        project_name=eval_run.project_name,
        run_name=eval_run.run_name,
        status=eval_run.status.value,
        created_at=eval_run.created_at,
    )


@router.post("/upload-file", response_model=EvalUploadResponse)
async def upload_eval_file(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith('.json'):
        raise HTTPException(status_code=400, detail="Only JSON files are supported")

    try:
        content = await file.read()
        data = json.loads(content)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON file")

    if "project_name" not in data or "run_name" not in data:
        raise HTTPException(
            status_code=400,
            detail="JSON must contain 'project_name' and 'run_name' fields"
        )

    eval_run = EvalRun(
        project_name=data.get("project_name"),
        run_name=data.get("run_name"),
        raw_data=data,
        status=EvalStatus.UPLOADED,
    )
    db.add(eval_run)
    db.commit()
    db.refresh(eval_run)

    return EvalUploadResponse(
        id=eval_run.id,
        project_name=eval_run.project_name,
        run_name=eval_run.run_name,
        status=eval_run.status.value,
        created_at=eval_run.created_at,
    )


@router.get("/{run_id}", response_model=EvalUploadResponse)
def get_eval_run(run_id: uuid.UUID, db: Session = Depends(get_db)):
    eval_run = db.query(EvalRun).filter(EvalRun.id == run_id).first()
    if not eval_run:
        raise HTTPException(status_code=404, detail="Eval run not found")

    return EvalUploadResponse(
        id=eval_run.id,
        project_name=eval_run.project_name,
        run_name=eval_run.run_name,
        status=eval_run.status.value,
        created_at=eval_run.created_at,
    )


@router.get("/{run_id}/data")
def get_eval_run_data(run_id: uuid.UUID, db: Session = Depends(get_db)):
    eval_run = db.query(EvalRun).filter(EvalRun.id == run_id).first()
    if not eval_run:
        raise HTTPException(status_code=404, detail="Eval run not found")

    return eval_run.raw_data


@router.post("/{run_id}/configure", response_model=EvalConfigResponse)
def configure_eval(
    run_id: uuid.UUID,
    config_request: EvalConfigRequest,
    db: Session = Depends(get_db),
):
    eval_run = db.query(EvalRun).filter(EvalRun.id == run_id).first()
    if not eval_run:
        raise HTTPException(status_code=404, detail="Eval run not found")

    existing_config = db.query(EvalConfig).filter(EvalConfig.eval_run_id == run_id).first()
    if existing_config:
        existing_config.context = config_request.context.model_dump()
        db.commit()
        db.refresh(existing_config)
        config = existing_config
    else:
        config = EvalConfig(
            eval_run_id=run_id,
            context=config_request.context.model_dump(),
        )
        db.add(config)

    eval_run.status = EvalStatus.CONFIGURED
    db.commit()
    db.refresh(config)

    return EvalConfigResponse(
        id=config.id,
        eval_run_id=config.eval_run_id,
        context=config.context,
        created_at=config.created_at,
    )


@router.post("/{run_id}/generate", response_model=GenerateReportResponse)
async def generate_report(run_id: uuid.UUID, db: Session = Depends(get_db)):
    eval_run = db.query(EvalRun).filter(EvalRun.id == run_id).first()
    if not eval_run:
        raise HTTPException(status_code=404, detail="Eval run not found")

    config = db.query(EvalConfig).filter(EvalConfig.eval_run_id == run_id).first()
    if not config:
        raise HTTPException(
            status_code=400,
            detail="Eval run must be configured before generating report"
        )

    existing_report = db.query(GeneratedReport).filter(
        GeneratedReport.eval_run_id == run_id
    ).first()
    if existing_report:
        db.delete(existing_report)
        db.commit()

    summary_result = await generate_summary(eval_run.raw_data, config.context)

    shareable_token = str(uuid.uuid4())[:8]

    report = GeneratedReport(
        eval_run_id=run_id,
        summary=summary_result["summary"],
        recommendation=summary_result["recommendation"],
        key_findings=summary_result["key_findings"],
        risk_assessment=summary_result["risk_assessment"],
        trade_offs=summary_result["trade_offs"],
        shareable_token=shareable_token,
    )
    db.add(report)

    eval_run.status = EvalStatus.GENERATED
    db.commit()
    db.refresh(report)

    return GenerateReportResponse(
        id=report.id,
        eval_run_id=report.eval_run_id,
        summary=report.summary,
        recommendation=report.recommendation.value if report.recommendation else None,
        key_findings=report.key_findings,
        risk_assessment=report.risk_assessment,
        trade_offs=report.trade_offs,
        generated_at=report.generated_at,
        shareable_token=report.shareable_token,
    )
