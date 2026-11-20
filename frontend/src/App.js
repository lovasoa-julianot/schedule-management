import Planning from "./components/planning";
import Navbar from "./components/navbar";
import TopBar from "./components/topbar";
import Teacher from "./components/teacher";
import ClassRoom from "./components/class";
import Subject from "./components/subject";
import Messagerie from "./components/message";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./components/auth/login";
import Dashboard from "./components/dashboard";
import Register from "./components/auth/register";
import Disponibility from "./components/statistics/disponibility";
import TeacherHour from "./components/statistics/teacherHour";
import Week from "./components/statistics/week";
import Profil from "./components/settings/profil";
import Sector from "./components/settings/sector";
import api from "./hooks/api";
import ForgotPassword from "./components/auth/forgetPassword";
import Users from "./components/users";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // État pour contrôler l'ouverture/fermeture de la Navbar sur mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    api
      .get("/user/profile")
      .then((rep) => {
        if (rep.data) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch((error) => {
        console.error("Erreur vérification authentification :", error.message);
        setIsAuthenticated(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50 text-slate-500 font-medium">
        Chargement de SchedConnect...
      </div>
    );
  }

  return (
    <div className="App min-h-screen bg-slate-50 text-slate-800 antialiased">
      <Router>
        {isAuthenticated ? (
          <div className="min-h-screen bg-slate-50">
            {/* Navbar (Sidebar) avec gestion de l'état mobile */}
            <Navbar
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              setLoading={setLoading}
            />

            {/* TopBar avec le déclencheur du menu hamburger */}
            <TopBar
              setIsAuthenticated={setIsAuthenticated}
              onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            />

            {/* Zone de contenu principale décalée pour éviter les chevauchements */}
            <div className="sm:ml-64 min-h-screen flex flex-col bg-slate-50">
              <main className="flex-1 pt-24 px-6 pb-12">
                <Routes>
                  <Route
                    path="/"
                    element={<Navigate to="/dashboard" replace />}
                  />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/enseignant" element={<Teacher />} />
                  <Route path="/planning" element={<Planning />} />
                  <Route path="/salle" element={<ClassRoom />} />
                  <Route path="/matiere" element={<Subject />} />
                  <Route path="/messagerie" element={<Messagerie />} />
                  <Route
                    path="/statistique/disponibilite"
                    element={<Disponibility />}
                  />
                  <Route
                    path="/statistique/heures-enseignants"
                    element={<TeacherHour />}
                  />
                  <Route path="/statistique/semaine" element={<Week />} />
                  <Route path="/parametre/profile" element={<Profil />} />
                  <Route path="/profile" element={<Profil />} />
                  <Route path="/parametre/curcus" element={<Sector />} />
                  <Route path="/users" element={<Users />} />
                  <Route
                    path="*"
                    element={<Navigate to="/dashboard" replace />}
                  />
                </Routes>
              </main>
            </div>
          </div>
        ) : (
          <Routes>
            <Route
              path="/login"
              element={<Login setIsAuthentificated={setIsAuthenticated} />}
            />
            <Route path="/forgotPassword" element={<ForgotPassword />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        )}
      </Router>
    </div>
  );
}

export default App;
