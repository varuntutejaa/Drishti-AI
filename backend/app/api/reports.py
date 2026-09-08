from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.screening import Screening
from app.services.report_generator import ReportGenerator

router = APIRouter(tags=["reports"])

@router.get("/screenings/{screening_id}/report")
def report(screening_id: int, db: Session = Depends(get_db)):
    screening = db.get(Screening, screening_id)
    if not screening:
        raise HTTPException(404, "Screening not found")
    pdf = ReportGenerator().generate_pdf(screening)
    return Response(pdf, media_type="application/pdf", headers={"Content-Disposition": f"attachment; filename=retina-ai-{screening_id}.pdf"})
