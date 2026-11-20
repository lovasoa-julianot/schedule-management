import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Link, useLocation } from "react-router-dom";
import api from "../../hooks/api";
import Logo from "../../assets/calendar.png";
import Office from "../../assets/espace-de-travail.png";
import { Mail, Lock, ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [emailVerified, setEmailVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get("type");
    setIsFirstLogin(type === "first-login");
  }, [location]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleVerifyEmail = async (e) => {
    e.preventDefault();

    if (!form.email) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Veuillez saisir votre email !",
        backdrop: "rgba(0,0,0,0.4)",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Veuillez saisir un email valide !",
        backdrop: "rgba(0,0,0,0.4)",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/verify", {
        email: form.email,
      });

      if (response.data.success) {
        setEmailVerified(true);
        if (isFirstLogin) {
          Swal.fire({
            icon: "success",
            title: "Email vérifié",
            text: "Bienvenue ! Veuillez créer votre mot de passe pour activer votre compte.",
            backdrop: "rgba(0,0,0,0.4)",
          });
        } else {
          Swal.fire({
            icon: "success",
            title: "Email vérifié",
            text: `Ravis de vous voir ${response.data.user.name || ""}, vous pouvez maintenant réinitialiser votre mot de passe.`,
            backdrop: "rgba(0,0,0,0.4)",
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Email non trouvé",
          text:
            response.data.message ||
            "Cet email n'existe pas dans notre système.",
          backdrop: "rgba(0,0,0,0.4)",
        });
      }
    } catch (error) {
      let errorMessage = "Erreur lors de la vérification de l'email";
      if (error.response?.status === 404) {
        errorMessage = "Cet email n'existe pas dans notre système.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: errorMessage,
        backdrop: "rgba(0,0,0,0.4)",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!form.password || form.password.length < 6) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Le mot de passe doit contenir au moins 6 caractères !",
        backdrop: "rgba(0,0,0,0.4)",
      });
      return;
    }

    if (form.password !== form.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Les mots de passe ne correspondent pas !",
        backdrop: "rgba(0,0,0,0.4)",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/reset-password", {
        email: form.email,
        password: form.password,
        password_confirmation: form.confirmPassword,
      });

      if (response.data.success) {
        if (isFirstLogin) {
          Swal.fire({
            icon: "success",
            title: "Compte activé !",
            text: "Votre compte a été activé avec succès. Vous pouvez maintenant vous connecter.",
            backdrop: "rgba(0,0,0,0.4)",
          }).then(() => {
            window.location.href = "/login";
          });
        } else {
          Swal.fire({
            icon: "success",
            title: "Succès",
            text: "Votre mot de passe a été réinitialisé avec succès !",
            backdrop: "rgba(0,0,0,0.4)",
          }).then(() => {
            window.location.href = "/login";
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: response.data.message || "Erreur lors de la réinitialisation",
          backdrop: "rgba(0,0,0,0.4)",
        });
      }
    } catch (error) {
      let errorMessage = "Erreur lors de la réinitialisation";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        const errors = Object.values(error.response.data.errors).flat();
        errorMessage = errors.join(", ");
      }

      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: errorMessage,
        backdrop: "rgba(0,0,0,0.4)",
      });
    } finally {
      setLoading(false);
    }
  };

  const pageTitle = isFirstLogin ? "Activation de compte" : "Réinitialisation";

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 px-4">
      <div className="flex w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100">
        {/* Formulaire GAUCHE */}
        <div className="flex w-full md:w-1/2 items-center justify-center p-8 sm:p-12">
          <div className="w-full max-w-md">
            <div className="flex flex-col items-center mb-6">
              <img
                src={Logo}
                alt="SchedConnect"
                className="w-16 h-16 mb-2 object-contain"
              />
              <span className="text-slate-900 font-extrabold text-2xl tracking-tight">
                Sched<span className="text-blue-600">Connect</span>
              </span>
              <h2 className="text-sm font-semibold text-slate-500 mt-2">
                {pageTitle}
              </h2>
            </div>

            {!emailVerified ? (
              <form onSubmit={handleVerifyEmail} className="space-y-4">
                <div>
                  <label className="block mb-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Adresse Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="bg-slate-50/50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 block w-full ps-10 p-3 transition-all"
                      placeholder="exemple@gmail.com"
                    />
                  </div>
                </div>

                <div className="p-3.5 bg-blue-50/60 border border-blue-100 rounded-2xl">
                  <p className="text-xs text-blue-700 leading-relaxed">
                    <span className="font-bold">Information : </span>
                    {isFirstLogin
                      ? "Saisissez l'email fourni par votre administrateur pour activer votre accès."
                      : "Saisissez votre email enregistré pour recevoir les instructions de réinitialisation."}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full text-white font-semibold bg-blue-600 hover:bg-blue-700 rounded-xl text-sm py-3 text-center shadow-lg shadow-blue-600/30 transition cursor-pointer disabled:opacity-50"
                >
                  {loading
                    ? "Vérification..."
                    : isFirstLogin
                      ? "Vérifier mon compte"
                      : "Vérifier mon email"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block mb-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Adresse Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      disabled
                      className="bg-slate-100 border border-slate-200 text-slate-500 text-sm rounded-xl block w-full ps-10 p-3 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {isFirstLogin
                      ? "Créer un mot de passe"
                      : "Nouveau mot de passe"}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      disabled={loading}
                      required
                      placeholder="••••••••"
                      className="bg-slate-50/50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 block w-full ps-10 p-3 transition-all"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Minimum 6 caractères
                  </p>
                </div>

                <div>
                  <label className="block mb-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      disabled={loading}
                      required
                      placeholder="••••••••"
                      className="bg-slate-50/50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 block w-full ps-10 p-3 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full text-white font-semibold bg-blue-600 hover:bg-blue-700 rounded-xl text-sm py-3 text-center shadow-lg shadow-blue-600/30 transition cursor-pointer disabled:opacity-50"
                >
                  {loading
                    ? "Traitement..."
                    : isFirstLogin
                      ? "Activer mon compte"
                      : "Réinitialiser"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEmailVerified(false);
                    setForm({ email: "", password: "", confirmPassword: "" });
                  }}
                  disabled={loading}
                  className="w-full py-2.5 border border-slate-200 text-slate-600 font-semibold text-sm rounded-xl hover:bg-slate-50 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Retour
                </button>
              </form>
            )}

            <p className="mt-6 text-center text-xs text-slate-500">
              {isFirstLogin ? "Déjà un compte ? " : "Retour à la "}
              <Link
                to="/login"
                className="text-blue-600 font-semibold hover:underline"
              >
                {isFirstLogin ? "Se connecter" : "Page de connexion"}
              </Link>
            </p>
          </div>
        </div>

        {/* Visuel DROITE */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-slate-900 to-[#0f172a] relative justify-center items-center p-12">
          <div className="absolute inset-0 bg-blue-600/10 backdrop-blur-3xl"></div>
          <div className="relative z-10 flex flex-col items-center text-center">
            <img
              src={Office}
              alt="Workspace"
              className="w-64 h-64 object-contain drop-shadow-2xl mb-6"
            />
            <h3 className="text-white font-bold text-lg">
              Sécurité et Accès Simplifiés
            </h3>
            <p className="text-slate-400 text-xs mt-2 max-w-xs">
              Gérez l'activation de vos accès administratifs et récupérez votre
              compte en toute sécurité.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
