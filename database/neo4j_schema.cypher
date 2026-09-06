CREATE CONSTRAINT user_id IF NOT EXISTS FOR (u:User) REQUIRE u.id IS UNIQUE;
CREATE CONSTRAINT provider_id IF NOT EXISTS FOR (p:Provider) REQUIRE p.id IS UNIQUE;
CREATE CONSTRAINT model_id IF NOT EXISTS FOR (m:Model) REQUIRE m.id IS UNIQUE;
CREATE CONSTRAINT dataset_id IF NOT EXISTS FOR (d:Dataset) REQUIRE d.id IS UNIQUE;
CREATE CONSTRAINT evaluation_id IF NOT EXISTS FOR (e:Evaluation) REQUIRE e.id IS UNIQUE;

CREATE (p:Provider {id:"provider-openai", name:"OpenAI"})
CREATE (m:Model {id:"model-gpt4o", name:"GPT-4o"})
CREATE (d:Dataset {id:"dataset-general", name:"General Knowledge Benchmark"});

MATCH (p:Provider {id:"provider-openai"}), (m:Model {id:"model-gpt4o"})
CREATE (m)-[:PROVIDED_BY]->(p);

MATCH (m:Model {id:"model-gpt4o"}), (d:Dataset {id:"dataset-general"})
CREATE (m)-[:BENCHMARKED_ON]->(d);

// Example query:
// MATCH (m:Model)-[:PROVIDED_BY]->(p:Provider)
// RETURN p.name, m.name;