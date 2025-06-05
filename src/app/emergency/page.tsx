"use client";

import React, { useState } from "react";
// Make sure the path is correct; adjust if your file is in a different location
import EmergencyForm from "../../../components/emergency/emergency-form";
import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

export default function EmergencyPage() {
  const [recentAnalysis, setRecentAnalysis] = useState<any>(null);

  const handleAnalysisComplete = (analysis: any) => {
    console.log("Emergency Analysis:", analysis);
    setRecentAnalysis(analysis);

    if (analysis.requires_immediate_action) {
      alert(
        "🚨 CRITICAL EMERGENCY DETECTED! Emergency services have been notified."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link
                href="/affected/dashboard"
                className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Home</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-semibold text-gray-900">
                Emergency Classifier
              </h1>
            </div>

            <Link
              href="/"
              className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🚨 AI Emergency Classification System
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
              Advanced AI-powered system to classify emergency situations and
              determine urgency levels in real-time
            </p>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">
                  🤖 AI-Powered
                </h3>
                <p className="text-sm text-blue-700">
                  Advanced machine learning models analyze text to classify
                  emergencies
                </p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-800 mb-2">
                  ⚡ Real-Time
                </h3>
                <p className="text-sm text-red-700">
                  Instant classification and urgency assessment in milliseconds
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">
                  🎯 Accurate
                </h3>
                <p className="text-sm text-green-700">
                  High-precision models trained on disaster response scenarios
                </p>
              </div>
            </div>
          </div>

          {/* How to Use Instructions */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              📋 How to Use
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-800 mb-2">
                  Step 1: Input Emergency Description
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Type or select an emergency scenario. Be as descriptive as
                  possible for accurate classification.
                </p>

                <h3 className="font-medium text-gray-800 mb-2">
                  Step 2: Add Location & Contact (Optional)
                </h3>
                <p className="text-sm text-gray-600">
                  Provide location and contact information for better response
                  coordination.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-2">
                  Step 3: Get AI Analysis
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Our AI will classify the situation as emergency/non-emergency
                  and assign urgency level.
                </p>

                <h3 className="font-medium text-gray-800 mb-2">
                  Step 4: View Recommendations
                </h3>
                <p className="text-sm text-gray-600">
                  See recommended actions and response priorities based on the
                  classification.
                </p>
              </div>
            </div>
          </div>

          {/* Emergency Classification Form */}
          <EmergencyForm
            onAnalysisComplete={handleAnalysisComplete}
            showLocation={true}
            showContact={true}
          />

          {/* Recent Analysis Summary */}
          {recentAnalysis && (
            <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📊 Quick Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div
                    className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                      recentAnalysis.emergency_analysis.is_emergency
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {recentAnalysis.emergency_analysis.is_emergency
                      ? "🚨 EMERGENCY"
                      : "📝 NON-EMERGENCY"}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold">
                    {recentAnalysis.urgency_analysis.urgency_level}
                  </div>
                  <div className="text-sm text-gray-500">Urgency Level</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold">
                    {(
                      recentAnalysis.emergency_analysis.confidence * 100
                    ).toFixed(1)}
                    %
                  </div>
                  <div className="text-sm text-gray-500">Confidence</div>
                </div>
                <div className="text-center">
                  <div
                    className={`text-lg font-semibold ${
                      recentAnalysis.requires_immediate_action
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {recentAnalysis.requires_immediate_action
                      ? "IMMEDIATE"
                      : "STANDARD"}
                  </div>
                  <div className="text-sm text-gray-500">Response Priority</div>
                </div>
              </div>
            </div>
          )}

          {/* Technical Info */}
          <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              🔬 Technical Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">
                  Classification Categories
                </h4>
                <ul className="space-y-1">
                  <li>
                    • <strong>Emergency:</strong> Requires immediate response
                  </li>
                  <li>
                    • <strong>Non-Emergency:</strong> Standard processing
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">
                  Urgency Levels
                </h4>
                <ul className="space-y-1">
                  <li>
                    • <strong>CRITICAL:</strong> Life-threatening, immediate
                    action
                  </li>
                  <li>
                    • <strong>HIGH:</strong> Urgent response needed
                  </li>
                  <li>
                    • <strong>MEDIUM:</strong> Important, respond within 30min
                  </li>
                  <li>
                    • <strong>LOW:</strong> Standard processing queue
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
