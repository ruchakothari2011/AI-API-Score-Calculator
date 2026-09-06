CREATE DATABASE ai_score;

-- Connect to ai_score before running the following tables.

CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    role_id INTEGER REFERENCES roles(id),
    name VARCHAR(120) NOT NULL,
    email VARCHAR(180) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS providers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(120) UNIQUE NOT NULL,
    website TEXT,
    status VARCHAR(30) DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS models (
    id SERIAL PRIMARY KEY,
    provider_id INTEGER REFERENCES providers(id),
    name VARCHAR(160) NOT NULL,
    version VARCHAR(80),
    status VARCHAR(30) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    name VARCHAR(160) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS evaluation_configs (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id),
    accuracy_weight NUMERIC(5,2) DEFAULT 30,
    relevance_weight NUMERIC(5,2) DEFAULT 20,
    quality_weight NUMERIC(5,2) DEFAULT 15,
    reliability_weight NUMERIC(5,2) DEFAULT 10,
    latency_weight NUMERIC(5,2) DEFAULT 10,
    cost_weight NUMERIC(5,2) DEFAULT 10,
    safety_weight NUMERIC(5,2) DEFAULT 5,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO roles(name) VALUES ('admin'), ('evaluator'), ('viewer')
ON CONFLICT (name) DO NOTHING;

INSERT INTO providers(name, website) VALUES
('OpenAI', 'https://openai.com'),
('Anthropic', 'https://anthropic.com'),
('Google', 'https://ai.google'),
('Meta', 'https://ai.meta.com')
ON CONFLICT (name) DO NOTHING;