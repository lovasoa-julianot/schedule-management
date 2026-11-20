import Header from "../components/layout/Header";
import MetricsChart from "../components/metrics/MetricsChart";
import MetricsSummary from "../components/metrics/MetricsSummary";
import EndpointTable from "../components/dashboard/EndpointTable";
import { useMetrics } from "../hooks/useMetrics";

export default function MetricsPage() {
  const { metrics, history, loading, error, refresh } = useMetrics();

  return (
    <>
      <Header
        title="Metrics"
        subtitle="Analyse détaillée des performances SchedConnect"
        onRefresh={refresh}
        loading={loading}
      />

      <main className="space-y-8 p-4 md:p-6">
        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        {metrics && (
          <>
            <MetricsSummary metrics={metrics} />

            <div className="grid gap-5 xl:grid-cols-2">
              <MetricsChart
                title="Trafic HTTP"
                data={history}
                dataKeys={[
                  {
                    key: "requestsPerSecond",
                    label: "Requests/s",
                  },
                ]}
              />

              <MetricsChart
                title="Taux d'erreur"
                data={history}
                dataKeys={[
                  {
                    key: "errorRate",
                    label: "Error rate",
                  },
                ]}
                unit="%"
              />

              <MetricsChart
                title="Latence"
                data={history}
                dataKeys={[
                  {
                    key: "p95",
                    label: "P95",
                  },
                  {
                    key: "p99",
                    label: "P99",
                  },
                ]}
                unit=" ms"
              />

              <MetricsChart
                title="Ressources système"
                data={history}
                dataKeys={[
                  {
                    key: "cpu",
                    label: "CPU",
                  },
                  {
                    key: "memory",
                    label: "Memory",
                  },
                ]}
              />
            </div>

            <EndpointTable endpoints={metrics.endpoints} />
          </>
        )}
      </main>
    </>
  );
}
