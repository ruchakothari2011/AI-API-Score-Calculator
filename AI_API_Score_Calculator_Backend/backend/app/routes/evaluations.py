from datetime import datetime,timezone
from fastapi import APIRouter,HTTPException
from app.database import get_db
from app.schemas import EvaluationRequest,EvaluationResponse
from app.services.scoring import calculate_weighted_score,get_metrics
router=APIRouter()
@router.post('',response_model=EvaluationResponse)
async def create_evaluation(payload:EvaluationRequest):
    try: score=calculate_weighted_score(payload.weights)
    except ValueError as e: raise HTTPException(status_code=400,detail=str(e))
    response={'score':score,'provider':payload.provider,'model':payload.model,'dataset':payload.dataset,'test_cases':payload.test_cases,'metrics':get_metrics(),'created_at':datetime.now(timezone.utc).isoformat()}
    db=get_db()
    if db is not None:
        r=await db.evaluations.insert_one(response.copy()); response['id']=str(r.inserted_id)
    return response
@router.get('')
async def list_evaluations(limit:int=20):
    db=get_db()
    if db is None: return {'items':[],'count':0,'database':'disconnected'}
    items=[]
    async for x in db.evaluations.find().sort('created_at',-1).limit(limit): x['id']=str(x.pop('_id')); items.append(x)
    return {'items':items,'count':len(items),'database':'connected'}
