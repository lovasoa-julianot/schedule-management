import React, { useState } from "react";
import Logo from "../../assets/calendar.png";
import {
  FileWarning,
  CheckCircle2,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Briefcase,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../hooks/api";

const Register = () => {
  const [showInfo, setShowInfo] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    mdp: "",
    genre: "Homme",
    adresse: "",
    phone: "",
    fonction: "",
    confirmPassword: "",
    accepted: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.mdp !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      setShowAlert(true);
      return;
    }

    if (!formData.accepted) {
      setError("Vous devez accepter les conditions d'utilisation.");
      setShowAlert(true);
      return;
    }

    api
      .post("/user/responsable/register", formData)
      .then(() => {
        setShowInfo(true);
      })
      .catch((err) => {
        if (err.response) {
          setError(err.response.data);
          setShowAlert(true);
        } else {
          setError(err.message);
          setShowAlert(true);
        }
      });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 py-12 px-4 sm:px-6">
      {/* Modal Succès */}
      {showInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-[90%] max-w-sm text-center border border-slate-100">
            <div className="flex justify-center mb-4">
              <div className="bg-emerald-50 p-3 rounded-2xl">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              </div>
            </div>

            <h2 className="text-lg font-bold text-slate-900 tracking-tight mb-1">
              Compte créé avec succès
            </h2>

            <p className="text-sm text-slate-500 mb-6">
              Votre compte a été enregistré. Vous pouvez maintenant vous
              connecter.
            </p>

            <button
              onClick={() => {
                setShowInfo(false);
                navigate("/login");
              }}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-emerald-600/30 transition cursor-pointer"
            >
              Se connecter
            </button>
          </div>
        </div>
      )}

      {/* Modal Erreur */}
      {showAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-[90%] max-w-sm text-center border border-slate-100">
            <div className="flex justify-center mb-4">
              <div className="bg-rose-50 p-3 rounded-2xl">
                <FileWarning className="text-rose-600 w-8 h-8" />
              </div>
            </div>

            <h2 className="text-lg font-bold text-slate-900 tracking-tight mb-1">
              Erreur d'inscription
            </h2>

            <p className="text-sm text-slate-500 mb-6">
              {typeof error === "string"
                ? error
                : "Une erreur est survenue. Veuillez vérifier les champs."}
            </p>

            <button
              onClick={() => setShowAlert(false)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-600/30 transition cursor-pointer"
            >
              Réessayer
            </button>
          </div>
        </div>
      )}

      {/* En-tête Logo */}
      <div className="flex flex-col items-center mb-6">
        <img src={Logo} className="w-16 h-16 mb-2 object-contain" alt="Logo" />
        <span className="text-white font-extrabold text-2xl tracking-tight">
          Sched.<span className="text-blue-500">Connect</span>
        </span>
        <h2 className="text-sm font-medium text-slate-400 mt-1">
          Créer un compte responsable
        </h2>
      </div>

      {/* Formulaire complet */}
      <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl border border-slate-100">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
                Nom
              </label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                placeholder="Nom"
                required
                className="bg-slate-50/50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 block w-full p-3"
              />
            </div>
            <div>
              <label className="block mb-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
                Prénom
              </label>
              <input
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                placeholder="Prénom"
                required
                className="bg-slate-50/50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 block w-full p-3"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="exemple@email.com"
              required
              className="bg-slate-50/50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 block w-full p-3"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
                Mot de passe
              </label>
              <input
                type="password"
                name="mdp"
                value={formData.mdp}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="bg-slate-50/50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 block w-full p-3"
              />
            </div>
            <div>
              <label className="block mb-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
                Confirmation
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="bg-slate-50/50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 block w-full p-3"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <input
              id="accept"
              name="accepted"
              type="checkbox"
              checked={formData.accepted}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 bg-slate-50 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="accept" className="text-xs text-slate-600">
              J'accepte les{" "}
              <a href="#" className="text-blue-600 font-semibold underline">
                conditions d'utilisation
              </a>
            </label>
          </div>

          <button
            type="submit"
            className="w-full mt-4 text-white bg-blue-600 hover:bg-blue-700 font-semibold rounded-xl text-sm py-3 shadow-lg shadow-blue-600/30 transition cursor-pointer"
          >
            S'inscrire
          </button>

          <p className="text-center text-xs text-slate-500 mt-4">
            Déjà un compte ?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-semibold hover:underline"
            >
              Se connecter
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
