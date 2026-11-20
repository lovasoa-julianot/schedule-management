namespace SchedConnect.Monitoring.Models.Metrics;

public class DatabaseMetric
{
    public bool IsAvailable { get; set; }

    public int ActiveConnections { get; set; }

    public int IdleConnections { get; set; }

    public int MaxConnections { get; set; }

    public double ConnectionUsagePercent { get; set; }

    public double AverageQueryDurationMs { get; set; }

    public double P95QueryDurationMs { get; set; }

    public double P99QueryDurationMs { get; set; }

    public long FailedQueries { get; set; }

    public long SlowQueries { get; set; }

    public double QueriesPerSecond { get; set; }

    public double BufferPoolUsagePercent { get; set; }

    public long BufferPoolSizeBytes { get; set; }

    public double BufferPoolReadRequestsPerSecond { get; set; }

    public double BufferPoolReadHitRatio { get; set; }

    public DateTime Timestamp { get; set; }
}