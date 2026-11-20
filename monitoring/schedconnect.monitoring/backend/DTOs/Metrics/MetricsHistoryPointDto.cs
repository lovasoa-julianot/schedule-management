namespace SchedConnect.Monitoring.DTOs.Metrics;

public class MetricsHistoryPointDto
{
    public DateTime Timestamp { get; set; }

    public double RequestsPerSecond { get; set; }

    public double ErrorRate { get; set; }

    public double ClientErrorRate { get; set; }

    public double ServerErrorRate { get; set; }

    public double AverageResponseTimeMs { get; set; }

    public double P95ResponseTimeMs { get; set; }

    public double P99ResponseTimeMs { get; set; }

    public double CpuUsagePercentage { get; set; }

    public double MemoryUsedMb { get; set; }
}