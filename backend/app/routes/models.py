from fastapi import APIRouter
from app.database import get_db
router=APIRouter()
DEFAULT_MODELS=[{'name':'GPT-4o','provider':'OpenAI','score':92.4,'accuracy':94,'latency':1.2,'cost':0.08,'reliability':98},{'name':'Claude 3.5 Sonnet','provider':'Anthropic','score':90.8,'accuracy':92,'latency':1.5,'cost':0.06,'reliability':97},{'name':'Gemini 1.5 Pro','provider':'Google','score':88.7,'accuracy':90,'latency':1.1,'cost':0.04,'reliability':96}]
@router.get('')
async def list_models():
    db=get_db()
    if db is None:return {'items':DEFAULT_MODELS,'database':'disconnected'}
    items=await db.models.find({}, {'_id':0}).to_list(length=100)
    return {'items':items or DEFAULT_MODELS,'database':'connected'}
