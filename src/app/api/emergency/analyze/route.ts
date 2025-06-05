import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_API_URL || "http://localhost:8000";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.text || typeof body.text !== "string") {
      return NextResponse.json(
        { error: "Text field is required and must be a string" },
        { status: 400 }
      );
    }

    console.log("🔍 Attempting to connect to backend:", BACKEND_URL);

    // Try to connect to backend with timeout
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

      const response = await fetch(`${BACKEND_URL}/analyze/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Backend responded with status: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Backend connected successfully");
      return NextResponse.json(data);
    } catch (backendError) {
      console.log("❌ Backend connection failed, using mock response");

      // Generate intelligent mock response
      const text = body.text.toLowerCase();

      // Determine if it's an emergency based on keywords
      const emergencyKeywords = [
        "emergency",
        "urgent",
        "help",
        "fire",
        "collapsed",
        "trapped",
        "medical",
        "ambulance",
        "rescue",
        "critical",
        "danger",
        "injured",
        "accident",
      ];
      const isEmergency = emergencyKeywords.some((keyword) =>
        text.includes(keyword)
      );

      // Determine urgency level
      let urgencyLevel = "LOW";
      if (
        text.includes("critical") ||
        text.includes("life threatening") ||
        text.includes("collapsed") ||
        text.includes("trapped")
      ) {
        urgencyLevel = "CRITICAL";
      } else if (
        text.includes("urgent") ||
        text.includes("emergency") ||
        text.includes("fire") ||
        text.includes("medical emergency")
      ) {
        urgencyLevel = "HIGH";
      } else if (
        text.includes("help") ||
        text.includes("medical") ||
        text.includes("injured") ||
        text.includes("accident")
      ) {
        urgencyLevel = "MEDIUM";
      }

      const mockResponse = {
        text: body.text,
        emergency_analysis: {
          is_emergency: isEmergency,
          confidence: isEmergency ? 0.87 : 0.73,
          probabilities: {
            emergency: isEmergency ? 0.87 : 0.27,
            non_emergency: isEmergency ? 0.13 : 0.73,
          },
        },
        urgency_analysis: {
          urgency_level: urgencyLevel,
          confidence: 0.81,
          probabilities: {
            LOW: urgencyLevel === "LOW" ? 0.81 : 0.05,
            MEDIUM: urgencyLevel === "MEDIUM" ? 0.81 : 0.15,
            HIGH: urgencyLevel === "HIGH" ? 0.81 : 0.1,
            CRITICAL: urgencyLevel === "CRITICAL" ? 0.81 : 0.05,
          },
        },
        requires_immediate_action:
          urgencyLevel === "HIGH" || urgencyLevel === "CRITICAL",
        processing_time_ms: 180,
        request_id: "demo_" + Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        mode: "demo_mode_backend_offline",
      };

      return NextResponse.json(mockResponse);
    }
  } catch (error) {
    console.error("💥 Emergency analysis error:", error);
    return NextResponse.json(
      {
        error: "Failed to analyze emergency request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
