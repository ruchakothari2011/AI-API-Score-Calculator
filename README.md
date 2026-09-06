# AI API Score Calculator & Intelligent Model Evaluation Platform

A professional ADBMS capstone starter application for evaluating, scoring,
comparing and monitoring AI APIs/models.

## Stack

- Frontend: React + Vite + Recharts + Lucide
- Backend: FastAPI
- Relational DB: PostgreSQL
- NoSQL DB: MongoDB
- Graph DB: Neo4j
- Planned AI/NLP: Scikit-learn + Hugging Face Transformers/BERT/Llama
- Visualization: Plotly/Grafana
- Cloud target: AWS

## Current starter features

- Professional dark/light dashboard
- Responsive sidebar navigation
- KPI cards
- AI score trend chart
- Model ranking
- API health panel
- Evaluation configuration
- Dynamic scoring weights
- Local score calculation
- Model comparison UI
- Analytics UI
- AI insights UI
- API monitoring UI
- FastAPI health/model/score endpoints
- PostgreSQL schema
- MongoDB collections/index examples
- Neo4j graph schema

## Run frontend

```bash
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal, normally:
http://localhost:5173

## Run backend

Create a virtual environment:

```bash
cd backend
python -m venv venv
```

Windows:

```bash
venv\Scripts\activate
```

Install:

```bash
pip install -r requirements.txt
```

Run:

```bash
uvicorn app.main:app --reload --port 8000
```

API:
http://localhost:8000

Swagger:
http://localhost:8000/docs

## Databases

PostgreSQL:
- Create the `ai_score` database.
- Run `database/postgres_schema.sql`.

MongoDB:
- Run `database/mongodb_schema.js` in mongosh.

Neo4j:
- Run `database/neo4j_schema.cypher` in Neo4j Browser.

## Next development phases

1. Connect React to FastAPI.
2. Add JWT authentication and role-based access.
3. Persist projects/models/evaluations.
4. Add MongoDB evaluation storage.
5. Add Neo4j relationship queries.
6. Integrate real AI provider adapters.
7. Add Hugging Face/BERT semantic evaluation.
8. Add hallucination/safety evaluation.
9. Add Scikit-learn anomaly detection.
10. Add Plotly analytics and Grafana monitoring.
11. Add PDF/CSV/Excel reporting.
12. Deploy to AWS.

## Security note

Never commit real API keys, passwords, JWT secrets or database credentials.
Use `.env` and a cloud secret manager in production.