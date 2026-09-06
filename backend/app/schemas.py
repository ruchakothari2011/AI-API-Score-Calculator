from pydantic import BaseModel,Field
from typing import Dict
class EvaluationRequest(BaseModel):
    provider:str='OpenAI'; model:str='GPT-4o'; dataset:str='DBMS Question Answering'; test_cases:int=Field(100,ge=1,le=100000); weights:Dict[str,float]
class EvaluationResponse(BaseModel):
    score:float; provider:str; model:str; dataset:str; test_cases:int; metrics:Dict[str,float]; created_at:str
