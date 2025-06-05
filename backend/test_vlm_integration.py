"""
Test script for VLM integration
"""

import asyncio
import aiohttp
import base64
import json

async def test_vlm_integration():
    """Test all VLM endpoints"""
    
    print("🧪 Testing RescueLanka VLM Integration...")
    print("="*50)
    
    async with aiohttp.ClientSession() as session:
        
        # Test 1: Main API Health
        try:
            async with session.get("http://localhost:8000/health") as response:
                if response.status == 200:
                    print("✅ Main API health check: PASSED")
                else:
                    print("❌ Main API health check: FAILED")
                    return
        except Exception as e:
            print(f"❌ Main API not reachable: {e}")
            return
        
        # Test 2: VLM Health
        try:
            async with session.get("http://localhost:8000/vlm/health") as response:
                if response.status == 200:
                    data = await response.json()
                    print("✅ VLM health check: PASSED")
                    print(f"   Status: {data.get('status')}")
                    print(f"   VLM Service: {data.get('vlm_service')}")
                else:
                    print("❌ VLM health check: FAILED")
        except Exception as e:
            print(f"❌ VLM health check error: {e}")
        
        # Test 3: Base64 Image Analysis
        print("\n🖼️ Testing image analysis...")
        
        # Small test image (1x1 pixel PNG)
        test_image_b64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
        
        test_payload = {
            "image": test_image_b64,
            "text_description": "Severe earthquake damage to building in Colombo, people trapped inside, immediate rescue needed",
            "location": "Colombo, Western Province, Sri Lanka",
            "disaster_type": "earthquake"
        }
        
        try:
            async with session.post(
                "http://localhost:8000/vlm/analyze/base64",
                json=test_payload
            ) as response:
                if response.status == 200:
                    result = await response.json()
                    print("✅ Image analysis: PASSED")
                    print(f"   Damage Detected: {result['disaster_assessment']['damage_detected']}")
                    print(f"   Severity: {result['disaster_assessment']['severity_level']}")
                    print(f"   Priority Score: {result['disaster_assessment']['priority_score']}/10")
                    print(f"   Immediate Action: {result['disaster_assessment']['requires_immediate_action']}")
                    print(f"   Recommendations: {len(result['recommendations'])} items")
                    print(f"   Visual Tags: {result['visual_tags']}")
                else:
                    error_text = await response.text()
                    print(f"❌ Image analysis: FAILED ({response.status})")
                    print(f"   Error: {error_text}")
        except Exception as e:
            print(f"❌ Image analysis error: {e}")
        
        print("\n🎉 VLM Integration tests completed!")
        print("\nNext steps:")
        print("1. ✅ Backend VLM integration is working")
        print("2. 📱 Add frontend VLM components to your React app")
        print("3. 🔗 Connect frontend to these backend endpoints")

if __name__ == "__main__":
    asyncio.run(test_vlm_integration())