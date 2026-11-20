import { useEffect, useState } from "react";
import api from "../../hooks/api";
import {
  FiEdit2,
  FiCamera,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiLock,
  FiShield,
  FiCheck,
  FiX,
  FiKey,
} from "react-icons/fi";
import { Loader } from "../spin/Spinner";
import Swal from "sweetalert2";

const Avatar = ({ avatar, setAvatar }) => {
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setAvatar(preview);
  };

  return (
    <div className="relative group">
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
        id="avatar-upload"
      />
      <label htmlFor="avatar-upload" className="cursor-pointer block relative">
        <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden ring-4 ring-white shadow-md bg-indigo-50 flex items-center justify-center">
          {avatar ? (
            <img
              src={avatar}
              alt="Avatar"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <span className="text-2xl font-bold text-indigo-600">Avatar</span>
          )}
        </div>
        <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <FiCamera className="w-6 h-6 text-white" />
        </div>
      </label>
    </div>
  );
};

const TabButton = ({ label, icon: Icon, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
      active
        ? "bg-indigo-50 text-indigo-600 shadow-xs"
        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
    }`}
  >
    {Icon && <Icon className="w-4 h-4" />}
    {label}
  </button>
);

const InfosPersonnelles = ({ user }) => {
  const InfoCard = ({ icon: Icon, label, value }) => (
    <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 shadow-xs flex items-center justify-center text-indigo-600 shrink-0">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-sm font-bold text-slate-800 mt-0.5">
          {value ?? "—"}
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-900">
          Informations personnelles
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          Consultez les détails de votre profil enregistrés dans le système.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard icon={FiUser} label="Nom" value={user.nom} />
        <InfoCard icon={FiUser} label="Prénom" value={user.prenom} />
        <InfoCard
          icon={FiShield}
          label="Nom d'utilisateur"
          value={user.username}
        />
        <InfoCard icon={FiUser} label="Genre" value={user.genre} />
        <InfoCard icon={FiPhone} label="Téléphone" value={user.phone} />
        <InfoCard icon={FiMapPin} label="Adresse" value={user.adresse} />
      </div>
    </div>
  );
};

const Input = ({
  label,
  icon: Icon,
  editable = false,
  disabled = false,
  ...props
}) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
          <Icon className="w-4 h-4" />
        </div>
      )}
      <input
        {...props}
        disabled={disabled}
        className={`w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 text-sm text-slate-800 placeholder-slate-400
          focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all
          ${Icon ? "pl-10 pr-10" : "px-3.5 pr-10"}
          ${disabled ? "cursor-not-allowed bg-slate-100/70 text-slate-400" : "bg-white"}
        `}
      />
      {editable && !disabled && (
        <FiEdit2 className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
      )}
    </div>
  </div>
);

const Parametres = ({ formData, setFormData, onSave, onOpenPasswordModal }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSave();
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            Paramètres du compte
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Mettez à jour vos informations personnelles et sécurisez votre
            compte.
          </p>
        </div>

        {!isEditing ? (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-600 text-sm font-semibold hover:bg-indigo-100 transition-all cursor-pointer"
            >
              <FiEdit2 className="w-4 h-4" />
              Modifier mes infos
            </button>
            <button
              type="button"
              onClick={onOpenPasswordModal}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-all cursor-pointer"
            >
              <FiKey className="w-4 h-4 text-slate-500" />
              Changer le mot de passe
            </button>
          </div>
        ) : null}
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input label="Nom" name="nom" value={formData.nom || ""} disabled />
          <Input
            label="Prénom"
            name="prenom"
            disabled
            value={formData.prenom || ""}
          />
          <Input
            label="Nom d'utilisateur"
            name="username"
            icon={FiShield}
            value={formData.username ?? ""}
            onChange={handleChange}
            disabled={!isEditing}
            editable={isEditing}
          />
          <Input
            label="Téléphone"
            name="phone"
            icon={FiPhone}
            value={formData.phone || ""}
            onChange={handleChange}
            disabled={!isEditing}
            editable={isEditing}
          />
          <Input
            label="E-mail"
            name="email"
            icon={FiMail}
            value={formData.email || ""}
            disabled
          />
          <Input
            label="Adresse"
            name="adresse"
            icon={FiMapPin}
            value={formData.adresse || ""}
            onChange={handleChange}
            disabled={!isEditing}
            editable={isEditing}
          />
        </div>

        {isEditing && (
          <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold shadow-sm hover:bg-indigo-700 transition-all cursor-pointer"
            >
              <FiCheck className="w-4 h-4" />
              Enregistrer les modifications
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-all cursor-pointer"
            >
              <FiX className="w-4 h-4" />
              Annuler
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

const Profil = () => {
  const [user, setUser] = useState(null);
  const [id, setId] = useState("");
  const [role, setRole] = useState("");
  const [activeTab, setActiveTab] = useState("info");
  const [formData, setFormData] = useState({});
  const [avatar, setAvatar] = useState(null);

  // États pour la modale de mot de passe
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user?.avatarUrl) setAvatar(user.avatarUrl);
  }, [user]);

  useEffect(() => {
    api
      .get("/user/profile")
      .then((res) => {
        setId(res.data.userId);
        setRole(res.data.userRole);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (id && role) {
      api
        .get(`/user/info?id=${id}&role=${role}`)
        .then((res) => setUser(res.data[0]))
        .catch((err) => console.error(err));
    }
  }, [id, role]);

  useEffect(() => {
    if (user) {
      setFormData({
        nom: user.nom,
        prenom: user.prenom,
        username: user.username,
        genre: user.genre,
        phone: user.phone,
        adresse: user.adresse,
        email: user.email,
      });
    }
  }, [user]);

  const handleSave = async () => {
    try {
      await api.put(`/user/${id}`, formData);
      Swal.fire({
        title: "Succès",
        text: "Profil mis à jour avec succès !",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Erreur",
        text: "Impossible de mettre à jour le profil.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handlePasswordChangeSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Swal.fire(
        "Erreur",
        "Les nouveaux mots de passe ne correspondent pas.",
        "error",
      );
      return;
    }

    try {
      await api.put(`/user/${id}/password`, {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });
      Swal.fire("Succès", "Mot de passe modifié avec succès.", "success");
      setIsPasswordModalOpen(false);
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error(err);
      Swal.fire(
        "Erreur",
        "Échec de la modification du mot de passe. Vérifiez l'ancien mot de passe.",
        "error",
      );
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <Loader size="lg" color="blue" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 relative">
      {/* Header Profil */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-100 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-indigo-500 via-indigo-600 to-blue-600 relative"></div>
        <div className="px-6 pb-6 pt-0 relative flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12">
          <div className="flex items-end gap-5">
            <Avatar avatar={avatar} setAvatar={setAvatar} />
            <div className="mb-1">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                {user.nom} {user.prenom}
              </h2>
              <p className="text-sm font-medium text-slate-500">{user.email}</p>
            </div>
          </div>
          <div className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-full border border-indigo-100 self-start sm:self-auto">
            Rôle : {role || "Utilisateur"}
          </div>
        </div>
      </div>

      {/* Corps avec onglets */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-xs border border-slate-100 p-3 h-fit space-y-1">
          <TabButton
            label="Informations"
            icon={FiUser}
            active={activeTab === "info"}
            onClick={() => setActiveTab("info")}
          />
          <TabButton
            label="Paramètres"
            icon={FiEdit2}
            active={activeTab === "settings"}
            onClick={() => setActiveTab("settings")}
          />
        </div>

        <div className="lg:col-span-3 bg-white rounded-2xl shadow-xs border border-slate-100 p-6 md:p-8">
          {activeTab === "info" && <InfosPersonnelles user={user} />}
          {activeTab === "settings" && (
            <Parametres
              formData={formData}
              setFormData={setFormData}
              onSave={handleSave}
              onOpenPasswordModal={() => setIsPasswordModalOpen(true)}
            />
          )}
        </div>
      </div>

      {/* Modal de modification de mot de passe */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-100 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FiLock className="text-indigo-600" /> Modifier le mot de passe
              </h3>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePasswordChangeSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Ancien mot de passe
                </label>
                <input
                  type="password"
                  required
                  value={passwordData.oldPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      oldPassword: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  required
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Confirmer le nouveau mot de passe
                </label>
                <input
                  type="password"
                  required
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold shadow-sm hover:bg-indigo-700 transition-all cursor-pointer"
                >
                  Mettre à jour
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profil;
