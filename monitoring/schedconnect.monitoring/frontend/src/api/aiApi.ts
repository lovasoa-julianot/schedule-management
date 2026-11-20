import { apiClient } from "./client";
import type { AIAnalysis } from "../types/ai";

export const aiApi = {
  async analyzeIncident(incidentId: string): Promise<AIAnalysis> {
    const response = await apiClient.get<AIAnalysis>(
      `/ai/incidents/${incidentId}/analysis`,
    );

    return response.data;
  },
};
