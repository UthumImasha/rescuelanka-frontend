"""
Simple VLM Integration Service for RescueLanka
Place this file as: backend/vlm_integration_service.py
"""

import asyncio
import json
import base64
from typing import Dict, Any, List, Optional
import logging
import aiohttp
from datetime import datetime
import random

class VLMIntegrationService:
    """Service to integrate VLM capabilities with the main disaster response system"""
    
    def __init__(self, vlm_service_url: str = "http://localhost:8001"):
        self.vlm_service_url = vlm_service_url
        self.logger = self._setup_logger()
        self.session = None
        
    def _setup_logger(self):
        logging.basicConfig(level=logging.INFO)
        return logging.getLogger(__name__)
    
    async def initialize(self):
        """Initialize the VLM integration service"""
        self.session = aiohttp.ClientSession()
        
        # Test VLM service connection
        try:
            await self.test_vlm_connection()
            self.logger.info("✅ VLM service connection established")
            return True
        except Exception as e:
            self.logger.error(f"❌ Failed to connect to VLM service: {str(e)}")
            return False
    
    async def cleanup(self):
        """Cleanup resources"""
        if self.session:
            await self.session.close()
    
    async def test_vlm_connection(self):
        """Test connection to VLM service"""
        async with self.session.get(f"{self.vlm_service_url}/health") as response:
            if response.status != 200:
                raise Exception(f"VLM service not available: {response.status}")
            return await response.json()
    
    async def analyze_image_with_text(self, image_data: bytes, text_description: str = "", 
                                    location: str = "", disaster_type: str = "") -> Dict[str, Any]:
        """
        Analyze image with optional text description for disaster assessment
        """
        try:
            # Prepare image for VLM service
            image_b64 = base64.b64encode(image_data).decode('utf-8')
            
            payload = {
                "image": image_b64,
                "text_description": text_description,
                "location": location,
                "disaster_type": disaster_type,
                "analysis_type": "disaster_assessment"
            }
            
            async with self.session.post(
                f"{self.vlm_service_url}/analyze/image",
                json=payload,
                timeout=aiohttp.ClientTimeout(total=30)
            ) as response:
                
                if response.status != 200:
                    error_detail = await response.text()
                    raise Exception(f"VLM analysis failed: {error_detail}")
                
                result = await response.json()
                
                # Process and enhance VLM results for disaster response
                enhanced_result = self._enhance_vlm_results(result, text_description, location)
                
                return enhanced_result
                
        except asyncio.TimeoutError:
            raise Exception("VLM analysis timeout")
        except Exception as e:
            self.logger.error(f"VLM analysis failed: {str(e)}")
            raise Exception(f"VLM analysis error: {str(e)}")
    
    def _enhance_vlm_results(self, vlm_result: Dict[str, Any], 
                           text_description: str, location: str) -> Dict[str, Any]:
        """
        Enhance VLM results with disaster-specific processing
        """
        # Extract key information from VLM result
        damage_detected = vlm_result.get('damage_detected', False)
        severity_level = vlm_result.get('severity_level', 'UNKNOWN')
        detected_objects = vlm_result.get('detected_objects', [])
        scene_description = vlm_result.get('scene_description', '')
        
        # Calculate priority based on VLM analysis
        priority_score = self._calculate_priority_score(vlm_result)
        
        # Generate recommendations
        recommendations = self._generate_recommendations(vlm_result, text_description)
        
        # Create enhanced result
        enhanced_result = {
            "vlm_analysis": vlm_result,
            "disaster_assessment": {
                "damage_detected": damage_detected,
                "severity_level": severity_level,
                "priority_score": priority_score,
                "requires_immediate_action": priority_score >= 8,
                "structural_damage": any('building' in obj.lower() or 'structure' in obj.lower() 
                                       for obj in detected_objects),
                "casualties_possible": any('person' in obj.lower() or 'people' in obj.lower() 
                                         for obj in detected_objects),
                "blocked_access": any('debris' in obj.lower() or 'blocked' in obj.lower() 
                                    for obj in detected_objects)
            },
            "location_info": {
                "location": location,
                "coordinates": vlm_result.get('coordinates', []),
                "area_affected": vlm_result.get('area_affected', 'unknown')
            },
            "recommendations": recommendations,
            "visual_tags": self._generate_visual_tags(vlm_result),
            "processing_info": {
                "timestamp": datetime.utcnow().isoformat(),
                "model_version": vlm_result.get('model_version', 'unknown'),
                "confidence_score": vlm_result.get('confidence', 0.0)
            }
        }
        
        return enhanced_result
    
    def _calculate_priority_score(self, vlm_result: Dict[str, Any]) -> int:
        """Calculate priority score from 1-10 based on VLM analysis"""
        score = 1
        
        # Base severity mapping
        severity_mapping = {
            'CRITICAL': 9,
            'HIGH': 7,
            'SEVERE': 7,
            'MEDIUM': 5,
            'MODERATE': 4,
            'LOW': 2,
            'MINOR': 2
        }
        
        severity = vlm_result.get('severity_level', 'LOW').upper()
        score = severity_mapping.get(severity, 3)
        
        # Adjust based on detected objects/conditions
        detected_objects = vlm_result.get('detected_objects', [])
        scene_description = vlm_result.get('scene_description', '').lower()
        
        # Critical indicators
        if any(keyword in scene_description for keyword in ['collapsed', 'fire', 'flood', 'trapped']):
            score = min(10, score + 2)
        
        # Structural damage indicators
        if any('building' in obj.lower() or 'structure' in obj.lower() for obj in detected_objects):
            score = min(10, score + 1)
        
        # People presence
        if any('person' in obj.lower() or 'people' in obj.lower() for obj in detected_objects):
            score = min(10, score + 1)
        
        return max(1, min(10, score))
    
    def _generate_recommendations(self, vlm_result: Dict[str, Any], 
                                text_description: str) -> List[str]:
        """Generate actionable recommendations based on VLM analysis"""
        recommendations = []
        
        severity = vlm_result.get('severity_level', '').upper()
        detected_objects = vlm_result.get('detected_objects', [])
        scene_description = vlm_result.get('scene_description', '').lower()
        
        # Critical severity recommendations
        if severity in ['CRITICAL', 'SEVERE']:
            recommendations.append("IMMEDIATE EVACUATION REQUIRED")
            recommendations.append("Deploy emergency response teams immediately")
            recommendations.append("Establish safety perimeter")
        
        # Structural damage
        if any('building' in obj.lower() or 'structure' in obj.lower() for obj in detected_objects):
            recommendations.append("Deploy structural engineer for safety assessment")
            recommendations.append("Evacuate nearby buildings as precaution")
        
        # Fire detection
        if 'fire' in scene_description or any('fire' in obj.lower() for obj in detected_objects):
            recommendations.append("Deploy fire suppression teams")
            recommendations.append("Establish water supply for firefighting")
            recommendations.append("Evacuate downwind areas")
        
        # Flood detection
        if 'flood' in scene_description or any('water' in obj.lower() for obj in detected_objects):
            recommendations.append("Monitor water levels continuously")
            recommendations.append("Prepare evacuation routes to higher ground")
            recommendations.append("Deploy water rescue teams")
        
        # People presence
        if any('person' in obj.lower() or 'people' in obj.lower() for obj in detected_objects):
            recommendations.append("Conduct immediate headcount and welfare check")
            recommendations.append("Provide medical assessment")
        
        # Debris/blocked access
        if any('debris' in obj.lower() or 'blocked' in obj.lower() for obj in detected_objects):
            recommendations.append("Deploy heavy equipment for debris removal")
            recommendations.append("Establish alternative access routes")
        
        # Default recommendations
        if not recommendations:
            recommendations.extend([
                "Continue monitoring situation",
                "Document damage for assessment",
                "Maintain communication with local authorities"
            ])
        
        return recommendations
    
    def _generate_visual_tags(self, vlm_result: Dict[str, Any]) -> List[str]:
        """Generate visual tags for dashboard display"""
        tags = []
        
        severity = vlm_result.get('severity_level', '').upper()
        detected_objects = vlm_result.get('detected_objects', [])
        scene_description = vlm_result.get('scene_description', '').lower()
        
        # Severity tags
        if severity in ['CRITICAL', 'SEVERE']:
            tags.append("urgent")
        
        # Damage type tags
        if 'fire' in scene_description:
            tags.append("fire_damage")
        if 'flood' in scene_description:
            tags.append("flood_damage")
        if any('building' in obj.lower() for obj in detected_objects):
            tags.append("structural_damage")
        if any('debris' in obj.lower() for obj in detected_objects):
            tags.append("debris_field")
        if any('vehicle' in obj.lower() for obj in detected_objects):
            tags.append("vehicle_involved")
        
        # Safety tags
        if any('person' in obj.lower() for obj in detected_objects):
            tags.append("casualties_possible")
        if 'blocked' in scene_description:
            tags.append("access_blocked")
        
        return tags