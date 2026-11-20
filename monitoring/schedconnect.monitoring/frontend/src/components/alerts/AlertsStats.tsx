import type { MonitoringAlert } from "../../types/alerts";

interface AlertsStatsProps {
  alerts: MonitoringAlert[];
}

export default function AlertsStats({ alerts }: AlertsStatsProps) {
  const critical = alerts.filter(
    (alert) => alert.severity === "CRITICAL",
  ).length;

  const warning = alerts.filter((alert) => alert.severity === "WARNING").length;

  const info = alerts.filter((alert) => alert.severity === "INFO").length;

  const cards = [
    {
      label: "Total",
      value: alerts.length,
    },
    {
      label: "Critical",
      value: critical,
    },
    {
      label: "Warning",
      value: warning,
    },
    {
      label: "Info",
      value: info,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="stat rounded-box border border-base-300 bg-base-100 shadow-sm"
        >
          <div className="stat-title">{card.label}</div>

          <div className="stat-value text-2xl">{card.value}</div>
        </div>
      ))}
    </div>
  );
}
