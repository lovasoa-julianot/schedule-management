import { ArrowRight, BrainCircuit } from "lucide-react";
import type { MonitoringIncident } from "../../types/incidents";

interface IncidentCardProps {
  incident: MonitoringIncident;
  onAnalyze?: () => void;
}

export default function IncidentCard({
  incident,
  onAnalyze,
}: IncidentCardProps) {
  const severityClass =
    incident.severity === "CRITICAL"
      ? "badge-error"
      : incident.severity === "WARNING"
        ? "badge-warning"
        : "badge-info";

  return (
    <div className="card border border-base-300 bg-base-100 shadow-sm">
      <div className="card-body p-5">
        <div className="flex flex-col justify-between gap-4 md:flex-row">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold">{incident.title}</h3>

              <span className={`badge ${severityClass}`}>
                {incident.severity}
              </span>

              <span className="badge badge-outline">{incident.status}</span>
            </div>

            <p className="mt-2 text-xs leading-5 text-base-content/60">
              {incident.description}
            </p>
          </div>

          {onAnalyze && (
            <button className="btn btn-primary btn-sm" onClick={onAnalyze}>
              <BrainCircuit size={15} />
              Analyser
              <ArrowRight size={14} />
            </button>
          )}
        </div>

        <div className="mt-4 grid gap-4 border-t border-base-300 pt-4 text-xs md:grid-cols-3">
          <div>
            <p className="text-base-content/40">Service</p>

            <p className="mt-1 font-medium">{incident.service ?? "-"}</p>
          </div>

          <div>
            <p className="text-base-content/40">Endpoint</p>

            <p className="mt-1 truncate font-mono">
              {incident.endpoint ?? "-"}
            </p>
          </div>

          <div>
            <p className="text-base-content/40">Détecté</p>

            <p className="mt-1">
              {new Date(incident.detectedAt).toLocaleString("fr-FR")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
