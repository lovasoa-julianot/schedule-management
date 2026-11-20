import { apiClient } from "./client";
import type { SchedConnectMetrics } from "../types/metrics";

export const metricsApi = {
  async getMetrics(): Promise<SchedConnectMetrics> {
    const response = await apiClient.get<SchedConnectMetrics>("/metrics");

    return response.data;
  },

  async getEndpoints() {
    const response =
      await apiClient.get<SchedConnectMetrics["endpoints"]>(
        "/metrics/endpoints",
      );

    return response.data;
  },
};
