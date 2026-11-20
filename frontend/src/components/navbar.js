import { FiCalendar, FiUser } from "react-icons/fi";
import {
  MdPerson,
  MdMenuBook,
  MdMeetingRoom,
  MdAnalytics,
  MdSettings,
  MdBarChart,
  MdExpandMore,
  MdGroup,
} from "react-icons/md";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import nProgress from "nprogress";
import "nprogress/nprogress.css";
import api from "../hooks/api";
import { can } from "../hooks/permission";

const Navbar = ({ isOpen, onClose }) => {
  const [openStats, setOpenStats] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);

  // Récupération de l'état actif initial depuis le localStorage si disponible
  const [active, setActive] = useState(() => {
    return localStorage.getItem("menuActive") || "Dashboard";
  });

  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState("Dashboard");
  const [role, setRole] = useState("");

  useEffect(() => {
    document.title = `SchedConnect | ${currentPage}`;
    api
      .get("/user/profile")
      .then((rep) => {
        if (rep.data.userRole === "Responsable_planning") {
          setRole("secretary");
        } else if (rep.data.userRole === "Admin") {
          setRole("admin");
        } else {
          setRole("");
        }
      })
      .catch(() => {
        setRole("");
      });
  }, [currentPage]);

  const menuClick = (menu, path) => {
    setActive(menu);
    localStorage.setItem("menuActive", menu);
    nProgress.start();
    setCurrentPage(menu);
    if (onClose) onClose(); // Ferme le menu sur mobile après clic
    setTimeout(() => {
      nProgress.done();
      navigate(path);
    }, 500);
  };

  return (
    <>
      {/* Overlay sombre pour mobile quand le menu est ouvert */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-xs sm:hidden transition-opacity"
        />
      )}

      <aside
        id="separator-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform duration-300 ease-in-out border-r border-slate-800 bg-[#0f172a] shadow-xl ${
          isOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
        }`}
        aria-label="Sidebar"
      >
        <div className="h-full px-4 py-6 overflow-y-auto flex flex-col justify-between bg-[#0f172a]">
          <nav className="space-y-6">
            {/* Logo / En-tête de la Sidebar */}
            <div className="px-3 pt-2 pb-4 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xl font-extrabold tracking-tight text-white">
                Sched<span className="text-blue-500">Connect</span>
              </span>
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></div>
            </div>

            {/* Section Accueil */}
            <div>
              <h4 className="text-[11px] font-bold px-3 text-slate-400 uppercase tracking-wider mb-2">
                Accueil
              </h4>
              <ul className="space-y-1">
                <li>
                  <Link
                    onClick={() => menuClick("Dashboard", "/dashboard")}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                      active === "Dashboard"
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                        : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                    }`}
                  >
                    <MdAnalytics
                      className={`w-5 h-5 ${active === "Dashboard" ? "text-white" : "text-slate-400"}`}
                    />
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            {/* Section Gestion */}
            <div>
              <h4 className="text-[11px] font-bold px-3 text-slate-400 uppercase tracking-wider mb-2">
                Gestion
              </h4>
              <ul className="space-y-1">
                <li>
                  <Link
                    onClick={() => menuClick("Enseignant", "/enseignant")}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                      active === "Enseignant"
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                        : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                    }`}
                  >
                    <MdGroup
                      className={`w-5 h-5 ${active === "Enseignant" ? "text-white" : "text-slate-400"}`}
                    />
                    Enseignants
                  </Link>
                </li>
                <li>
                  <Link
                    onClick={() => menuClick("Matiere", "/matiere")}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                      active === "Matiere"
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                        : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                    }`}
                  >
                    <MdMenuBook
                      className={`w-5 h-5 ${active === "Matiere" ? "text-white" : "text-slate-400"}`}
                    />
                    Matières
                  </Link>
                </li>
                <li>
                  <Link
                    onClick={() => menuClick("Salle", "/salle")}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                      active === "Salle"
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                        : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                    }`}
                  >
                    <MdMeetingRoom
                      className={`w-5 h-5 ${active === "Salle" ? "text-white" : "text-slate-400"}`}
                    />
                    Salles
                  </Link>
                </li>
                <li>
                  <Link
                    onClick={() => menuClick("Planning", "/planning")}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                      active === "Planning"
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                        : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                    }`}
                  >
                    <FiCalendar
                      className={`w-5 h-5 ${active === "Planning" ? "text-white" : "text-slate-400"}`}
                    />
                    Calendrier
                  </Link>
                </li>

                {/* Menu Statistiques avec Accordéon */}
                <li>
                  <button
                    onClick={() => setOpenStats(!openStats)}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-sm text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <MdBarChart className="w-5 h-5 text-slate-400" />
                      <span>Statistiques</span>
                    </div>
                    <MdExpandMore
                      className={`w-4 h-4 text-slate-400 transform transition-transform duration-200 ${
                        openStats ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </button>

                  {openStats && (
                    <ul className="ml-9 mt-1 space-y-1 text-sm border-l-2 border-slate-800 pl-3">
                      <li>
                        <Link
                          onClick={() =>
                            menuClick(
                              "Disponibilite",
                              "/statistique/disponibilite",
                            )
                          }
                          className={`block py-1.5 px-2 rounded-lg font-medium transition-colors ${
                            active === "Disponibilite"
                              ? "text-blue-400 font-bold"
                              : "text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          Disponibilité
                        </Link>
                      </li>
                      <li>
                        <Link
                          onClick={() =>
                            menuClick(
                              "Heures",
                              "/statistique/heures-enseignants",
                            )
                          }
                          className={`block py-1.5 px-2 rounded-lg font-medium transition-colors ${
                            active === "Heures"
                              ? "text-blue-400 font-bold"
                              : "text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          Heures enseignants
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>

                {can(role, "profil") && (
                  <li>
                    <Link
                      onClick={() => menuClick("Profile", "/profile")}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                        active === "Profile"
                          ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                          : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                      }`}
                    >
                      <FiUser
                        className={`w-5 h-5 ${active === "Profile" ? "text-white" : "text-slate-400"}`}
                      />
                      Profil
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            {/* Section Administration */}
            {can(role, "user") && (
              <div>
                <h4 className="text-[11px] font-bold px-3 text-slate-400 uppercase tracking-wider mb-2">
                  Administration
                </h4>
                <ul className="space-y-1">
                  <li>
                    <Link
                      onClick={() => menuClick("users", "/users")}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                        active === "users"
                          ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                          : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                      }`}
                    >
                      <MdPerson
                        className={`w-5 h-5 ${active === "users" ? "text-white" : "text-slate-400"}`}
                      />
                      Utilisateurs
                    </Link>
                  </li>

                  <li>
                    <button
                      onClick={() => setOpenSettings(!openSettings)}
                      className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-sm text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <MdSettings className="w-5 h-5 text-slate-400" />
                        <span>Paramètres</span>
                      </div>
                      <MdExpandMore
                        className={`w-4 h-4 text-slate-400 transform transition-transform duration-200 ${
                          openSettings ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </button>

                    {openSettings && (
                      <ul className="ml-9 mt-1 space-y-1 text-sm border-l-2 border-slate-800 pl-3">
                        <li>
                          <Link
                            onClick={() =>
                              menuClick("ParamProfile", "/parametre/profile")
                            }
                            className={`block py-1.5 px-2 rounded-lg font-medium transition-colors ${
                              active === "ParamProfile"
                                ? "text-blue-400 font-bold"
                                : "text-slate-400 hover:text-slate-200"
                            }`}
                          >
                            Profil
                          </Link>
                        </li>
                        <li>
                          <Link
                            onClick={() =>
                              menuClick("Curcus", "/parametre/curcus")
                            }
                            className={`block py-1.5 px-2 rounded-lg font-medium transition-colors ${
                              active === "Curcus"
                                ? "text-blue-400 font-bold"
                                : "text-slate-400 hover:text-slate-200"
                            }`}
                          >
                            Cursus
                          </Link>
                        </li>
                      </ul>
                    )}
                  </li>
                </ul>
              </div>
            )}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
