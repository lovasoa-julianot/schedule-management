import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, ShieldCheck } from "lucide-react";

import Header from "../components/layout/Header";
import MetricCard from "../components/dashboard/MetricCard";
import StatusCard from "../components/dashboard/StatusCard";
import EndpointTable from "../components/dashboard/EndpointTable";

import { monitoringApi } from "../api/monitoringApi";
import { metricsApi } from "../api/metricsApi";
import { alertsApi } from "../api/alertsApi";
import { incidentsApi } from "../api/incidentsApi";

import type { SchedConnectMetrics } from "../types/metrics";
import type { MonitoringAlert } from "../types/alerts";
import type { MonitoringIncident } from "../types/incidents";

export default function DashboardPage() {
  const [overview, setOverview] = useState<Awaited<
    ReturnType<typeof monitoringApi.getOverview>
  > | null>(null);

  const [metrics, setMetrics] = useState<SchedConnectMetrics | null>(null);

  const [alerts, setAlerts] = useState<MonitoringAlert[]>([]);

  const [incidents, setIncidents] = useState<MonitoringIncident[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [overviewData, metricsData, alertsData, incidentsData] =
        await Promise.all([
          monitoringApi.getOverview(),
          metricsApi.getMetrics(),
          alertsApi.getActiveAlerts(),
          incidentsApi.getActiveIncidents(),
        ]);

      setOverview(overviewData);
      setMetrics(metricsData);
      setAlerts(alertsData);
      setIncidents(incidentsData);
    } catch (err) {
      console.error(err);
      setError("Impossible de récupérer les données de supervision.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();

    const interval = setInterval(loadDashboard, 15000);

    return () => clearInterval(interval);
  }, [loadDashboard]);

  const formatNumber = (value: number, digits = 1) =>
    new Intl.NumberFormat("fr-FR", {
      maximumFractionDigits: digits,
    }).format(value);

  const errorRate = metrics?.http.errorRate ?? 0;
  const latency = metrics?.http.p95ResponseTimeMs ?? 0;
  const cpu = metrics?.system.cpuUsagePercentage ?? 0;

  return (
    <>
      <Header
        title="Tableau de bord"
        subtitle="Vue globale de la supervision SchedConnect"
        onRefresh={loadDashboard}
        loading={loading}
      />

      <main className="space-y-8 p-4 md:p-6 lg:p-8">
        {/* ERREUR */}
        {error && (
          <div className="alert alert-error shadow-sm">
            <AlertTriangle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* ========================================================= */}
        {/* ÉTAT DU SYSTÈME */}
        {/* ========================================================= */}

        <section className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                État du système
              </h2>

              <p className="text-sm text-base-content/60">
                État actuel des composants surveillés
              </p>
            </div>

            <div
              className={`badge badge-lg gap-2 px-4 py-3 ${
                overview?.status === "UP"
                  ? "badge-success"
                  : overview?.status === "DEGRADED"
                    ? "badge-warning"
                    : "badge-error"
              }`}
            >
              <ShieldCheck size={16} />
              <span>{overview?.status ?? "INCONNU"}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {" "}
            <StatusCard
              name="Frontend SchedConnect"
              status={"UNKNOWN"}
              description="Application React / Vite"
            />
            <StatusCard
              name="Backend SchedConnect"
              status={metrics?.availability.isUp ? "UP" : "DOWN"}
              description="API ASP.NET Core 8"
            />
            <StatusCard
              name="Prometheus"
              status={overview?.prometheusAvailable ? "UP" : "DOWN"}
              description="Collecte et stockage des métriques"
            />
            <StatusCard
              name="Base de données"
              status={metrics?.database.isAvailable ? "UP" : "UNKNOWN"}
              description="État de la base de données"
            />
          </div>
        </section>

        {/* ========================================================= */}
        {/* MÉTRIQUES PRINCIPALES */}
        {/* ========================================================= */}

        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight">
              Métriques principales
            </h2>

            <p className="text-sm text-base-content/60">
              Données actuelles du backend
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <MetricCard
              label="Requêtes / seconde"
              value={formatNumber(metrics?.http.requestsPerSecond ?? 0, 2)}
              description="Trafic HTTP actuel"
            />

            {/* <MetricCard
              label="Erreurs Frontend (JS)"
              value="0" // Remplacer par votre variable d'état si disponible
              status="normal"
              description="Exceptions capturées (24h)"
            /> */}

            <MetricCard
              label="Taux d'erreur"
              value={formatNumber(errorRate, 2)}
              unit="%"
              status={
                errorRate >= 10
                  ? "critical"
                  : errorRate >= 5
                    ? "warning"
                    : "normal"
              }
              description="Erreurs HTTP 4xx + 5xx"
            />

            <MetricCard
              label="Latence P95"
              value={formatNumber(latency, 1)}
              unit="ms"
              status={
                latency >= 1000
                  ? "critical"
                  : latency >= 500
                    ? "warning"
                    : "normal"
              }
              description="95e percentile"
            />

            <MetricCard
              label="Processeur (CPU)"
              value={formatNumber(cpu, 2)}
              unit="%"
              status={cpu >= 90 ? "critical" : cpu >= 70 ? "warning" : "normal"}
              description="Utilisation du processus SchedConnect"
            />

            <MetricCard
              label="Mémoire"
              value={formatNumber(metrics?.system.memoryUsedMb ?? 0, 1)}
              unit="Mo"
              description="Mémoire utilisée par le backend"
            />

            <MetricCard
              label="Alertes actives"
              value={alerts.length.toString()}
              status={
                alerts.some((alert) => alert.severity === "CRITICAL")
                  ? "critical"
                  : alerts.length > 0
                    ? "warning"
                    : "normal"
              }
              description="Alertes actuellement détectées"
            />
          </div>
        </section>

        {/* ========================================================= */}
        {/* POINTS D'ACCÈS */}
        {/* ========================================================= */}

        {metrics && (
          <section>
            <EndpointTable endpoints={metrics.endpoints} />
          </section>
        )}

        {/* ========================================================= */}
        {/* INCIDENTS ACTIFS */}
        {/* ========================================================= */}

        <section className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body p-0">
            {/* En-tête */}
            <div className="flex items-center justify-between border-b border-base-300 px-5 py-4">
              <div>
                <h2 className="text-lg font-bold">Incidents actifs</h2>

                <p className="text-sm text-base-content/60">
                  Incidents nécessitant une intervention
                </p>
              </div>

              <div className="badge badge-neutral">{incidents.length}</div>
            </div>

            {/* Contenu */}
            {incidents.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success">
                  <ShieldCheck size={28} />
                </div>

                <strong className="text-base font-semibold">
                  Aucun incident actif
                </strong>

                <p className="mt-1 text-sm text-base-content/60">
                  SchedConnect fonctionne normalement.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-base-300">
                {incidents.map((incident) => (
                  <div
                    className="flex flex-col gap-4 px-5 py-4 transition-colors hover:bg-base-200/50 sm:flex-row sm:items-center sm:justify-between"
                    key={incident.id}
                  >
                    <div className="min-w-0">
                      <strong className="block text-sm font-semibold">
                        {incident.title}
                      </strong>

                      <p className="mt-1 text-sm text-base-content/60">
                        {incident.description}
                      </p>
                    </div>

                    <span
                      className={`badge shrink-0 ${
                        incident.severity === "CRITICAL"
                          ? "badge-error"
                          : incident.severity === "WARNING"
                            ? "badge-warning"
                            : "badge-info"
                      }`}
                    >
                      {incident.severity}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
