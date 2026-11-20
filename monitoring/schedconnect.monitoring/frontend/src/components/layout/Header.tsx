import { RefreshCw, Settings } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  onRefresh?: () => void;
  loading?: boolean;
}

export default function Header({
  title,
  subtitle,
  onRefresh,
  loading = false,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-base-300 bg-base-100/95 px-4 backdrop-blur md:px-6">
      <div>
        <h2 className="text-lg font-bold">{title}</h2>

        {subtitle && (
          <p className="hidden text-xs text-base-content/50 sm:block">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="badge badge-success badge-outline gap-2">
          <span className="status status-success status-xs animate-pulse" />
          LIVE
        </div>

        {onRefresh && (
          <button
            className="btn btn-ghost btn-sm btn-square"
            onClick={onRefresh}
            disabled={loading}
            title="Actualiser"
          >
            <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
          </button>
        )}

        <button className="btn btn-ghost btn-sm btn-square" title="Paramètres">
          <Settings size={17} />
        </button>
      </div>
    </header>
  );
}
