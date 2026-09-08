from typing import Optional

class LesionDetectionService:
    def detect(self, image_path: Optional[str] = None) -> dict:
        return {
            "lesions": [
                {"type": "Microaneurysms", "confidence": 0.87, "bbox": [0.26, 0.34, 0.18, 0.15]},
                {"type": "Hemorrhages", "confidence": 0.72, "bbox": [0.57, 0.28, 0.17, 0.20]},
                {"type": "Hard Exudates", "confidence": 0.81, "bbox": [0.47, 0.58, 0.21, 0.14]},
            ],
            "demo_model": True,
            "note": "Demo lesion localization output; replace service with a trained detector for clinical validation.",
        }
