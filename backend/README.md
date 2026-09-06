# FastAPI Backend

## Run on Windows PowerShell
```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
uvicorn main:app --reload --port 8000
```

Open http://127.0.0.1:8000/docs

### Endpoints
- GET `/api/health`
- POST `/api/evaluations`
- GET `/api/evaluations`
- GET `/api/models`
- GET `/api/analytics/summary`
