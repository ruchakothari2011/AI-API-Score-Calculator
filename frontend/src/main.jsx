import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

import {
  Activity,
  BarChart3,
  Bot,
  Gauge,
  LayoutDashboard,
  Settings,
  Sparkles,
  TestTube2,
  Users,
  GitCompare,
  FileText,
  ShieldCheck
} from "lucide-react";

import "./styles.css";

const API_BASE = "http://localhost:8000";

// Normalize API list responses. The backend may return either a direct array
// or an object containing an `items` array.
const getItems = (data) => Array.isArray(data) ? data : (data?.items || []);

/* =========================================================
   APP
========================================================= */

function App() {
  const [page, setPage] = useState("Dashboard");

  const menu = [
    ["Dashboard", LayoutDashboard],
    ["AI Models", Bot],
    ["Evaluations", TestTube2],
    ["Compare Models", GitCompare],
    ["Analytics", BarChart3],
    ["AI Insights", Sparkles],
    ["API Monitoring", Activity],
    ["Reports", FileText],
    ["Users", Users],
    ["Settings", Settings]
  ];

  return (
    <div className="app">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="brand">
          <div className="brand-icon">
            <Sparkles size={21} />
          </div>

          <div>
            <strong>AI SCORE</strong>
            <span>CALCULATOR</span>
          </div>
        </div>

        <div className="workspace-title">
          WORKSPACE
        </div>

        <nav>
          {menu.map(([name, Icon]) => (
            <button
              key={name}
              className={
                page === name
                  ? "nav-item active"
                  : "nav-item"
              }
              onClick={() => setPage(name)}
            >
              <Icon size={18} />
              <span>{name}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-user">
          <div className="avatar">RK</div>

          <div>
            <strong>Project Admin</strong>
            <span>Administrator</span>
          </div>
        </div>

      </aside>

      {/* MAIN */}
      <main className="main">

        <header className="topbar">

          <div>
            <span>AI API SCORE CALCULATOR</span>
            <strong>{page}</strong>
          </div>

          <div className="top-user">
            <div className="status-online"></div>
            <div className="avatar">RK</div>
          </div>

        </header>

        <section className="content">

          {page === "Dashboard" && (
            <Dashboard setPage={setPage} />
          )}

          {page === "Evaluations" && (
            <EvaluationPage />
          )}

          {page === "AI Models" && (
            <ModelsPage />
          )}

          {page === "Compare Models" && (
            <ComparePage />
          )}

          {page === "Analytics" && (
            <AnalyticsPage />
          )}

          {page === "AI Insights" && (
            <InsightsPage />
          )}

          {page === "API Monitoring" && (
            <MonitoringPage />
          )}

          {page === "Reports" && (
            <ReportsPage />
          )}

          {page === "Users" && (
            <UsersPage />
          )}

          {page === "Settings" && (
            <SettingsPage />
          )}

        </section>

      </main>

    </div>
  );
}


/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard({ setPage }) {

  const [models, setModels] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {

    setLoading(true);

    try {

      const [modelsResponse, summaryResponse] =
        await Promise.all([
          fetch(`${API_BASE}/api/models`),
          fetch(`${API_BASE}/api/analytics/summary`)
        ]);

      const modelsData = await modelsResponse.json();
      const summaryData = await summaryResponse.json();

      setModels(getItems(modelsData));
      setSummary(summaryData);

    } catch (error) {

      console.error(
        "Dashboard loading error:",
        error
      );

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const modelCount = models.length;

  const averageScore =
    summary?.average_score ??
    (
      models.reduce(
        (sum, model) =>
          sum + Number(model.score || 0),
        0
      ) / (models.length || 1)
    ).toFixed(1);

  const evaluationCount =
    summary?.total_evaluations ?? 0;

  const bestModel =
    summary?.best_model ||
    models[0]?.name ||
    "N/A";

  return (
    <>
      <div className="page-header">

        <div>

          <div className="eyebrow">
            AI EVALUATION PLATFORM
          </div>

          <h1>
            AI API Score Calculator
          </h1>

          <p>
            Monitor, evaluate and compare
            your AI APIs from one professional
            workspace.
          </p>

        </div>

        <button
          className="primary"
          onClick={() =>
            setPage("Evaluations")
          }
        >
          <Sparkles size={18} />
          New Evaluation
        </button>

      </div>


      <div className="stats-grid">

        <Stat
          icon={Bot}
          title="AI Models"
          value={
            loading
              ? "..."
              : modelCount
          }
          change="Connected"
        />

        <Stat
          icon={TestTube2}
          title="Evaluations"
          value={
            loading
              ? "..."
              : evaluationCount
          }
          change="Saved"
        />

        <Stat
          icon={Gauge}
          title="Average Score"
          value={
            loading
              ? "..."
              : averageScore
          }
          change="Current"
        />

        <Stat
          icon={ShieldCheck}
          title="Best Model"
          value={
            loading
              ? "..."
              : bestModel
          }
          change="Top score"
        />

      </div>


      <div className="dashboard-grid">

        <Card title="AI Score Overview">

          <div className="score-overview">

            <div className="score-circle">

              <strong>
                {loading
                  ? "--"
                  : averageScore}
              </strong>

              <span>/100</span>

            </div>

            <div>

              <h2>
                {Number(averageScore) >= 90
                  ? "Excellent Performance"
                  : Number(averageScore) >= 75
                  ? "Good Performance"
                  : "Needs Improvement"}
              </h2>

              <p>
                Current score based on your
                connected AI model data.
              </p>

              <div className="progress">
                <i
                  style={{
                    width: `${Math.min(
                      100,
                      Number(averageScore) || 0
                    )}%`
                  }}
                />
              </div>

              <small>
                {averageScore}/100 overall score
              </small>

            </div>

          </div>

        </Card>


        <Card title="Quick Actions">

          <div className="quick-actions">

            <button
              onClick={() =>
                setPage("Evaluations")
              }
            >
              <TestTube2 />
              <span>New Evaluation</span>
            </button>

            <button
              onClick={() =>
                setPage("Compare Models")
              }
            >
              <GitCompare />
              <span>Compare Models</span>
            </button>

            <button
              onClick={() =>
                setPage("Analytics")
              }
            >
              <BarChart3 />
              <span>View Analytics</span>
            </button>

            <button
              onClick={() =>
                setPage("Reports")
              }
            >
              <FileText />
              <span>View Reports</span>
            </button>

          </div>

        </Card>

      </div>


      <Card title="Connected Model Performance">

        {models.length === 0 ? (

          <div className="empty">

            <Bot size={45} />

            <h2>
              No Models Available
            </h2>

            <p>
              Connect or configure models
              in the AI Models section.
            </p>

          </div>

        ) : (

          <div className="metrics-grid">

            {models.map((model) => (

              <Metric
                key={model.name}
                name={model.name}
                value={Number(model.score || 0)}
              />

            ))}

          </div>

        )}

      </Card>

    </>
  );
}


/* =========================================================
   EVALUATION PAGE
========================================================= */

function EvaluationPage() {

  const [models, setModels] = useState([]);

  const [provider, setProvider] =
    useState("OpenAI");

  const [model, setModel] =
    useState("GPT-4o");

  const [dataset, setDataset] =
    useState("General Knowledge");

  const [testCases, setTestCases] =
    useState(100);

  const [weights, setWeights] =
    useState({
      accuracy: 30,
      relevance: 20,
      quality: 15,
      reliability: 10,
      latency: 10,
      cost: 10,
      safety: 5
    });

  const [score, setScore] =
    useState(null);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [values, setValues] =
    useState({
      accuracy: 94,
      relevance: 91,
      quality: 93,
      reliability: 98,
      latency: 87,
      cost: 82,
      safety: 96
    });


  useEffect(() => {

    fetch(`${API_BASE}/api/models`)
      .then((response) =>
        response.json()
      )
      .then((data) => {

        const items = getItems(data);

        setModels(items);

        if (items.length > 0) {

          setModel(items[0].name);
          setProvider(items[0].provider);

          setValues({
            accuracy:
              Number(items[0].accuracy ?? 94),

            relevance: 91,

            quality: 93,

            reliability:
              Number(
                items[0].reliability ?? 98
              ),

            latency:
              Math.max(
                0,
                Math.min(
                  100,
                  100 -
                    Number(
                      items[0].latency ?? 1
                    ) *
                      10
                )
              ),

            cost:
              Math.max(
                0,
                Math.min(
                  100,
                  100 -
                    Number(
                      items[0].cost ?? 0.08
                    ) *
                      100
                )
              ),

            safety: 96
          });

        }

      })
      .catch((err) => {

        console.error(err);

        setError(
          "Unable to load AI models."
        );

      });

  }, []);


  const total = Object.values(weights)
    .reduce(
      (a, b) => a + Number(b || 0),
      0
    );


  const labels = {
    accuracy: "Accuracy",
    relevance: "Relevance",
    quality: "Quality",
    reliability: "Reliability",
    latency: "Latency",
    cost: "Cost Efficiency",
    safety: "Safety"
  };


  const handleModelChange = (name) => {

    setModel(name);

    const selected =
      models.find(
        (item) => item.name === name
      );

    if (!selected) return;

    setProvider(selected.provider);

    setValues({
      accuracy:
        Number(selected.accuracy ?? 94),

      relevance: 91,

      quality: 93,

      reliability:
        Number(
          selected.reliability ?? 98
        ),

      latency:
        Math.max(
          0,
          Math.min(
            100,
            100 -
              Number(
                selected.latency ?? 1
              ) *
                10
          )
        ),

      cost:
        Math.max(
          0,
          Math.min(
            100,
            100 -
              Number(
                selected.cost ?? 0.08
              ) *
                100
          )
        ),

      safety: 96
    });

    setScore(null);
    setMessage("");
  };


  async function calculateScore() {

    setError("");
    setMessage("");

    if (total !== 100) {

      setError(
        "Scoring weights must total exactly 100%."
      );

      return;

    }

    setSaving(true);

    try {

      const response =
        await fetch(
          `${API_BASE}/api/evaluations`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({
              provider,
              model,
              dataset,
              test_cases:
                Number(testCases),

              weights
            })
          }
        );

      const data =
        await response.json();

      if (!response.ok) {

        throw new Error(
          data.detail ||
            "Evaluation failed."
        );

      }

      setScore(data.score);

      setMessage(
        "Evaluation completed and saved successfully."
      );

    } catch (err) {

      console.error(err);

      setError(
        err.message ||
          "Could not save evaluation."
      );

    } finally {

      setSaving(false);

    }
  }


  return (
    <>
      <div className="page-header">

        <div>

          <div className="eyebrow">
            EVALUATION ENGINE
          </div>

          <h1>
            New AI Evaluation
          </h1>

          <p>
            Configure your benchmark and
            calculate a weighted AI API score.
          </p>

        </div>

      </div>


      <div className="evaluation-grid">

        <Card title="Evaluation Configuration">

          {error && (
            <div
              style={{
                marginBottom: "16px",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #7f1d1d"
              }}
            >
              {error}
            </div>
          )}

          {message && (
            <div
              style={{
                marginBottom: "16px",
                padding: "12px",
                borderRadius: "8px"
              }}
            >
              {message}
            </div>
          )}


          <div className="form-grid">

            <label>
              AI Provider

              <select
                value={provider}
                onChange={(e) =>
                  setProvider(e.target.value)
                }
              >

                {[...new Set(
                  models.map(
                    (item) => item.provider
                  )
                )].map((item) => (

                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>

                ))}

              </select>

            </label>


            <label>
              AI Model

              <select
                value={model}
                onChange={(e) =>
                  handleModelChange(
                    e.target.value
                  )
                }
              >

                {models.length > 0 ? (

                  models.map((item) => (

                    <option
                      key={item.name}
                      value={item.name}
                    >
                      {item.name}
                    </option>

                  ))

                ) : (

                  <option>
                    Loading models...
                  </option>

                )}

              </select>

            </label>


            <label>
              Dataset

              <select
                value={dataset}
                onChange={(e) =>
                  setDataset(e.target.value)
                }
              >

                <option>
                  General Knowledge
                </option>

                <option>
                  Customer Support
                </option>

                <option>
                  DBMS Question Answering
                </option>

                <option>
                  NLP Benchmark
                </option>

              </select>

            </label>


            <label>
              Test Cases

              <input
                type="number"
                min="1"
                value={testCases}
                onChange={(e) =>
                  setTestCases(
                    Number(e.target.value)
                  )
                }
              />

            </label>

          </div>


          <div className="divider"></div>


          <div className="weight-title">

            <h3>
              Scoring Weights
            </h3>

            <span
              className={
                total === 100
                  ? "valid"
                  : "invalid"
              }
            >
              {total}%
            </span>

          </div>


          <div className="weights">

            {Object.entries(weights).map(
              ([key, value]) => (

                <div
                  className="weight-row"
                  key={key}
                >

                  <span>
                    {labels[key]}
                  </span>

                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={value}
                    onChange={(e) =>
                      setWeights({
                        ...weights,
                        [key]:
                          Number(
                            e.target.value
                          )
                      })
                    }
                  />

                  <small>%</small>

                </div>

              )
            )}

          </div>


          <button
            className="primary full"
            disabled={
              total !== 100 ||
              saving ||
              models.length === 0
            }
            onClick={calculateScore}
          >

            <Sparkles size={18} />

            {saving
              ? "Saving Evaluation..."
              : "Calculate AI Score"}

          </button>

        </Card>


        <Card title="Score Preview">

          {score !== null ? (

            <div className="score-result">

              <div className="large-score">

                <strong>
                  {score}
                </strong>

                <span>/100</span>

              </div>

              <h2>
                {Number(score) >= 90
                  ? "Excellent Performance"
                  : Number(score) >= 75
                  ? "Good Performance"
                  : "Needs Improvement"}
              </h2>

              <p>
                Evaluation saved in the
                backend database.
              </p>


              <div className="metric-list">

                {Object.entries(values).map(
                  ([key, value]) => (

                    <Metric
                      key={key}
                      name={labels[key]}
                      value={value}
                    />

                  )
                )}

              </div>

            </div>

          ) : (

            <div className="empty">

              <Gauge size={45} />

              <h2>
                Ready to Evaluate
              </h2>

              <p>
                Configure the benchmark
                and click Calculate AI Score.
              </p>

            </div>

          )}

        </Card>

      </div>
    </>
  );
}


/* =========================================================
   AI MODELS
========================================================= */

function ModelsPage() {

  const [models, setModels] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [selectedModel, setSelectedModel] =
    useState(null);


  const loadModels = async () => {

    setLoading(true);
    setError("");

    try {

      const response =
        await fetch(
          `${API_BASE}/api/models`
        );

      if (!response.ok) {
        throw new Error(
          `Server returned ${response.status}`
        );
      }

      const data =
        await response.json();

      setModels(getItems(data));

    } catch (err) {

      console.error(err);

      setError(
        "Unable to load models from the backend."
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {
    loadModels();
  }, []);


  if (selectedModel) {

    return (
      <>

        <div className="page-header">

          <div>

            <div className="eyebrow">
              MODEL DETAILS
            </div>

            <h1>
              {selectedModel.name}
            </h1>

            <p>
              {selectedModel.provider}
            </p>

          </div>


          <button
            className="secondary"
            onClick={() =>
              setSelectedModel(null)
            }
          >
            ← Back to Models
          </button>

        </div>


        <div className="stats-grid">

          <Stat
            icon={Gauge}
            title="Overall Score"
            value={selectedModel.score}
            change="Current"
          />

          <Stat
            icon={ShieldCheck}
            title="Accuracy"
            value={`${selectedModel.accuracy}%`}
            change="Current"
          />

          <Stat
            icon={Activity}
            title="Latency"
            value={`${selectedModel.latency}s`}
            change="Current"
          />

          <Stat
            icon={ShieldCheck}
            title="Reliability"
            value={`${selectedModel.reliability}%`}
            change="Current"
          />

        </div>


        <Card title="Model Information">

          <div className="metrics-grid">

            <Metric
              name="Accuracy"
              value={
                Number(
                  selectedModel.accuracy
                )
              }
            />

            <Metric
              name="Reliability"
              value={
                Number(
                  selectedModel.reliability
                )
              }
            />

            <Metric
              name="Cost Efficiency"
              value={Math.max(
                0,
                Math.min(
                  100,
                  100 -
                    Number(
                      selectedModel.cost
                    ) *
                      100
                )
              )}
            />

          </div>


          <div
            style={{
              marginTop: "24px"
            }}
          >

            <p>
              <strong>
                Provider:
              </strong>{" "}
              {selectedModel.provider}
            </p>

            <p>
              <strong>
                Overall Score:
              </strong>{" "}
              {selectedModel.score}
            </p>

            <p>
              <strong>
                API Cost:
              </strong>{" "}
              ${selectedModel.cost}
            </p>

            <p>
              <strong>
                Latency:
              </strong>{" "}
              {selectedModel.latency}s
            </p>

            <p>
              <strong>
                Reliability:
              </strong>{" "}
              {selectedModel.reliability}%
            </p>

          </div>

        </Card>

      </>
    );
  }


  return (
    <>

      <div className="page-header">

        <div>

          <div className="eyebrow">
            MODEL REGISTRY
          </div>

          <h1>
            AI Models
          </h1>

          <p>
            Manage and monitor your
            connected AI models.
          </p>

        </div>


        <button
          className="secondary"
          onClick={loadModels}
        >
          ↻ Refresh
        </button>

      </div>


      <Card title="Connected Models">

        {loading && (

          <div className="empty">

            <Gauge size={45} />

            <h2>
              Loading Models...
            </h2>

            <p>
              Connecting to FastAPI.
            </p>

          </div>

        )}


        {error && (

          <div className="empty">

            <Bot size={45} />

            <h2>
              Unable to Load Models
            </h2>

            <p>
              {error}
            </p>

            <button
              className="primary"
              onClick={loadModels}
            >
              Try Again
            </button>

          </div>

        )}


        {!loading &&
          !error &&
          models.length === 0 && (

            <div className="empty">

              <Bot size={45} />

              <h2>
                No Models Found
              </h2>

              <p>
                Your backend returned
                no models.
              </p>

            </div>

          )}


        {!loading &&
          !error &&
          models.length > 0 && (

            <div className="model-table">

              {models.map((model) => (

                <div
                  className="model-row"
                  key={model.name}
                >

                  <div className="model-name">

                    <div className="model-icon">
                      <Bot size={18} />
                    </div>

                    <div>

                      <strong>
                        {model.name}
                      </strong>

                      <span>
                        {model.provider}
                      </span>

                    </div>

                  </div>


                  <span className="status">
                    Operational
                  </span>


                  <strong>
                    {model.score}
                  </strong>


                  <button
                    className="secondary"
                    onClick={() =>
                      setSelectedModel(model)
                    }
                  >
                    View
                  </button>

                </div>

              ))}

            </div>

          )}

      </Card>

    </>
  );
}


/* =========================================================
   COMPARE MODELS
========================================================= */

function ComparePage() {

  const [models, setModels] =
    useState([]);

  const [loading, setLoading] =
    useState(true);


  useEffect(() => {

    fetch(`${API_BASE}/api/models`)
      .then((response) =>
        response.json()
      )
      .then((data) => {

        setModels(
          getItems(data)
        );

      })
      .catch((err) => {

        console.error(err);

      })
      .finally(() => {

        setLoading(false);

      });

  }, []);


  return (
    <>

      <div className="page-header">

        <div>

          <div className="eyebrow">
            MODEL BENCHMARKING
          </div>

          <h1>
            Compare AI Models
          </h1>

          <p>
            Compare AI models using
            standardized evaluation metrics.
          </p>

        </div>

      </div>


      {loading ? (

        <div className="card">

          <div className="empty">

            <Gauge size={45} />

            <h2>
              Loading Models...
            </h2>

          </div>

        </div>

      ) : (

        <div className="compare-grid">

          {models.map((model) => (

            <div
              className="compare-card"
              key={model.name}
            >

              <div className="model-icon">
                <Bot />
              </div>

              <h2>
                {model.name}
              </h2>

              <span>
                {model.provider}
              </span>

              <div className="compare-score">
                {model.score}
              </div>

              <p>
                Overall AI API Score
              </p>


              <Metric
                name="Accuracy"
                value={Number(
                  model.accuracy ?? 0
                )}
              />

              <Metric
                name="Reliability"
                value={Number(
                  model.reliability ?? 0
                )}
              />

              <Metric
                name="Latency"
                value={Math.max(
                  0,
                  Math.min(
                    100,
                    100 -
                      Number(
                        model.latency ?? 1
                      ) *
                        10
                  )
                )}
              />

            </div>

          ))}

        </div>

      )}

    </>
  );
}


/* =========================================================
   ANALYTICS
========================================================= */

function AnalyticsPage() {

  const [summary, setSummary] =
    useState(null);

  const [evaluations, setEvaluations] =
    useState([]);

  const [loading, setLoading] =
    useState(true);


  const loadAnalytics = async () => {

    setLoading(true);

    try {

      const [
        summaryResponse,
        evaluationsResponse
      ] = await Promise.all([

        fetch(
          `${API_BASE}/api/analytics/summary`
        ),

        fetch(
          `${API_BASE}/api/evaluations`
        )

      ]);

      const summaryData =
        await summaryResponse.json();

      const evaluationData =
        await evaluationsResponse.json();

      setSummary(summaryData);

      setEvaluations(
        getItems(evaluationData)
      );

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {
    loadAnalytics();
  }, []);


  const scores =
    evaluations.map(
      (item) =>
        Number(item.score || 0)
    );


  return (
    <>

      <div className="page-header">

        <div>

          <div className="eyebrow">
            DATA ANALYTICS
          </div>

          <h1>
            Analytics
          </h1>

          <p>
            Analyze your AI evaluation
            performance and trends.
          </p>

        </div>


        <button
          className="secondary"
          onClick={loadAnalytics}
        >
          ↻ Refresh
        </button>

      </div>


      <div className="stats-grid">

        <Stat
          icon={TestTube2}
          title="Total Evaluations"
          value={
            loading
              ? "..."
              : summary?.total_evaluations ?? 0
          }
          change="Database"
        />

        <Stat
          icon={Gauge}
          title="Average Score"
          value={
            loading
              ? "..."
              : summary?.average_score ?? 0
          }
          change="Average"
        />

        <Stat
          icon={Bot}
          title="Best Model"
          value={
            loading
              ? "..."
              : summary?.best_model || "N/A"
          }
          change="Current"
        />

        <Stat
          icon={ShieldCheck}
          title="Database"
          value={
            loading
              ? "..."
              : summary?.database ===
                "connected"
              ? "Online"
              : "Offline"
          }
          change="MongoDB"
        />

      </div>


      <div className="analytics-grid">

        <Card title="Recent Evaluation Scores">

          {scores.length === 0 ? (

            <div className="empty">

              <BarChart3 size={45} />

              <h2>
                No Evaluation Data
              </h2>

              <p>
                Run an evaluation to see
                real score data here.
              </p>

            </div>

          ) : (

            <div className="metrics-grid">

              {evaluations
                .slice(0, 7)
                .map((item) => (

                  <Metric
                    key={
                      item.id ||
                      item.created_at
                    }
                    name={
                      item.model ||
                      "Evaluation"
                    }
                    value={Number(
                      item.score || 0
                    )}
                  />

                ))}

            </div>

          )}

        </Card>


        <Card title="Performance Summary">

          <div className="summary">

            <Summary
              title="Average Score"
              value={
                summary?.average_score ??
                0
              }
            />

            <Summary
              title="Best Model"
              value={
                summary?.best_model ||
                "N/A"
              }
            />

            <Summary
              title="Total Evaluations"
              value={
                summary?.total_evaluations ??
                0
              }
            />

            <Summary
              title="Database"
              value={
                summary?.database ===
                "connected"
                  ? "Connected"
                  : "Disconnected"
              }
            />

          </div>

        </Card>

      </div>

    </>
  );
}


/* =========================================================
   AI INSIGHTS
========================================================= */

function InsightsPage() {

  const [models, setModels] =
    useState([]);

  const [loading, setLoading] =
    useState(true);


  useEffect(() => {

    fetch(`${API_BASE}/api/models`)
      .then((response) =>
        response.json()
      )
      .then((data) => {

        setModels(
          getItems(data)
        );

      })
      .catch((error) => {

        console.error(error);

      })
      .finally(() => {

        setLoading(false);

      });

  }, []);


  const bestModel =
    [...models].sort(
      (a, b) =>
        Number(b.score || 0) -
        Number(a.score || 0)
    )[0];


  const fastestModel =
    [...models].sort(
      (a, b) =>
        Number(a.latency || 999) -
        Number(b.latency || 999)
    )[0];


  const cheapestModel =
    [...models].sort(
      (a, b) =>
        Number(a.cost || 999) -
        Number(b.cost || 999)
    )[0];


  return (
    <>

      <div className="page-header">

        <div>

          <div className="eyebrow">
            AI-POWERED ANALYSIS
          </div>

          <h1>
            AI Insights
          </h1>

          <p>
            Intelligent recommendations
            based on your model evaluation data.
          </p>

        </div>

      </div>


      {loading ? (

        <div className="card">

          <div className="empty">

            <Sparkles size={45} />

            <h2>
              Loading Insights...
            </h2>

          </div>

        </div>

      ) : models.length === 0 ? (

        <div className="card">

          <div className="empty">

            <Sparkles size={45} />

            <h2>
              No Model Data
            </h2>

            <p>
              Add model data before generating
              insights.
            </p>

          </div>

        </div>

      ) : (

        <div className="insights">

          <Insight
            title={
              `${bestModel.name} is the top performer`
            }
            text={
              `${bestModel.name} currently has the highest overall score of ${bestModel.score}.`
            }
          />

          <Insight
            title={
              `${fastestModel.name} is the fastest model`
            }
            text={
              `${fastestModel.name} has the lowest recorded latency of ${fastestModel.latency} seconds.`
            }
          />

          <Insight
            title={
              `${cheapestModel.name} is the most cost efficient`
            }
            text={
              `${cheapestModel.name} has the lowest recorded API cost of $${cheapestModel.cost}.`
            }
          />

          <Insight
            title="Model selection recommendation"
            text={
              "Choose the highest-scoring model when accuracy and reliability are the priority. Choose the lowest-cost or lowest-latency model when efficiency is more important."
            }
          />

        </div>

      )}

    </>
  );
}


/* =========================================================
   API MONITORING
========================================================= */

function MonitoringPage() {

  const [health, setHealth] =
    useState(null);

  const [models, setModels] =
    useState([]);

  const [latency, setLatency] =
    useState(null);

  const [loading, setLoading] =
    useState(true);


  const checkHealth = async () => {

    setLoading(true);

    const start =
      performance.now();

    try {

      const [
        healthResponse,
        modelsResponse
      ] = await Promise.all([

        fetch(
          `${API_BASE}/api/health`
        ),

        fetch(
          `${API_BASE}/api/models`
        )

      ]);

      const elapsed =
        performance.now() - start;

      setLatency(
        (elapsed / 1000).toFixed(2)
      );

      const healthData =
        await healthResponse.json();

      const modelsData =
        await modelsResponse.json();

      setHealth(
        healthData
      );

      setModels(
        getItems(modelsData)
      );

    } catch (error) {

      console.error(error);

      setHealth(null);

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {
    checkHealth();
  }, []);


  return (
    <>

      <div className="page-header">

        <div>

          <div className="eyebrow">
            API OBSERVABILITY
          </div>

          <h1>
            API Monitoring
          </h1>

          <p>
            Monitor backend health,
            response time and model availability.
          </p>

        </div>


        <button
          className="secondary"
          onClick={checkHealth}
        >
          ↻ Check Now
        </button>

      </div>


      <div className="stats-grid">

        <Stat
          icon={Activity}
          title="Backend"
          value={
            loading
              ? "..."
              : health
              ? "Online"
              : "Offline"
          }
          change="FastAPI"
        />

        <Stat
          icon={Gauge}
          title="Response Time"
          value={
            loading
              ? "..."
              : `${latency || 0}s`
          }
          change="Health check"
        />

        <Stat
          icon={Bot}
          title="Models"
          value={
            loading
              ? "..."
              : models.length
          }
          change="Available"
        />

        <Stat
          icon={ShieldCheck}
          title="Status"
          value={
            loading
              ? "..."
              : health
              ? "Healthy"
              : "Offline"
          }
          change="Current"
        />

      </div>


      <Card title="API Endpoint Health">

        <div className="health-list">

          <Health
            name="FastAPI Backend"
            latency={
              latency
                ? `${latency}s`
                : "--"
            }
            uptime={
              health
                ? "Healthy"
                : "Offline"
            }
          />


          {models.map((model) => (

            <Health
              key={model.name}
              name={
                `${model.provider} ${model.name}`
              }
              latency={
                `${model.latency}s`
              }
              uptime="Available"
            />

          ))}

        </div>

      </Card>

    </>
  );
}


/* =========================================================
   REPORTS
========================================================= */

function ReportsPage() {

  const [reports, setReports] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [selectedReport, setSelectedReport] =
    useState(null);


  const loadReports = async () => {

    setLoading(true);
    setError("");

    try {

      const response =
        await fetch(
          `${API_BASE}/api/evaluations`
        );

      if (!response.ok) {
        throw new Error(
          "Failed to load reports."
        );
      }

      const data =
        await response.json();

      setReports(
        getItems(data)
      );

    } catch (err) {

      console.error(err);

      setError(
        "Could not load evaluation reports."
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {
    loadReports();
  }, []);


  if (selectedReport) {

    return (
      <>

        <div className="page-header">

          <div>

            <div className="eyebrow">
              EVALUATION REPORT
            </div>

            <h1>
              {selectedReport.model}
            </h1>

            <p>
              {selectedReport.provider}
            </p>

          </div>


          <button
            className="secondary"
            onClick={() =>
              setSelectedReport(null)
            }
          >
            ← Back to Reports
          </button>

        </div>


        <div className="stats-grid">

          <Stat
            icon={Gauge}
            title="Overall Score"
            value={
              selectedReport.score
            }
            change="Final score"
          />

          <Stat
            icon={Bot}
            title="Provider"
            value={
              selectedReport.provider
            }
            change="AI provider"
          />

          <Stat
            icon={TestTube2}
            title="Test Cases"
            value={
              selectedReport.test_cases
            }
            change="Executed"
          />

          <Stat
            icon={FileText}
            title="Dataset"
            value={
              selectedReport.dataset
            }
            change="Benchmark"
          />

        </div>


        <Card title="Report Details">

          <div className="metrics-grid">

            {selectedReport.metrics &&
              Object.entries(
                selectedReport.metrics
              ).map(
                ([name, value]) => (

                  <Metric
                    key={name}
                    name={name}
                    value={Number(value)}
                  />

                )
              )}

          </div>


          <div
            style={{
              marginTop: "24px"
            }}
          >

            <p>
              <strong>
                Provider:
              </strong>{" "}
              {selectedReport.provider}
            </p>

            <p>
              <strong>
                Model:
              </strong>{" "}
              {selectedReport.model}
            </p>

            <p>
              <strong>
                Dataset:
              </strong>{" "}
              {selectedReport.dataset}
            </p>

            <p>
              <strong>
                Test Cases:
              </strong>{" "}
              {selectedReport.test_cases}
            </p>

            <p>
              <strong>
                Score:
              </strong>{" "}
              {selectedReport.score}/100
            </p>

            <p>
              <strong>
                Created:
              </strong>{" "}
              {selectedReport.created_at
                ? new Date(
                    selectedReport.created_at
                  ).toLocaleString()
                : "N/A"}
            </p>

          </div>

        </Card>

      </>
    );
  }


  return (
    <>

      <div className="page-header">

        <div>

          <div className="eyebrow">
            AI API SCORE CALCULATOR
          </div>

          <h1>
            Reports
          </h1>

          <p>
            View and manage AI evaluation reports.
          </p>

        </div>


        <button
          className="secondary"
          onClick={loadReports}
        >
          ↻ Refresh
        </button>

      </div>


      <Card title="Evaluation Reports">

        {loading && (

          <div className="empty">

            <FileText size={50} />

            <h2>
              Loading Reports...
            </h2>

            <p>
              Fetching evaluation history.
            </p>

          </div>

        )}


        {error && (

          <div className="empty">

            <FileText size={50} />

            <h2>
              Unable to Load Reports
            </h2>

            <p>
              {error}
            </p>

          </div>

        )}


        {!loading &&
          !error &&
          reports.length === 0 && (

            <div className="empty">

              <FileText size={50} />

              <h2>
                No Reports Yet
              </h2>

              <p>
                Complete an evaluation first.
                Your report will appear here.
              </p>

            </div>

          )}


        {!loading &&
          !error &&
          reports.length > 0 && (

            <div className="model-table">

              {reports.map((report) => (

                <div
                  className="model-row"
                  key={report.id}
                >

                  <div className="model-name">

                    <div className="model-icon">
                      <FileText size={18} />
                    </div>

                    <div>

                      <strong>
                        {report.model}
                      </strong>

                      <span>
                        {report.provider}
                      </span>

                    </div>

                  </div>


                  <span className="status">
                    Completed
                  </span>


                  <strong>
                    {report.score}
                  </strong>


                  <button
                    className="secondary"
                    onClick={() =>
                      setSelectedReport(
                        report
                      )
                    }
                  >
                    View Report
                  </button>

                </div>

              ))}

            </div>

          )}

      </Card>

    </>
  );
}


/* =========================================================
   USERS
========================================================= */

function UsersPage() {

  const [users, setUsers] =
    useState(() => {

      try {

        const saved =
          localStorage.getItem(
            "ai_score_users"
          );

        return saved
          ? JSON.parse(saved)
          : [
              {
                id: 1,
                name: "Project Admin",
                email:
                  "admin@example.com",
                role:
                  "Administrator",
                status: "Active"
              }
            ];

      } catch {

        return [];

      }

    });


  const [showForm, setShowForm] =
    useState(false);


  const [form, setForm] =
    useState({
      name: "",
      email: "",
      role: "Evaluator"
    });


  useEffect(() => {

    localStorage.setItem(
      "ai_score_users",
      JSON.stringify(users)
    );

  }, [users]);


  const addUser = (event) => {

    event.preventDefault();

    if (
      !form.name.trim() ||
      !form.email.trim()
    ) {

      alert(
        "Please enter name and email."
      );

      return;

    }


    const newUser = {

      id: Date.now(),

      name:
        form.name.trim(),

      email:
        form.email.trim(),

      role:
        form.role,

      status:
        "Active"

    };


    setUsers((current) => [
      ...current,
      newUser
    ]);


    setForm({
      name: "",
      email: "",
      role: "Evaluator"
    });


    setShowForm(false);

  };


  const deleteUser = (id) => {

    if (
      window.confirm(
        "Are you sure you want to delete this user?"
      )
    ) {

      setUsers((current) =>
        current.filter(
          (user) =>
            user.id !== id
        )
      );

    }

  };


  return (
    <>

      <div className="page-header">

        <div>

          <div className="eyebrow">
            AI API SCORE CALCULATOR
          </div>

          <h1>
            Users
          </h1>

          <p>
            Manage application users
            and permissions.
          </p>

        </div>


        <button
          className="primary"
          onClick={() =>
            setShowForm(!showForm)
          }
        >
          + Add User
        </button>

      </div>


      {showForm && (

        <Card title="Add User">

          <form
            onSubmit={addUser}
            style={{
              display: "grid",
              gap: "16px"
            }}
          >

            <label>
              Full Name

              <input
                type="text"
                placeholder="Enter full name"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name:
                      e.target.value
                  })
                }
              />

            </label>


            <label>
              Email Address

              <input
                type="email"
                placeholder="Enter email"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email:
                      e.target.value
                  })
                }
              />

            </label>


            <label>
              Role

              <select
                value={form.role}
                onChange={(e) =>
                  setForm({
                    ...form,
                    role:
                      e.target.value
                  })
                }
              >

                <option value="Evaluator">
                  Evaluator
                </option>

                <option value="Administrator">
                  Administrator
                </option>

                <option value="Viewer">
                  Viewer
                </option>

              </select>

            </label>


            <div>

              <button
                className="primary"
                type="submit"
              >
                Save User
              </button>


              <button
                className="secondary"
                type="button"
                onClick={() =>
                  setShowForm(false)
                }
                style={{
                  marginLeft: "10px"
                }}
              >
                Cancel
              </button>

            </div>

          </form>

        </Card>

      )}


      <Card title="Application Users">

        {users.length === 0 ? (

          <div className="empty">

            <Users size={50} />

            <h2>
              No Users
            </h2>

            <p>
              Add a user to get started.
            </p>

          </div>

        ) : (

          <div className="model-table">

            {users.map((user) => (

              <div
                className="model-row"
                key={user.id}
              >

                <div className="model-name">

                  <div className="model-icon">
                    <Users size={18} />
                  </div>

                  <div>

                    <strong>
                      {user.name}
                    </strong>

                    <span>
                      {user.email}
                    </span>

                  </div>

                </div>


                <span className="status">
                  {user.status}
                </span>


                <strong>
                  {user.role}
                </strong>


                <button
                  className="secondary"
                  onClick={() =>
                    deleteUser(user.id)
                  }
                >
                  Delete
                </button>

              </div>

            ))}

          </div>

        )}

      </Card>

    </>
  );
}


/* =========================================================
   SETTINGS
========================================================= */

function SettingsPage() {

  const [settings, setSettings] =
    useState(() => {

      try {

        const saved =
          localStorage.getItem(
            "ai_score_settings"
          );

        return saved
          ? JSON.parse(saved)
          : {
              applicationName:
                "AI API Score Calculator",

              refreshInterval:
                "30",

              defaultDataset:
                "General Knowledge",

              scoreThreshold:
                "80",

              backendUrl:
                API_BASE
            };

      } catch {

        return {
          applicationName:
            "AI API Score Calculator",

          refreshInterval:
            "30",

          defaultDataset:
            "General Knowledge",

          scoreThreshold:
            "80",

          backendUrl:
            API_BASE
        };

      }

    });


  const [saved, setSaved] =
    useState(false);


  const update = (
    key,
    value
  ) => {

    setSettings({
      ...settings,
      [key]: value
    });

    setSaved(false);

  };


  const saveSettings = () => {

    localStorage.setItem(
      "ai_score_settings",
      JSON.stringify(settings)
    );

    setSaved(true);

    setTimeout(
      () => setSaved(false),
      2500
    );

  };


  return (
    <>

      <div className="page-header">

        <div>

          <div className="eyebrow">
            CONFIGURATION
          </div>

          <h1>
            Settings
          </h1>

          <p>
            Configure your AI evaluation platform.
          </p>

        </div>

      </div>


      <Card title="General Settings">

        <div className="form-grid">

          <label>
            Application Name

            <input
              type="text"
              value={
                settings.applicationName
              }
              onChange={(e) =>
                update(
                  "applicationName",
                  e.target.value
                )
              }
            />

          </label>


          <label>
            Refresh Interval

            <select
              value={
                settings.refreshInterval
              }
              onChange={(e) =>
                update(
                  "refreshInterval",
                  e.target.value
                )
              }
            >

              <option value="15">
                15 seconds
              </option>

              <option value="30">
                30 seconds
              </option>

              <option value="60">
                60 seconds
              </option>

              <option value="300">
                5 minutes
              </option>

            </select>

          </label>


          <label>
            Default Dataset

            <select
              value={
                settings.defaultDataset
              }
              onChange={(e) =>
                update(
                  "defaultDataset",
                  e.target.value
                )
              }
            >

              <option>
                General Knowledge
              </option>

              <option>
                Customer Support
              </option>

              <option>
                DBMS Question Answering
              </option>

              <option>
                NLP Benchmark
              </option>

            </select>

          </label>


          <label>
            Score Threshold

            <input
              type="number"
              min="0"
              max="100"
              value={
                settings.scoreThreshold
              }
              onChange={(e) =>
                update(
                  "scoreThreshold",
                  e.target.value
                )
              }
            />

          </label>

        </div>

      </Card>


      <Card title="Backend Configuration">

        <div className="form-grid">

          <label>
            Backend URL

            <input
              type="text"
              value={
                settings.backendUrl
              }
              onChange={(e) =>
                update(
                  "backendUrl",
                  e.target.value
                )
              }
            />

          </label>

        </div>


        <div
          style={{
            marginTop: "20px"
          }}
        >

          <button
            className="primary"
            onClick={saveSettings}
          >
            Save Settings
          </button>


          {saved && (

            <span
              style={{
                marginLeft: "15px"
              }}
            >
              ✓ Settings saved
            </span>

          )}

        </div>

      </Card>

    </>
  );
}


/* =========================================================
   CARD
========================================================= */

function Card({
  title,
  children
}) {

  return (

    <div className="card">

      <div className="card-header">

        <h2>
          {title}
        </h2>

      </div>

      {children}

    </div>

  );
}


/* =========================================================
   STAT
========================================================= */

function Stat({
  icon: Icon,
  title,
  value,
  change
}) {

  return (

    <div className="stat-card">

      <div className="stat-icon">
        <Icon size={20} />
      </div>

      <span>
        {title}
      </span>

      <strong>
        {value}
      </strong>

      <small>
        {change}
      </small>

    </div>

  );
}


/* =========================================================
   METRIC
========================================================= */

function Metric({
  name,
  value
}) {

  const numericValue =
    Math.max(
      0,
      Math.min(
        100,
        Number(value) || 0
      )
    );


  return (

    <div className="metric">

      <div className="metric-top">

        <span>
          {name}
        </span>

        <strong>
          {Number(value).toFixed(1)}%
        </strong>

      </div>


      <div className="bar">

        <i
          style={{
            width:
              `${numericValue}%`
          }}
        />

      </div>

    </div>

  );
}


/* =========================================================
   SUMMARY
========================================================= */

function Summary({
  title,
  value
}) {

  return (

    <div className="summary-item">

      <span>
        {title}
      </span>

      <strong>
        {value}
      </strong>

    </div>

  );
}


/* =========================================================
   INSIGHT
========================================================= */

function Insight({
  title,
  text
}) {

  return (

    <div className="insight">

      <div className="insight-icon">
        <Sparkles />
      </div>

      <div>

        <h2>
          {title}
        </h2>

        <p>
          {text}
        </p>

      </div>

    </div>

  );
}


/* =========================================================
   HEALTH
========================================================= */

function Health({
  name,
  latency,
  uptime
}) {

  return (

    <div className="health-row">

      <div>

        <span className="health-dot"></span>

        <strong>
          {name}
        </strong>

      </div>

      <span>
        {latency}
      </span>

      <strong>
        {uptime}
      </strong>

      <span className="status">
        Operational
      </span>

    </div>

  );
}


/* =========================================================
   RENDER
========================================================= */

createRoot(
  document.getElementById("root")
).render(
  <App />
);