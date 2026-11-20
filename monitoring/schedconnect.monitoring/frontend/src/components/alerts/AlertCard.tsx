import { AlertTriangle, CircleAlert, Info } from "lucide-react";

import type { MonitoringAlert } from "../../types/alerts";

interface AlertCardProps {
  alert: MonitoringAlert;
}

export default function AlertCard({ alert }: AlertCardProps) {
  const isCritical = alert.severity === "CRITICAL";

  const isWarning = alert.severity === "WARNING";

  const Icon = isCritical ? CircleAlert : isWarning ? AlertTriangle : Info;

  const colorClass = isCritical
    ? "text-error"
    : isWarning
      ? "text-warning"
      : "text-info";

  return (
    <div className="card border border-base-300 bg-base-100 shadow-sm">
      <div className="card-body p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 gap-3">
            <Icon size={20} className={`mt-0.5 shrink-0 ${colorClass}`} />

            <div className="min-w-0">
              <h3 className="text-sm font-semibold">{alert.title}</h3>

              <p className="mt-1 text-xs leading-5 text-base-content/60">
                {alert.description}
              </p>
            </div>
          </div>

          <span
            className={`badge ${
              isCritical
                ? "badge-error"
                : isWarning
                  ? "badge-warning"
                  : "badge-info"
            }`}
          >
            {alert.severity}
          </span>
        </div>

        <div className="mt-4 grid gap-3 text-xs sm:grid-cols-3">
          <div>
            <p className="text-base-content/40">Type</p>
            <p className="mt-1 font-medium">{alert.type}</p>
          </div>

          <div>
            <p className="text-base-content/40">Service</p>
            <p className="mt-1 font-medium">{alert.service ?? "-"}</p>
          </div>

          <div>
            <p className="text-base-content/40">Endpoint</p>
            <p className="mt-1 truncate font-mono">{alert.endpoint ?? "-"}</p>
          </div>
        </div>

        {(alert.currentValue !== undefined ||
          alert.threshold !== undefined) && (
          <div className="mt-4 flex gap-3">
            {alert.currentValue !== undefined && (
              <div className="badge badge-outline">
                Valeur: {alert.currentValue.toFixed(2)}
              </div>
            )}

            {alert.threshold !== undefined && (
              <div className="badge badge-outline">
                Seuil: {alert.threshold.toFixed(2)}
              </div>
            )}
          </div>
        )}

        <div className="mt-3 text-[10px] text-base-content/40">
          {new Date(alert.timestamp).toLocaleString("fr-FR")}
        </div>
      </div>
    </div>
  );
}
