from pydantic import BaseModel

class QualityResult(BaseModel):
    quality_score: float
    is_acceptable: bool
    blur_score: float
    brightness_score: float
    contrast_score: float
    field_of_view_score: float
    artifact_score: float
