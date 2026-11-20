interface MetricCardProps {
  label: string;
  value: string;
  unit?: string;
  description?: string;
  status?: "normal" | "warning" | "critical";
}

export default function MetricCard({
  label,
  value,
  unit,
  description,
  status = "normal",
}: MetricCardProps) {
  const borderClass =
    status === "critical"
      ? "border-error/40"
      : status === "warning"
        ? "border-warning/40"
        : "border-base-300";

  return (
    <div className={`card border bg-base-100 shadow-sm ${borderClass}`}>
      <div className="card-body gap-2 p-5">
        <p className="text-xs text-base-content/50">{label}</p>

        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold tracking-tight">{value}</span>

          {unit && (
            <span className="mb-1 text-xs text-base-content/50">{unit}</span>
          )}
        </div>

        {description && (
          <p className="text-[10px] text-base-content/40">{description}</p>
        )}
      </div>
    </div>
  );
}
