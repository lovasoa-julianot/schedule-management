export interface ServiceAvailabilityMetric {
  service: string;
  isUp: boolean;
  uptimePercentage: number;
  timestamp: string;
}

export interface HttpMetric {
  requestsPerSecond: number;
  clientErrorRate: number;
  serverErrorRate: number;
  errorRate: number;
  averageResponseTimeMs: number;
  p95ResponseTimeMs: number;
  p99ResponseTimeMs: number;
  timestamp: string;
}

export interface SystemResourceMetric {
  cpuUsagePercentage: number;
  memoryUsedMb: number;
  timestamp: string;
}

export interface EndpointMetric {
  endpoint: string;
  method: string;
  controller: string;
  action: string;
  requestsPerSecond: number;
  errorRate: number;
  averageResponseTimeMs: number;
  p95ResponseTimeMs: number;
  timestamp: string;
}

export interface DatabaseMetric {
  isAvailable: boolean;
  activeConnections: number;
  idleConnections: number;
  maxConnections: number;
  connectionUsagePercent: number;
  averageQueryDurationMs: number;
  p95QueryDurationMs: number;
  p99QueryDurationMs: number;
  failedQueries: number;
  slowQueries: number;
  queriesPerSecond: number;
  bufferPoolUsagePercent: number;
  bufferPoolSizeBytes: number;
  bufferPoolReadRequestsPerSecond: number;
  bufferPoolReadHitRatio: number;
  timestamp: string;
}

export interface FrontendMetric {
  isAvailable: boolean;
  lcpMs: number;
  fidMs: number;
  cls: number;
  fcpMs: number;
  ttfbMs: number;
  jsErrorsCount: number;
  jsErrorsLast5Min: number;
  bundleSizeKb: number;
  bundleGzippedKb: number;
  pageViews: number;
  sessions: number;
  avgSessionDurationMs: number;
  timestamp: string;
}

export interface SchedConnectMetrics {
  availability: ServiceAvailabilityMetric;
  http: HttpMetric;
  system: SystemResourceMetric;
  database: DatabaseMetric;
  frontend: FrontendMetric;
  endpoints: EndpointMetric[];
  timestamp: string;
}
