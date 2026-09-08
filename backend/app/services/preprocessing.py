from typing import Optional

class PreprocessingService:
    def run(self, image_path: Optional[str] = None) -> dict:
        return {
            "steps": ["resize", "crop retinal region", "illumination correction", "contrast normalization", "CLAHE", "artifact reduction", "normalization"],
            "original": image_path,
            "enhanced": image_path,
            "cropped": image_path,
            "message": "Demo preprocessing completed. Replace with OpenCV pipeline for production weights.",
        }
