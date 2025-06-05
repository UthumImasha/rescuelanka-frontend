"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import {
  Camera,
  Upload,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  FileImage,
  X,
  Loader,
  ArrowLeft,
  Home,
  Zap,
  TrendingUp,
  Shield,
  Activity,
} from "lucide-react";

// Types for VLM Analysis
interface VLMAnalysisResult {
  vlm_analysis: any;
  disaster_assessment: {
    damage_detected: boolean;
    severity_level: string;
    priority_score: number;
    requires_immediate_action: boolean;
    structural_damage: boolean;
    casualties_possible: boolean;
    blocked_access: boolean;
  };
  location_info: {
    location: string;
    coordinates: number[];
    area_affected: string;
  };
  recommendations: string[];
  visual_tags: string[];
  processing_info: {
    timestamp: string;
    model_version: string;
    confidence_score: number;
  };
}

const VLMAnalysisPage = () => {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [textDescription, setTextDescription] = useState("");
  const [location, setLocation] = useState("");
  const [disasterType, setDisasterType] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] =
    useState<VLMAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<VLMAnalysisResult[]>(
    []
  );
  const [isVLMAvailable, setIsVLMAvailable] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const disasterTypes = [
    "earthquake",
    "flood",
    "fire",
    "hurricane",
    "tornado",
    "landslide",
    "building_collapse",
    "explosion",
    "cyclone",
    "tsunami",
    "other",
  ];

  // Check VLM service availability on component mount
  useEffect(() => {
    checkVLMAvailability();
  }, []);

  const checkVLMAvailability = async () => {
    try {
      const response = await fetch("http://localhost:8000/vlm/health");
      const data = await response.json();
      setIsVLMAvailable(data.status === "healthy");
    } catch (error) {
      setIsVLMAvailable(false);
    }
  };

  const handleImageUpload = useCallback((file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError("Image too large. Please select an image under 10MB");
      return;
    }

    setImage(file);
    setError(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) handleImageUpload(file);
  };

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      if (file) handleImageUpload(file);
    },
    [handleImageUpload]
  );

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const analyzeImage = async () => {
    if (!image) {
      setError("Please select an image first");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("text_description", textDescription);
      formData.append("location", location);
      formData.append("disaster_type", disasterType);

      const response = await fetch("http://localhost:8000/vlm/analyze/image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Analysis failed");
      }

      const result = await response.json();
      setAnalysisResult(result);
      setAnalysisHistory((prev) => [result, ...prev].slice(0, 10)); // Keep last 10 results
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearImage = () => {
    setImage(null);
    setImagePreview(null);
    setAnalysisResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      CRITICAL: "text-red-600 bg-red-100",
      HIGH: "text-orange-600 bg-orange-100",
      SEVERE: "text-red-600 bg-red-100",
      MEDIUM: "text-yellow-600 bg-yellow-100",
      MODERATE: "text-yellow-600 bg-yellow-100",
      LOW: "text-green-600 bg-green-100",
      MINOR: "text-green-600 bg-green-100",
    };
    return colors[severity?.toUpperCase()] || "text-gray-600 bg-gray-100";
  };

  const getSeverityBadgeColor = (severity: string) => {
    const colors: Record<string, string> = {
      CRITICAL: "bg-red-500",
      HIGH: "bg-orange-500",
      SEVERE: "bg-red-500",
      MEDIUM: "bg-yellow-500",
      MODERATE: "bg-yellow-500",
      LOW: "bg-green-500",
      MINOR: "bg-green-500",
    };
    return colors[severity?.toUpperCase()] || "bg-gray-500";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link
                href="/affected/dashboard"
                className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <ArrowLeft size={20} />
                Back to Home
              </Link>
              <div className="h-6 border-l border-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Eye className="text-blue-600" size={28} />
                Vision Analysis
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${isVLMAvailable
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
                  }`}
              >
                {isVLMAvailable ? "● Online" : "● Offline"}
              </div>
              <Link
                href="/emergency"
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Emergency AI
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isVLMAvailable && (
          <div className="mb-6 p-4 bg-orange-100 border border-orange-300 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-orange-600" size={20} />
              <p className="text-orange-800 font-medium">VLM Service Offline</p>
            </div>
            <p className="text-orange-700 text-sm mt-1">
              The Vision Analysis service is currently unavailable. Please make
              sure the backend VLM service is running on port 8001.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Analysis Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  AI-Powered Disaster Image Analysis
                </h2>
                <p className="text-gray-600">
                  Upload disaster scene images to get instant AI analysis with
                  damage assessment and response recommendations
                </p>
              </div>

              {/* Image Upload Area */}
              <div className="mb-6">
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${imagePreview
                    ? "border-green-300 bg-green-50"
                    : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                    }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-h-64 mx-auto rounded-lg shadow-md"
                      />
                      <button
                        onClick={clearImage}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <FileImage
                        className="mx-auto text-gray-400 mb-4"
                        size={48}
                      />
                      <p className="text-lg font-medium text-gray-700 mb-2">
                        Drop an image here or click to select
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        Supports JPG, PNG, GIF (max 10MB)
                      </p>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
                        disabled={!isVLMAvailable}
                      >
                        <Upload size={16} />
                        Select Image
                      </button>
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {/* Context Information */}
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Text Description (Optional)
                  </label>
                  <textarea
                    value={textDescription}
                    onChange={(e) => setTextDescription(e.target.value)}
                    placeholder="Describe what you see or the situation..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    disabled={!isVLMAvailable}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                    <MapPin size={16} />
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Street address, coordinates, or area name"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={!isVLMAvailable}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Disaster Type
                  </label>
                  <select
                    value={disasterType}
                    onChange={(e) => setDisasterType(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={!isVLMAvailable}
                  >
                    <option value="">Select type...</option>
                    {disasterTypes.map((type) => (
                      <option key={type} value={type}>
                        {type.replace("_", " ").toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Analyze Button */}
              <div className="mb-6">
                <button
                  onClick={analyzeImage}
                  disabled={!image || isAnalyzing || !isVLMAvailable}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${image && !isAnalyzing && isVLMAvailable
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader className="animate-spin" size={20} />
                      Analyzing Image...
                    </>
                  ) : (
                    <>
                      <Camera size={20} />
                      Analyze with AI Vision
                    </>
                  )}
                </button>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg">
                  <p className="text-red-700 flex items-center gap-2">
                    <AlertTriangle size={16} />
                    {error}
                  </p>
                </div>
              )}

              {/* Analysis Results */}
              {analysisResult && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <CheckCircle className="text-green-600" size={24} />
                    Analysis Results
                  </h3>

                  {/* Disaster Assessment */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold mb-4">
                      Disaster Assessment
                    </h4>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="bg-white p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Damage Detected</p>
                        <p
                          className={`text-lg font-bold ${analysisResult.disaster_assessment.damage_detected
                            ? "text-red-600"
                            : "text-green-600"
                            }`}
                        >
                          {analysisResult.disaster_assessment.damage_detected
                            ? "YES"
                            : "NO"}
                        </p>
                      </div>

                      <div className="bg-white p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Severity Level</p>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(
                            analysisResult.disaster_assessment.severity_level
                          )}`}
                        >
                          {analysisResult.disaster_assessment.severity_level}
                        </span>
                      </div>

                      <div className="bg-white p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Priority Score</p>
                        <p className="text-lg font-bold text-orange-600">
                          {analysisResult.disaster_assessment.priority_score}/10
                        </p>
                      </div>

                      <div className="bg-white p-4 rounded-lg">
                        <p className="text-sm text-gray-600">
                          Immediate Action
                        </p>
                        <p
                          className={`text-lg font-bold ${analysisResult.disaster_assessment
                            .requires_immediate_action
                            ? "text-red-600"
                            : "text-green-600"
                            }`}
                        >
                          {analysisResult.disaster_assessment
                            .requires_immediate_action
                            ? "REQUIRED"
                            : "NOT NEEDED"}
                        </p>
                      </div>
                    </div>

                    {/* Risk Indicators */}
                    <div className="grid md:grid-cols-3 gap-4">
                      <div
                        className={`p-3 rounded-lg ${analysisResult.disaster_assessment.structural_damage
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                          }`}
                      >
                        <p className="font-medium">Structural Damage</p>
                        <p className="text-sm">
                          {analysisResult.disaster_assessment.structural_damage
                            ? "Detected"
                            : "Not detected"}
                        </p>
                      </div>

                      <div
                        className={`p-3 rounded-lg ${analysisResult.disaster_assessment.casualties_possible
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                          }`}
                      >
                        <p className="font-medium">Casualties Possible</p>
                        <p className="text-sm">
                          {analysisResult.disaster_assessment
                            .casualties_possible
                            ? "People detected"
                            : "No people visible"}
                        </p>
                      </div>

                      <div
                        className={`p-3 rounded-lg ${analysisResult.disaster_assessment.blocked_access
                          ? "bg-orange-100 text-orange-800"
                          : "bg-green-100 text-green-800"
                          }`}
                      >
                        <p className="font-medium">Access Blocked</p>
                        <p className="text-sm">
                          {analysisResult.disaster_assessment.blocked_access
                            ? "Debris/blockage detected"
                            : "Access appears clear"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  {analysisResult.recommendations &&
                    analysisResult.recommendations.length > 0 && (
                      <div className="bg-blue-50 p-6 rounded-lg">
                        <h4 className="text-lg font-semibold mb-4 text-blue-800">
                          Recommended Actions
                        </h4>
                        <ul className="space-y-2">
                          {analysisResult.recommendations.map(
                            (recommendation, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-2"
                              >
                                <CheckCircle
                                  className="text-blue-600 mt-1 flex-shrink-0"
                                  size={16}
                                />
                                <span className="text-blue-800">
                                  {recommendation}
                                </span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                  {/* Visual Tags */}
                  {analysisResult.visual_tags &&
                    analysisResult.visual_tags.length > 0 && (
                      <div className="bg-yellow-50 p-6 rounded-lg">
                        <h4 className="text-lg font-semibold mb-4 text-yellow-800">
                          Visual Tags
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {analysisResult.visual_tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-sm font-medium"
                            >
                              {tag.replace("_", " ").toUpperCase()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Location Information */}
                  {analysisResult.location_info && (
                    <div className="bg-green-50 p-6 rounded-lg">
                      <h4 className="text-lg font-semibold mb-4 text-green-800 flex items-center gap-2">
                        <MapPin size={20} />
                        Location Information
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {analysisResult.location_info.location && (
                          <div>
                            <p className="text-sm text-green-600 font-medium">
                              Location
                            </p>
                            <p className="text-green-800">
                              {analysisResult.location_info.location}
                            </p>
                          </div>
                        )}
                        {analysisResult.location_info.coordinates &&
                          analysisResult.location_info.coordinates.length >
                          0 && (
                            <div>
                              <p className="text-sm text-green-600 font-medium">
                                Coordinates
                              </p>
                              <p className="text-green-800">
                                {analysisResult.location_info.coordinates.join(
                                  ", "
                                )}
                              </p>
                            </div>
                          )}
                      </div>
                    </div>
                  )}

                  {/* Technical Details */}
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="text-sm font-semibold mb-2 text-gray-700 flex items-center gap-2">
                      <Clock size={16} />
                      Processing Information
                    </h4>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Timestamp</p>
                        <p className="text-gray-800">
                          {new Date(
                            analysisResult.processing_info.timestamp
                          ).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Model Version</p>
                        <p className="text-gray-800">
                          {analysisResult.processing_info.model_version}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Confidence Score</p>
                        <p className="text-gray-800">
                          {(
                            analysisResult.processing_info.confidence_score *
                            100
                          ).toFixed(1)}
                          %
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Stats Card */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Activity className="text-blue-600" size={20} />
                Analysis Stats
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Analyses</span>
                  <span className="font-bold text-blue-600">
                    {analysisHistory.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Critical Issues</span>
                  <span className="font-bold text-red-600">
                    {
                      analysisHistory.filter(
                        (r) => r.disaster_assessment?.requires_immediate_action
                      ).length
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Damage Detected</span>
                  <span className="font-bold text-orange-600">
                    {
                      analysisHistory.filter(
                        (r) => r.disaster_assessment?.damage_detected
                      ).length
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Service Status</span>
                  <span
                    className={`font-bold ${isVLMAvailable ? "text-green-600" : "text-red-600"
                      }`}
                  >
                    {isVLMAvailable ? "Online" : "Offline"}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Zap className="text-yellow-600" size={20} />
                Quick Actions
              </h3>

              <div className="space-y-3">
                <button
                  onClick={() =>
                    setTextDescription(
                      "Building collapsed in earthquake, people trapped inside, need immediate rescue"
                    )
                  }
                  className="w-full text-left p-3 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
                  disabled={!isVLMAvailable}
                >
                  <p className="font-medium text-red-800">Critical Emergency</p>
                  <p className="text-xs text-red-600">
                    Building collapse scenario
                  </p>
                </button>

                <button
                  onClick={() =>
                    setTextDescription(
                      "Severe flooding in residential area, vehicles submerged"
                    )
                  }
                  className="w-full text-left p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
                  disabled={!isVLMAvailable}
                >
                  <p className="font-medium text-blue-800">Flood Assessment</p>
                  <p className="text-xs text-blue-600">
                    Water damage evaluation
                  </p>
                </button>

                <button
                  onClick={() =>
                    setTextDescription(
                      "Minor property damage, no immediate danger"
                    )
                  }
                  className="w-full text-left p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
                  disabled={!isVLMAvailable}
                >
                  <p className="font-medium text-green-800">Minor Incident</p>
                  <p className="text-xs text-green-600">
                    Low priority assessment
                  </p>
                </button>
              </div>
            </div>

            {/* Recent Analysis History */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <TrendingUp className="text-purple-600" size={20} />
                Recent Analyses
              </h3>

              <div className="space-y-3">
                {analysisHistory.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    <Camera size={32} className="mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No analyses yet</p>
                  </div>
                ) : (
                  analysisHistory.slice(0, 5).map((result, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div
                          className={`w-3 h-3 rounded-full ${getSeverityBadgeColor(
                            result.disaster_assessment?.severity_level
                          )}`}
                        />
                        <span className="text-xs text-gray-500">
                          {new Date(
                            result.processing_info?.timestamp
                          ).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {result.location_info?.location || "Unknown Location"}
                      </p>
                      <p className="text-xs text-gray-600">
                        {result.disaster_assessment?.severity_level} - Priority:{" "}
                        {result.disaster_assessment?.priority_score}/10
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VLMAnalysisPage;
