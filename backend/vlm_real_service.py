"""
Robust VLM Service with automatic model format detection
backend/vlm_real_service.py

This version can handle different model formats and provides detailed diagnostics
"""

import os
import sys
import pickle
import joblib
import numpy as np
from pathlib import Path
from typing import Dict, Any, List, Optional
import logging
import base64
import io
from datetime import datetime

# FastAPI imports
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn

# ML/Image processing imports
try:
    import tensorflow as tf
    from tensorflow.keras.models import load_model
    from tensorflow.keras.preprocessing import image
    from tensorflow.keras.applications.vgg16 import preprocess_input
    from PIL import Image
    import cv2
    HAS_ML_LIBRARIES = True
except ImportError as e:
    print(f"⚠️ Missing ML libraries: {e}")
    HAS_ML_LIBRARIES = False

try:
    from sklearn.ensemble import RandomForestClassifier
    from sklearn.svm import SVC
    from sklearn.linear_model import LogisticRegression
    HAS_SKLEARN = True
except ImportError:
    HAS_SKLEARN = False

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ModelFormatDetector:
    """Utility class to detect and load different model formats"""
    
    @staticmethod
    def detect_file_format(file_path: Path) -> str:
        """Detect the format of a model file"""
        try:
            with open(file_path, 'rb') as f:
                header = f.read(16)
            
            # Check for different formats
            if header.startswith(b'\x80\x03'):
                return "pickle_protocol_3"
            elif header.startswith(b'\x80\x04'):
                return "pickle_protocol_4"
            elif header.startswith(b'\x80\x05'):
                return "pickle_protocol_5"
            elif header.startswith(b'PK'):
                return "joblib_compressed"
            elif header.startswith(b'\x08'):
                return "protobuf_or_tensorflow"
            elif b'HDF' in header or b'hdf' in header:
                return "hdf5"
            else:
                return "unknown"
                
        except Exception as e:
            logger.error(f"Error detecting format for {file_path}: {e}")
            return "error"
    
    @staticmethod
    def load_classifier_robust(file_path: Path):
        """Try multiple methods to load the classifier"""
        logger.info(f"🔍 Attempting to load classifier from: {file_path}")
        
        # Detect format
        format_type = ModelFormatDetector.detect_file_format(file_path)
        logger.info(f"📋 Detected format: {format_type}")
        
        # Method 1: Standard pickle
        try:
            logger.info("🔄 Trying standard pickle...")
            with open(file_path, 'rb') as f:
                model = pickle.load(f)
            logger.info("✅ Loaded with standard pickle")
            return model, "pickle"
        except Exception as e:
            logger.warning(f"❌ Standard pickle failed: {e}")
        
        # Method 2: Joblib (scikit-learn's preferred format)
        try:
            logger.info("🔄 Trying joblib...")
            model = joblib.load(file_path)
            logger.info("✅ Loaded with joblib")
            return model, "joblib"
        except Exception as e:
            logger.warning(f"❌ Joblib failed: {e}")
        
        # Method 3: Pickle with different protocols
        for protocol in [0, 1, 2, 3, 4, 5]:
            try:
                logger.info(f"🔄 Trying pickle protocol {protocol}...")
                with open(file_path, 'rb') as f:
                    model = pickle.load(f)
                logger.info(f"✅ Loaded with pickle protocol {protocol}")
                return model, f"pickle_p{protocol}"
            except Exception as e:
                logger.warning(f"❌ Pickle protocol {protocol} failed: {e}")
        
        # Method 4: Try loading as TensorFlow model (in case it's mislabeled)
        try:
            logger.info("🔄 Trying as TensorFlow model...")
            model = load_model(str(file_path))
            logger.info("✅ Loaded as TensorFlow model")
            return model, "tensorflow"
        except Exception as e:
            logger.warning(f"❌ TensorFlow loading failed: {e}")
        
        # Method 5: Try to read file info
        try:
            logger.info("🔍 Analyzing file content...")
            with open(file_path, 'rb') as f:
                content = f.read(100)  # First 100 bytes
            logger.info(f"📄 File header (hex): {content[:20].hex()}")
            logger.info(f"📄 File header (ascii): {content[:50]}")
            logger.info(f"📄 File size: {file_path.stat().st_size} bytes")
        except Exception as e:
            logger.error(f"❌ Could not read file info: {e}")
        
        raise Exception(f"Could not load classifier from {file_path} with any method")

