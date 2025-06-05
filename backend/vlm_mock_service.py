"""
Mock VLM Service for RescueLanka Testing
Place this file as: backend/vlm_mock_service.py
Run this service on port 8001 before starting your main API
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import base64
import random
import uvicorn
from typing import Dict, Any

# Create mock VLM app
mock_vlm_app = FastAPI(
    title="Mock VLM Service for RescueLanka", 
    description="Simulated Vision-Language Model for disaster response testing"
)

class VLMAnalysisRequest(BaseModel):
    image: str  # base64 encoded
    text_description: str = ""
    location: str = ""
    disaster_type: str = ""
    analysis_type: str = "disaster_assessment"

@mock_vlm_app.get("/")
def root():
    return {
        "service": "Mock VLM for RescueLanka",
        "status": "running",
        "endpoints": {
            "health": "/health",
            "analyze": "/analyze/image"
        }
    }

@mock_vlm_app.get("/health")
async def health():
    return {
        "status": "healthy", 
        "service": "mock_vlm_rescuelanka",
        "message": "Mock VLM service is running and ready for disaster analysis",
        "version": "1.0.0"
    }

@mock_vlm_app.post("/analyze/image")
async def mock_analyze_image(request: VLMAnalysisRequest):
    """Mock VLM analysis with realistic Sri Lankan disaster assessment results"""
    
    # Simulate analysis based on text description and disaster type
    text_lower = request.text_description.lower()
    disaster_lower = request.disaster_type.lower()
    location_lower = request.location.lower()
    
    # Determine severity based on keywords
    if any(word in text_lower for word in ['collapsed', 'fire', 'severe', 'critical', 'trapped', 'died', 'death']):
        severity = 'CRITICAL'
        damage_detected = True
        confidence = 0.85 + random.random() * 0.1
    elif any(word in text_lower for word in ['damaged', 'flood', 'emergency', 'injured', 'evacuation', 'urgent']):
        severity = 'HIGH'
        damage_detected = True
        confidence = 0.75 + random.random() * 0.15
    elif any(word in text_lower for word in ['minor', 'small', 'light', 'slight']):
        severity = 'LOW'
        damage_detected = random.choice([True, False])
        confidence = 0.65 + random.random() * 0.2
    else:
        severity = random.choice(['MEDIUM', 'HIGH'])
        damage_detected = random.choice([True, False])
        confidence = 0.7 + random.random() * 0.2
    
    # Generate realistic detected objects based on disaster type and Sri Lankan context
    objects_map = {
        'fire': ['building', 'smoke', 'flames', 'damaged_roof', 'burnt_structure', 'emergency_vehicle'],
        'flood': ['water', 'submerged_car', 'debris', 'damaged_building', 'flood_water', 'boat'],
        'earthquake': ['collapsed_wall', 'rubble', 'cracked_foundation', 'debris', 'damaged_structure', 'rescue_team'],
        'hurricane': ['fallen_tree', 'damaged_roof', 'debris', 'broken_windows', 'wind_damage', 'coconut_tree'],
        'cyclone': ['fallen_tree', 'damaged_roof', 'debris', 'broken_windows', 'wind_damage', 'palm_tree'],
        'landslide': ['debris', 'mud', 'damaged_road', 'blocked_passage', 'earth_movement', 'rocks'],
        'tsunami': ['water', 'debris', 'damaged_building', 'boat', 'coastal_damage', 'sand'],
        'explosion': ['debris', 'damaged_building', 'rubble', 'emergency_vehicles', 'blast_damage', 'smoke']
    }
    
    detected_objects = objects_map.get(disaster_lower, ['building', 'debris', 'damage'])
    
    # Add people if mentioned
    if any(word in text_lower for word in ['person', 'people', 'trapped', 'injured', 'casualties', 'victims']):
        detected_objects.extend(['person', 'people'])
    
    # Add Sri Lankan specific objects based on location
    if any(location in location_lower for location in ['colombo', 'galle', 'kandy', 'jaffna', 'batticaloa']):
        detected_objects.extend(['vehicle', 'road', 'building'])
    
    if any(location in location_lower for location in ['coast', 'beach', 'sea', 'ocean']):
        detected_objects.extend(['water', 'sand', 'boat'])
    
    if any(location in location_lower for location in ['mountain', 'hill', 'upcountry']):
        detected_objects.extend(['trees', 'vegetation', 'slope'])
    
    # Generate mock coordinates for Sri Lankan locations
    coordinates = []
    if request.location:
        # Sri Lankan major cities coordinates
        city_coords = {
            'colombo': [6.9271, 79.8612],
            'galle': [6.0535, 80.2210],
            'kandy': [7.2906, 80.6337],
            'jaffna': [9.6615, 80.0255],
            'batticaloa': [7.7102, 81.6924],
            'negombo': [7.2083, 79.8358],
            'matara': [5.9549, 80.5550],
            'ratnapura': [6.6828, 80.3992],
            'anuradhapura': [8.3114, 80.4037],
            'trincomalee': [8.5874, 81.2152]
        }
        
        # Check if location matches known cities
        for city, coords in city_coords.items():
            if city in location_lower:
                # Add some random variation
                coordinates = [
                    coords[0] + random.uniform(-0.05, 0.05),
                    coords[1] + random.uniform(-0.05, 0.05)
                ]
                break
        
        # If no specific city found, use general Sri Lankan coordinates
        if not coordinates:
            lat = 7.8731 + random.uniform(-2, 2)  # Sri Lanka latitude range
            lon = 80.7718 + random.uniform(-1, 1)  # Sri Lanka longitude range
            coordinates = [lat, lon]
    
    # Generate contextual scene description
    scene_parts = [
        f"Analysis shows {severity.lower()} level damage",
        f"from {request.disaster_type or 'disaster'}" if request.disaster_type else "",
        f"in {request.location}" if request.location else "",
        f". {request.text_description}" if request.text_description else ""
    ]
    
    scene_description = " ".join(filter(None, scene_parts))
    
    # Calculate area affected based on severity
    if severity == 'CRITICAL':
        area_affected = f"approximately {random.randint(100, 500)} square meters"
    elif severity == 'HIGH':
        area_affected = f"approximately {random.randint(50, 150)} square meters"
    elif severity == 'MEDIUM':
        area_affected = f"approximately {random.randint(20, 80)} square meters"
    else:
        area_affected = "minimal area"
    
    # Create realistic mock result
    mock_result = {
        "damage_detected": damage_detected,
        "severity_level": severity,
        "confidence": confidence,
        "detected_objects": detected_objects,
        "scene_description": scene_description,
        "coordinates": coordinates,
        "area_affected": area_affected,
        "model_version": "mock_vlm_v1.0_sri_lanka",
        "analysis_timestamp": "2024-06-05T10:30:00Z",
        "disaster_context": {
            "country": "Sri Lanka",
            "region": "South Asia",
            "local_hazards": ["monsoon floods", "cyclones", "landslides", "coastal erosion"],
            "emergency_contacts": {
                "police": "119",
                "fire": "110", 
                "ambulance": "1990",
                "disaster_management": "117"
            }
        }
    }
    
    return mock_result

# Additional endpoint for testing different scenarios
@mock_vlm_app.post("/analyze/scenario")
async def analyze_scenario(scenario: str):
    """Test different disaster scenarios quickly"""
    
    scenarios = {
        "flood_colombo": {
            "text_description": "Severe flooding in Colombo streets, vehicles submerged",
            "location": "Colombo, Western Province",
            "disaster_type": "flood"
        },
        "landslide_kandy": {
            "text_description": "Major landslide blocking Kandy-Nuwara Eliya road",
            "location": "Kandy, Central Province", 
            "disaster_type": "landslide"
        },
        "cyclone_galle": {
            "text_description": "Cyclone damage to coastal buildings in Galle",
            "location": "Galle, Southern Province",
            "disaster_type": "cyclone"
        },
        "building_collapse": {
            "text_description": "Building collapsed in earthquake, people trapped",
            "location": "Colombo Central",
            "disaster_type": "earthquake"
        }
    }
    
    if scenario not in scenarios:
        raise HTTPException(status_code=400, detail=f"Unknown scenario. Available: {list(scenarios.keys())}")
    
    # Use the scenario data to create analysis request
    scenario_data = scenarios[scenario]
    request = VLMAnalysisRequest(
        image="mock_image_data",
        **scenario_data
    )
    
    return await mock_analyze_image(request)

@mock_vlm_app.get("/test/scenarios")
async def list_test_scenarios():
    """List available test scenarios"""
    return {
        "available_scenarios": [
            "flood_colombo",
            "landslide_kandy", 
            "cyclone_galle",
            "building_collapse"
        ],
        "usage": "POST /analyze/scenario with scenario name",
        "example": {
            "scenario": "flood_colombo"
        }
    }

if __name__ == "__main__":
    print("🎭 Starting Mock VLM Service for RescueLanka...")
    print("🇱🇰 Configured for Sri Lankan disaster scenarios")
    print("🌐 Service running on: http://localhost:8001")
    print("❤️ Health check: http://localhost:8001/health")
    print("🔍 Analysis endpoint: http://localhost:8001/analyze/image")
    print("🧪 Test scenarios: http://localhost:8001/test/scenarios")
    print("📚 API docs: http://localhost:8001/docs")
    print("\n🚨 Emergency Numbers (Sri Lanka):")
    print("   Police: 119")
    print("   Fire: 110")
    print("   Ambulance: 1990") 
    print("   Disaster Management: 117")
    print("\nPress Ctrl+C to stop")
    
    # Fixed uvicorn configuration
    uvicorn.run(
        "vlm_mock_service:mock_vlm_app",  # Import string format
        host="0.0.0.0", 
        port=8001, 
        reload=False,  # Disable reload for stability
        log_level="info"
    )