namespace SchedConnect.Monitoring.Models.Metrics;

public class MetricsHistory
{
    public string Range { get; set; } = string.Empty;

    public string Step { get; set; } = string.Empty;

    public DateTime Start { get; set; }

    public DateTime End { get; set; }

    public List<MetricsHistoryPoint> Points { get; set; } = [];
}