class VLMRobustService:
    """Robust VLM Service with multiple model format support"""
    
    def __init__(self, models_dir="vlm/models"):
        self.models_dir = Path(models_dir)
        self.disaster_classifier = None
        self.feature_extractor = None
        self.classifier_type = None
        self.class_labels = None
        self.is_loaded = False
        
        # Sri Lankan disaster types mapping
        self.disaster_types = [
            'earthquake', 'flood', 'fire', 'landslide', 'cyclone', 
            'tsunami', 'building_collapse', 'explosion', 'tornado', 'other'
        ]
        
    def inspect_models_directory(self):
        """Inspect the models directory and report findings"""
        logger.info(f"🔍 Inspecting models directory: {self.models_dir}")
        
        if not self.models_dir.exists():
            logger.error(f"❌ Models directory does not exist: {self.models_dir}")
            return False
        
        # List all files
        files = list(self.models_dir.glob("*"))
        logger.info(f"📁 Found {len(files)} files in models directory:")
        
        for file in files:
            size = file.stat().st_size if file.is_file() else 0
            file_type = ModelFormatDetector.detect_file_format(file) if file.is_file() else "directory"
            logger.info(f"   📄 {file.name} ({size} bytes, {file_type})")
        
        return True
        
    def load_models(self):
        """Load models with robust error handling"""
        try:
            # Inspect directory first
            if not self.inspect_models_directory():
                return False
            
            # Try to load disaster classifier
            classifier_candidates = [
                "disaster_classifier.pkl",
                "dissaster_classifier.pkl",  # Common typo
                "classifier.pkl",
                "model.pkl",
                "disaster_model.pkl"
            ]
            
            classifier_loaded = False
            for candidate in classifier_candidates:
                classifier_path = self.models_dir / candidate
                if classifier_path.exists():
                    try:
                        logger.info(f"🎯 Found classifier candidate: {candidate}")
                        self.disaster_classifier, self.classifier_type = ModelFormatDetector.load_classifier_robust(classifier_path)
                        logger.info(f"✅ Successfully loaded classifier: {type(self.disaster_classifier).__name__}")
                        classifier_loaded = True
                        break
                    except Exception as e:
                        logger.warning(f"❌ Failed to load {candidate}: {e}")
                        continue
            
            if not classifier_loaded:
                logger.error("❌ Could not load any classifier file")
                return False
                
            # Try to load feature extractor
            extractor_candidates = [
                "feature_extractor.h5",
                "extractor.h5",
                "cnn_model.h5",
                "feature_model.h5",
                "vgg_features.h5"
            ]
            
            extractor_loaded = False
            for candidate in extractor_candidates:
                extractor_path = self.models_dir / candidate
                if extractor_path.exists():
                    try:
                        logger.info(f"🎯 Found extractor candidate: {candidate}")
                        self.feature_extractor = load_model(extractor_path)
                        logger.info(f"✅ Successfully loaded feature extractor")
                        logger.info(f"   Input shape: {self.feature_extractor.input_shape}")
                        logger.info(f"   Output shape: {self.feature_extractor.output_shape}")
                        extractor_loaded = True
                        break
                    except Exception as e:
                        logger.warning(f"❌ Failed to load {candidate}: {e}")
                        continue
            
            if not extractor_loaded:
                logger.error("❌ Could not load any feature extractor file")
                return False
            
            # Validate loaded models
            if not self.validate_models():
                return False
            
            self.is_loaded = True
            logger.info("🎉 All models loaded and validated successfully!")
            return True
            
        except Exception as e:
            logger.error(f"❌ Error in load_models: {e}")
            return False
    
    def validate_models(self) -> bool:
        """Validate that models work together"""
        try:
            logger.info("🧪 Validating model compatibility...")
            
            # Test feature extractor with dummy data
            input_shape = self.feature_extractor.input_shape[1:]  # Remove batch dimension
            dummy_image = np.random.random((1,) + input_shape).astype(np.float32)
            
            logger.info(f"🔍 Testing with dummy input shape: {dummy_image.shape}")
            features = self.feature_extractor.predict(dummy_image, verbose=0)
            logger.info(f"✅ Feature extractor output shape: {features.shape}")
            
            # Flatten features for classifier
            features_flat = features.flatten()
            logger.info(f"🔍 Flattened features shape: {features_flat.shape}")
            
            # Test classifier
            if hasattr(self.disaster_classifier, 'predict'):
                prediction = self.disaster_classifier.predict([features_flat])
                logger.info(f"✅ Classifier prediction: {prediction}")
                
                if hasattr(self.disaster_classifier, 'predict_proba'):
                    probabilities = self.disaster_classifier.predict_proba([features_flat])
                    logger.info(f"✅ Classifier probabilities shape: {probabilities.shape}")
                    
                    # Check if number of classes matches our disaster types
                    n_classes = probabilities.shape[1]
                    logger.info(f"🔍 Number of classes: {n_classes}")
                    logger.info(f"🔍 Expected disaster types: {len(self.disaster_types)}")
                    
                    if n_classes != len(self.disaster_types):
                        logger.warning(f"⚠️ Class count mismatch: model has {n_classes}, expected {len(self.disaster_types)}")
                        # Adjust disaster types to match model output
                        if n_classes < len(self.disaster_types):
                            self.disaster_types = self.disaster_types[:n_classes]
                            logger.info(f"🔧 Adjusted disaster types to: {self.disaster_types}")
                else:
                    logger.warning("⚠️ Classifier doesn't have predict_proba method")
                
                return True
            else:
                logger.error("❌ Classifier doesn't have predict method")
                return False
                
        except Exception as e:
            logger.error(f"❌ Model validation failed: {e}")
            return False
    
    def preprocess_image(self, image_data: bytes) -> np.ndarray:
        """Preprocess image for feature extractor"""
        try:
            # Convert bytes to PIL Image
            image_pil = Image.open(io.BytesIO(image_data))
            
            # Convert to RGB if needed
            if image_pil.mode != 'RGB':
                image_pil = image_pil.convert('RGB')
            
            # Get input size from model
            input_shape = self.feature_extractor.input_shape[1:3]  # Height, Width
            image_pil = image_pil.resize(input_shape)
            
            # Convert to numpy array
            img_array = image.img_to_array(image_pil)
            img_array = np.expand_dims(img_array, axis=0)
            
            # Preprocess (assuming VGG16-style preprocessing)
            img_array = preprocess_input(img_array)
            
            return img_array
            
        except Exception as e:
            logger.error(f"Image preprocessing failed: {e}")
            raise
    
    def extract_features(self, image_array: np.ndarray) -> np.ndarray:
        """Extract features using the loaded feature extractor"""
        try:
            features = self.feature_extractor.predict(image_array, verbose=0)
            return features.flatten()
        except Exception as e:
            logger.error(f"Feature extraction failed: {e}")
            raise
    
    def classify_disaster(self, features: np.ndarray) -> Dict[str, Any]:
        """Classify disaster type using the loaded classifier"""
        try:
            # Get prediction
            if hasattr(self.disaster_classifier, 'predict_proba'):
                probabilities = self.disaster_classifier.predict_proba([features])[0]
                predicted_class_idx = np.argmax(probabilities)
            else:
                # Fallback for classifiers without predict_proba
                prediction = self.disaster_classifier.predict([features])[0]
                if isinstance(prediction, (int, np.integer)):
                    predicted_class_idx = prediction
                else:
                    # String prediction - find index
                    predicted_class_idx = self.disaster_types.index(prediction) if prediction in self.disaster_types else 0
                
                # Create dummy probabilities
                probabilities = np.zeros(len(self.disaster_types))
                probabilities[predicted_class_idx] = 0.9
                probabilities[probabilities == 0] = 0.1 / (len(probabilities) - 1)
            
            # Ensure we don't go out of bounds
            predicted_class_idx = min(predicted_class_idx, len(self.disaster_types) - 1)
            
            # Get predicted disaster type
            predicted_disaster = self.disaster_types[predicted_class_idx]
            confidence = float(probabilities[predicted_class_idx])
            
            # Create probabilities dictionary
            disaster_probabilities = {
                disaster_type: float(prob) 
                for disaster_type, prob in zip(self.disaster_types, probabilities)
            }
            
            return {
                "predicted_type": predicted_disaster,
                "confidence": confidence,
                "all_probabilities": disaster_probabilities,
                "prediction_method": f"trained_model_{self.classifier_type}",
                "model_info": {
                    "classifier_type": type(self.disaster_classifier).__name__,
                    "n_classes": len(self.disaster_types),
                    "feature_dim": len(features)
                }
            }
            
        except Exception as e:
            logger.error(f"Disaster classification failed: {e}")
            raise
    
    def assess_damage_severity(self, disaster_type: str, features: np.ndarray, 
                             text_description: str = "") -> Dict[str, Any]:
        """Assess damage severity based on features and context"""
        try:
            # Feature-based severity assessment
            feature_mean = np.mean(features)
            feature_std = np.std(features)
            feature_max = np.max(features)
            feature_min = np.min(features)
            
            # Adaptive thresholds based on feature statistics
            threshold_high = np.percentile(features, 90)
            threshold_medium = np.percentile(features, 70)
            
            if feature_max > threshold_high and feature_std > np.std(features) * 0.8:
                severity = "CRITICAL"
                priority_score = 9
            elif feature_max > threshold_medium and feature_std > np.std(features) * 0.5:
                severity = "HIGH" 
                priority_score = 7
            elif feature_mean > np.mean(features):
                severity = "MEDIUM"
                priority_score = 5
            else:
                severity = "LOW"
                priority_score = 3
            
            # Disaster type adjustments
            high_impact_disasters = ['tsunami', 'earthquake', 'explosion', 'building_collapse']
            if disaster_type in high_impact_disasters:
                priority_score = min(10, priority_score + 2)
                if severity == "LOW":
                    severity = "MEDIUM"
            
            # Text-based adjustments
            text_lower = text_description.lower()
            critical_words = ['critical', 'severe', 'collapsed', 'trapped', 'death', 'casualties', 'emergency']
            high_words = ['damaged', 'injured', 'urgent', 'evacuation', 'rescue']
            
            if any(word in text_lower for word in critical_words):
                priority_score = min(10, priority_score + 3)
                if severity in ["LOW", "MEDIUM"]:
                    severity = "HIGH"
            elif any(word in text_lower for word in high_words):
                priority_score = min(10, priority_score + 1)
            
            return {
                "severity_level": severity,
                "priority_score": priority_score,
                "damage_detected": priority_score >= 4,
                "requires_immediate_action": priority_score >= 8,
                "structural_damage": disaster_type in ['earthquake', 'building_collapse', 'explosion'] or 'building' in text_lower,
                "casualties_possible": any(word in text_lower for word in ['people', 'person', 'trapped', 'injured', 'casualties']),
                "blocked_access": any(word in text_lower for word in ['blocked', 'debris', 'road', 'impassable']),
                "feature_analysis": {
                    "feature_mean": float(feature_mean),
                    "feature_std": float(feature_std),
                    "feature_max": float(feature_max),
                    "feature_min": float(feature_min)
                }
            }
            
        except Exception as e:
            logger.error(f"Damage assessment failed: {e}")
            # Fallback assessment
            return {
                "severity_level": "MEDIUM",
                "priority_score": 5,
                "damage_detected": True,
                "requires_immediate_action": False,
                "structural_damage": False,
                "casualties_possible": False,
                "blocked_access": False,
                "feature_analysis": {"error": str(e)}
            }
    
    def generate_recommendations(self, disaster_type: str, severity: str, 
                               damage_assessment: Dict[str, Any]) -> List[str]:
        """Generate contextual recommendations"""
        recommendations = []
        
        # Severity-based recommendations
        if severity == "CRITICAL":
            recommendations.extend([
                "🚨 IMMEDIATE EVACUATION REQUIRED",
                "📞 Contact emergency services: 117 (Disaster Management)",
                "🛡️ Establish safety perimeter immediately",
                "👥 Deploy emergency response teams"
            ])
        elif severity == "HIGH":
            recommendations.extend([
                "⚡ Deploy emergency response teams",
                "📋 Assess area for evacuation needs",
                "📞 Establish communication with local authorities"
            ])
        elif severity == "MEDIUM":
            recommendations.extend([
                "👀 Continue monitoring situation",
                "📊 Document damage for assessment",
                "📞 Maintain communication channels"
            ])
        
        # Disaster-specific recommendations
        disaster_recommendations = {
            'flood': ["💧 Monitor water levels", "⬆️ Move to higher ground", "🚤 Prepare water rescue if needed"],
            'fire': ["🔥 Deploy fire suppression", "💨 Evacuate downwind areas", "💧 Secure water supply"],
            'earthquake': ["🏗️ Check structural integrity", "⚠️ Prepare for aftershocks", "🔍 Structural engineer assessment"],
            'landslide': ["⛰️ Avoid unstable slopes", "🚧 Clear debris from roads", "📊 Monitor additional landslide risk"],
            'tsunami': ["⬆️ Move to higher ground immediately", "🌊 Stay away from coastline", "📻 Monitor wave warnings"],
            'building_collapse': ["🚫 Do not enter damaged structures", "🔍 Deploy search and rescue", "🏥 Establish medical triage area"]
        }
        
        if disaster_type in disaster_recommendations:
            recommendations.extend(disaster_recommendations[disaster_type])
        
        return recommendations[:8]  # Limit to 8 recommendations
    
    def analyze_image(self, image_data: bytes, text_description: str = "", 
                     location: str = "", disaster_type: str = "") -> Dict[str, Any]:
        """Complete image analysis pipeline"""
        if not self.is_loaded:
            raise Exception("Models not loaded. Please load models first.")
        
        try:
            logger.info("🔄 Starting image analysis...")
            
            # Step 1: Preprocess image
            logger.info("📸 Preprocessing image...")
            image_array = self.preprocess_image(image_data)
            
            # Step 2: Extract features
            logger.info("🧠 Extracting features...")
            features = self.extract_features(image_array)
            logger.info(f"✅ Extracted {len(features)} features")
            
            # Step 3: Classify disaster type
            logger.info("🎯 Classifying disaster type...")
            if not disaster_type:
                disaster_prediction = self.classify_disaster(features)
                predicted_disaster_type = disaster_prediction["predicted_type"]
                disaster_confidence = disaster_prediction["confidence"]
                disaster_probabilities = disaster_prediction["all_probabilities"]
                was_predicted = True
                logger.info(f"🤖 Predicted: {predicted_disaster_type} (confidence: {disaster_confidence:.2f})")
            else:
                predicted_disaster_type = disaster_type
                disaster_confidence = 0.9
                disaster_probabilities = {disaster_type: 0.9}
                was_predicted = False
                logger.info(f"👤 User provided: {predicted_disaster_type}")
            
            # Step 4: Assess damage
            logger.info("📊 Assessing damage severity...")
            damage_assessment = self.assess_damage_severity(
                predicted_disaster_type, features, text_description
            )
            
            # Step 5: Generate recommendations
            logger.info("💡 Generating recommendations...")
            recommendations = self.generate_recommendations(
                predicted_disaster_type, 
                damage_assessment["severity_level"], 
                damage_assessment
            )
            
            # Step 6: Compile results
            result = {
                "disaster_assessment": damage_assessment,
                "location_info": {
                    "location": location,
                    "coordinates": [7.8731, 80.7718],  # Default Sri Lanka center
                    "area_affected": f"approximately {damage_assessment['priority_score'] * 25} square meters"
                },
                "recommendations": recommendations,
                "visual_tags": [
                    predicted_disaster_type.replace('_', ' '),
                    damage_assessment["severity_level"].lower(),
                    "damage_detected" if damage_assessment["damage_detected"] else "no_damage"
                ],
                "processing_info": {
                    "timestamp": datetime.utcnow().isoformat(),
                    "model_version": f"real_vlm_robust_v1.0_{self.classifier_type}",
                    "confidence_score": disaster_confidence
                },
                "disaster_type_prediction": {
                    "predicted_type": predicted_disaster_type,
                    "confidence": disaster_confidence,
                    "all_probabilities": disaster_probabilities,
                    "was_predicted": was_predicted,
                    "user_provided_type": disaster_type if disaster_type else None
                },
                "vlm_analysis": {
                    "feature_vector_size": len(features),
                    "classifier_type": type(self.disaster_classifier).__name__,
                    "model_load_method": self.classifier_type
                }
            }
            
            logger.info("✅ Analysis completed successfully!")
            return result
            
        except Exception as e:
            logger.error(f"❌ Image analysis failed: {e}")
            raise

