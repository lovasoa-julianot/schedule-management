import {
  Activity,
  Bell,
  BrainCircuit,
  Gauge,
  LayoutDashboard,
  ShieldAlert,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navigation = [
  {
    label: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Metrics",
    path: "/metrics",
    icon: Gauge,
  },
  {
    label: "Alerts",
    path: "/alerts",
    icon: Bell,
  },
  {
    label: "Incidents",
    path: "/incidents",
    icon: ShieldAlert,
  },
  {
    label: "AI Analysis",
    path: "/ai",
    icon: BrainCircuit,
  },
];

export default function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-64 shrink-0 border-r border-base-300 bg-base-100 lg:flex lg:flex-col">
      {/* Brand */}
      <div className="flex items-center gap-3 border-b border-base-300 p-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Activity size={21} />
        </div>

        <div>
          <h1 className="text-sm font-bold">SchedConnect</h1>

          <p className="text-xs text-base-content/50">Monitoring</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-lg px-3 py-2.5",
                  "text-sm transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-base-content/60 hover:bg-base-200 hover:text-base-content",
                ].join(" ")
              }
            >
              <Icon size={18} />

              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Connection */}
      <div className="border-t border-base-300 p-3">
        <div className="flex items-center gap-3 rounded-lg border border-base-300 bg-base-200 p-3">
          <div className="status status-success animate-pulse" />

          <div className="min-w-0">
            <p className="text-xs font-semibold">Monitoring active</p>

            <p className="truncate text-[10px] text-base-content/50">
              Prometheus connected
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
