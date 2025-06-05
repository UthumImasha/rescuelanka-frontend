import uvicorn
from fastapi import FastAPI, HTTPException, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import base64
from typing import Optional
import sys
from pathlib import Path

# Add current directory to path for imports
sys.path.append(str(Path(__file__).parent))

# VLM Integration imports (will be created)
try:
    from vlm_integration_service import VLMIntegrationService
    VLM_AVAILABLE = True
except ImportError:
    VLM_AVAILABLE = False
    print("⚠️ VLM integration files not found. VLM features will be disabled.")

# Global VLM service instance
vlm_service = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """App lifespan management"""
    global vlm_service
    
    # Startup
    print("🚀 Starting RescueLanka Backend...")
    
    if VLM_AVAILABLE:
        # Initialize VLM service
        try:
            print("🔍 Initializing VLM integration...")
            vlm_service = VLMIntegrationService("http://localhost:8001")
            
            # Try to connect to VLM service
            success = await vlm_service.initialize()
            
            if success:
                print("✅ VLM service connected successfully")
                app.state.vlm_service = vlm_service
            else:
                print("⚠️ VLM service connection failed - running without VLM")
                vlm_service = None
                
        except Exception as e:
            print(f"⚠️ VLM initialization error: {e}")
            vlm_service = None
    
    print("✅ Backend startup complete!")
    print("🌐 API running on: http://localhost:8000")
    print("📚 API docs: http://localhost:8000/docs")
    if vlm_service:
        print("👁️ VLM endpoints: http://localhost:8000/vlm/health")
    
    yield
    
    # Shutdown
    print("🛑 Shutting down backend...")
    if vlm_service:
        await vlm_service.cleanup()
        print("✅ VLM service cleaned up")

# Create FastAPI app with lifespan
app = FastAPI(
    title="RescueLanka Disaster Response API",
    description="Backend API for disaster response coordination with VLM integration",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Your existing endpoints
@app.get("/")
def read_root():
    return {
        "message": "RescueLanka Backend is working!",
        "version": "1.0.0",
        "vlm_available": vlm_service is not None,
        "endpoints": {
            "health": "/health",
            "analyze_text": "/analyze/request",
            "vlm_health": "/vlm/health" if vlm_service else None,
            "vlm_analyze": "/vlm/analyze/image" if vlm_service else None
        }
    }

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "vlm_status": "connected" if vlm_service else "disconnected",
        "services": {
            "main_api": "healthy",
            "vlm_service": "healthy" if vlm_service else "unavailable"
        }
    }

@app.post("/analyze/request")
def analyze(request: dict):
    """Your existing text analysis endpoint"""
    text = request.get("text", "")
    return {
        "text": text,
        "emergency_analysis": {
            "is_emergency": "emergency" in text.lower(),
            "confidence": 0.85,
            "probabilities": {"emergency": 0.85, "non_emergency": 0.15}
        },
        "urgency_analysis": {
            "urgency_level": "HIGH",
            "confidence": 0.80,
            "probabilities": {"LOW": 0.1, "MEDIUM": 0.2, "HIGH": 0.7, "CRITICAL": 0.0}
        },
        "requires_immediate_action": True,
        "processing_time_ms": 100,
        "request_id": "test-123",
        "timestamp": "2024-01-01T00:00:00Z"
    }

# VLM Endpoints (only available if VLM service is running)
@app.get("/vlm/health")
async def vlm_health_check():
    """Check VLM service health"""
    if not vlm_service:
        raise HTTPException(status_code=503, detail="VLM service not available")
    
    try:
        health_status = await vlm_service.test_vlm_connection()
        return {
            "status": "healthy",
            "vlm_service": "connected",
            "vlm_service_url": vlm_service.vlm_service_url,
            "vlm_health": health_status
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "vlm_service": "disconnected",
            "error": str(e)
        }

