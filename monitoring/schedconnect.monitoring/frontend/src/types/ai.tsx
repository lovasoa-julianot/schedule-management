export interface AIAnalysis {
  incidentId: string;
  summary: string;
  explanation: string;
  probableCause: string;
  impact: string;
  recommendedActions: string[];
  confidence: "LOW" | "MEDIUM" | "HIGH";
  timestamp: string;
}
