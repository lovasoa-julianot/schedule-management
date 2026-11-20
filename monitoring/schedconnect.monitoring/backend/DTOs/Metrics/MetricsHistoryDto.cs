namespace SchedConnect.Monitoring.DTOs.Metrics;

public class MetricsHistoryDto
{
    public string Range { get; set; } = string.Empty;

    public string Step { get; set; } = string.Empty;

    public DateTime Start { get; set; }

    public DateTime End { get; set; }

    public List<MetricsHistoryPointDto> Points { get; set; } = [];
}