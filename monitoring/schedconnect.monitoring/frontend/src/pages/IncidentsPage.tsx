import { useNavigate } from "react-router-dom";

import Header from "../components/layout/Header";
import IncidentCard from "../components/incidents/IncidentCard";
import { useIncidents } from "../hooks/useIncidents";

export default function IncidentsPage() {
  const navigate = useNavigate();

  const { incidents, loading, error, refresh } = useIncidents();

  return (
    <>
      <Header
        title="Incidents"
        subtitle="Problèmes regroupant plusieurs signaux de monitoring"
        onRefresh={refresh}
        loading={loading}
      />

      <main className="space-y-6 p-4 md:p-6">
        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">Active incidents</h3>

            <p className="text-[10px] text-base-content/50">
              {incidents.length} incident(s) actif(s)
            </p>
          </div>
        </div>

        {incidents.length === 0 ? (
          <div className="hero rounded-box border border-base-300 bg-base-100 py-20">
            <div className="hero-content text-center">
              <div>
                <h3 className="text-lg font-semibold">Aucun incident actif</h3>

                <p className="mt-2 text-sm text-base-content/50">
                  Aucun incident n'a été détecté actuellement.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {incidents.map((incident) => (
              <IncidentCard
                key={incident.id}
                incident={incident}
                onAnalyze={() => navigate(`/ai?incident=${incident.id}`)}
              />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
