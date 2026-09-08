from pydantic import BaseModel

class PatientCreate(BaseModel):
    patient_id: str
    name: str
    age: int
    sex: str
    diabetes_duration: str = ""
    complications: str = ""
    previous_dr_history: str = ""
    last_eye_exam: str = ""
    health_center: str

class PatientOut(PatientCreate):
    id: int
    class Config:
        from_attributes = True
