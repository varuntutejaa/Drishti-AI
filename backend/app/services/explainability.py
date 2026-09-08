from typing import Optional

class ExplainabilityService:
    def generate_gradcam(self, image_path: Optional[str] = None) -> dict:
        return {
            "gradcam_heatmap": "/static/demo/gradcam.png",
            "gradcam_overlay": "/static/demo/overlay.png",
            "attention_map": "/static/demo/attention.png",
            "message": "Areas highlighted in red represent model attention, not proof of lesion presence.",
            "demo_model": True,
        }

    def generate_overlay(self, image_path: Optional[str] = None) -> dict:
        return self.generate_gradcam(image_path)
