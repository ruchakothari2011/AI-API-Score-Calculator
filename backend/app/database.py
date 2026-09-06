from motor.motor_asyncio import AsyncIOMotorClient
from app.config import MONGO_URI, MONGO_DB
client=None; db=None
async def connect_to_mongo():
    global client,db
    client=AsyncIOMotorClient(MONGO_URI,serverSelectionTimeoutMS=3000)
    try:
        await client.admin.command('ping'); db=client[MONGO_DB]; print(f'MongoDB connected: {MONGO_DB}')
    except Exception as e: print(f'MongoDB connection warning: {e}'); db=None
async def close_mongo():
    global client
    if client: client.close()
def get_db(): return db
