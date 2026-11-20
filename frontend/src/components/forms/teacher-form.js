import React, { useState } from "react";
import { FiX } from "react-icons/fi";

const TeacherForm = ({
  data,
  handleChange,
  handleSubmit,
  isEdit,
  setShowModal,
}) => {
  const [phoneError, setPhoneError] = useState("");

  // Fonction de validation du téléphone
  const validatePhone = (phoneValue) => {
    const trimmedValue = phoneValue.trim();

    if (!trimmedValue) {
      return "Le numéro de téléphone est requis.";
    }

    // Si la taille est inférieure à 13, on affiche un message d'alerte
    if (trimmedValue.length < 13) {
      return "Le numéro est invalide (doit contenir exactement 13 caractères).";
    }

    // Regex pour valider le format exact (+261 suivi du préfixe 32, 33, 34, 35, 37 ou 38 et de 7 chiffres)
    const phoneRegex = /^\+261(32|33|34|35|37|38)\d{7}$/;

    if (!phoneRegex.test(trimmedValue)) {
      return "Format invalide. Exemple valide : +261341234567 (Opérateurs : 32, 33, 34, 35, 37, 38).";
    }

    return "";
  };

  // Gestionnaire pour le champ contact avec validation et blocage à 13 max
  const handlePhoneChange = (e) => {
    const value = e.target.value;

    // Bloque la saisie si on dépasse 13 caractères
    if (value.length <= 13) {
      handleChange(e);
      const errorMsg = validatePhone(value);
      setPhoneError(errorMsg);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const errorMsg = validatePhone(data.phone);
    if (errorMsg) {
      setPhoneError(errorMsg);
      return;
    }
    handleSubmit(e);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-lg shadow-xl border border-slate-100 my-8">
        {/* En-tête du modal */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {isEdit ? "Modifier l'enseignant" : "Nouvel enseignant"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Remplissez les informations personnelles de l'enseignant.
            </p>
          </div>
          <button
            onClick={() => setShowModal(false)}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Nom
              </label>
              <input
                type="text"
                name="nom"
                value={data.nom}
                onChange={handleChange}
                className="w-full border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                placeholder="Ex: RAKOTO"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Prénom
              </label>
              <input
                type="text"
                name="prenom"
                value={data.prenom}
                onChange={handleChange}
                className="w-full border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                placeholder="Ex: Jean"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={data.email}
                onChange={handleChange}
                className="w-full border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                placeholder="exemple@domaine.mg"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Genre
              </label>
              <select
                name="genre"
                value={data.genre}
                onChange={handleChange}
                className="w-full border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700"
                required
              >
                <option value="" disabled>
                  Choisir un genre
                </option>
                <option value="Masculin">Masculin</option>
                <option value="Feminin">Féminin</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Adresse
              </label>
              <input
                type="text"
                name="adresse"
                value={data.adresse}
                onChange={handleChange}
                className="w-full border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                placeholder="Ex: Ankatso"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Contact (Téléphone)
                </label>
                <span className="text-[10px] text-slate-400">
                  {data.phone ? data.phone.length : 0}/13
                </span>
              </div>
              <input
                type="text"
                name="phone"
                value={data.phone}
                onChange={handlePhoneChange}
                maxLength={13}
                className={`w-full border bg-slate-50/50 px-3.5 py-2.5 text-sm rounded-xl focus:outline-none focus:ring-2 transition-all ${
                  phoneError
                    ? "border-rose-300 focus:ring-rose-500/20 focus:border-rose-500"
                    : "border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500"
                }`}
                placeholder="+261340000000"
                required
              />
              {phoneError && (
                <p className="text-xs text-rose-600 mt-1.5 leading-relaxed font-medium">
                  {phoneError}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Grade
            </label>
            <select
              name="grade"
              value={data.grade}
              onChange={handleChange}
              className="w-full border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700"
              required
            >
              <option value="" disabled>
                Choisir un grade
              </option>
              <option value="Doctorant">Doctorant</option>
              <option value="Professeur Titulaire">Professeur Titulaire</option>
              <option value="Maitres de Conférences">
                Maitres de Conférences
              </option>
              <option value="Assistant">Assistant</option>
              <option value="Vacataire">Vacataire</option>
              <option value="Chargé de cours">Chargé de cours</option>
              <option value="Professeur Associé">Professeur Associé</option>
              <option value="Professeur Émérite">Professeur Émérite</option>
            </select>
          </div>

          {/* Boutons d'action */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={!!phoneError || !data.phone}
              className={`px-5 py-2.5 rounded-xl text-white text-sm font-semibold shadow-sm transition-all ${
                phoneError || !data.phone
                  ? "bg-indigo-300 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/25 hover:scale-[1.02] active:scale-95"
              }`}
            >
              {isEdit ? "Mettre à jour" : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherForm; // (ou export default TeacherForm)
