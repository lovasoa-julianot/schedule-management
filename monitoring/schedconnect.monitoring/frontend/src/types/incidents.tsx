export type IncidentStatus = "ACTIVE" | "ACKNOWLEDGED" | "RESOLVED" | "CLOSED";

export interface MonitoringIncident {
  id: string;
  title: string;
  description: string;
  severity: string;
  status: IncidentStatus;
  service?: string;
  endpoint?: string;
  alertIds: string[];
  detectedAt: string;
  lastUpdatedAt: string;
}
