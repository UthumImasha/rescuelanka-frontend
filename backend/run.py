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

# Complete model integration
try:
    from complete_model_service import CompleteModelService
    COMPLETE_MODELS_AVAILABLE = True
except ImportError:
    COMPLETE_MODELS_AVAILABLE = False
    print("⚠️ Complete model service not found. Using basic functionality.")

# Global model service instance
model_service = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """App lifespan management with complete model integration"""
    global model_service
    
    # Startup
    print("🚀 Starting RescueLanka Backend with Complete Model Integration...")
    
    if COMPLETE_MODELS_AVAILABLE:
        # Initialize complete model service
        try:
            print("🧠 Initializing complete model service...")
            model_service = CompleteModelService()
            
            # Load all models
            success = model_service.load_all_models()
            
            if success:
                print("✅ Complete model service loaded successfully")
                app.state.model_service = model_service
                
                # Show loaded models status
                loaded_models = [k for k, v in model_service.models_loaded.items() if v]
                print(f"📊 Loaded models: {', '.join(loaded_models)}")
            else:
                print("⚠️ Some models failed to load - running with limited functionality")
                model_service = None
                
        except Exception as e:
            print(f"⚠️ Model initialization error: {e}")
            model_service = None
    
    print("✅ Backend startup complete!")
    print("🌐 API running on: http://localhost:8000")
    print("📚 API docs: http://localhost:8000/docs")
    if model_service:
        print("🧠 All AI models: http://localhost:8000/models/status")
    
    yield
    
    # Shutdown
    print("🛑 Shutting down backend...")
    if model_service:
        print("✅ Model service cleaned up")