@app.post("/vlm/analyze/image")
async def analyze_uploaded_image(
    file: UploadFile = File(..., description="Image file to analyze"),
    text_description: str = Form("", description="Optional text description"),
    location: str = Form("", description="Location information"),
    disaster_type: str = Form("", description="Type of disaster")
):
    """Analyze uploaded image for disaster assessment"""
    if not vlm_service:
        raise HTTPException(status_code=503, detail="VLM service not available")
    
    # Validate file type
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # Validate file size (max 10MB)
    image_data = await file.read()
    if len(image_data) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image too large (max 10MB)")
    
    # Analyze with VLM
    try:
        result = await vlm_service.analyze_image_with_text(
            image_data=image_data,
            text_description=text_description,
            location=location,
            disaster_type=disaster_type
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/vlm/analyze/base64")
async def analyze_base64_image(request: dict):
    """Analyze base64 encoded image"""
    if not vlm_service:
        raise HTTPException(status_code=503, detail="VLM service not available")
    
    try:
        # Extract base64 image data
        image_b64 = request.get('image', '')
        if not image_b64:
            raise HTTPException(status_code=400, detail="No image data provided")
        
        # Decode base64 image
        try:
            image_data = base64.b64decode(image_b64)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid base64 image data")
        
        # Analyze with VLM
        result = await vlm_service.analyze_image_with_text(
            image_data=image_data,
            text_description=request.get('text_description', ''),
            location=request.get('location', ''),
            disaster_type=request.get('disaster_type', '')
        )
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/combined")
async def analyze_combined(
    text: str = Form(..., description="Text description of the situation"),
    file: Optional[UploadFile] = File(None, description="Optional image file"),
    location: str = Form("", description="Location information"),
    disaster_type: str = Form("", description="Type of disaster")
):
    """
    Combined analysis: Text + Image (if provided)
    This combines your existing text analysis with VLM image analysis
    """
    
    # Start with text analysis (your existing logic)
    text_result = {
        "text": text,
        "emergency_analysis": {
            "is_emergency": "emergency" in text.lower(),
            "confidence": 0.85,
            "probabilities": {"emergency": 0.85, "non_emergency": 0.15}
        },
        "urgency_analysis": {
            "urgency_level": "HIGH",
            "confidence": 0.80,
            "probabilities": {"LOW": 0.1, "MEDIUM": 0.2, "HIGH": 0.7, "CRITICAL": 0.0}
        },
        "requires_immediate_action": True,
        "processing_time_ms": 100,
        "request_id": "combined-123",
        "timestamp": "2024-01-01T00:00:00Z"
    }
    
    # Add image analysis if image provided and VLM available
    image_result = None
    if file and vlm_service:
        try:
            # Validate and read image
            if file.content_type.startswith('image/'):
                image_data = await file.read()
                if len(image_data) <= 10 * 1024 * 1024:  # 10MB limit
                    
                    # Analyze with VLM
                    image_result = await vlm_service.analyze_image_with_text(
                        image_data=image_data,
                        text_description=text,
                        location=location,
                        disaster_type=disaster_type
                    )
        except Exception as e:
            print(f"Image analysis failed: {e}")
    
    # Combine results
    combined_result = {
        "text_analysis": text_result,
        "image_analysis": image_result,
        "has_image": image_result is not None,
        "vlm_available": vlm_service is not None
    }
    
    # Calculate combined priority if both analyses available
    if image_result:
        text_priority = 7 if text_result["requires_immediate_action"] else 4
        image_priority = image_result["disaster_assessment"]["priority_score"]
        combined_priority = max(text_priority, image_priority)
        
        combined_result["combined_assessment"] = {
            "priority_score": combined_priority,
            "requires_immediate_action": combined_priority >= 8,
            "confidence": (text_result["emergency_analysis"]["confidence"] + 
                         image_result["processing_info"]["confidence_score"]) / 2
        }
    
    return combined_result

if __name__ == "__main__":
    print("🚀 Starting RescueLanka Backend on http://localhost:8000")
    print("📖 Make sure to start VLM mock service first:")
    print("   python vlm_mock_service.py")
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)