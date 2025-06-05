"""
Complete Model Integration Service for RescueLanka with Enhanced VLM Analysis
Uses ALL your trained models:
- emergency_classifier/ (Hugging Face transformer)
- urgency_classifier/ (Hugging Face transformer) 
- vlm/models/disaster_classifier.pkl (or dissater_classifier.pkl)
- vlm/models/feature_extractor.h5

FINAL CORRECTED VERSION - Fixes JSON serialization issues

backend/complete_model_service.py
"""

import os
import sys
import pickle
import joblib
import numpy as np
import cv2
from pathlib import Path
from typing import Dict, Any, List, Optional
import logging
import base64
import io
import time
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
    from PIL import Image, ImageStat
    HAS_TF = True
except ImportError as e:
    print(f"⚠️ Missing TensorFlow: {e}")
    HAS_TF = False

# Hugging Face imports
try:
    from transformers import (
        AutoTokenizer, 
        AutoModelForSequenceClassification,
        pipeline
    )
    import torch
    HAS_TRANSFORMERS = True
except ImportError as e:
    print(f"⚠️ Missing Transformers: {e}")
    HAS_TRANSFORMERS = False

try:
    import joblib
    HAS_SKLEARN = True
except ImportError:
    HAS_SKLEARN = False

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def convert_numpy_types(obj: Any) -> Any:
    """
    Convert numpy types to native Python types for JSON serialization
    """
    if isinstance(obj, np.integer):
        return int(obj)
    elif isinstance(obj, np.floating):
        return float(obj)
    elif isinstance(obj, np.bool_):
        return bool(obj)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    elif isinstance(obj, dict):
        return {key: convert_numpy_types(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [convert_numpy_types(item) for item in obj]
    elif isinstance(obj, tuple):
        return tuple(convert_numpy_types(item) for item in obj)
    else:
        return obj

class EnhancedVLMAnalyzer:
    """Enhanced VLM Analyzer with better damage detection capabilities"""
    
    def __init__(self):
        self.disaster_types = [
            'earthquake', 'flood', 'fire', 'landslide', 'cyclone', 
            'tsunami', 'building_collapse', 'explosion', 'tornado', 'other'
        ]
        self.disaster_classifier = None
        self.feature_extractor = None
        self.is_loaded = False
    
    def analyze_visual_damage_indicators(self, image_data: bytes) -> Dict[str, Any]:
        """Analyze visual indicators of damage from the image"""
        try:
            # Convert to PIL and OpenCV formats
            image_pil = Image.open(io.BytesIO(image_data))
            if image_pil.mode != 'RGB':
                image_pil = image_pil.convert('RGB')
            
            # Convert to OpenCV format for analysis
            image_cv = cv2.cvtColor(np.array(image_pil), cv2.COLOR_RGB2BGR)
            gray = cv2.cvtColor(image_cv, cv2.COLOR_BGR2GRAY)
            
            # Initialize damage indicators
            damage_indicators = {
                "structural_damage_score": 0.0,
                "debris_presence": 0.0,
                "smoke_fire_indicators": 0.0,
                "water_damage_indicators": 0.0,
                "overall_damage_score": 0.0
            }
            
            # 1. Analyze edges for structural damage (broken lines, irregular patterns)
            edges = cv2.Canny(gray, 50, 150)
            edge_density = np.sum(edges > 0) / (edges.shape[0] * edges.shape[1])
            
            # High edge density often indicates debris, broken structures
            if edge_density > 0.15:  # Threshold for high damage
                damage_indicators["structural_damage_score"] = min(1.0, float(edge_density * 3))
            
            # 2. Analyze color distribution for fire/smoke (orange, red, black areas)
            hsv = cv2.cvtColor(image_cv, cv2.COLOR_BGR2HSV)
            
            # Fire colors (orange/red)
            fire_lower = np.array([0, 50, 50])
            fire_upper = np.array([30, 255, 255])
            fire_mask = cv2.inRange(hsv, fire_lower, fire_upper)
            fire_ratio = np.sum(fire_mask > 0) / (fire_mask.shape[0] * fire_mask.shape[1])
            
            # Smoke colors (dark gray/black)
            smoke_lower = np.array([0, 0, 0])
            smoke_upper = np.array([180, 50, 80])
            smoke_mask = cv2.inRange(hsv, smoke_lower, smoke_upper)
            smoke_ratio = np.sum(smoke_mask > 0) / (smoke_mask.shape[0] * smoke_mask.shape[1])
            
            damage_indicators["smoke_fire_indicators"] = min(1.0, float((fire_ratio + smoke_ratio) * 5))
            
            # 3. Analyze water presence (blue areas, reflections)
            water_lower = np.array([100, 50, 50])
            water_upper = np.array([130, 255, 255])
            water_mask = cv2.inRange(hsv, water_lower, water_upper)
            water_ratio = np.sum(water_mask > 0) / (water_mask.shape[0] * water_mask.shape[1])
            
            damage_indicators["water_damage_indicators"] = min(1.0, float(water_ratio * 4))
            
            # 4. Texture analysis for debris
            # Calculate local binary patterns or texture variance
            laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
            # Normalize variance (typical range 0-10000)
            texture_score = min(1.0, float(laplacian_var / 5000))
            damage_indicators["debris_presence"] = texture_score
            
            # 5. Calculate overall damage score
            weights = {
                "structural_damage_score": 0.3,
                "debris_presence": 0.3,
                "smoke_fire_indicators": 0.25,
                "water_damage_indicators": 0.15
            }
            
            overall_score = sum(
                damage_indicators[key] * weight 
                for key, weight in weights.items()
            )
            damage_indicators["overall_damage_score"] = float(overall_score)
            
            # 6. Image statistics
            stat = ImageStat.Stat(image_pil)
            damage_indicators["brightness"] = float(sum(stat.mean) / len(stat.mean) / 255.0)
            damage_indicators["contrast"] = float(sum(stat.stddev) / len(stat.stddev) / 255.0)
            
            # Convert all numpy types to Python types
            return convert_numpy_types(damage_indicators)
            
        except Exception as e:
            logger.error(f"Visual damage analysis failed: {e}")
            # Return default moderate damage indicators
            return {
                "structural_damage_score": 0.5,
                "debris_presence": 0.5,
                "smoke_fire_indicators": 0.3,
                "water_damage_indicators": 0.2,
                "overall_damage_score": 0.4,
                "brightness": 0.5,
                "contrast": 0.5,
                "error": str(e)
            }
    
    def _assess_enhanced_severity(self, disaster_type: str, model_confidence: float, 
                                 damage_analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Enhanced severity assessment combining model prediction + visual analysis"""
        
        overall_damage_score = damage_analysis["overall_damage_score"]
        
        # Base severity from disaster type
        high_severity_disasters = ['earthquake', 'tsunami', 'building_collapse', 'explosion', 'fire']
        medium_severity_disasters = ['flood', 'landslide', 'cyclone', 'tornado']
        
        if disaster_type in high_severity_disasters:
            base_severity_score = 7
        elif disaster_type in medium_severity_disasters:
            base_severity_score = 5
        else:
            base_severity_score = 3
        
        # Adjust based on visual damage indicators
        visual_damage_bonus = overall_damage_score * 4  # Scale 0-1 to 0-4
        
        # Adjust based on model confidence
        confidence_bonus = (model_confidence - 0.5) * 2 if model_confidence > 0.5 else 0
        
        # Calculate final severity score
        final_severity_score = min(10, base_severity_score + visual_damage_bonus + confidence_bonus)
        
        # Determine severity level
        if final_severity_score >= 8:
            severity_level = "CRITICAL"
        elif final_severity_score >= 6:
            severity_level = "HIGH"
        elif final_severity_score >= 4:
            severity_level = "MEDIUM"
        else:
            severity_level = "LOW"
        
        # Determine if damage is detected
        damage_detected = (
            overall_damage_score > 0.25 or 
            damage_analysis["structural_damage_score"] > 0.3 or
            damage_analysis["debris_presence"] > 0.4 or
            final_severity_score >= 5
        )
        
        result = {
            "severity_level": severity_level,
            "priority_score": int(final_severity_score),
            "damage_detected": bool(damage_detected),
            "requires_immediate_action": bool(final_severity_score >= 7),
            "casualty_risk": bool(final_severity_score >= 6 and disaster_type in high_severity_disasters),
            "structural_damage_likely": bool(damage_analysis["structural_damage_score"] > 0.4),
            "evacuation_recommended": bool(final_severity_score >= 8),
            "emergency_services_needed": bool(final_severity_score >= 7),
            "assessment_components": {
                "base_severity": float(base_severity_score),
                "visual_damage_bonus": float(visual_damage_bonus),
                "confidence_bonus": float(confidence_bonus),
                "final_score": float(final_severity_score)
            }
        }
        
        # Convert all numpy types to Python types
        return convert_numpy_types(result)
    
    def _categorize_damage_level(self, damage_score: float) -> str:
        """Categorize overall damage level"""
        if damage_score >= 0.7:
            return "severe"
        elif damage_score >= 0.5:
            return "moderate"
        elif damage_score >= 0.3:
            return "minor"
        else:
            return "minimal"
    
    def classify_disaster_from_image(self, image_data: bytes) -> Dict[str, Any]:
        """Enhanced disaster classification using trained models + visual analysis"""
        if not self.is_loaded:
            return {"error": "VLM models not loaded"}
        
        try:
            # 1. Preprocess image for feature extractor
            image_pil = Image.open(io.BytesIO(image_data))
            if image_pil.mode != 'RGB':
                image_pil = image_pil.convert('RGB')
            
            # Resize to model input size
            input_shape = self.feature_extractor.input_shape[1:3]
            image_pil = image_pil.resize(input_shape)
            
            # Convert to array and preprocess (VGG16 style)
            img_array = image.img_to_array(image_pil)
            img_array = np.expand_dims(img_array, axis=0)
            img_array = preprocess_input(img_array)
            
            # 2. Extract features using trained model
            features = self.feature_extractor.predict(img_array, verbose=0)
            features_flat = features.flatten()
            
            # 3. Classify disaster type using trained classifier
            if hasattr(self.disaster_classifier, 'predict_proba'):
                probabilities = self.disaster_classifier.predict_proba([features_flat])[0]
                predicted_class_idx = np.argmax(probabilities)
            else:
                prediction = self.disaster_classifier.predict([features_flat])[0]
                predicted_class_idx = prediction if isinstance(prediction, int) else 0
                # Create mock probabilities
                probabilities = np.zeros(len(self.disaster_types))
                probabilities[predicted_class_idx] = 0.85
                probabilities[probabilities == 0] = 0.15 / (len(probabilities) - 1)
            
            # Ensure valid index
            predicted_class_idx = min(predicted_class_idx, len(self.disaster_types) - 1)
            predicted_disaster = self.disaster_types[predicted_class_idx]
            base_confidence = float(probabilities[predicted_class_idx])
            
            # 4. Analyze visual damage indicators
            damage_analysis = self.analyze_visual_damage_indicators(image_data)
            overall_damage_score = damage_analysis["overall_damage_score"]
            
            # 5. Enhanced damage assessment
            severity_assessment = self._assess_enhanced_severity(
                predicted_disaster, base_confidence, damage_analysis
            )
            
            # 6. Create comprehensive disaster probabilities
            disaster_probabilities = {
                disaster_type: float(prob) 
                for disaster_type, prob in zip(self.disaster_types, probabilities)
            }
            
            result = {
                "predicted_type": predicted_disaster,
                "confidence": base_confidence,
                "all_probabilities": disaster_probabilities,
                "damage_analysis": damage_analysis,
                "severity_assessment": severity_assessment,
                "enhanced_confidence": min(1.0, base_confidence + (overall_damage_score * 0.2)),
                "visual_indicators": {
                    "structural_damage": bool(damage_analysis["structural_damage_score"] > 0.4),
                    "debris_detected": bool(damage_analysis["debris_presence"] > 0.5),
                    "fire_smoke_detected": bool(damage_analysis["smoke_fire_indicators"] > 0.3),
                    "water_damage": bool(damage_analysis["water_damage_indicators"] > 0.3),
                    "overall_damage_level": self._categorize_damage_level(overall_damage_score)
                },
                "prediction_method": "enhanced_trained_model"
            }
            
            # Convert all numpy types to Python types
            return convert_numpy_types(result)
            
        except Exception as e:
            logger.error(f"Enhanced disaster classification failed: {e}")
            return {"error": str(e)}
    
    def generate_enhanced_recommendations(self, disaster_type: str, severity_assessment: Dict[str, Any], 
                                        damage_analysis: Dict[str, Any]) -> List[str]:
        """Generate enhanced recommendations based on visual analysis"""
        recommendations = []
        severity = severity_assessment["severity_level"]
        priority_score = severity_assessment["priority_score"]
        
        # Immediate action recommendations
        if priority_score >= 8:
            recommendations.extend([
                "🚨 CRITICAL SITUATION - IMMEDIATE ACTION REQUIRED",
                "📞 Call emergency services: 119 (Police), 110 (Fire), 1990 (Ambulance)"
            ])
        elif priority_score >= 6:
            recommendations.extend([
                "⚡ HIGH PRIORITY - Deploy emergency response teams",
                "📞 Contact local disaster management authorities"
            ])
        
        # Structural damage recommendations
        if damage_analysis["structural_damage_score"] > 0.4:
            recommendations.extend([
                "🏗️ STRUCTURAL DAMAGE DETECTED - Do not enter buildings",
                "👷 Deploy structural engineers for safety assessment"
            ])
        
        # Fire/smoke recommendations
        if damage_analysis["smoke_fire_indicators"] > 0.3:
            recommendations.extend([
                "🔥 FIRE/SMOKE DETECTED - Deploy fire suppression teams",
                "💨 Evacuate downwind areas immediately"
            ])
        
        # Water damage recommendations
        if damage_analysis["water_damage_indicators"] > 0.3:
            recommendations.extend([
                "💧 WATER DAMAGE DETECTED - Monitor water levels",
                "⬆️ Move to higher ground if water rising"
            ])
        
        # Debris/rescue recommendations
        if damage_analysis["debris_presence"] > 0.5:
            recommendations.extend([
                "🪨 DEBRIS DETECTED - Deploy search and rescue teams",
                "🚧 Clear access routes for emergency vehicles"
            ])
        
        # Disaster-specific recommendations
        disaster_specific = {
            'earthquake': ["⚠️ Monitor for aftershocks", "🏥 Establish medical triage area"],
            'flood': ["📊 Monitor water levels continuously", "🚤 Prepare water rescue equipment"],
            'fire': ["💧 Secure water supply for firefighting", "🌪️ Monitor wind direction"],
            'landslide': ["⛰️ Monitor slope stability", "🚧 Block access to unstable areas"],
            'tsunami': ["🌊 Monitor wave warnings", "⬆️ Ensure evacuation to higher ground"]
        }
        
        if disaster_type in disaster_specific:
            recommendations.extend(disaster_specific[disaster_type])
        
        return recommendations[:8]  # Limit to 8 most important recommendations


class CompleteModelService:
    """Complete service using all your trained models with enhanced VLM"""
    
    def __init__(self, models_base_dir="models"):
        self.models_base_dir = Path(models_base_dir)
        
        # Model instances
        self.emergency_classifier = None
        self.emergency_tokenizer = None
        self.emergency_pipeline = None
        
        self.urgency_classifier = None  
        self.urgency_tokenizer = None
        self.urgency_pipeline = None
        
        self.disaster_classifier = None
        self.feature_extractor = None
        
        # Enhanced VLM analyzer
        self.enhanced_vlm = EnhancedVLMAnalyzer()
        
        # Model paths
        self.emergency_path = self.models_base_dir / "emergency_classifier"
        self.urgency_path = self.models_base_dir / "urgency_classifier"
        self.vlm_path = self.models_base_dir / "vlm" / "models"
        
        # Status tracking
        self.models_loaded = {
            "emergency_classifier": False,
            "urgency_classifier": False,
            "disaster_classifier": False,
            "feature_extractor": False
        }
        
        # Disaster types and urgency levels
        self.disaster_types = [
            'earthquake', 'flood', 'fire', 'landslide', 'cyclone', 
            'tsunami', 'building_collapse', 'explosion', 'tornado', 'other'
        ]
        
        self.urgency_levels = ["LOW", "MEDIUM", "HIGH", "CRITICAL"]
        
        # Device selection
        self.device = "cuda" if torch.cuda.is_available() and HAS_TRANSFORMERS else "cpu"
        logger.info(f"🖥️ Using device: {self.device}")
    
    def check_model_files(self):
        """Check which model files are available"""
        logger.info("🔍 Checking available model files...")
        
        # Check emergency classifier
        emergency_files = {
            "model.safetensors": self.emergency_path / "model.safetensors",
            "tokenizer.json": self.emergency_path / "tokenizer.json", 
            "tokenizer_config.json": self.emergency_path / "tokenizer_config.json",
            "config.json": self.emergency_path / "config.json"
        }
        
        logger.info(f"📁 Emergency classifier ({self.emergency_path}):")
        for file_name, file_path in emergency_files.items():
            exists = file_path.exists()
            size = file_path.stat().st_size if exists else 0
            logger.info(f"   {'✅' if exists else '❌'} {file_name} ({size} bytes)")
        
        # Check urgency classifier  
        urgency_files = {
            "model.safetensors": self.urgency_path / "model.safetensors",
            "tokenizer.json": self.urgency_path / "tokenizer.json",
            "tokenizer_config.json": self.urgency_path / "tokenizer_config.json", 
            "config.json": self.urgency_path / "config.json"
        }
        
        logger.info(f"📁 Urgency classifier ({self.urgency_path}):")
        for file_name, file_path in urgency_files.items():
            exists = file_path.exists()
            size = file_path.stat().st_size if exists else 0
            logger.info(f"   {'✅' if exists else '❌'} {file_name} ({size} bytes)")
        
        # Check VLM models
        vlm_files = {
            "disaster_classifier.pkl": self.vlm_path / "disaster_classifier.pkl",
            "dissater_classifier.pkl": self.vlm_path / "dissater_classifier.pkl",  # Check typo version
            "feature_extractor.h5": self.vlm_path / "feature_extractor.h5"
        }
        
        logger.info(f"📁 VLM models ({self.vlm_path}):")
        for file_name, file_path in vlm_files.items():
            exists = file_path.exists()
            size = file_path.stat().st_size if exists else 0
            logger.info(f"   {'✅' if exists else '❌'} {file_name} ({size} bytes)")
    
    def load_emergency_classifier(self):
        """Load emergency classification model (Hugging Face)"""
        try:
            logger.info("🚨 Loading emergency classifier...")
            
            if not self.emergency_path.exists():
                logger.error(f"❌ Emergency classifier path not found: {self.emergency_path}")
                return False
            
            # Load tokenizer
            self.emergency_tokenizer = AutoTokenizer.from_pretrained(
                str(self.emergency_path), 
                local_files_only=True
            )
            logger.info("✅ Emergency tokenizer loaded")
            
            # Load model
            self.emergency_classifier = AutoModelForSequenceClassification.from_pretrained(
                str(self.emergency_path),
                local_files_only=True,
                torch_dtype=torch.float32
            )
            self.emergency_classifier.to(self.device)
            self.emergency_classifier.eval()
            logger.info("✅ Emergency model loaded")
            
            # Create pipeline
            self.emergency_pipeline = pipeline(
                "text-classification",
                model=self.emergency_classifier,
                tokenizer=self.emergency_tokenizer,
                device=0 if self.device == "cuda" else -1,
                top_k=None
            )
            logger.info("✅ Emergency pipeline created")
            
            self.models_loaded["emergency_classifier"] = True
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to load emergency classifier: {e}")
            return False
    
    def load_urgency_classifier(self):
        """Load urgency classification model (Hugging Face)"""
        try:
            logger.info("⚡ Loading urgency classifier...")
            
            if not self.urgency_path.exists():
                logger.error(f"❌ Urgency classifier path not found: {self.urgency_path}")
                return False
            
            # Load tokenizer
            self.urgency_tokenizer = AutoTokenizer.from_pretrained(
                str(self.urgency_path),
                local_files_only=True
            )
            logger.info("✅ Urgency tokenizer loaded")
            
            # Load model
            self.urgency_classifier = AutoModelForSequenceClassification.from_pretrained(
                str(self.urgency_path),
                local_files_only=True, 
                torch_dtype=torch.float32
            )
            self.urgency_classifier.to(self.device)
            self.urgency_classifier.eval()
            logger.info("✅ Urgency model loaded")
            
            # Create pipeline
            self.urgency_pipeline = pipeline(
                "text-classification",
                model=self.urgency_classifier,
                tokenizer=self.urgency_tokenizer,
                device=0 if self.device == "cuda" else -1,
                top_k=None
            )
            logger.info("✅ Urgency pipeline created")
            
            self.models_loaded["urgency_classifier"] = True
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to load urgency classifier: {e}")
            return False
    
    def load_disaster_classifier(self):
        """Load disaster classification model (pickle/joblib)"""
        try:
            logger.info("🌪️ Loading disaster classifier...")
            
            # Try both possible filenames
            classifier_files = ["disaster_classifier.pkl", "dissater_classifier.pkl"]
            classifier_loaded = False
            
            for filename in classifier_files:
                classifier_path = self.vlm_path / filename
                if classifier_path.exists():
                    try:
                        logger.info(f"📦 Found classifier: {filename}")
                        # Try multiple loading methods
                        try:
                            with open(classifier_path, 'rb') as f:
                                self.disaster_classifier = pickle.load(f)
                            logger.info("✅ Disaster classifier loaded with pickle")
                        except:
                            self.disaster_classifier = joblib.load(classifier_path)
                            logger.info("✅ Disaster classifier loaded with joblib")
                        
                        classifier_loaded = True
                        break
                    except Exception as e:
                        logger.warning(f"❌ Failed to load {filename}: {e}")
                        continue
            
            if not classifier_loaded:
                logger.error("❌ Could not load any disaster classifier file")
                return False
            
            self.models_loaded["disaster_classifier"] = True
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to load disaster classifier: {e}")
            return False
    
    def load_feature_extractor(self):
        """Load feature extractor model (TensorFlow)"""
        try:
            logger.info("🖼️ Loading feature extractor...")
            
            extractor_path = self.vlm_path / "feature_extractor.h5"
            if not extractor_path.exists():
                logger.error(f"❌ Feature extractor not found: {extractor_path}")
                return False
            
            self.feature_extractor = load_model(str(extractor_path))
            logger.info("✅ Feature extractor loaded")
            logger.info(f"   Input shape: {self.feature_extractor.input_shape}")
            logger.info(f"   Output shape: {self.feature_extractor.output_shape}")
            
            self.models_loaded["feature_extractor"] = True
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to load feature extractor: {e}")
            return False
    
    def load_all_models(self):
        """Load all available models"""
        logger.info("🚀 Loading all models...")
        self.check_model_files()
        
        success_count = 0
        total_models = 4
        
        # Load each model
        if HAS_TRANSFORMERS:
            if self.load_emergency_classifier():
                success_count += 1
            if self.load_urgency_classifier():
                success_count += 1
        else:
            logger.warning("⚠️ Transformers not available - skipping text classifiers")
        
        if HAS_TF:
            if self.load_feature_extractor():
                success_count += 1
        else:
            logger.warning("⚠️ TensorFlow not available - skipping feature extractor")
        
        if HAS_SKLEARN:
            if self.load_disaster_classifier():
                success_count += 1
        else:
            logger.warning("⚠️ Scikit-learn not available - skipping disaster classifier")
        
        # Setup enhanced VLM if VLM models loaded
        if self.models_loaded["disaster_classifier"] and self.models_loaded["feature_extractor"]:
            self.enhanced_vlm.disaster_classifier = self.disaster_classifier
            self.enhanced_vlm.feature_extractor = self.feature_extractor
            self.enhanced_vlm.disaster_types = self.disaster_types
            self.enhanced_vlm.is_loaded = True
            logger.info("✅ Enhanced VLM analyzer configured")
        
        logger.info(f"📊 Loaded {success_count}/{total_models} models successfully")
        
        # Test models if loaded
        if success_count > 0:
            self.test_models()
        
        return success_count > 0
    
    def test_models(self):
        """Test all loaded models with sample data"""
        logger.info("🧪 Testing loaded models...")
        
        # Test emergency classifier
        if self.models_loaded["emergency_classifier"]:
            try:
                test_text = "Building collapsed, people trapped inside, need immediate rescue"
                result = self.classify_emergency(test_text)
                if "error" not in result:
                    logger.info(f"✅ Emergency classifier test: {result['is_emergency']} (confidence: {result['confidence']:.3f})")
                else:
                    logger.warning(f"⚠️ Emergency classifier test had issues: {result.get('error', 'unknown')}")
            except Exception as e:
                logger.error(f"❌ Emergency classifier test failed: {e}")
        
        # Test urgency classifier
        if self.models_loaded["urgency_classifier"]:
            try:
                test_text = "Critical situation with casualties"
                result = self.classify_urgency(test_text)
                if "error" not in result:
                    logger.info(f"✅ Urgency classifier test: {result['urgency_level']} (confidence: {result['confidence']:.3f})")
                else:
                    logger.warning(f"⚠️ Urgency classifier test had issues: {result.get('error', 'unknown')}")
            except Exception as e:
                logger.error(f"❌ Urgency classifier test failed: {e}")
        
        # Test VLM pipeline
        if self.enhanced_vlm.is_loaded:
            try:
                input_shape = self.feature_extractor.input_shape[1:]
                dummy_image = np.random.random((1,) + input_shape).astype(np.float32)
                features = self.feature_extractor.predict(dummy_image, verbose=0)
                features_flat = features.flatten()
                prediction = self.disaster_classifier.predict([features_flat])
                logger.info(f"✅ Enhanced VLM pipeline test: prediction successful")
            except Exception as e:
                logger.error(f"❌ VLM pipeline test failed: {e}")
    
    def classify_emergency(self, text: str) -> Dict[str, Any]:
        """Classify if text describes an emergency"""
        if not self.models_loaded["emergency_classifier"]:
            return {"error": "Emergency classifier not loaded"}
        
        try:
            results = self.emergency_pipeline(text, top_k=None)
            
            # Initialize scores
            emergency_score = 0.0
            non_emergency_score = 0.0
            
            # Process results
            for result in results:
                label = str(result['label']).upper()
                score = float(result['score'])
                
                if 'LABEL_1' in label or '1' in label or 'EMERGENCY' in label:
                    emergency_score = score
                elif 'LABEL_0' in label or '0' in label or 'NON_EMERGENCY' in label:
                    non_emergency_score = score
                else:
                    if emergency_score == 0.0:
                        emergency_score = score
                    else:
                        non_emergency_score = score
            
            # Ensure we have both scores
            if emergency_score == 0.0 and non_emergency_score == 0.0:
                if results:
                    emergency_score = results[0]['score']
                    non_emergency_score = 1.0 - emergency_score
            
            # Normalize scores
            total_score = emergency_score + non_emergency_score
            if total_score > 0:
                emergency_score = emergency_score / total_score
                non_emergency_score = non_emergency_score / total_score
            
            is_emergency = emergency_score > 0.5
            confidence = max(emergency_score, non_emergency_score)
            
            result = {
                "is_emergency": bool(is_emergency),
                "confidence": float(confidence),
                "probabilities": {
                    "emergency": float(emergency_score),
                    "non_emergency": float(non_emergency_score)
                },
                "raw_results": results,
                "model_labels": [r['label'] for r in results]
            }
            
            # Convert numpy types to Python types
            return convert_numpy_types(result)
            
        except Exception as e:
            logger.error(f"Emergency classification failed: {e}")
            # Keyword fallback
            text_lower = text.lower()
            is_emergency = any(word in text_lower for word in ['emergency', 'urgent', 'help', 'rescue', 'trapped', 'fire', 'collapsed'])
            return {
                "is_emergency": bool(is_emergency),
                "confidence": 0.6,
                "probabilities": {
                    "emergency": 0.7 if is_emergency else 0.3,
                    "non_emergency": 0.3 if is_emergency else 0.7
                },
                "fallback": "keyword_based",
                "error": str(e)
            }
    
    def classify_urgency(self, text: str) -> Dict[str, Any]:
        """Classify urgency level of text"""
        if not self.models_loaded["urgency_classifier"]:
            return {"error": "Urgency classifier not loaded"}
        
        try:
            results = self.urgency_pipeline(text, top_k=None)
            
            # Initialize urgency scores
            urgency_scores = {level: 0.0 for level in self.urgency_levels}
            
            # Process results
            for i, result in enumerate(results):
                label = str(result['label']).upper()
                score = float(result['score'])
                
                # Map labels to urgency levels
                mapped = False
                
                # Strategy 1: Direct text matching
                for level in self.urgency_levels:
                    if level in label:
                        urgency_scores[level] = score
                        mapped = True
                        break
                
                # Strategy 2: LABEL_N format mapping
                if not mapped:
                    if 'LABEL_0' in label or label == '0':
                        urgency_scores["LOW"] = score
                        mapped = True
                    elif 'LABEL_1' in label or label == '1':
                        urgency_scores["MEDIUM"] = score
                        mapped = True
                    elif 'LABEL_2' in label or label == '2':
                        urgency_scores["HIGH"] = score
                        mapped = True
                    elif 'LABEL_3' in label or label == '3':
                        urgency_scores["CRITICAL"] = score
                        mapped = True
                
                # Strategy 3: Position-based mapping
                if not mapped and i < len(self.urgency_levels):
                    urgency_scores[self.urgency_levels[i]] = score
            
            # Ensure we have scores
            total_score = sum(urgency_scores.values())
            if total_score == 0.0 and results:
                for i, result in enumerate(results[:len(self.urgency_levels)]):
                    urgency_scores[self.urgency_levels[i]] = result['score']
            
            # Normalize scores
            total_score = sum(urgency_scores.values())
            if total_score > 0:
                urgency_scores = {level: float(score/total_score) for level, score in urgency_scores.items()}
            
            # Find highest scoring urgency level
            predicted_urgency = max(urgency_scores, key=urgency_scores.get)
            confidence = urgency_scores[predicted_urgency]
            
            result = {
                "urgency_level": predicted_urgency,
                "confidence": float(confidence),
                "probabilities": {level: float(score) for level, score in urgency_scores.items()},
                "raw_results": results,
                "model_labels": [r['label'] for r in results]
            }
            
            # Convert numpy types to Python types
            return convert_numpy_types(result)
            
        except Exception as e:
            logger.error(f"Urgency classification failed: {e}")
            # Keyword fallback
            text_lower = text.lower()
            if any(word in text_lower for word in ['critical', 'immediate', 'life threatening']):
                urgency_level = "CRITICAL"
                probabilities = {"LOW": 0.1, "MEDIUM": 0.1, "HIGH": 0.2, "CRITICAL": 0.6}
            elif any(word in text_lower for word in ['urgent', 'emergency', 'help', 'rescue']):
                urgency_level = "HIGH"
                probabilities = {"LOW": 0.1, "MEDIUM": 0.2, "HIGH": 0.6, "CRITICAL": 0.1}
            elif any(word in text_lower for word in ['need', 'assistance', 'damaged']):
                urgency_level = "MEDIUM"
                probabilities = {"LOW": 0.2, "MEDIUM": 0.6, "HIGH": 0.2, "CRITICAL": 0.0}
            else:
                urgency_level = "LOW"
                probabilities = {"LOW": 0.6, "MEDIUM": 0.3, "HIGH": 0.1, "CRITICAL": 0.0}
            
            return {
                "urgency_level": urgency_level,
                "confidence": float(probabilities[urgency_level]),
                "probabilities": {level: float(score) for level, score in probabilities.items()},
                "fallback": "keyword_based",
                "error": str(e)
            }
    
    def classify_disaster_from_image(self, image_data: bytes) -> Dict[str, Any]:
        """Enhanced disaster classification using trained models + visual analysis"""
        if not self.enhanced_vlm.is_loaded:
            return {"error": "VLM models not loaded"}
        
        try:
            # Use enhanced VLM analyzer
            result = self.enhanced_vlm.classify_disaster_from_image(image_data)
            return result
            
        except Exception as e:
            logger.error(f"Enhanced disaster classification failed: {e}")
            return {"error": str(e)}
    
    def complete_analysis(self, text: str, image_data: bytes = None, 
                         location: str = "", disaster_type: str = "") -> Dict[str, Any]:
        """Complete analysis using all models with enhanced VLM"""
        start_time = time.time()
        
        try:
            results = {
                "text": text,
                "location": location,
                "timestamp": datetime.utcnow().isoformat()
            }
            
            # Text-based emergency and urgency classification
            if text:
                emergency_result = self.classify_emergency(text)
                urgency_result = self.classify_urgency(text)
                
                results["emergency_analysis"] = emergency_result
                results["urgency_analysis"] = urgency_result
            
            # Enhanced image-based disaster classification
            if image_data:
                if not disaster_type:
                    # Use enhanced VLM analysis
                    disaster_result = self.classify_disaster_from_image(image_data)
                    results["disaster_type_prediction"] = disaster_result
                    
                    if "error" not in disaster_result:
                        predicted_disaster_type = disaster_result.get("predicted_type", "unknown")
                        # Use enhanced severity assessment from VLM
                        vlm_severity = disaster_result.get("severity_assessment", {})
                    else:
                        predicted_disaster_type = "unknown"
                        vlm_severity = {}
                else:
                    # Use provided disaster type
                    predicted_disaster_type = disaster_type
                    results["disaster_type_prediction"] = {
                        "predicted_type": disaster_type,
                        "confidence": 0.9,
                        "prediction_method": "user_provided"
                    }
                    vlm_severity = {}
            else:
                predicted_disaster_type = disaster_type or "unknown"
                vlm_severity = {}
            
            # Combined assessment
            emergency_analysis = results.get("emergency_analysis", {})
            urgency_analysis = results.get("urgency_analysis", {})
            
            is_emergency = emergency_analysis.get("is_emergency", False)
            urgency_level = urgency_analysis.get("urgency_level", "LOW")
            
            # Use VLM severity if available, otherwise calculate basic severity
            if vlm_severity:
                priority_score = vlm_severity.get("priority_score", 5)
                damage_detected = vlm_severity.get("damage_detected", False)
                requires_immediate_action = vlm_severity.get("requires_immediate_action", False)
                severity_level = vlm_severity.get("severity_level", urgency_level)
            else:
                # Basic severity calculation
                priority_mapping = {"LOW": 2, "MEDIUM": 5, "HIGH": 8, "CRITICAL": 10}
                priority_score = priority_mapping.get(urgency_level, 5)
                
                if is_emergency:
                    priority_score = min(10, priority_score + 2)
                
                damage_detected = is_emergency and priority_score >= 5
                requires_immediate_action = priority_score >= 8
                severity_level = urgency_level
            
            # Enhanced assessment
            results["combined_assessment"] = {
                "is_emergency": bool(is_emergency),
                "urgency_level": urgency_level,
                "disaster_type": predicted_disaster_type,
                "priority_score": int(priority_score),
                "damage_detected": bool(damage_detected),
                "requires_immediate_action": bool(requires_immediate_action),
                "severity_level": severity_level,
                "confidence": {
                    "emergency": emergency_analysis.get("confidence", 0.5),
                    "urgency": urgency_analysis.get("confidence", 0.5)
                }
            }
            
            # Generate enhanced recommendations
            if image_data and self.enhanced_vlm.is_loaded and vlm_severity:
                # Use VLM-based recommendations
                vlm_result = results.get("disaster_type_prediction", {})
                damage_analysis = vlm_result.get("damage_analysis", {})
                
                results["recommendations"] = self.enhanced_vlm.generate_enhanced_recommendations(
                    predicted_disaster_type, vlm_severity, damage_analysis
                )
            else:
                # Use basic recommendations
                results["recommendations"] = self.generate_recommendations(
                    is_emergency, urgency_level, predicted_disaster_type
                )
            
            # Processing info
            processing_time = (time.time() - start_time) * 1000
            results["processing_info"] = {
                "processing_time_ms": float(processing_time),
                "models_used": [k for k, v in self.models_loaded.items() if v],
                "device": self.device,
                "model_version": "enhanced_complete_v1.0",
                "enhanced_vlm_used": bool(self.enhanced_vlm.is_loaded)
            }
            
            # Convert all numpy types to Python types
            return convert_numpy_types(results)
            
        except Exception as e:
            logger.error(f"Complete analysis failed: {e}")
            return {"error": str(e)}
    
    def generate_recommendations(self, is_emergency: bool, urgency_level: str, 
                               disaster_type: str) -> List[str]:
        """Generate basic recommendations"""
        recommendations = []
        
        if is_emergency and urgency_level == "CRITICAL":
            recommendations.extend([
                "🚨 IMMEDIATE ACTION REQUIRED",
                "📞 Contact emergency services: 119 (Police), 110 (Fire), 1990 (Ambulance)",
                "🛡️ Ensure personal safety first",
                "📍 Share exact location with emergency responders"
            ])
        elif is_emergency and urgency_level == "HIGH":
            recommendations.extend([
                "⚡ URGENT response needed",
                "📞 Contact local authorities",
                "🚪 Prepare for possible evacuation"
            ])
        elif is_emergency:
            recommendations.extend([
                "📞 Report to relevant authorities",
                "👀 Monitor situation closely",
                "📋 Document damage and needs"
            ])
        
        # Disaster-specific recommendations
        disaster_recommendations = {
            'flood': ["💧 Move to higher ground", "⚠️ Avoid flood waters", "📻 Monitor weather updates"],
            'fire': ["🔥 Evacuate immediately if threatened", "💨 Stay low to avoid smoke", "🚪 Don't use elevators"],
            'earthquake': ["🏠 Take cover under sturdy furniture", "🚪 Stay away from windows", "⚠️ Expect aftershocks"],
            'landslide': ["⛰️ Move away from slide area", "🚧 Avoid unstable slopes", "👂 Listen for unusual sounds"],
            'tsunami': ["⬆️ Move to higher ground immediately", "🌊 Stay away from coast", "📻 Monitor emergency broadcasts"]
        }
        
        if disaster_type in disaster_recommendations:
            recommendations.extend(disaster_recommendations[disaster_type])
        
        return recommendations[:8]
    
    def get_model_info(self) -> Dict[str, Any]:
        """Get information about loaded models"""
        info = {
            "device": self.device,
            "models_loaded": self.models_loaded,
            "enhanced_vlm_active": bool(self.enhanced_vlm.is_loaded),
            "model_details": {}
        }
        
        # Get emergency model details
        if self.emergency_classifier is not None:
            info["model_details"]["emergency"] = {
                "model_type": str(type(self.emergency_classifier)),
                "num_parameters": int(sum(p.numel() for p in self.emergency_classifier.parameters())),
                "num_labels": int(self.emergency_classifier.config.num_labels) if hasattr(self.emergency_classifier, 'config') else "unknown"
            }
        
        # Get urgency model details
        if self.urgency_classifier is not None:
            info["model_details"]["urgency"] = {
                "model_type": str(type(self.urgency_classifier)),
                "num_parameters": int(sum(p.numel() for p in self.urgency_classifier.parameters())),
                "num_labels": int(self.urgency_classifier.config.num_labels) if hasattr(self.urgency_classifier, 'config') else "unknown"
            }
        
        # Get VLM model details
        if self.enhanced_vlm.is_loaded:
            info["model_details"]["vlm"] = {
                "disaster_classifier_type": str(type(self.disaster_classifier)),
                "feature_extractor_input": str(self.feature_extractor.input_shape),
                "feature_extractor_output": str(self.feature_extractor.output_shape),
                "disaster_types": self.disaster_types
            }
        
        # Convert numpy types to Python types
        return convert_numpy_types(info)


# Global service instance
complete_service = CompleteModelService()

# FastAPI app
complete_app = FastAPI(
    title="Complete RescueLanka Model Service with Enhanced VLM",
    description="Complete service using all trained models: emergency, urgency, and enhanced disaster classification"
)

class CompleteAnalysisRequest(BaseModel):
    text: str
    image: Optional[str] = None  # base64 encoded
    location: str = ""
    disaster_type: str = ""

@complete_app.on_event("startup")
async def startup_event():
    """Load all models on startup"""
    logger.info("🚀 Starting Complete Model Service with Enhanced VLM...")
    
    if not (HAS_TRANSFORMERS and HAS_TF and HAS_SKLEARN):
        logger.error("❌ Missing required libraries")
        logger.info(f"Transformers: {HAS_TRANSFORMERS}, TensorFlow: {HAS_TF}, Scikit-learn: {HAS_SKLEARN}")
        return
    
    success = complete_service.load_all_models()
    
    if success:
        logger.info("✅ Complete Model Service with Enhanced VLM ready!")
    else:
        logger.error("❌ Failed to load models")

@complete_app.get("/")
def root():
    return {
        "service": "Complete RescueLanka Model Service with Enhanced VLM",
        "models_loaded": complete_service.models_loaded,
        "enhanced_vlm_active": complete_service.enhanced_vlm.is_loaded,
        "capabilities": [
            "Emergency classification (Hugging Face)",
            "Urgency classification (Hugging Face)", 
            "Enhanced disaster type prediction with visual damage analysis",
            "Combined analysis and intelligent recommendations",
            "Advanced damage detection and severity assessment"
        ],
        "device": complete_service.device
    }

@complete_app.get("/health")
async def health():
    loaded_count = sum(complete_service.models_loaded.values())
    total_count = len(complete_service.models_loaded)
    
    return {
        "status": "healthy" if loaded_count > 0 else "unhealthy",
        "models_loaded": complete_service.models_loaded,
        "enhanced_vlm_active": complete_service.enhanced_vlm.is_loaded,
        "models_status": f"{loaded_count}/{total_count} loaded",
        "device": complete_service.device,
        "libraries": {
            "transformers": HAS_TRANSFORMERS,
            "tensorflow": HAS_TF,
            "sklearn": HAS_SKLEARN
        }
    }

@complete_app.post("/analyze/text")
async def analyze_text(request: dict):
    """Analyze text for emergency and urgency classification"""
    text = request.get("text", "")
    if not text:
        raise HTTPException(status_code=400, detail="Text is required")
    
    try:
        emergency_result = complete_service.classify_emergency(text)
        urgency_result = complete_service.classify_urgency(text)
        
        result = {
            "text": text,
            "emergency_analysis": emergency_result,
            "urgency_analysis": urgency_result,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        return convert_numpy_types(result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@complete_app.post("/analyze/image")
async def analyze_image(request: dict):
    """Analyze image for enhanced disaster type classification"""
    image_b64 = request.get("image", "")
    if not image_b64:
        raise HTTPException(status_code=400, detail="Image is required")
    
    try:
        image_data = base64.b64decode(image_b64)
        result = complete_service.classify_disaster_from_image(image_data)
        
        response = {
            "disaster_type_prediction": result,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        return convert_numpy_types(response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@complete_app.post("/analyze/complete")
async def analyze_complete(request: CompleteAnalysisRequest):
    """Complete analysis using all models with enhanced VLM"""
    try:
        image_data = None
        if request.image:
            image_data = base64.b64decode(request.image)
        
        result = complete_service.complete_analysis(
            text=request.text,
            image_data=image_data,
            location=request.location,
            disaster_type=request.disaster_type
        )
        
        return convert_numpy_types(result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@complete_app.get("/models/info")
async def models_info():
    """Get detailed information about loaded models"""
    return complete_service.get_model_info()

if __name__ == "__main__":
    print("🎯 Starting Complete Model Service with Enhanced VLM Analysis...")
    print("📁 Expected model structure:")
    print("   models/emergency_classifier/ (Hugging Face)")
    print("   models/urgency_classifier/ (Hugging Face)")
    print("   models/vlm/models/disaster_classifier.pkl (or dissater_classifier.pkl)")
    print("   models/vlm/models/feature_extractor.h5")
    print("🌐 Service running on: http://localhost:8001")
    print("❤️ Health check: http://localhost:8001/health")
    print("📊 Complete analysis: http://localhost:8001/analyze/complete")
    print("🔥 Enhanced VLM with advanced damage detection!")
    print("✅ JSON serialization issues fixed!")
    
    uvicorn.run(
        "complete_model_service:complete_app",
        host="0.0.0.0",
        port=8001,
        reload=False,
        log_level="info"
    )