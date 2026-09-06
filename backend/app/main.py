import os
from datetime import datetime, timezone
from typing import Dict

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


# ============================================================
# FASTAPI APP
# ============================================================

app = FastAPI(
    title="AI API Score Calculator API",
    version="1.0.0",
    description="Backend for AI model evaluation, scoring and analytics."
)


# ============================================================
# CORS
# ============================================================

origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://127.0.0.1:5175",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# SCORE REQUEST MODEL
# ============================================================

class ScoreRequest(BaseModel):
    accuracy: float = Field(94, ge=0, le=100)
    relevance: float = Field(91, ge=0, le=100)
    quality: float = Field(93, ge=0, le=100)
    reliability: float = Field(98, ge=0, le=100)
    latency: float = Field(87, ge=0, le=100)
    cost: float = Field(82, ge=0, le=100)
    safety: float = Field(96, ge=0, le=100)

    weights: Dict[str, float] = {
        "accuracy": 30,
        "relevance": 20,
        "quality": 15,
        "reliability": 10,
        "latency": 10,
        "cost": 10,
        "safety": 5
    }


# ============================================================
# ROOT
# ============================================================

@app.get("/")
def root():
    return {
        "name": "AI API Score Calculator",
        "status": "online",
        "version": "1.0.0"
    }


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }


# ============================================================
# SCORE CALCULATION
# ============================================================

@app.post("/api/score")
def calculate_score(request: ScoreRequest):

    # Check weights
    if abs(sum(request.weights.values()) - 100) > 0.001:
        return {
            "error": "Weights must total 100%."
        }

    values = request.model_dump()

    score = sum(
        values[key] * weight / 100
        for key, weight in request.weights.items()
    )

    if score >= 90:
        grade = "Excellent"
    elif score >= 80:
        grade = "Good"
    else:
        grade = "Needs Improvement"

    return {
        "score": round(score, 2),
        "grade": grade,
        "metrics": {
            key: values[key]
            for key in request.weights
        },
        "weights": request.weights
    }


# ============================================================
# AI MODELS
# ============================================================

@app.get("/api/models")
def models():
    return [
        {
            "name": "GPT-4o",
            "provider": "OpenAI",
            "score": 94.1,
            "accuracy": 96,
            "latency": 0.92
        },
        {
            "name": "Claude 3.5 Sonnet",
            "provider": "Anthropic",
            "score": 93.4,
            "accuracy": 95,
            "latency": 1.08
        },
        {
            "name": "Gemini 1.5 Pro",
            "provider": "Google",
            "score": 91.8,
            "accuracy": 93,
            "latency": 1.22
        },
        {
            "name": "Llama 3.1 70B",
            "provider": "Meta",
            "score": 88.7,
            "accuracy": 90,
            "latency": 1.46
        }
    ]


# ============================================================
# ANALYTICS SUMMARY
# ============================================================

@app.get("/api/analytics/summary")
def analytics_summary():
    return {
        "total_evaluations": 0,
        "average_score": 92.0,
        "best_model": "GPT-4o",
        "success_rate": 100,
        "database": "connected",
        "models_available": 4
    }


# ============================================================
# ANALYTICS
# ============================================================

@app.get("/api/analytics")
def analytics():
    return {
        "total_evaluations": 0,
        "average_score": 92.0,
        "best_model": "GPT-4o",
        "success_rate": 100,
        "models_available": 4,
        "metrics": {
            "accuracy": 94,
            "relevance": 91,
            "quality": 93,
            "reliability": 98,
            "latency": 87,
            "cost": 82,
            "safety": 96
        }
    }


# ============================================================
# MODEL COMPARISON
# ============================================================

@app.get("/api/models/compare")
def compare_models():
    return {
        "models": [
            {
                "name": "GPT-4o",
                "provider": "OpenAI",
                "score": 94.1,
                "accuracy": 96,
                "latency": 0.92
            },
            {
                "name": "Claude 3.5 Sonnet",
                "provider": "Anthropic",
                "score": 93.4,
                "accuracy": 95,
                "latency": 1.08
            },
            {
                "name": "Gemini 1.5 Pro",
                "provider": "Google",
                "score": 91.8,
                "accuracy": 93,
                "latency": 1.22
            },
            {
                "name": "Llama 3.1 70B",
                "provider": "Meta",
                "score": 88.7,
                "accuracy": 90,
                "latency": 1.46
            }
        ]
    }


# ============================================================
# STATUS
# ============================================================

@app.get("/api/status")
def status():
    return {
        "status": "online",
        "backend": "FastAPI",
        "database": "connected",
        "models_available": 4,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }


# ============================================================
# TEST
# ============================================================

@app.get("/api/test")
def test():
    return {
        "message": "AI API Score Calculator backend is working!",
        "status": "success"
    }
# ============================================================
# EVALUATIONS
# ============================================================

@app.post("/api/evaluations")
def create_evaluation(request: ScoreRequest):

    if abs(sum(request.weights.values()) - 100) > 0.001:
        return {
            "error": "Weights must total 100%."
        }

    values = request.model_dump()

    score = sum(
        values[key] * weight / 100
        for key, weight in request.weights.items()
    )

    if score >= 90:
        grade = "Excellent"
    elif score >= 80:
        grade = "Good"
    else:
        grade = "Needs Improvement"

    return {
        "id": 1,
        "score": round(score, 2),
        "grade": grade,
        "status": "completed",
        "metrics": {
            key: values[key]
            for key in request.weights
        },
        "weights": request.weights,
        "created_at": datetime.now(timezone.utc).isoformat()
    }


@app.get("/api/evaluations")
def get_evaluations():
    return {
        "items": [],
        "total": 0
    }

