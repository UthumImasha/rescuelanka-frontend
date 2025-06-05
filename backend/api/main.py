import logging
import time
import uvicorn
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .config.settings import settings
from .config.database import connect_to_mongo, close_mongo_connection
from .models.model_loader import model_loader
from .models.schemas import (
    EmergencyRequest, 
    BatchRequest, 
    HealthResponse
)
from .services.classification_service import classification_service

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("🚀 Starting Emergency Classification API...")
    
    # Connect to database
    await connect_to_mongo()
    
    # Load ML models
    success = await model_loader.load_models()
    if not success:
        logger.warning("⚠️ Some models failed to load")
    
    logger.info("✅ API startup complete")
    
    yield
    
    # Shutdown
    await close_mongo_connection()
    logger.info("🛑 API shutdown complete")

# Initialize FastAPI app
app = FastAPI(
    title="Emergency Classification API",
    description="AI-powered emergency classification and urgency assessment",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Emergency Classification API",
        "version": "1.0.0",
        "status": "active",
        "docs": "/docs"
    }

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    model_info = model_loader.get_model_info()
    
    return HealthResponse(
        status="healthy",
        timestamp=time.time(),
        models_loaded=model_info["models_loaded"],
        database_connected=True,
        device=model_info["device"]
    )

@app.post("/classify/emergency")
async def classify_emergency(request: EmergencyRequest):
    """Classify emergency status"""
    try:
        result = await model_loader.classify_emergency(request.text)
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/classify/urgency")
async def classify_urgency(request: EmergencyRequest):
    """Classify urgency level"""
    try:
        result = await model_loader.classify_urgency(request.text)
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/request")
async def analyze_request(request: EmergencyRequest):
    """Complete emergency analysis"""
    try:
        return await classification_service.analyze_single_request(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/batch")
async def analyze_batch(request: BatchRequest):
    """Batch analysis"""
    try:
        return await classification_service.analyze_batch_requests(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/models/info")
async def get_model_info():
    """Get model information"""
    return model_loader.get_model_info()

if __name__ == "__main__":
    uvicorn.run(
        "api.main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=settings.API_RELOAD
    )
