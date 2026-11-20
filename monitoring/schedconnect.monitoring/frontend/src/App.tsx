import { BrowserRouter, Routes, Route } from "react-router-dom";

import AppLayout from "./components/layout/AppLayout";

import DashboardPage from "./pages/DashboardPage";
import MetricsPage from "./pages/MetricsPage";
import AlertsPage from "./pages/AlertsPage";
import IncidentsPage from "./pages/IncidentsPage";
import AIAnalysisPage from "./pages/AIAnalysisPage";
// import MetricsPage from "./pages/MetricsPage";
// import AlertsPage from "./pages/AlertsPage";
// import IncidentsPage from "./pages/IncidentsPage";
// import AIAnalysisPage from "./pages/AIAnalysisPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />

          <Route path="/metrics" element={<MetricsPage />} />

          <Route path="/alerts" element={<AlertsPage />} />

          <Route path="/incidents" element={<IncidentsPage />} />

          <Route path="/ai" element={<AIAnalysisPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
