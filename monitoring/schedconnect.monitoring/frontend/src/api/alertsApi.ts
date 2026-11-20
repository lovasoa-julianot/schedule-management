import { apiClient } from "./client";
import type { MonitoringAlert } from "../types/alerts";

export const alertsApi = {
  async getActiveAlerts(): Promise<MonitoringAlert[]> {
    const response = await apiClient.get<MonitoringAlert[]>("/alerts");

    return response.data;
  },
};