# Create FastAPI app with lifespan
app = FastAPI(
    title="RescueLanka Complete AI Backend",
    description="Complete disaster response API with emergency, urgency, and disaster classification",
    version="2.0.0",
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

# Root endpoint
@app.get("/")
def read_root():
    models_status = "disabled"
    if model_service:
        loaded_count = sum(model_service.models_loaded.values())
        total_count = len(model_service.models_loaded)
        models_status = f"{loaded_count}/{total_count} loaded"
    
    return {
        "message": "RescueLanka Complete AI Backend",
        "version": "2.0.0",
        "models_status": models_status,
        "capabilities": [
            "Emergency classification (Hugging Face transformers)",
            "Urgency classification (Hugging Face transformers)",
            "Disaster type prediction (CNN + ML)",
            "Image analysis with VLM",
            "Combined multi-modal analysis"
        ],
        "endpoints": {
            "health": "/health",
            "models_status": "/models/status",
            "analyze_text": "/analyze/text",
            "analyze_image": "/analyze/image", 
            "analyze_complete": "/analyze/complete",
            "vlm_analyze": "/vlm/analyze/image"
        }
    }

@app.get("/health")
def health():
    if model_service:
        loaded_count = sum(model_service.models_loaded.values())
        total_count = len(model_service.models_loaded)
        
        return {
            "status": "healthy",
            "models_status": f"{loaded_count}/{total_count} loaded",
            "models_loaded": model_service.models_loaded,
            "services": {
                "main_api": "healthy",
                "emergency_classifier": "healthy" if model_service.models_loaded.get("emergency_classifier") else "unavailable",
                "urgency_classifier": "healthy" if model_service.models_loaded.get("urgency_classifier") else "unavailable",
                "disaster_classifier": "healthy" if model_service.models_loaded.get("disaster_classifier") else "unavailable",
                "feature_extractor": "healthy" if model_service.models_loaded.get("feature_extractor") else "unavailable"
            }
        }
    else:
        return {
            "status": "limited",
            "models_status": "not_loaded",
            "services": {
                "main_api": "healthy",
                "ai_models": "unavailable"
            }
        }

@app.get("/models/status")
def models_status():
    """Detailed model status endpoint"""
    if not model_service:
        return {
            "status": "models_not_loaded",
            "message": "Complete model service not available"
        }
    
    return {
        "models_loaded": model_service.models_loaded,
        "device": model_service.device,
        "model_paths": {
            "emergency_classifier": str(model_service.emergency_path),
            "urgency_classifier": str(model_service.urgency_path),
            "vlm_models": str(model_service.vlm_path)
        },
        "capabilities": {
            "text_emergency_classification": model_service.models_loaded.get("emergency_classifier", False),
            "text_urgency_classification": model_service.models_loaded.get("urgency_classifier", False),
            "image_disaster_classification": model_service.models_loaded.get("disaster_classifier", False) and model_service.models_loaded.get("feature_extractor", False),
            "complete_multimodal_analysis": all(model_service.models_loaded.values())
        }
    }

# Text Analysis Endpoints
@app.post("/analyze/text")
async def analyze_text_only(request: dict):
    """Analyze text for emergency and urgency classification"""
    if not model_service:
        # Fallback to basic analysis
        text = request.get("text", "")
        return {
            "text": text,
            "emergency_analysis": {
                "is_emergency": "emergency" in text.lower(),
                "confidence": 0.6,
                "probabilities": {"emergency": 0.6, "non_emergency": 0.4},
                "method": "keyword_fallback"
            },
            "urgency_analysis": {
                "urgency_level": "MEDIUM",
                "confidence": 0.5,
                "probabilities": {"LOW": 0.2, "MEDIUM": 0.5, "HIGH": 0.2, "CRITICAL": 0.1},
                "method": "keyword_fallback"
            }
        }
    
    text = request.get("text", "")
    if not text:
        raise HTTPException(status_code=400, detail="Text is required")
    
    try:
        emergency_result = model_service.classify_emergency(text)
        urgency_result = model_service.classify_urgency(text)
        
        return {
            "text": text,
            "emergency_analysis": emergency_result,
            "urgency_analysis": urgency_result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Image Analysis Endpoints  
@app.post("/analyze/image")
async def analyze_image_only(
    file: UploadFile = File(..., description="Image file to analyze")
):
    """Analyze image for disaster type classification"""
    if not model_service:
        raise HTTPException(status_code=503, detail="Image analysis models not available")
    
    # Validate file
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    image_data = await file.read()
    if len(image_data) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image too large (max 10MB)")
    
    try:
        result = model_service.classify_disaster_from_image(image_data)
        return {"disaster_type_prediction": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Complete Analysis Endpoint (Main one)
@app.post("/analyze/complete")
async def analyze_complete(
    text: str = Form(..., description="Text description of the situation"),
    file: Optional[UploadFile] = File(None, description="Optional image file"),
    location: str = Form("", description="Location information"),
    disaster_type: str = Form("", description="Disaster type (optional - will be predicted if not provided)")
):
    """
    Complete multi-modal analysis using all available models
    This is the main analysis endpoint that combines all capabilities
    """
    
    if not model_service:
        # Fallback analysis
        return {
            "text": text,
            "location": location,
            "emergency_analysis": {
                "is_emergency": "emergency" in text.lower(),
                "confidence": 0.6,
                "method": "fallback"
            },
            "urgency_analysis": {
                "urgency_level": "MEDIUM",
                "confidence": 0.5,
                "method": "fallback"
            },
            "combined_assessment": {
                "is_emergency": "emergency" in text.lower(),
                "urgency_level": "MEDIUM",
                "disaster_type": disaster_type or "unknown",
                "priority_score": 5,
                "requires_immediate_action": False
            },
            "recommendations": ["Contact local authorities if needed"],
            "note": "Limited analysis - AI models not available"
        }
    
    try:
        # Read image data if provided
        image_data = None
        if file:
            if not file.content_type.startswith('image/'):
                raise HTTPException(status_code=400, detail="File must be an image")
            
            image_data = await file.read()
            if len(image_data) > 10 * 1024 * 1024:
                raise HTTPException(status_code=400, detail="Image too large (max 10MB)")
        
        # Perform complete analysis
        result = model_service.complete_analysis(
            text=text,
            image_data=image_data,
            location=location,
            disaster_type=disaster_type
        )
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Legacy VLM endpoints for backward compatibility
@app.post("/vlm/analyze/image")
async def vlm_analyze_image(
    file: UploadFile = File(..., description="Image file to analyze"),
    text_description: str = Form("", description="Optional text description"),
    location: str = Form("", description="Location information"),
    disaster_type: str = Form("", description="Type of disaster")
):
    """VLM-style image analysis endpoint for backward compatibility"""
    if not model_service:
        raise HTTPException(status_code=503, detail="VLM models not available")
    
    # Validate file
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    image_data = await file.read()
    if len(image_data) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image too large (max 10MB)")
    
    try:
        # Use complete analysis but format for VLM compatibility
        result = model_service.complete_analysis(
            text=text_description,
            image_data=image_data,
            location=location,
            disaster_type=disaster_type
        )
        
        # Reformat for VLM compatibility
        vlm_result = {
            "disaster_assessment": {
                "damage_detected": result.get("combined_assessment", {}).get("is_emergency", False),
                "severity_level": result.get("combined_assessment", {}).get("urgency_level", "MEDIUM"),
                "priority_score": result.get("combined_assessment", {}).get("priority_score", 5),
                "requires_immediate_action": result.get("combined_assessment", {}).get("requires_immediate_action", False),
                "structural_damage": "building" in text_description.lower() or "structure" in text_description.lower(),
                "casualties_possible": any(word in text_description.lower() for word in ["people", "person", "injured", "trapped"]),
                "blocked_access": any(word in text_description.lower() for word in ["blocked", "debris", "road"])
            },
            "location_info": {
                "location": location,
                "coordinates": [7.8731, 80.7718],  # Default Sri Lanka coordinates
                "area_affected": f"approximately {result.get('combined_assessment', {}).get('priority_score', 5) * 20} square meters"
            },
            "recommendations": result.get("recommendations", []),
            "visual_tags": [
                result.get("combined_assessment", {}).get("disaster_type", "unknown"),
                result.get("combined_assessment", {}).get("urgency_level", "medium").lower()
            ],
            "processing_info": result.get("processing_info", {}),
            "disaster_type_prediction": result.get("disaster_type_prediction", {})
        }
        
        return vlm_result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/vlm/health")
async def vlm_health():
    """VLM health check for backward compatibility"""
    if not model_service:
        return {
            "status": "unhealthy",
            "vlm_service": "disconnected",
            "error": "Models not loaded"
        }
    
    return {
        "status": "healthy",
        "vlm_service": "connected",
        "models_loaded": model_service.models_loaded
    }

# Legacy endpoint for backward compatibility
@app.post("/analyze/request")
def analyze_legacy(request: dict):
    """Legacy analysis endpoint"""
    text = request.get("text", "")
    
    if model_service:
        try:
            # Use new models for analysis
            emergency_result = model_service.classify_emergency(text)
            urgency_result = model_service.classify_urgency(text)
            
            return {
                "text": text,
                "emergency_analysis": emergency_result,
                "urgency_analysis": urgency_result,
                "requires_immediate_action": urgency_result.get("urgency_level") in ["HIGH", "CRITICAL"],
                "processing_time_ms": 50,
                "request_id": "legacy-request",
                "timestamp": "2024-01-01T00:00:00Z"
            }
        except Exception as e:
            print(f"Model analysis failed, using fallback: {e}")
    
    # Fallback analysis
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
        "request_id": "legacy-fallback",
        "timestamp": "2024-01-01T00:00:00Z"
    }

if __name__ == "__main__":
    print("🚀 Starting RescueLanka Complete AI Backend")
    print("🧠 Using ALL your trained models:")
    print("   📁 models/emergency_classifier/ (Hugging Face)")
    print("   📁 models/urgency_classifier/ (Hugging Face)")
    print("   📁 models/vlm/models/disaster_classifier.pkl")
    print("   📁 models/vlm/models/feature_extractor.h5")
    print("🌐 Server: http://localhost:8000")
    print("📚 API Docs: http://localhost:8000/docs")
    print("🔍 Model Status: http://localhost:8000/models/status")
    print("🎯 Complete Analysis: http://localhost:8000/analyze/complete")
    print("=" * 60)
    
    uvicorn.run(
        "run:app",
        host="127.0.0.1", 
        port=8000, 
        reload=False,
        log_level="info"
    )