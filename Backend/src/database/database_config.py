import motor.motor_asyncio
from beanie import init_beanie
from src.model.api_model import APIModel, APIKeyModel, AuditLogModel
from src.model.user_model import UserModel
from src.model.api_usage_model import APIUsage
import os
from dotenv import load_dotenv

load_dotenv()
MONGODB_URI = os.getenv("MONGODB_URL", "mongodb://localhost:27017/api_train_db")

async def init_db():
    client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URI)
    await init_beanie(
        database=client.get_default_database(),
        document_models=[APIModel, APIKeyModel, AuditLogModel, UserModel, APIUsage],
    )