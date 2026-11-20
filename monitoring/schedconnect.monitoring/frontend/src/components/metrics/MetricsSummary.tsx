import MetricCard from "../dashboard/MetricCard";
import type { SchedConnectMetrics } from "../../types/metrics";

interface MetricsSummaryProps {
  metrics: SchedConnectMetrics;
}

export default function MetricsSummary({ metrics }: MetricsSummaryProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        label="Requests / second"
        value={metrics.http.requestsPerSecond.toFixed(2)}
        description="Trafic HTTP actuel"
      />

      <MetricCard
        label="Error rate"
        value={metrics.http.errorRate.toFixed(2)}
        unit="%"
        status={
          metrics.http.errorRate >= 10
            ? "critical"
            : metrics.http.errorRate >= 5
              ? "warning"
              : "normal"
        }
        description="Erreurs HTTP globales"
      />

      <MetricCard
        label="P95 latency"
        value={metrics.http.p95ResponseTimeMs.toFixed(1)}
        unit="ms"
        status={
          metrics.http.p95ResponseTimeMs >= 1000
            ? "critical"
            : metrics.http.p95ResponseTimeMs >= 500
              ? "warning"
              : "normal"
        }
        description="95e percentile"
      />

      <MetricCard
        label="P99 latency"
        value={metrics.http.p99ResponseTimeMs.toFixed(1)}
        unit="ms"
        description="99e percentile"
      />

      <MetricCard
        label="CPU"
        value={metrics.system.cpuUsagePercentage.toFixed(2)}
        unit="%"
        status={
          metrics.system.cpuUsagePercentage >= 90
            ? "critical"
            : metrics.system.cpuUsagePercentage >= 70
              ? "warning"
              : "normal"
        }
        description="Processus backend"
      />

      <MetricCard
        label="Memory"
        value={metrics.system.memoryUsedMb.toFixed(1)}
        unit="MB"
        description="Working set"
      />

      <MetricCard
        label="4xx rate"
        value={metrics.http.clientErrorRate.toFixed(2)}
        unit="%"
        description="Erreurs client"
      />

      <MetricCard
        label="5xx rate"
        value={metrics.http.serverErrorRate.toFixed(2)}
        unit="%"
        status={
          metrics.http.serverErrorRate >= 10
            ? "critical"
            : metrics.http.serverErrorRate >= 5
              ? "warning"
              : "normal"
        }
        description="Erreurs serveur"
      />
    </div>
  );
}
