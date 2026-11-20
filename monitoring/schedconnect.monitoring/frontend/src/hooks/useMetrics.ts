import { useCallback, useEffect, useState } from "react";
import { metricsApi } from "../api/metricsApi";
import type { SchedConnectMetrics } from "../types/metrics";

export interface MetricsHistoryPoint {
  time: string;
  requestsPerSecond: number;
  errorRate: number;
  p95: number;
  p99: number;
  cpu: number;
  memory: number;
}

export function useMetrics(intervalMs = 15000) {
  const [metrics, setMetrics] = useState<SchedConnectMetrics | null>(null);

  const [history, setHistory] = useState<MetricsHistoryPoint[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);

      const data = await metricsApi.getMetrics();

      setMetrics(data);

      const point: MetricsHistoryPoint = {
        time: new Date(data.timestamp).toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        requestsPerSecond: data.http.requestsPerSecond,
        errorRate: data.http.errorRate,
        p95: data.http.p95ResponseTimeMs,
        p99: data.http.p99ResponseTimeMs,
        cpu: data.system.cpuUsagePercentage,
        memory: data.system.memoryUsedMb,
      };

      setHistory((previous) => [...previous, point].slice(-20));
    } catch (err) {
      console.error(err);
      setError("Impossible de récupérer les métriques.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();

    const interval = setInterval(load, intervalMs);

    return () => clearInterval(interval);
  }, [load, intervalMs]);

  return {
    metrics,
    history,
    loading,
    error,
    refresh: load,
  };
}
