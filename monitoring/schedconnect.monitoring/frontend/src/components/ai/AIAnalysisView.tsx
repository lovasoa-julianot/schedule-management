import {
  BrainCircuit,
  CheckCircle2,
  Lightbulb,
  Search,
  Target,
} from "lucide-react";

import type { AIAnalysis } from "../../types/ai";

interface AIAnalysisViewProps {
  analysis: AIAnalysis;
}

export default function AIAnalysisView({ analysis }: AIAnalysisViewProps) {
  const confidenceClass =
    analysis.confidence === "HIGH"
      ? "badge-success"
      : analysis.confidence === "MEDIUM"
        ? "badge-warning"
        : "badge-error";

  return (
    <div className="space-y-4">
      <div className="card border border-primary/20 bg-primary/5 shadow-sm">
        <div className="card-body p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-2 text-primary">
              <BrainCircuit size={20} />
            </div>

            <div>
              <h3 className="text-sm font-semibold">AI diagnosis</h3>

              <p className="text-[10px] text-base-content/50">
                Analyse générée à partir du contexte de monitoring.
              </p>
            </div>

            <span className={`badge ml-auto ${confidenceClass}`}>
              Confidence: {analysis.confidence}
            </span>
          </div>

          <div className="mt-5">
            <h4 className="text-xs font-semibold">{analysis.summary}</h4>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body p-5">
            <div className="flex items-center gap-2">
              <Search size={17} className="text-info" />

              <h3 className="text-sm font-semibold">Explication</h3>
            </div>

            <p className="mt-3 text-xs leading-6 text-base-content/70">
              {analysis.explanation}
            </p>
          </div>
        </div>

        <div className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body p-5">
            <div className="flex items-center gap-2">
              <Target size={17} className="text-warning" />

              <h3 className="text-sm font-semibold">Cause probable</h3>
            </div>

            <p className="mt-3 text-xs leading-6 text-base-content/70">
              {analysis.probableCause}
            </p>
          </div>
        </div>

        <div className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body p-5">
            <div className="flex items-center gap-2">
              <Lightbulb size={17} className="text-warning" />

              <h3 className="text-sm font-semibold">Impact</h3>
            </div>

            <p className="mt-3 text-xs leading-6 text-base-content/70">
              {analysis.impact}
            </p>
          </div>
        </div>

        <div className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body p-5">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={17} className="text-success" />

              <h3 className="text-sm font-semibold">Actions recommandées</h3>
            </div>

            <div className="mt-3 space-y-2">
              {analysis.recommendedActions.map((action, index) => (
                <div
                  key={`${index}-${action}`}
                  className="flex gap-2 text-xs leading-5"
                >
                  <span className="badge badge-neutral badge-sm shrink-0">
                    {index + 1}
                  </span>

                  <span className="text-base-content/70">{action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="text-right text-[10px] text-base-content/40">
        Analyse générée le{" "}
        {new Date(analysis.timestamp).toLocaleString("fr-FR")}
      </div>
    </div>
  );
}
