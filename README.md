# 🤖 AI API Score Calculator

A full-stack web application designed to **evaluate, score, compare, and analyze AI APIs and AI models** using multiple performance metrics.

The platform provides a centralized dashboard where users can evaluate AI models based on **accuracy, relevance, quality, reliability, latency, cost, and safety**, and view the results through interactive analytics and comparison interfaces.

---

## 📌 Project Overview

With the rapid growth of AI APIs and Large Language Models (LLMs), selecting the right model for a particular application can be difficult.

The **AI API Score Calculator** helps users make informed decisions by providing a structured evaluation system for different AI models.

The application calculates an overall score based on multiple evaluation criteria and presents the results through dashboards, analytics, model comparisons, monitoring, and user management interfaces.

---

## ✨ Key Features

### 📊 Dashboard
- Overall AI API performance overview
- Model scores
- Evaluation statistics
- Performance metrics
- Quick access to major application modules

### 🧪 AI Model Evaluation
Evaluate AI models using multiple metrics:

- Accuracy
- Relevance
- Quality
- Reliability
- Latency
- Cost
- Safety

### 🤖 Model Management
- View available AI models
- Compare model performance
- View individual model metrics
- Analyze model scores

### ⚖️ Model Comparison
Compare multiple AI models based on:
- Overall score
- Accuracy
- Latency
- Reliability
- Cost
- Other evaluation metrics

### 📈 Analytics
- Evaluation statistics
- Performance trends
- Model performance analysis
- Metric-based insights

### 💡 Insights
- Identify high-performing models
- Analyze evaluation results
- Support AI model selection

### 🖥️ Monitoring
- Monitor AI API performance
- Track important performance metrics
- Observe model/API behavior

### 👥 User Management
- User overview
- User-related information
- User management interface

---

## 🧮 Evaluation Metrics

The application evaluates AI APIs using the following weighted metrics:

| Metric | Weight |
|---|---:|
| Accuracy | 30% |
| Relevance | 20% |
| Quality | 15% |
| Reliability | 10% |
| Latency | 10% |
| Cost | 10% |
| Safety | 5% |
| **Total** | **100%** |

The weighted evaluation produces an overall score that can be used to compare different AI models.

---

## 🏗️ System Architecture

```text
                 ┌─────────────────────┐
                 │      User           │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │   React Frontend    │
                 │                     │
                 │ Dashboard           │
                 │ Evaluation          │
                 │ Models              │
                 │ Comparison          │
                 │ Analytics           │
                 │ Monitoring          │
                 │ Users               │
                 └──────────┬──────────┘
                            │
                         REST API
                            │
                            ▼
                 ┌─────────────────────┐
                 │   FastAPI Backend   │
                 │                     │
                 │ API Routes          │
                 │ Evaluation Logic    │
                 │ Scoring Services    │
                 │ Analytics           │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │      Database       │
                 │      MongoDB        │
                 └─────────────────────┘
