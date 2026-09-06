import os
from dotenv import load_dotenv
load_dotenv()
MONGO_URI=os.getenv('MONGO_URI','mongodb://127.0.0.1:27017')
MONGO_DB=os.getenv('MONGO_DB','ai_api_score_calculator')
