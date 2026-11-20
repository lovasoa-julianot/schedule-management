import { useEffect, useState } from "react";
import api from "../hooks/api";
import { Loader } from "./spin/Spinner";
import { FiChevronDown, FiLogOut, FiBell, FiMenu } from "react-icons/fi";

const LogoutLoadingModal = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-[90%] max-w-sm text-center border border-slate-100">
        <div className="flex justify-center mb-4">
          <Loader size="lg" color="indigo" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
          Déconnexion en cours…
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Veuillez patienter quelques instants.
        </p>
      </div>
    </div>
  );
};

const TopBar = ({ setIsAuthenticated, onToggleSidebar }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [user, setUser] = useState(null);
  const [id, setId] = useState("");
  const [role, setRole] = useState("");
  const [isLoginOut, setIsLoginOut] = useState(false);

  useEffect(() => {
    api
      .get("/user/profile")
      .then((res) => {
        setId(res.data.userId);
        setRole(res.data.userRole);
      })
      .catch((err) => console.error("Erreur de recuperation: ", err));
  }, []);

  const getUser = (key) => {
    api
      .get(`/user/info?id=${key}&role=${role}`)
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => console.error("Erreur de recuperation: ", err));
  };

  useEffect(() => {
    if (id && role) {
      getUser(id);
    }
  }, [id, role]);

  const handleLogout = async () => {
    setShowDropdown(false);
    setIsLoginOut(true);
    setTimeout(async () => {
      try {
        await api.post("/user/logout", role, {
          headers: { "Content-Type": "application/json" },
        });
        setIsAuthenticated(false);
      } catch (err) {
        console.error(
          "Erreur lors de la déconnexion :",
          err.response?.data || err.message,
        );
      } finally {
        setIsLoginOut(false);
      }
    }, 2000);
  };

  const userData = user ? user[0] : null;

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-xs border-b border-slate-100 fixed top-0 right-0 left-0 sm:left-64 z-30 h-16 transition-all">
      <LogoutLoadingModal isOpen={isLoginOut} />

      <div className="h-full px-4 sm:px-6 flex items-center justify-between">
        {/* Partie Gauche : Bouton Hamburger Mobile & Logo */}
        <div className="flex items-center space-x-3">
          {/* Bouton Hamburger pour déclencher l'ouverture/fermeture du Navbar */}
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors sm:hidden focus:outline-none cursor-pointer"
            aria-label="Ouvrir le menu"
          >
            <FiMenu className="w-5 h-5" />
          </button>

          <h1 className="text-lg font-extrabold text-slate-900 tracking-tight sm:hidden">
            Sched<span className="text-blue-600">Connect</span>
          </h1>
        </div>

        {/* Partie Droite : Notifications & Profil Utilisateur */}
        <div className="flex items-center space-x-3 sm:space-x-4 relative ml-auto">
          {/* Cloche de Notification */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowDropdown(false);
              }}
              className="p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors relative focus:outline-none cursor-pointer"
              aria-label="Notifications"
            >
              <FiBell className="w-5 h-5" />
              {/* Badge indicateur de notification */}
              <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white"></span>
            </button>

            {/* Dropdown des Notifications */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-slate-100 rounded-2xl shadow-xl z-40 overflow-hidden py-2 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Notifications
                  </span>
                  <span className="text-[10px] bg-blue-50 text-blue-600 font-semibold px-2 py-0.5 rounded-full">
                    1 non lue
                  </span>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-slate-50">
                  <div className="px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer">
                    <p className="text-xs font-semibold text-slate-800">
                      Mise à jour du planning
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Un cours a été modifié pour la salle 102.
                    </p>
                    <span className="text-[9px] text-slate-400 mt-1 block">
                      Il y a 10 minutes
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profil utilisateur & Menu déroulant */}
          <div className="relative">
            <button
              onClick={() => {
                setShowDropdown(!showDropdown);
                setShowNotifications(false);
              }}
              className="flex items-center gap-3 py-1.5 px-3 rounded-xl hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer border border-transparent"
            >
              <img
                className="h-9 w-9 rounded-xl object-cover border-2 border-slate-200 bg-slate-100 shrink-0 shadow-sm"
                src={
                  userData?.photo ||
                  `https://ui-avatars.com/api/?name=${userData?.prenom || userData?.email || "User"}+${userData?.nom || ""}&background=2563eb&color=fff`
                }
                alt="Avatar"
              />

              {userData ? (
                <div className="hidden sm:flex flex-col items-start leading-tight">
                  <span className="text-sm font-bold text-slate-800">
                    {userData.nom
                      ? `${userData.nom} ${userData.prenom || ""}`
                      : userData.email}
                  </span>
                  <span className="text-xs font-medium text-slate-500 capitalize mt-0.5">
                    {userData.role || role || "Utilisateur"}
                  </span>
                </div>
              ) : (
                <div className="w-24 h-4 bg-slate-200 rounded animate-pulse"></div>
              )}

              <FiChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${showDropdown ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown Menu Profil */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-100 rounded-2xl shadow-xl z-40 overflow-hidden py-1.5 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-2 border-b border-slate-100 sm:hidden">
                  <p className="text-xs font-bold text-slate-800 truncate">
                    {userData?.email || "Connecté"}
                  </p>
                  <p className="text-[11px] text-slate-400 capitalize">
                    {userData?.role || role}
                  </p>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 text-left px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50/60 transition-colors cursor-pointer"
                >
                  <FiLogOut className="w-4 h-4" />
                  Se déconnecter
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
