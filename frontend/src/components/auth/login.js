import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/calendar.png";
import Office from "../../assets/espace-de-travail.png";
import { useEffect, useState } from "react";
import { XCircle, Mail, Lock } from "lucide-react";
import api from "../../hooks/api";

const Login = ({ setIsAuthentificated }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState({
    email: "",
    mdp: "",
    client: "web",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Connexion - SchedConnect";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const rep = await api.post("/user/login", user);
      if (rep.data) {
        setTimeout(() => {
          setIsAuthentificated(true);
          navigate("/dashboard");
          setLoading(false);
        }, 1500);
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data);
        setShowAlert(true);
      } else {
        setError(err.message);
        setShowAlert(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 px-4">
      {/* Modal d'erreur */}
      {showAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-[90%] max-w-sm text-center border border-slate-100">
            <div className="flex justify-center mb-4">
              <div className="bg-rose-50 p-3 rounded-2xl">
                <XCircle className="text-rose-600 w-8 h-8" />
              </div>
            </div>

            <h2 className="text-lg font-bold text-slate-900 tracking-tight mb-1">
              Erreur de connexion
            </h2>

            <p className="text-sm text-slate-500 mb-6">
              {typeof error === "string"
                ? error
                : "Identifiants incorrects ou erreur serveur."}
            </p>

            <button
              onClick={() => setShowAlert(false)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-600/30 transition cursor-pointer"
            >
              Compris
            </button>
          </div>
        </div>
      )}

      {/* Conteneur principal de la carte de connexion */}
      <div className="flex w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100">
        <div className="flex w-full md:w-1/2 items-center justify-center p-8 sm:p-12">
          <div className="w-full max-w-md">
            <div className="flex flex-col items-center mb-8">
              <img
                src={Logo}
                alt="SchedConnect"
                className="w-20 h-20 mb-3 object-contain"
              />
              <span className="text-slate-900 font-extrabold text-2xl tracking-tight">
                Sched<span className="text-blue-600">Connect</span>
              </span>
              <p className="text-xs text-slate-400 mt-1">
                Connectez-vous pour accéder à votre espace
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                    required
                    className="bg-slate-50/50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 block w-full ps-10 p-3 transition-all"
                    placeholder="exemple@gmail.com"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    name="mdp"
                    value={user.mdp}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className="bg-slate-50/50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 block w-full ps-10 p-3 transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <Link
                  to="/forgotPassword"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Mot de passe oublié ?
                </Link>
                {/* À la place du lien "Créer un compte" dans Login.jsx */}
                <p className="text-center text-xs text-slate-500 mt-4">
                  Premier accès ?{" "}
                  <Link
                    to="/forgotPassword?type=first-login"
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    Activer mon compte
                  </Link>
                </p>
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full mt-2 text-white font-semibold bg-blue-600 hover:bg-blue-700 rounded-xl text-sm py-3 text-center shadow-lg shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Connexion...</span>
                  </div>
                ) : (
                  <span>Se connecter</span>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Panneau illustratif droit (Masqué sur mobile) */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-slate-900 to-[#0f172a] relative justify-center items-center p-12">
          <div className="absolute inset-0 bg-blue-600/10 backdrop-blur-3xl"></div>
          <div className="relative z-10 flex flex-col items-center text-center">
            <img
              src={Office}
              alt="Workspace"
              className="w-64 h-64 object-contain drop-shadow-2xl mb-6"
            />
            <h3 className="text-white font-bold text-lg">
              Gérez vos plannings avec aisance
            </h3>
            <p className="text-slate-400 text-xs mt-2 max-w-xs">
              Optimisez l'organisation de vos cours, salles et enseignants en
              toute simplicité.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
