import uuid
import time
from typing import Dict, Any, List
from datetime import datetime
from ..models.model_loader import model_loader
from ..models.schemas import (
    EmergencyRequest, 
    AnalysisResponse, 
    BatchRequest, 
    BatchResponse
)
from ..config.database import get_database

class ClassificationService:
    def __init__(self):
        self.database = get_database()
    
    async def analyze_single_request(
        self, 
        request: EmergencyRequest
    ) -> AnalysisResponse:
        """Analyze a single emergency request"""
        start_time = time.time()
        request_id = str(uuid.uuid4())
        
        try:
            # Log request to database
            if self.database:
                await self._log_request(request_id, request)
            
            # Perform analysis
            result = await model_loader.analyze_request(request.text)
            processing_time = (time.time() - start_time) * 1000
            
            # Create response
            analysis_response = AnalysisResponse(
                text=request.text,
                emergency_analysis=result["emergency_analysis"],
                urgency_analysis=result["urgency_analysis"],
                requires_immediate_action=result["requires_immediate_action"],
                processing_time_ms=processing_time,
                request_id=request_id
            )
            
            # Log classification result
            if self.database:
                await self._log_classification(request_id, analysis_response)
            
            return analysis_response
            
        except Exception as e:
            processing_time = (time.time() - start_time) * 1000
            raise Exception(f"Analysis failed: {str(e)}")
    
    async def analyze_batch_requests(
        self, 
        request: BatchRequest
    ) -> BatchResponse:
        """Analyze multiple emergency requests"""
        start_time = time.time()
        results = []
        
        for i, text in enumerate(request.texts):
            try:
                single_request = EmergencyRequest(
                    text=text,
                    user_id=request.user_id,
                    session_id=request.session_id
                )
                
                analysis = await self.analyze_single_request(single_request)
                results.append(analysis)
                
            except Exception as e:
                # Create error result
                error_result = AnalysisResponse(
                    text=text,
                    emergency_analysis={"error": str(e)},
                    urgency_analysis={"error": str(e)},
                    requires_immediate_action=False,
                    processing_time_ms=0
                )
                results.append(error_result)
        
        processing_time = (time.time() - start_time) * 1000
        
        # Calculate summary
        successful = [r for r in results if not hasattr(r.emergency_analysis, 'error')]
        emergency_count = sum(
            1 for r in successful 
            if r.emergency_analysis.get('is_emergency', False)
        )
        immediate_action_count = sum(
            1 for r in successful 
            if r.requires_immediate_action
        )
        
        summary = {
            "total_requests": len(request.texts),
            "successful_analyses": len(successful),
            "emergency_count": emergency_count,
            "immediate_action_required": immediate_action_count,
            "avg_processing_time_ms": processing_time / len(request.texts)
        }
        
        return BatchResponse(
            results=results,
            summary=summary,
            processing_time_ms=processing_time
        )
    
    async def _log_request(self, request_id: str, request: EmergencyRequest):
        """Log request to database"""
        try:
            collection = self.database["requests"]
            await collection.insert_one({
                "_id": request_id,
                "timestamp": datetime.utcnow(),
                "text": request.text,
                "user_id": request.user_id,
                "session_id": request.session_id,
                "location": request.location,
                "contact_info": request.contact_info
            })
        except Exception as e:
            print(f"Failed to log request: {e}")
    
    async def _log_classification(self, request_id: str, analysis: AnalysisResponse):
        """Log classification result to database"""
        try:
            collection = self.database["classifications"]
            await collection.insert_one({
                "_id": str(uuid.uuid4()),
                "request_id": request_id,
                "timestamp": analysis.timestamp,
                "is_emergency": analysis.emergency_analysis.is_emergency,
                "urgency_level": analysis.urgency_analysis.urgency_level,
                "requires_immediate_action": analysis.requires_immediate_action,
                "processing_time_ms": analysis.processing_time_ms
            })
        except Exception as e:
            print(f"Failed to log classification: {e}")

# Global service instance
classification_service = ClassificationService()
