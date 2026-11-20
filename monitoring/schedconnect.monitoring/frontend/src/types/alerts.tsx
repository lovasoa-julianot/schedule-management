export type AlertSeverity = "CRITICAL" | "WARNING" | "INFO";

export interface MonitoringAlert {
  id: string;
  type: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  service?: string;
  endpoint?: string;
  currentValue?: number;
  threshold?: number;
  timestamp: string;
}
