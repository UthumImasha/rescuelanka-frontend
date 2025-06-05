"use client";

import React, { useState } from "react";

interface AnalysisResponse {
  text: string;
  emergency_analysis: {
    is_emergency: boolean;
    confidence: number;
    probabilities: {
      emergency: number;
      non_emergency: number;
    };
  };
  urgency_analysis: {
    urgency_level: string;
    confidence: number;
    probabilities: {
      LOW: number;
      MEDIUM: number;
      HIGH: number;
      CRITICAL: number;
    };
  };
  requires_immediate_action: boolean;
  processing_time_ms: number;
  request_id?: string;
  timestamp: string;
}

interface EmergencyRequest {
  text: string;
  location?: string;
  contact_info?: string;
}

interface Props {
  onAnalysisComplete?: (analysis: AnalysisResponse) => void;
  showLocation?: boolean;
  showContact?: boolean;
}

export default function EmergencyForm({
  onAnalysisComplete,
  showLocation = true,
  showContact = true,
}: Props) {
  const [text, setText] = useState("");
  const [location, setLocation] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exampleTexts = [
    "Building collapsed on Main Street, people trapped inside, need immediate rescue",
    "Medical emergency - elderly person having chest pains, need ambulance",
    "Wildfire approaching residential area, evacuation assistance needed",
    "Gas leak reported at shopping center, area needs to be evacuated",
    "Need food supplies for emergency shelter volunteers",
    "Looking for information about shelter locations",
  ];

  const analyzeRequest = async (request: EmergencyRequest) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/emergency/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze request");
      }

      const result = await response.json();
      return result;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    const request: EmergencyRequest = {
      text: text.trim(),
      location: location.trim() || undefined,
      contact_info: contactInfo.trim() || undefined,
    };

    try {
      const result = await analyzeRequest(request);
      setAnalysis(result);
      onAnalysisComplete?.(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const getUrgencyBadgeClass = (urgency: string) => {
    switch (urgency) {
      case "CRITICAL":
        return "bg-red-100 text-red-800 border-red-200";
      case "HIGH":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "LOW":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatConfidence = (confidence: number) => {
    return `${(confidence * 100).toFixed(1)}%`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Emergency Request Analysis
        </h2>
        <p className="text-gray-600">
          AI-powered emergency classification and priority assessment
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-3">Quick Examples:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {exampleTexts.map((example, index) => (
            <button
              key={index}
              onClick={() => setText(example)}
              className="text-left text-sm text-blue-700 hover:text-blue-900 hover:bg-blue-100 p-2 rounded border border-blue-200 transition-colors"
              disabled={loading}
            >
              "{example.substring(0, 60)}..."
            </button>
          ))}
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Emergency Description *
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={4}
            placeholder="Describe the emergency situation in detail..."
            disabled={loading}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {showLocation && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📍 Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Address or landmark"
                disabled={loading}
              />
            </div>
          )}

          {showContact && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                👤 Contact Information
              </label>
              <input
                type="text"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Phone number or contact person"
                disabled={loading}
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !text.trim()}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
        >
          {loading ? "⏳ Analyzing..." : "🚨 Analyze Emergency Request"}
        </button>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          <div className="flex items-center gap-2">
            <span className="font-medium">❌ Analysis Error</span>
          </div>
          <p className="mt-1 text-sm">{error}</p>
        </div>
      )}

      {analysis && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <span>
              {analysis.emergency_analysis.is_emergency ? "🚨" : "📝"}
            </span>
            Analysis Results
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-medium text-gray-900 mb-4">
                Emergency Classification
              </h4>
              <div className="space-y-3">
                <div
                  className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${
                    analysis.emergency_analysis.is_emergency
                      ? "bg-red-100 text-red-800 border border-red-200"
                      : "bg-green-100 text-green-800 border border-green-200"
                  }`}
                >
                  {analysis.emergency_analysis.is_emergency
                    ? "EMERGENCY"
                    : "NON-EMERGENCY"}
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <strong>Confidence:</strong>{" "}
                    {formatConfidence(analysis.emergency_analysis.confidence)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-medium text-gray-900 mb-4">
                Urgency Assessment
              </h4>
              <div className="space-y-3">
                <div
                  className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium border ${getUrgencyBadgeClass(
                    analysis.urgency_analysis.urgency_level
                  )}`}
                >
                  <span className="mr-1">
                    {analysis.urgency_analysis.urgency_level === "CRITICAL"
                      ? "🔴"
                      : analysis.urgency_analysis.urgency_level === "HIGH"
                      ? "🟠"
                      : analysis.urgency_analysis.urgency_level === "MEDIUM"
                      ? "🟡"
                      : "🟢"}
                  </span>
                  {analysis.urgency_analysis.urgency_level}
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <strong>Confidence:</strong>{" "}
                    {formatConfidence(analysis.urgency_analysis.confidence)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {analysis.requires_immediate_action && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <span className="font-medium text-red-800">
                  ⚠️ Immediate Action Required
                </span>
              </div>
              <p className="text-sm text-red-700">
                This emergency requires immediate attention and should be
                prioritized for response.
              </p>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-50 p-3 rounded">
            <div className="flex items-center gap-4">
              <span>
                ⏱️ Processing: {analysis.processing_time_ms?.toFixed(0)}ms
              </span>
              {analysis.request_id && (
                <span>ID: {analysis.request_id.slice(0, 8)}...</span>
              )}
            </div>
            <div className="text-gray-400">
              {new Date(analysis.timestamp).toLocaleTimeString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

