from fastapi import APIRouter

router = APIRouter(tags=["dashboard"])

@router.get("/dashboard/stats")
def dashboard_stats():
    return {
        "screenings_today": 14,
        "total_screenings": 1284,
        "refer_for_ophthalmology": 0.29,
        "image_quality_failures": 0.06,
        "average_ai_confidence": 0.91,
        "operational_mode": "ONLINE",
        "device_status": "Ready",
        "last_model_sync": "2026-09-08T09:30:00+05:30",
        "pending_uploads": 0,
        "network_status": "Connected",
    }

@router.get("/model/metrics")
def model_metrics():
    return {
        "demo_model": True,
        "accuracy": 0.92,
        "sensitivity": 0.90,
        "specificity": 0.94,
        "f1_score": 0.91,
        "auroc": 0.96,
        "class_wise": {
            "no_dr": 0.94,
            "mild": 0.86,
            "moderate": 0.91,
            "severe": 0.93,
            "proliferative": 0.89,
        },
        "confusion_matrix": [[94, 3, 2, 1, 0], [6, 86, 6, 2, 0], [2, 5, 91, 2, 0], [1, 1, 5, 90, 3], [0, 0, 2, 7, 91]],
    }
