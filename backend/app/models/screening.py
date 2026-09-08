from sqlalchemy import Boolean, Column, DateTime, Float, Integer, String, Text
from sqlalchemy.sql import func
from app.database.database import Base

class Screening(Base):
    __tablename__ = "screenings"
    id = Column(Integer, primary_key=True)
    patient_id = Column(String, index=True)
    eye = Column(String, default="Right")
    image_path = Column(String, nullable=True)
    quality_score = Column(Float, nullable=True)
    quality_acceptable = Column(Boolean, nullable=True)
    predicted_class = Column(Integer, nullable=True)
    label = Column(String, nullable=True)
    confidence = Column(Float, nullable=True)
    probabilities_json = Column(Text, default="{}")
    lesions_json = Column(Text, default="[]")
    recommendation = Column(String, nullable=True)
    status = Column(String, default="Draft")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
