import uuid
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.eval_run import EvalRun
from app.models.eval_config import EvalConfig
from app.models.generated_report import GeneratedReport
from app.schemas.eval import ReportResponse
from app.services.pdf_service import generate_pdf
from app.services.pptx_service import generate_pptx

router = APIRouter(tags=["reports"])


@router.get("/api/reports/by-run/{eval_run_id}", response_model=ReportResponse)
def get_report_by_run(eval_run_id: uuid.UUID, db: Session = Depends(get_db)):
    report = db.query(GeneratedReport).filter(GeneratedReport.eval_run_id == eval_run_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    eval_run = db.query(EvalRun).filter(EvalRun.id == report.eval_run_id).first()
    config = db.query(EvalConfig).filter(EvalConfig.eval_run_id == report.eval_run_id).first()

    return ReportResponse(
        id=report.id,
        eval_run_id=report.eval_run_id,
        project_name=eval_run.project_name,
        run_name=eval_run.run_name,
        summary=report.summary,
        recommendation=report.recommendation.value if report.recommendation else None,
        key_findings=report.key_findings,
        risk_assessment=report.risk_assessment,
        trade_offs=report.trade_offs,
        generated_at=report.generated_at,
        shareable_token=report.shareable_token,
        metrics=eval_run.raw_data.get("metrics", {}),
        config=config.context if config else None,
    )


@router.get("/api/reports/{report_id}", response_model=ReportResponse)
def get_report(report_id: uuid.UUID, db: Session = Depends(get_db)):
    report = db.query(GeneratedReport).filter(GeneratedReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    eval_run = db.query(EvalRun).filter(EvalRun.id == report.eval_run_id).first()
    config = db.query(EvalConfig).filter(EvalConfig.eval_run_id == report.eval_run_id).first()

    return ReportResponse(
        id=report.id,
        eval_run_id=report.eval_run_id,
        project_name=eval_run.project_name,
        run_name=eval_run.run_name,
        summary=report.summary,
        recommendation=report.recommendation.value if report.recommendation else None,
        key_findings=report.key_findings,
        risk_assessment=report.risk_assessment,
        trade_offs=report.trade_offs,
        generated_at=report.generated_at,
        shareable_token=report.shareable_token,
        metrics=eval_run.raw_data.get("metrics", {}),
        config=config.context if config else None,
    )


@router.get("/api/reports/{report_id}/export")
def export_report_pdf(report_id: uuid.UUID, db: Session = Depends(get_db)):
    report = db.query(GeneratedReport).filter(GeneratedReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    eval_run = db.query(EvalRun).filter(EvalRun.id == report.eval_run_id).first()
    config = db.query(EvalConfig).filter(EvalConfig.eval_run_id == report.eval_run_id).first()

    report_data = {
        "project_name": eval_run.project_name,
        "run_name": eval_run.run_name,
        "summary": report.summary,
        "recommendation": report.recommendation.value if report.recommendation else None,
        "key_findings": report.key_findings,
        "risk_assessment": report.risk_assessment,
        "trade_offs": report.trade_offs,
        "generated_at": report.generated_at.isoformat(),
        "metrics": eval_run.raw_data.get("metrics", {}),
        "config": config.context if config else None,
    }

    pdf_bytes = generate_pdf(report_data)

    filename = f"{eval_run.project_name}-{eval_run.run_name}-report.pdf".replace(" ", "_")

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@router.get("/api/reports/{report_id}/export-pptx")
def export_report_pptx(report_id: uuid.UUID, db: Session = Depends(get_db)):
    report = db.query(GeneratedReport).filter(GeneratedReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    eval_run = db.query(EvalRun).filter(EvalRun.id == report.eval_run_id).first()
    config = db.query(EvalConfig).filter(EvalConfig.eval_run_id == report.eval_run_id).first()

    report_data = {
        "project_name": eval_run.project_name,
        "run_name": eval_run.run_name,
        "summary": report.summary,
        "recommendation": report.recommendation.value if report.recommendation else None,
        "key_findings": report.key_findings,
        "risk_assessment": report.risk_assessment,
        "trade_offs": report.trade_offs,
        "generated_at": report.generated_at.isoformat(),
        "metrics": eval_run.raw_data.get("metrics", {}),
        "config": config.context if config else None,
    }

    pptx_bytes = generate_pptx(report_data)

    filename = f"{eval_run.project_name}-{eval_run.run_name}-report.pptx".replace(" ", "_")

    return Response(
        content=pptx_bytes,
        media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@router.get("/api/public/reports/{token}", response_model=ReportResponse)
def get_public_report(token: str, db: Session = Depends(get_db)):
    report = db.query(GeneratedReport).filter(
        GeneratedReport.shareable_token == token
    ).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    eval_run = db.query(EvalRun).filter(EvalRun.id == report.eval_run_id).first()
    config = db.query(EvalConfig).filter(EvalConfig.eval_run_id == report.eval_run_id).first()

    return ReportResponse(
        id=report.id,
        eval_run_id=report.eval_run_id,
        project_name=eval_run.project_name,
        run_name=eval_run.run_name,
        summary=report.summary,
        recommendation=report.recommendation.value if report.recommendation else None,
        key_findings=report.key_findings,
        risk_assessment=report.risk_assessment,
        trade_offs=report.trade_offs,
        generated_at=report.generated_at,
        shareable_token=report.shareable_token,
        metrics=eval_run.raw_data.get("metrics", {}),
        config=config.context if config else None,
    )
