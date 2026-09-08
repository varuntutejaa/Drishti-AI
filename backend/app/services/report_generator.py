from io import BytesIO
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

class ReportGenerator:
    def generate_pdf(self, screening) -> bytes:
        buffer = BytesIO()
        pdf = canvas.Canvas(buffer, pagesize=A4)
        pdf.setTitle("RETINA-AI Screening Report")
        pdf.setFont("Helvetica-Bold", 18)
        pdf.drawString(50, 800, "RETINA-AI Clinical Screening Report")
        pdf.setFont("Helvetica", 11)
        lines = [
            f"Patient ID: {screening.patient_id}",
            f"Eye: {screening.eye}",
            f"Image Quality: {screening.quality_score or 'Pending'}",
            f"AI Prediction: {screening.label or 'Pending'}",
            f"Confidence: {screening.confidence or 'Pending'}",
            f"Recommendation: {screening.recommendation or 'Pending'}",
            "Disclaimer: AI-assisted screening tool. Review by qualified healthcare professional required.",
        ]
        for i, line in enumerate(lines):
            pdf.drawString(50, 755 - i * 24, line)
        pdf.save()
        return buffer.getvalue()
