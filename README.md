# RETINA-AI

Explainable diabetic retinopathy screening demo for rural health workflows.

## Run

```bash
npm install
npm run dev
```

Backend:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The app is a screening and decision-support demo, not a definitive diagnosis system. Demo ML outputs are clearly marked and isolated behind replaceable services.
