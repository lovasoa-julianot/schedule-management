import { useMemo, useState } from "react";

import Header from "../components/layout/Header";
import AlertCard from "../components/alerts/AlertCard";
import AlertsStats from "../components/alerts/AlertsStats";
import { useAlerts } from "../hooks/useAlerts";

export default function AlertsPage() {
  const { alerts, loading, error, refresh } = useAlerts();

  const [severity, setSeverity] = useState("ALL");

  const filteredAlerts = useMemo(() => {
    if (severity === "ALL") {
      return alerts;
    }

    return alerts.filter((alert) => alert.severity === severity);
  }, [alerts, severity]);

  return (
    <>
      <Header
        title="Alerts"
        subtitle="Alertes détectées par le moteur de monitoring"
        onRefresh={refresh}
        loading={loading}
      />

      <main className="space-y-6 p-4 md:p-6">
        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        <AlertsStats alerts={alerts} />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold">Active alerts</h3>

            <p className="text-[10px] text-base-content/50">
              {filteredAlerts.length} alerte(s)
            </p>
          </div>

          <select
            className="select select-bordered select-sm"
            value={severity}
            onChange={(event) => setSeverity(event.target.value)}
          >
            <option value="ALL">Toutes les sévérités</option>

            <option value="CRITICAL">Critical</option>

            <option value="WARNING">Warning</option>

            <option value="INFO">Info</option>
          </select>
        </div>

        {filteredAlerts.length === 0 ? (
          <div className="hero rounded-box border border-base-300 bg-base-100 py-16">
            <div className="hero-content text-center">
              <div>
                <h3 className="text-lg font-semibold">Aucune alerte</h3>

                <p className="mt-2 text-sm text-base-content/50">
                  Aucun signal nécessitant actuellement votre attention.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
