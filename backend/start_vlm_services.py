"""
Script to start both your main API and VLM mock service
"""

import subprocess
import sys
import time
import signal
import os
from pathlib import Path

def start_services():
    """Start VLM mock service and main API"""
    processes = []
    
    try:
        print("🚀 Starting RescueLanka VLM Services...")
        
        # Change to backend directory
        backend_dir = Path(__file__).parent
        os.chdir(backend_dir)
        
        # Start VLM mock service
        print("🎭 Starting VLM Mock Service on port 8001...")
        vlm_process = subprocess.Popen([
            sys.executable, "vlm_mock_service.py"
        ])
        processes.append(("VLM Mock Service", vlm_process))
        time.sleep(3)  # Wait for VLM service to start
        
        # Start main API
        print("🌐 Starting Main API on port 8000...")
        api_process = subprocess.Popen([
            sys.executable, "run.py"
        ])
        processes.append(("Main API", api_process))
        
        print("\n" + "="*60)
        print("✅ RescueLanka Services Started Successfully!")
        print("🌐 Main API: http://localhost:8000")
        print("🎭 VLM Mock Service: http://localhost:8001")
        print("📚 API Documentation: http://localhost:8000/docs")
        print("❤️ VLM Health Check: http://localhost:8000/vlm/health")
        print("🔍 Test VLM Analysis: http://localhost:8000/vlm/analyze/image")
        print("\nPress Ctrl+C to stop all services")
        print("="*60)
        
        # Wait for keyboard interrupt
        try:
            while True:
                time.sleep(1)
                # Check if any process died
                for name, process in processes:
                    if process.poll() is not None:
                        print(f"⚠️ {name} stopped unexpectedly")
                        raise KeyboardInterrupt
        except KeyboardInterrupt:
            pass
            
    except Exception as e:
        print(f"❌ Error starting services: {e}")
    
    finally:
        print("\n🛑 Stopping all services...")
        for name, process in processes:
            try:
                process.terminate()
                process.wait(timeout=5)
                print(f"✅ {name} stopped")
            except subprocess.TimeoutExpired:
                process.kill()
                print(f"⚠️ {name} force killed")
            except Exception as e:
                print(f"⚠️ Error stopping {name}: {e}")

if __name__ == "__main__":
    start_services()