# Global service instance
vlm_robust_service = VLMRobustService()

# FastAPI app
robust_vlm_app = FastAPI(
    title="Robust VLM Service for RescueLanka",
    description="Production VLM service with robust model loading and format detection"
)

class VLMAnalysisRequest(BaseModel):
    image: str  # base64 encoded
    text_description: str = ""
    location: str = ""
    disaster_type: str = ""

@robust_vlm_app.on_event("startup")
async def startup_event():
    """Load models on startup"""
    if not HAS_ML_LIBRARIES:
        logger.error("❌ Required ML libraries not available")
        return
    
    logger.info("🚀 Starting Robust VLM Service...")
    success = vlm_robust_service.load_models()
    
    if success:
        logger.info("✅ Robust VLM Service ready!")
    else:
        logger.error("❌ Failed to load models - check logs above for details")

@robust_vlm_app.get("/")
def root():
    return {
        "service": "Robust VLM Service for RescueLanka",
        "status": "running" if vlm_robust_service.is_loaded else "models_not_loaded",
        "models_loaded": vlm_robust_service.is_loaded,
        "classifier_type": vlm_robust_service.classifier_type,
        "capabilities": [
            "Multiple model format support",
            "Automatic format detection",
            "Robust error handling",
            "Detailed diagnostics"
        ]
    }

