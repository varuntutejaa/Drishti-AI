from typing import Optional

class DRModelService:
    labels = ["No DR", "Mild DR", "Moderate DR", "Severe DR", "Proliferative DR"]

    def load_model(self):
        return {"loaded": True, "demo_mode": True, "architecture": "EfficientNet-B0 compatible service"}

    def predict(self, image_path: Optional[str] = None) -> dict:
        if image_path and "severe" in image_path.lower():
            cls, probs = 3, {"no_dr": 0.01, "mild": 0.02, "moderate": 0.04, "severe": 0.90, "proliferative": 0.03}
        else:
            cls, probs = 2, {"no_dr": 0.01, "mild": 0.04, "moderate": 0.91, "severe": 0.03, "proliferative": 0.01}
        return {"predicted_class": cls, "label": self.labels[cls], "confidence": max(probs.values()), "probabilities": probs, "demo_model": True}

    def get_probabilities(self, image_path: Optional[str] = None) -> dict:
        return self.predict(image_path)["probabilities"]

    def get_feature_maps(self, image_path: Optional[str] = None) -> dict:
        return {"feature_maps": "available in trained-model mode", "demo_model": True}
