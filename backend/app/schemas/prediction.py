from pydantic import BaseModel

class PredictionResult(BaseModel):
    predicted_class: int
    label: str
    confidence: float
    probabilities: dict[str, float]
    demo_model: bool = True
