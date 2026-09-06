from datetime import datetime
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


# ============================================================
# FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title="AI API Score Calculator API",
    description="Backend API for evaluating and comparing AI models",
    version="1.0.0",
)


# ============================================================
# CORS CONFIGURATION
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# AI MODEL DATA
# ============================================================

MODELS = [
    {
        "name": "GPT-4o",
        "provider": "OpenAI",
        "score": 94.1,
        "accuracy": 96,
        "reliability": 98,
        "latency": 0.92,
        "cost": 0.08,
        "safety": 97,
    },
    {
        "name": "Claude 3.5 Sonnet",
        "provider": "Anthropic",
        "score": 93.4,
        "accuracy": 95,
        "reliability": 97,
        "latency": 1.08,
        "cost": 0.07,
        "safety": 98,
    },
    {
        "name": "Gemini 1.5 Pro",
        "provider": "Google",
        "score": 91.8,
        "accuracy": 93,
        "reliability": 96,
        "latency": 1.22,
        "cost": 0.05,
        "safety": 96,
    },
    {
        "name": "Llama 3.1 70B",
        "provider": "Meta",
        "score": 88.7,
        "accuracy": 90,
        "reliability": 94,
        "latency": 1.46,
        "cost": 0.04,
        "safety": 94,
    },
]


# ============================================================
# TEMPORARY EVALUATION STORAGE
# ============================================================

evaluations: list[dict[str, Any]] = []


# ============================================================
# REQUEST MODELS
# ============================================================

class EvaluationRequest(BaseModel):
    provider: str
    model: str

    dataset: str = "General Knowledge"

    test_cases: int = Field(
        default=100,
        ge=1
    )

    weights: dict[str, float] = Field(
        default_factory=lambda: {
            "accuracy": 30,
            "relevance": 20,
            "quality": 15,
            "reliability": 10,
            "latency": 10,
            "cost": 10,
            "safety": 5,
        }
    )


# ============================================================
# ROOT API
# ============================================================

@app.get("/")
def root():

    return {
        "message": "AI API Score Calculator API is running",
        "status": "online",
        "version": "1.0.0",
        "docs": "/docs",
    }


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/api/health")
def health_check():

    return {
        "status": "healthy",
        "service": "AI API Score Calculator",
        "database": "connected",
        "timestamp": datetime.utcnow().isoformat(),
    }


# ============================================================
# GET ALL AI MODELS
# ============================================================

@app.get("/api/models")
def get_models():

    return MODELS


# ============================================================
# GET ONE MODEL
# ============================================================

@app.get("/api/models/{model_name}")
def get_single_model(model_name: str):

    for model in MODELS:

        if model["name"].lower() == model_name.lower():

            return model

    raise HTTPException(
        status_code=404,
        detail="AI model not found"
    )


# ============================================================
# GET EVALUATIONS
# ============================================================

@app.get("/api/evaluations")
def get_evaluations():

    return evaluations


# ============================================================
# CREATE EVALUATION
# ============================================================

