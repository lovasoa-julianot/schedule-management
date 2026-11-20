import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { MetricsHistoryPoint } from "../../hooks/useMetrics";

interface MetricsChartProps {
  title: string;
  data: MetricsHistoryPoint[];
  dataKeys: {
    key: keyof MetricsHistoryPoint;
    label: string;
  }[];
  unit?: string;
}

export default function MetricsChart({
  title,
  data,
  dataKeys,
  unit,
}: MetricsChartProps) {
  return (
    <div className="card border border-base-300 bg-base-100 shadow-sm">
      <div className="card-body p-5">
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>

          <p className="mt-1 text-[10px] text-base-content/50">
            Évolution des dernières mesures
          </p>
        </div>

        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />

              <XAxis dataKey="time" tick={{ fontSize: 10 }} />

              <YAxis tick={{ fontSize: 10 }} />

              <Tooltip
                contentStyle={{
                  background: "#111827",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  fontSize: "11px",
                }}
                formatter={(value) => {
                  const numericValue = Array.isArray(value)
                    ? Number(value[0])
                    : Number(value);

                  if (Number.isNaN(numericValue)) {
                    return `${String(value ?? "")}${unit ?? ""}`;
                  }

                  return `${numericValue.toFixed(2)}${unit ?? ""}`;
                }}
              />

              {dataKeys.length > 1 && (
                <Legend
                  wrapperStyle={{
                    fontSize: "10px",
                  }}
                />
              )}

              {dataKeys.map(({ key, label }, index) => (
                <Line
                  key={String(key)}
                  type="monotone"
                  dataKey={key}
                  name={label}
                  strokeWidth={2}
                  dot={false}
                  animationDuration={300}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
