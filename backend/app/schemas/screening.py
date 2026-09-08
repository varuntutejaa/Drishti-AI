from pydantic import BaseModel
from typing import Optional

class ScreeningCreate(BaseModel):
    patient_id: str
    eye: str = "Right"

class ScreeningOut(BaseModel):
    id: int
    patient_id: str
    eye: str
    status: str
    label: Optional[str] = None
    confidence: Optional[float] = None
    recommendation: Optional[str] = None
    class Config:
        from_attributes = True
