import { apiClient } from "./client";

export interface MonitoringOverview {
  status: string;
  prometheusAvailable: boolean;
  monitoredTargets: number;
  healthyTargets: number;
  unhealthyTargets: number;
  errorRate: number;
  averageResponseTime: number;
  timestamp: string;
}

export const monitoringApi = {
  async getOverview(): Promise<MonitoringOverview> {
    const response = await apiClient.get<MonitoringOverview>(
      "/monitoring/overview",
    );

    return response.data;
  },
};
