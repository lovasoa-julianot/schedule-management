using SchedConnect.Monitoring.Models.Prometheus;

namespace SchedConnect.Monitoring.Services.Prometheus;

public interface IPrometheusService
{
    Task<PrometheusResponse<PrometheusQueryData>> QueryAsync(
        string query,
        CancellationToken cancellationToken = default);

    Task<PrometheusResponse<PrometheusQueryData>> QueryRangeAsync(
        string query,
        DateTime start,
        DateTime end,
        TimeSpan step,
        CancellationToken cancellationToken = default);

    Task<bool> IsAvailableAsync(
        CancellationToken cancellationToken = default);
}