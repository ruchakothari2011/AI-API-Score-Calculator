from fastapi import APIRouter
from app.database import get_db
router=APIRouter()
@router.get('/summary')
async def summary():
    db=get_db()
    if db is None:return {'total_evaluations':0,'average_score':0,'best_model':'GPT-4o','database':'disconnected'}
    count=await db.evaluations.count_documents({}); rows=await db.evaluations.aggregate([{'$group':{'_id':None,'average_score':{'$avg':'$score'}}}]).to_list(length=1)
    return {'total_evaluations':count,'average_score':round(rows[0]['average_score'],1) if rows else 0,'best_model':'GPT-4o','database':'connected'}
