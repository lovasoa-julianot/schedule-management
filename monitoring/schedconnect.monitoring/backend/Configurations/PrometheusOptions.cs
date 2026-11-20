namespace SchedConnect.Monitoring.Configuration;

public class PrometheusOptions
{
    public const string SectionName = "Prometheus";

    public string Url { get; set; } = "http://localhost:9090";

    public string BackendJobName { get; set; } = "schedconnect-backend";

    public string FrontendJobName { get; set; } = "schedconnect-frontend";

    public string DatabaseJobName { get; set; } = "schedconnect-database";
}