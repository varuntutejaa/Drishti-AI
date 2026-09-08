from pathlib import Path
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.screening import Screening
from app.schemas.screening import ScreeningCreate, ScreeningOut
from app.utils.image_utils import UPLOAD_DIR

router = APIRouter(tags=["screenings"])

@router.post("/screenings", response_model=ScreeningOut)
def create_screening(payload: ScreeningCreate, db: Session = Depends(get_db)):
    screening = Screening(patient_id=payload.patient_id, eye=payload.eye)
    db.add(screening)
    db.commit()
    db.refresh(screening)
    return screening

@router.get("/screenings", response_model=list[ScreeningOut])
def list_screenings(db: Session = Depends(get_db)):
    return db.query(Screening).order_by(Screening.id.desc()).all()

@router.get("/screenings/{screening_id}", response_model=ScreeningOut)
def get_screening(screening_id: int, db: Session = Depends(get_db)):
    screening = db.get(Screening, screening_id)
    if not screening:
        raise HTTPException(404, "Screening not found")
    return screening

@router.post("/screenings/{screening_id}/upload")
async def upload_image(screening_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    if file.content_type not in {"image/jpeg", "image/png"}:
        raise HTTPException(400, "Only JPG, JPEG, and PNG files are supported")
    screening = db.get(Screening, screening_id)
    if not screening:
        raise HTTPException(404, "Screening not found")
    path = UPLOAD_DIR / f"screening_{screening_id}_{Path(file.filename or 'fundus.png').name}"
    path.write_bytes(await file.read())
    screening.image_path = str(path)
    screening.status = "Image uploaded"
    db.commit()
    return {"screening_id": screening_id, "image_path": screening.image_path}
