import type { EndpointMetric } from "../../types/metrics";

interface EndpointTableProps {
  endpoints: EndpointMetric[];
}

export default function EndpointTable({
  endpoints,
}: EndpointTableProps) {
  return (
    <div className="card border border-base-300 bg-base-100 shadow-sm">
      <div className="card-body p-0">

        <div className="flex items-center justify-between border-b border-base-300 p-5">
          <div>
            <h3 className="text-sm font-semibold">
              Endpoint performance
            </h3>

            <p className="mt-1 text-[10px] text-base-content/50">
              Performance observée sur les 5 dernières minutes
            </p>
          </div>

          <span className="badge badge-ghost">
            {endpoints.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="table table-sm">
            <thead>
              <tr>
                <th>Endpoint</th>
                <th>Method</th>
                <th>Requests/s</th>
                <th>Errors</th>
                <th>Average</th>
                <th>P95</th>
              </tr>
            </thead>

            <tbody>
              {endpoints.map((endpoint) => (
                <tr
                  key={`${endpoint.method}-${endpoint.endpoint}-${endpoint.action}`}
                >
                  <td>
                    <div>
                      <div className="font-mono text-xs">
                        {endpoint.endpoint}
                      </div>

                      <div className="text-[9px] text-base-content/40">
                        {endpoint.controller}
                        {" / "}
                        {endpoint.action}
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="badge badge-primary badge-outline badge-sm">
                      {endpoint.method}
                    </span>
                  </td>

                  <td>
                    {endpoint.requestsPerSecond.toFixed(2)}
                  </td>

                  <td>
                    <span
                      className={
                        endpoint.errorRate > 10
                          ? "text-error"
                          : endpoint.errorRate > 5
                            ? "text-warning"
                            : "text-success"
                      }
                    >
                      {endpoint.errorRate.toFixed(2)}%
                    </span>
                  </td>

                  <td>
                    {endpoint.averageResponseTimeMs.toFixed(1)}
                    {" ms"}
                  </td>

                  <td>
                    {endpoint.p95ResponseTimeMs.toFixed(1)}
                    {" ms"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}