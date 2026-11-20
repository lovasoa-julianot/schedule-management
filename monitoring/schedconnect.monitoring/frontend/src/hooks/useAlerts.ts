import { useCallback, useEffect, useState } from "react";
import { alertsApi } from "../api/alertsApi";
import type { MonitoringAlert } from "../types/alerts";

export function useAlerts(intervalMs = 15000) {
  const [alerts, setAlerts] = useState<MonitoringAlert[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);

      const data = await alertsApi.getActiveAlerts();

      setAlerts(data);
    } catch (err) {
      console.error(err);
      setError("Impossible de récupérer les alertes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();

    const interval = setInterval(load, intervalMs);

    return () => clearInterval(interval);
  }, [load, intervalMs]);

  return {
    alerts,
    loading,
    error,
    refresh: load,
  };
}
