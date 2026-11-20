import { apiClient } from "./client";
import type { MonitoringIncident } from "../types/incidents";

export const incidentsApi = {
  async getActiveIncidents(): Promise<MonitoringIncident[]> {
    const response = await apiClient.get<MonitoringIncident[]>("/incidents");

    return response.data;
  },
};
