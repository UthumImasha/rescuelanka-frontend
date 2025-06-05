from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConnectionFailure
import logging
# Fix import
from api.config.settings import settings

class Database:
    client: AsyncIOMotorClient = None
    database = None

database = Database()

async def connect_to_mongo():
    """Create database connection"""
    try:
        database.client = AsyncIOMotorClient(
            settings.MONGODB_URL,
            maxPoolSize=10,
            minPoolSize=1,
            serverSelectionTimeoutMS=5000
        )
        
        # Test connection
        await database.client.admin.command('ping')
        database.database = database.client[settings.DATABASE_NAME]
        
        logging.info(f"✅ Connected to MongoDB: {settings.DATABASE_NAME}")
        return True
    except ConnectionFailure as e:
        logging.error(f"❌ Failed to connect to MongoDB: {e}")
        return False

async def close_mongo_connection():
    """Close database connection"""
    if database.client:
        database.client.close()
        logging.info("🔌 Disconnected from MongoDB")

def get_database():
    return database.database
