"""
VLM API Endpoints for Disaster Response
Add these endpoints to your existing API structure
"""

from fastapi import APIRouter, HTTPException, File, UploadFile, Form, Depends
from fastapi.responses import JSONResponse
from typing import Dict, Any, Optional
import base64
from pathlib import Path
import sys

# Add the backend directory to Python path
sys.path.append(str(Path(__file__).parent.parent))

# Import your VLM integration service
from vlm_integration_service import VLMIntegrationService

# Create router for VLM endpoints
vlm_router = APIRouter(prefix="/vlm", tags=["Vision-Language Model"])

# Initialize VLM service (you'll inject this from your main app)
vlm_service = None

def get_vlm_service():
    """Dependency to get VLM service instance"""
    if vlm_service is None:
        raise HTTPException(status_code=503, detail="VLM service not available")
    return vlm_service

@vlm_router.post("/analyze/image")
async def analyze_uploaded_image(
    file: UploadFile = File(..., description="Image file to analyze"),
    text_description: str = Form("", description="Optional text description"),
    location: str = Form("", description="Location information"),
    disaster_type: str = Form("", description="Type of disaster"),
    vlm_svc: VLMIntegrationService = Depends(get_vlm_service)
):
    """Analyze uploaded image for disaster assessment"""
    
    # Validate file type
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # Validate file size (max 10MB)
    image_data = await file.read()
    if len(image_data) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image too large (max 10MB)")
    
    # Analyze with VLM
    try:
        result = await vlm_svc.analyze_image_with_text(
            image_data=image_data,
            text_description=text_description,
            location=location,
            disaster_type=disaster_type
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@vlm_router.post("/analyze/base64")
async def analyze_base64_image(
    request: dict,
    vlm_svc: VLMIntegrationService = Depends(get_vlm_service)
):
    """Analyze base64 encoded image"""
    
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
        result = await vlm_svc.analyze_image_with_text(
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

@vlm_router.get("/health")
async def vlm_health_check(vlm_svc: VLMIntegrationService = Depends(get_vlm_service)):
    """Check VLM service health"""
    
    try:
        health_status = await vlm_svc.test_vlm_connection()
        return {
            "status": "healthy",
            "vlm_service": "connected",
            "vlm_service_url": vlm_svc.vlm_service_url,
            "vlm_health": health_status
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "vlm_service": "disconnected",
            "error": str(e)
        }

# Function to set the VLM service instance
def set_vlm_service(service_instance):
    global vlm_service
    vlm_service = service_instance