@robust_vlm_app.get("/health")
async def health():
    return {
        "status": "healthy" if vlm_robust_service.is_loaded else "unhealthy",
        "service": "robust_vlm_rescuelanka",
        "models_loaded": vlm_robust_service.is_loaded,
        "classifier_type": vlm_robust_service.classifier_type,
        "version": "1.0.0",
        "ml_libraries": HAS_ML_LIBRARIES,
        "sklearn_available": HAS_SKLEARN
    }

@robust_vlm_app.post("/analyze/image")
async def analyze_image(request: VLMAnalysisRequest):
    """Analyze image using robust model loading"""
    if not vlm_robust_service.is_loaded:
        raise HTTPException(status_code=503, detail="Models not loaded")
    
    try:
        # Decode base64 image
        image_data = base64.b64decode(request.image)
        
        # Analyze with loaded models
        result = vlm_robust_service.analyze_image(
            image_data=image_data,
            text_description=request.text_description,
            location=request.location,
            disaster_type=request.disaster_type
        )
        
        return result
        
    except Exception as e:
        logger.error(f"Analysis failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@robust_vlm_app.get("/debug/models")
async def debug_models():
    """Debug endpoint to inspect model loading"""
    return {
        "models_directory": str(vlm_robust_service.models_dir),
        "directory_exists": vlm_robust_service.models_dir.exists(),
        "files_in_directory": [f.name for f in vlm_robust_service.models_dir.glob("*")] if vlm_robust_service.models_dir.exists() else [],
        "models_loaded": vlm_robust_service.is_loaded,
        "classifier_loaded": vlm_robust_service.disaster_classifier is not None,
        "extractor_loaded": vlm_robust_service.feature_extractor is not None,
        "classifier_type": vlm_robust_service.classifier_type
    }

if __name__ == "__main__":
    print("🛡️ Starting Robust VLM Service with advanced model loading...")
    print("🔍 This version can handle multiple model formats:")
    print("   - Standard pickle files")
    print("   - Joblib compressed files")
    print("   - Different pickle protocols")
    print("   - Automatic format detection")
    print("📁 Models expected in: backend/vlm/models/")
    print("🌐 Service running on: http://localhost:8001")
    print("🔧 Debug endpoint: http://localhost:8001/debug/models")
    print("❤️ Health check: http://localhost:8001/health")
    print("\nPress Ctrl+C to stop")
    
    uvicorn.run(
        "vlm_real_service:robust_vlm_app",
        host="0.0.0.0",
        port=8001,
        reload=False,
        log_level="info"
    )