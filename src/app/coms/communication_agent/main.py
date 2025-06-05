#!/usr/bin/env python

import sys
import os
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional
import uvicorn

# Add the src directory to the Python path
src_dir = Path(__file__).parent.parent.parent / "src"
sys.path.insert(0, str(src_dir))

from communication_agent.crew import CommunicationAgentCrew
from dotenv import load_dotenv

load_dotenv()

# FastAPI app
app = FastAPI(title="Communication Agent API", version="1.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the crew
crew_instance = CommunicationAgentCrew()

# Pydantic models for API
class MessageRequest(BaseModel):
    user_role: str
    message_content: str
    user_context: Optional[Dict] = {}

class BroadcastRequest(BaseModel):
    broadcast_type: str
    target_audience: str
    message_type: str
    key_information: str
    urgency_level: str

class ClarificationRequest(BaseModel):
    user_role: str
    original_message: str
    missing_info: str
    user_context: Optional[Dict] = {}

class MessageResponse(BaseModel):
    response: str
    urgency_level: Optional[str] = None
    status: str = "success"

# API Routes
@app.get("/")
async def health_check():
    return {"status": "Communication Agent API is running", "version": "1.0.0"}

@app.post("/api/process-message", response_model=MessageResponse)
async def process_message(request: MessageRequest):
    try:
        result = crew_instance.process_user_message(
            user_role=request.user_role,
            message_content=request.message_content,
            user_context=request.user_context
        )

        return MessageResponse(
            response=str(result),
            status="success"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/create-broadcast", response_model=MessageResponse)
async def create_broadcast(request: BroadcastRequest):
    try:
        result = crew_instance.create_public_broadcast(
            broadcast_type=request.broadcast_type,
            target_audience=request.target_audience,
            message_type=request.message_type,
            key_information=request.key_information,
            urgency_level=request.urgency_level
        )

        return MessageResponse(
            response=str(result),
            status="success"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate-clarification", response_model=MessageResponse)
async def generate_clarification(request: ClarificationRequest):
    try:
        result = crew_instance.generate_clarification(
            user_role=request.user_role,
            original_message=request.original_message,
            missing_info=request.missing_info,
            user_context=request.user_context
        )

        return MessageResponse(
            response=str(result),
            status="success"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8010)
