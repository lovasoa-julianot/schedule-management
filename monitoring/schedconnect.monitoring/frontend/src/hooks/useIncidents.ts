import { useCallback, useEffect, useState } from "react";
import { incidentsApi } from "../api/incidentsApi";
import type { MonitoringIncident } from "../types/incidents";

export function useIncidents(intervalMs = 15000) {
  const [incidents, setIncidents] = useState<MonitoringIncident[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);

      const data = await incidentsApi.getActiveIncidents();

      setIncidents(data);
    } catch (err) {
      console.error(err);
      setError("Impossible de récupérer les incidents.");
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
    incidents,
    loading,
    error,
    refresh: load,
  };
}
