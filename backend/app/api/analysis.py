import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.review import OphthalmologistReview
from app.models.screening import Screening
from app.services.dr_model import DRModelService
from app.services.explainability import ExplainabilityService
from app.services.image_quality import ImageQualityService
from app.services.lesion_detection import LesionDetectionService
from app.services.preprocessing import PreprocessingService
from app.services.recommendation import RecommendationService

router = APIRouter(tags=["analysis"])

def load(screening_id: int, db: Session) -> Screening:
    screening = db.get(Screening, screening_id)
    if not screening:
        raise HTTPException(404, "Screening not found")
    return screening

@router.post("/screenings/{screening_id}/quality")
def quality(screening_id: int, db: Session = Depends(get_db)):
    screening = load(screening_id, db)
    result = ImageQualityService().evaluate(screening.image_path)
    screening.quality_score = result["quality_score"]
    screening.quality_acceptable = result["is_acceptable"]
    screening.status = "Quality passed" if result["is_acceptable"] else "Recapture required"
    db.commit()
    return result

@router.post("/screenings/{screening_id}/preprocess")
def preprocess(screening_id: int, db: Session = Depends(get_db)):
    screening = load(screening_id, db)
    return PreprocessingService().run(screening.image_path)

@router.post("/screenings/{screening_id}/predict")
def predict(screening_id: int, db: Session = Depends(get_db)):
    screening = load(screening_id, db)
    if screening.quality_acceptable is False:
        raise HTTPException(409, "Image quality insufficient for reliable screening. Please recapture the image.")
    result = DRModelService().predict(screening.image_path)
    screening.predicted_class = result["predicted_class"]
    screening.label = result["label"]
    screening.confidence = result["confidence"]
    screening.probabilities_json = json.dumps(result["probabilities"])
    screening.status = "AI analyzed"
    db.commit()
    return result

@router.post("/screenings/{screening_id}/explain")
def explain(screening_id: int, db: Session = Depends(get_db)):
    screening = load(screening_id, db)
    return ExplainabilityService().generate_gradcam(screening.image_path)

@router.post("/screenings/{screening_id}/lesions")
def lesions(screening_id: int, db: Session = Depends(get_db)):
    screening = load(screening_id, db)
    result = LesionDetectionService().detect(screening.image_path)
    screening.lesions_json = json.dumps(result["lesions"])
    db.commit()
    return result

@router.post("/screenings/{screening_id}/recommendation")
def recommendation(screening_id: int, db: Session = Depends(get_db)):
    screening = load(screening_id, db)
    result = RecommendationService().recommend(screening.label, screening.confidence, screening.quality_acceptable)
    screening.recommendation = result["recommendation"]
    screening.status = "Recommendation generated"
    db.commit()
    return result

@router.post("/screenings/{screening_id}/review")
def review(screening_id: int, payload: dict, db: Session = Depends(get_db)):
    load(screening_id, db)
    review_row = OphthalmologistReview(
        screening_id=screening_id,
        decision=payload.get("decision", "Agree"),
        notes=payload.get("notes", ""),
        final_assessment=payload.get("final_assessment", ""),
    )
    db.add(review_row)
    db.commit()
    return {"stored": True, "review_id": review_row.id}
