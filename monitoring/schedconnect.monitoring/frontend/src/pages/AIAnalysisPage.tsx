import { useEffect, useState } from "react";

import { useSearchParams } from "react-router-dom";

import { BrainCircuit, Loader2 } from "lucide-react";

import Header from "../components/layout/Header";
import AIAnalysisView from "../components/ai/AIAnalysisView";

import { useIncidents } from "../hooks/useIncidents";
import { aiApi } from "../api/aiApi";

import type { AIAnalysis } from "../types/ai";

export default function AIAnalysisPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { incidents } = useIncidents();

  const [selectedIncidentId, setSelectedIncidentId] = useState(
    searchParams.get("incident") ?? "",
  );

  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const analyze = async () => {
    if (!selectedIncidentId) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setAnalysis(null);

      setSearchParams({
        incident: selectedIncidentId,
      });

      const result = await aiApi.analyzeIncident(selectedIncidentId);

      setAnalysis(result);
    } catch (err) {
      console.error(err);
      setError("Impossible de générer l'analyse IA.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const incidentId = searchParams.get("incident");

    if (
      incidentId &&
      incidents.some((incident) => incident.id === incidentId)
    ) {
      setSelectedIncidentId(incidentId);
    }
  }, [searchParams, incidents]);

  return (
    <>
      <Header
        title="AI Analysis"
        subtitle="Diagnostic assisté par intelligence artificielle"
      />

      <main className="space-y-6 p-4 md:p-6">
        <div className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-2 text-primary">
                <BrainCircuit size={20} />
              </div>

              <div>
                <h3 className="text-sm font-semibold">Analyse d'un incident</h3>

                <p className="text-[10px] text-base-content/50">
                  Sélectionnez un incident actif pour lancer son analyse.
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 md:flex-row">
              <select
                className="select select-bordered flex-1"
                value={selectedIncidentId}
                onChange={(event) => setSelectedIncidentId(event.target.value)}
              >
                <option value="">Sélectionner un incident</option>

                {incidents.map((incident) => (
                  <option key={incident.id} value={incident.id}>
                    {incident.title}
                  </option>
                ))}
              </select>

              <button
                className="btn btn-primary"
                onClick={analyze}
                disabled={!selectedIncidentId || loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Analyse...
                  </>
                ) : (
                  <>
                    <BrainCircuit size={16} />
                    Analyser
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        {!analysis && !loading && (
          <div className="hero rounded-box border border-base-300 bg-base-100 py-20">
            <div className="hero-content text-center">
              <div>
                <BrainCircuit size={42} className="mx-auto text-primary/60" />

                <h3 className="mt-4 text-lg font-semibold">
                  En attente d'une analyse
                </h3>

                <p className="mt-2 max-w-md text-sm text-base-content/50">
                  Sélectionnez un incident pour obtenir une explication
                  technique, une cause probable et des actions recommandées.
                </p>
              </div>
            </div>
          </div>
        )}

        {analysis && <AIAnalysisView analysis={analysis} />}
      </main>
    </>
  );
}
