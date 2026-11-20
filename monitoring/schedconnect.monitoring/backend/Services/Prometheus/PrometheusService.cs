using System.Text.Json;

using Microsoft.Extensions.Options;

using SchedConnect.Monitoring.Configuration;
using SchedConnect.Monitoring.Models.Prometheus;

namespace SchedConnect.Monitoring.Services.Prometheus;

public class PrometheusService : IPrometheusService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<PrometheusService> _logger;

    public PrometheusService(
        HttpClient httpClient,
        IOptions<PrometheusOptions> options,
        ILogger<PrometheusService> logger)
    {
        _httpClient = httpClient;
        _logger = logger;

        _httpClient.BaseAddress =
            new Uri(
                options.Value.Url.TrimEnd('/') + "/");
    }

    public async Task<PrometheusResponse<PrometheusQueryData>>
        QueryAsync(
            string query,
            CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(query))
        {
            throw new ArgumentException(
                "Prometheus query cannot be empty.",
                nameof(query));
        }

        var encodedQuery =
            Uri.EscapeDataString(query);

        var url =
            $"api/v1/query?query={encodedQuery}";

        try
        {
            var response =
                await _httpClient.GetAsync(
                    url,
                    cancellationToken);

            var content =
                await response.Content.ReadAsStringAsync(
                    cancellationToken);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError(
                    "Prometheus query failed. " +
                    "StatusCode: {StatusCode}, Response: {Response}",
                    response.StatusCode,
                    content);

                throw new HttpRequestException(
                    $"Prometheus returned {(int)response.StatusCode}.");
            }

            var result =
                JsonSerializer.Deserialize<
                    PrometheusResponse<PrometheusQueryData>
                >(content);

            if (result is null)
            {
                throw new InvalidOperationException(
                    "Prometheus returned an invalid response.");
            }

            if (!string.Equals(
                    result.Status,
                    "success",
                    StringComparison.OrdinalIgnoreCase))
            {
                throw new InvalidOperationException(
                    $"Prometheus query failed: {result.Error}");
            }

            return result;
        }
        catch (OperationCanceledException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Error while executing Prometheus query.");

            throw;
        }
    }

    public async Task<PrometheusResponse<PrometheusQueryData>>
        QueryRangeAsync(
            string query,
            DateTime start,
            DateTime end,
            TimeSpan step,
            CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(query))
        {
            throw new ArgumentException(
                "Prometheus query cannot be empty.",
                nameof(query));
        }

        if (start >= end)
        {
            throw new ArgumentException(
                "The start time must be earlier than the end time.");
        }

        if (step <= TimeSpan.Zero)
        {
            throw new ArgumentException(
                "The step must be greater than zero.",
                nameof(step));
        }

        var startTimestamp =
            new DateTimeOffset(
                start.ToUniversalTime())
            .ToUnixTimeSeconds();

        var endTimestamp =
            new DateTimeOffset(
                end.ToUniversalTime())
            .ToUnixTimeSeconds();

        var stepSeconds =
            step.TotalSeconds.ToString(
                "0.###",
                System.Globalization.CultureInfo.InvariantCulture);

        var encodedQuery =
            Uri.EscapeDataString(query);

        var url =
            $"api/v1/query_range" +
            $"?query={encodedQuery}" +
            $"&start={startTimestamp}" +
            $"&end={endTimestamp}" +
            $"&step={stepSeconds}";

        try
        {
            var response =
                await _httpClient.GetAsync(
                    url,
                    cancellationToken);

            var content =
                await response.Content.ReadAsStringAsync(
                    cancellationToken);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError(
                    "Prometheus range query failed. " +
                    "StatusCode: {StatusCode}, Response: {Response}",
                    response.StatusCode,
                    content);

                throw new HttpRequestException(
                    $"Prometheus returned {(int)response.StatusCode}.");
            }

            var result =
                JsonSerializer.Deserialize<
                    PrometheusResponse<PrometheusQueryData>
                >(content);

            if (result is null)
            {
                throw new InvalidOperationException(
                    "Prometheus returned an invalid range query response.");
            }

            if (!string.Equals(
                    result.Status,
                    "success",
                    StringComparison.OrdinalIgnoreCase))
            {
                throw new InvalidOperationException(
                    $"Prometheus range query failed: {result.Error}");
            }

            return result;
        }
        catch (OperationCanceledException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Error while executing Prometheus range query.");

            throw;
        }
    }

    public async Task<bool> IsAvailableAsync(
        CancellationToken cancellationToken = default)
    {
        try
        {
            var response =
                await _httpClient.GetAsync(
                    "api/v1/query?query=up",
                    cancellationToken);

            return response.IsSuccessStatusCode;
        }
        catch (OperationCanceledException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(
                ex,
                "Prometheus is currently unavailable.");

            return false;
        }
    }
}