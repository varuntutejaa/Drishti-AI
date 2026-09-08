from sqlalchemy import Column, Integer, String
from app.database.database import Base

class Patient(Base):
    __tablename__ = "patients"
    id = Column(Integer, primary_key=True)
    patient_id = Column(String, unique=True, index=True)
    name = Column(String)
    age = Column(Integer)
    sex = Column(String)
    diabetes_duration = Column(String)
    complications = Column(String, default="")
    previous_dr_history = Column(String, default="")
    last_eye_exam = Column(String, default="")
    health_center = Column(String)