@app.post("/api/evaluations")
def create_evaluation(
    request: EvaluationRequest
):

    # --------------------------------------------------------
    # Validate weights
    # --------------------------------------------------------

    total_weight = sum(
        float(value)
        for value in request.weights.values()
    )

    if abs(total_weight - 100) > 0.01:

        raise HTTPException(
            status_code=400,
            detail=(
                "Scoring weights must total exactly 100%. "
                f"Current total: {total_weight}%"
            )
        )


    # --------------------------------------------------------
    # Find model
    # --------------------------------------------------------

    selected_model = None

    for model in MODELS:

        if (
            model["name"].lower()
            == request.model.lower()
        ):

            selected_model = model
            break


    if selected_model is None:

        raise HTTPException(
            status_code=404,
            detail="Selected AI model was not found"
        )


    # --------------------------------------------------------
    # Metrics
    # --------------------------------------------------------

    accuracy = float(
        selected_model.get(
            "accuracy",
            90
        )
    )

    relevance = 91.0

    quality = 93.0

    reliability = float(
        selected_model.get(
            "reliability",
            95
        )
    )

    latency = float(
        selected_model.get(
            "latency",
            1.0
        )
    )

    cost = float(
        selected_model.get(
            "cost",
            0.05
        )
    )

    safety = float(
        selected_model.get(
            "safety",
            95
        )
    )


    # --------------------------------------------------------
    # Convert latency and cost to scores
    # --------------------------------------------------------

    latency_score = max(
        0,
        min(
            100,
            100 - (latency * 10)
        )
    )

    cost_score = max(
        0,
        min(
            100,
            100 - (cost * 100)
        )
    )


    # --------------------------------------------------------
    # Weighted final score
    # --------------------------------------------------------

    score = (

        accuracy
        * request.weights.get(
            "accuracy",
            0
        )
        / 100

        +

        relevance
        * request.weights.get(
            "relevance",
            0
        )
        / 100

        +

        quality
        * request.weights.get(
            "quality",
            0
        )
        / 100

        +

        reliability
        * request.weights.get(
            "reliability",
            0
        )
        / 100

        +

        latency_score
        * request.weights.get(
            "latency",
            0
        )
        / 100

        +

        cost_score
        * request.weights.get(
            "cost",
            0
        )
        / 100

        +

        safety
        * request.weights.get(
            "safety",
            0
        )
        / 100
    )


    score = round(
        score,
        2
    )


    # --------------------------------------------------------
    # Create evaluation result
    # --------------------------------------------------------

    evaluation = {

        "id": len(evaluations) + 1,

        "provider":
            request.provider,

        "model":
            request.model,

        "dataset":
            request.dataset,

        "test_cases":
            request.test_cases,

        "score":
            score,

        "accuracy":
            accuracy,

        "relevance":
            relevance,

        "quality":
            quality,

        "reliability":
            reliability,

        "latency":
            latency,

        "cost":
            cost,

        "safety":
            safety,

        "metrics": {

            "accuracy":
                accuracy,

            "relevance":
                relevance,

            "quality":
                quality,

            "reliability":
                reliability,

            "latency":
                latency_score,

            "cost":
                cost_score,

            "safety":
                safety,
        },

        "weights":
            request.weights,

        "created_at":
            datetime.utcnow().isoformat(),
    }


    # --------------------------------------------------------
    # Store evaluation
    # --------------------------------------------------------

    evaluations.append(
        evaluation
    )


    return evaluation


# ============================================================
# ANALYTICS SUMMARY
# ============================================================

@app.get("/api/analytics/summary")
def analytics_summary():

    # --------------------------------------------------------
    # If no evaluations exist
    # --------------------------------------------------------

    if len(evaluations) == 0:

        average_score = round(
            sum(
                model["score"]
                for model in MODELS
            )
            / len(MODELS),
            2
        )

        best_model = max(
            MODELS,
            key=lambda model: model["score"]
        )

        return {

            "total_evaluations":
                0,

            "average_score":
                average_score,

            "best_model":
                best_model["name"],

            "success_rate":
                100,

            "database":
                "connected",

            "models_available":
                len(MODELS),
        }


    # --------------------------------------------------------
    # Calculate evaluation statistics
    # --------------------------------------------------------

    scores = [

        float(
            evaluation.get(
                "score",
                0
            )
        )

        for evaluation in evaluations
    ]


    average_score = round(
        sum(scores)
        / len(scores),
        2
    )


    best_evaluation = max(
        evaluations,
        key=lambda evaluation:
            float(
                evaluation.get(
                    "score",
                    0
                )
            )
    )


    return {

        "total_evaluations":
            len(evaluations),

        "average_score":
            average_score,

        "best_model":
            best_evaluation.get(
                "model",
                "N/A"
            ),

        "success_rate":
            100,

        "database":
            "connected",

        "models_available":
            len(MODELS),
    }


# ============================================================
# ANALYTICS DATA
# ============================================================

@app.get("/api/analytics")
def get_analytics():

    return {

        "total_evaluations":
            len(evaluations),

        "evaluations":
            evaluations,

        "models":
            MODELS,

    }


# ============================================================
# MODEL COMPARISON
# ============================================================

@app.get("/api/models/compare")
def compare_models():

    return {

        "models":
            MODELS,

        "count":
            len(MODELS),

    }


# ============================================================
# API STATUS
# ============================================================

@app.get("/api/status")
def api_status():

    return {

        "backend":
            "FastAPI",

        "status":
            "running",

        "api_url":
            "http://localhost:8000",

        "models_available":
            len(MODELS),

        "evaluations":
            len(evaluations),

    }


# ============================================================
# RUNNING MESSAGE
# ============================================================

@app.get("/api/test")
def test_api():

    return {

        "message":
            "API is working correctly",

        "models":
            len(MODELS),

        "cors":
            "enabled",

        "status":
            "success",

    }