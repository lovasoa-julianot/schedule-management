using SchedConnect.Monitoring.Models.Monitoring;
using SchedConnect.Monitoring.Services.Prometheus;
using System.Net.Sockets;

namespace SchedConnect.Monitoring.Services.Monitoring;

public class MonitoringService : IMonitoringService
{
    private readonly IPrometheusService _prometheusService;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<MonitoringService> _logger;

    public MonitoringService(
        IPrometheusService prometheusService,
        IHttpClientFactory httpClientFactory,
        ILogger<MonitoringService> logger)
    {
        _prometheusService = prometheusService;
        _httpClientFactory = httpClientFactory;
        _logger = logger;
    }

    public async Task<MonitoringOverview> GetOverviewAsync(
        CancellationToken cancellationToken = default)
    {
        var timestamp = DateTime.UtcNow;

        // 1. Vérification simultanée de la Base de Données (TCP sur mysql:3306) et des services HTTP
        var dbTask = CheckTcpServiceAsync("mysql", 3306, cancellationToken);
        var frontendTask = CheckHttpServiceAsync("http://frontend:80", cancellationToken);
        var gatewayTask = CheckHttpServiceAsync("http://gateway:80", cancellationToken);

        await Task.WhenAll(dbTask, frontendTask, gatewayTask);

        bool isDbUp = await dbTask;
        bool isFrontendUp = await frontendTask;
        bool isGatewayUp = await gatewayTask;

        var servicesStatus = new Dictionary<string, bool>
        {
            { "gateway", isGatewayUp },
            { "frontend", isFrontendUp },
            { "backend", true }, // Le backend fonctionne puisqu'il exécute ce code
            { "database", isDbUp }
        };

        var prometheusAvailable =
            await _prometheusService.IsAvailableAsync(
                cancellationToken);

        if (!prometheusAvailable)
        {
            return new MonitoringOverview
            {
                Status = MonitoringStatus.Unknown,
                PrometheusAvailable = false,
                MonitoredTargets = 0,
                HealthyTargets = 0,
                UnhealthyTargets = 0,
                ErrorRate = 0,
                AverageResponseTime = 0,
                Timestamp = timestamp,
                Services = servicesStatus
            };
        }

        try
        {
            var result = await _prometheusService.QueryAsync(
                "up",
                cancellationToken);

            var targets = result.Data?.Result ?? [];

            var monitoredTargets = targets.Count;

            var healthyTargets = targets.Count(target =>
                target.Value.Count >= 2 &&
                target.Value[1].GetString() == "1");

            var unhealthyTargets =
                monitoredTargets - healthyTargets;

            var status = DetermineStatus(
                monitoredTargets,
                healthyTargets);

            // Si un service critique (BDD ou Gateway) est down, on rétrograde le statut global
            if (!isDbUp || !isGatewayUp)
            {
                status = MonitoringStatus.Degraded;
            }

            return new MonitoringOverview
            {
                Status = status,
                PrometheusAvailable = true,
                MonitoredTargets = monitoredTargets,
                HealthyTargets = healthyTargets,
                UnhealthyTargets = unhealthyTargets,
                ErrorRate = 0,
                AverageResponseTime = 0,
                Timestamp = timestamp,
                Services = servicesStatus
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Unable to build monitoring overview.");

            return new MonitoringOverview
            {
                Status = MonitoringStatus.Unknown,
                PrometheusAvailable = true,
                Timestamp = timestamp,
                Services = servicesStatus
            };
        }
    }

    private async Task<bool> CheckTcpServiceAsync(string host, int port, CancellationToken cancellationToken)
    {
        try
        {
            using var tcpClient = new TcpClient();
            using var cts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
            cts.CancelAfter(TimeSpan.FromSeconds(2));

            await tcpClient.ConnectAsync(host, port, cts.Token);
            return tcpClient.Connected;
        }
        catch
        {
            return false;
        }
    }

    private async Task<bool> CheckHttpServiceAsync(string url, CancellationToken cancellationToken)
    {
        try
        {
            var client = _httpClientFactory.CreateClient();
            client.Timeout = TimeSpan.FromSeconds(2);
            var response = await client.GetAsync(url, cancellationToken);
            return response.IsSuccessStatusCode || ((int)response.StatusCode < 500);
        }
        catch
        {
            return false;
        }
    }

    private static MonitoringStatus DetermineStatus(
        int total,
        int healthy)
    {
        if (total == 0)
            return MonitoringStatus.Unknown;

        if (healthy == total)
            return MonitoringStatus.Healthy;

        if (healthy == 0)
            return MonitoringStatus.Critical;

        return MonitoringStatus.Degraded;
    }
}