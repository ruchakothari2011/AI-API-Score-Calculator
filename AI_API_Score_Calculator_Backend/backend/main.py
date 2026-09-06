from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.evaluations import router as evaluations_router
from app.routes.models import router as models_router
from app.routes.analytics import router as analytics_router
from app.database import connect_to_mongo, close_mongo

app = FastAPI(title='AI API Score Calculator API', version='1.0.0', description='Backend for AI API/model evaluation and scoring.')
app.add_middleware(CORSMiddleware, allow_origins=['http://localhost:5173','http://localhost:5174','http://localhost:5175'], allow_credentials=True, allow_methods=['*'], allow_headers=['*'])
app.include_router(evaluations_router, prefix='/api/evaluations', tags=['Evaluations'])
app.include_router(models_router, prefix='/api/models', tags=['Models'])
app.include_router(analytics_router, prefix='/api/analytics', tags=['Analytics'])

@app.on_event('startup')
async def startup(): await connect_to_mongo()
@app.on_event('shutdown')
async def shutdown(): await close_mongo()
@app.get('/')
async def root(): return {'name':'AI API Score Calculator API','status':'running','docs':'/docs'}
@app.get('/api/health')
async def health(): return {'status':'healthy'}
