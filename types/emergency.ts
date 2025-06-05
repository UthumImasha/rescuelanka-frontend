export interface EmergencyClassification {
  is_emergency: boolean;
  confidence: number;
  probabilities: {
    emergency: number;
    non_emergency: number;
  };
}

export interface UrgencyClassification {
  urgency_level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | "N/A";
  confidence: number;
  probabilities: {
    LOW: number;
    MEDIUM: number;
    HIGH: number;
    CRITICAL: number;
  };
}

export interface AnalysisResponse {
  text: string;
  emergency_analysis: EmergencyClassification;
  urgency_analysis: UrgencyClassification;
  requires_immediate_action: boolean;
  processing_time_ms: number;
  request_id?: string;
  timestamp: string;
}

export interface EmergencyRequest {
  text: string;
  user_id?: string;
  session_id?: string;
  location?: string;
  contact_info?: string;
}
