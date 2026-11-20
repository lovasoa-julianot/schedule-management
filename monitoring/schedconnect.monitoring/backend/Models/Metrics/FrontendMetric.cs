namespace SchedConnect.Monitoring.Models.Metrics;

public class FrontendMetric
{
    public bool IsAvailable { get; set; }

    public double LcpMs { get; set; }

    public double FidMs { get; set; }

    public double Cls { get; set; }

    public double FcpMs { get; set; }

    public double TtfbMs { get; set; }

    public int JsErrorsCount { get; set; }

    public int JsErrorsLast5Min { get; set; }

    public double BundleSizeKb { get; set; }

    public double BundleGzippedKb { get; set; }

    public long PageViews { get; set; }

    public long Sessions { get; set; }

    public double AvgSessionDurationMs { get; set; }

    public DateTime Timestamp { get; set; }
}