interface StatusCardProps {
  name: string;
  status: "UP" | "DOWN" | "UNKNOWN";
  description?: string;
}

export default function StatusCard({
  name,
  status,
  description,
}: StatusCardProps) {
  const badgeClass =
    status === "UP"
      ? "badge-success"
      : status === "DOWN"
        ? "badge-error"
        : "badge-ghost";

  return (
    <div className="card border border-base-300 bg-base-100 shadow-sm">
      <div className="card-body p-5">
        <div className="flex items-center justify-between">
          <div
            className={`status ${
              status === "UP"
                ? "status-success"
                : status === "DOWN"
                  ? "status-error"
                  : "status-neutral"
            }`}
          />

          <span className={`badge badge-sm ${badgeClass}`}>{status}</span>
        </div>

        <h3 className="mt-3 text-sm font-semibold">{name}</h3>

        {description && (
          <p className="text-[10px] text-base-content/50">{description}</p>
        )}
      </div>
    </div>
  );
}
