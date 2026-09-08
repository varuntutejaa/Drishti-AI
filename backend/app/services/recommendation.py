from typing import Optional

class RecommendationService:
    def recommend(self, label: Optional[str], confidence: Optional[float], quality_acceptable: Optional[bool]) -> dict:
        if quality_acceptable is False:
            text = "Recapture required"
        elif confidence is not None and confidence < 0.70:
            text = "Manual review required"
        else:
            text = {
                "No DR": "Routine monitoring",
                "Mild DR": "Routine ophthalmic follow-up",
                "Moderate DR": "Ophthalmologist review recommended",
                "Severe DR": "Priority ophthalmology referral",
                "Proliferative DR": "Urgent ophthalmology referral",
            }.get(label or "", "Manual review required")
        return {"recommendation": text, "disclaimer": "Screening recommendation only; not a definitive medical diagnosis."}
