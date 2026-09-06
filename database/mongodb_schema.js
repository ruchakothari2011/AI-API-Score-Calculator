use ai_score

// Collections for flexible AI evaluation documents.
db.createCollection("evaluations")
db.createCollection("test_cases")
db.createCollection("api_logs")
db.createCollection("datasets")
db.createCollection("model_metrics")

// Recommended indexes:
db.evaluations.createIndex({ project_id: 1, created_at: -1 })
db.evaluations.createIndex({ "model.name": 1 })
db.evaluations.createIndex({ "scores.overall": -1 })
db.api_logs.createIndex({ model_id: 1, timestamp: -1 })

// Example evaluation document:
db.evaluations.insertOne({
  project_id: "demo-project",
  model: { provider: "OpenAI", name: "GPT-4o", version: "latest" },
  test_case: {
    prompt: "Explain normalization in DBMS.",
    expected_response: "Normalization organizes data to reduce redundancy."
  },
  actual_response: "Normalization is the process of organizing data...",
  metrics: {
    accuracy: 94,
    relevance: 91,
    quality: 93,
    latency_ms: 920,
    token_usage: 245,
    cost: 0.004
  },
  nlp_metrics: {
    semantic_similarity: 0.91,
    hallucination_score: 0.04
  },
  scores: { overall: 92.3 },
  created_at: new Date()
})