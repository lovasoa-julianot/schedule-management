import React from "react";
import { FiX, FiCalendar, FiClock } from "react-icons/fi";

const PlanningForm = ({
  enseignants,
  mentions,
  niveaux,
  salles,
  matieres,
  horaires,
  selectedDate,
  data,
  handleChange,
  handleSubmit,
  setShowModal,
  modalType,
}) => {
  // Formatage sécurisé de la date si elle existe
  const formattedDate =
    selectedDate instanceof Date
      ? selectedDate.toLocaleDateString()
      : selectedDate || "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-xl shadow-xl border border-slate-100 my-8">
        {/* En-tête de la modale */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {modalType === "create"
                ? "Ajouter un événement"
                : "Modifier l'événement"}
            </h2>
            {formattedDate && (
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                <FiCalendar className="w-3.5 h-3.5 text-indigo-500" />
                <span>Date concernée : {formattedDate}</span>
              </p>
            )}
          </div>
          <button
            onClick={() => setShowModal(false)}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type d'événement */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Type d'événement
            </label>
            <select
              name="type"
              value={data.type || ""}
              onChange={handleChange}
              className="w-full border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700"
              required
            >
              <option value="" disabled>
                Choisir un type
              </option>
              <option value="Hebdomadaire">Hebdomadaire</option>
              <option value="Semestriel">Semestriel</option>
              <option value="Partiel">Partiel</option>
            </select>
          </div>

          {/* Enseignant et Matière */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Enseignant
              </label>
              <select
                name="enseignantId"
                value={data.enseignantId || ""}
                onChange={handleChange}
                className="w-full border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700"
                required
              >
                <option value="" disabled>
                  Choisir un enseignant
                </option>
                {enseignants.length > 0 ? (
                  enseignants.map((enseignant) => (
                    <option key={enseignant.id} value={enseignant.id}>
                      {enseignant.nom} {enseignant.prenom}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    Aucun enseignant disponible
                  </option>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Matière
              </label>
              <select
                name="matiereId"
                value={data.matiereId || ""}
                onChange={handleChange}
                className="w-full border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700"
                required
              >
                <option value="" disabled>
                  Choisir une matière
                </option>
                {matieres.length > 0 ? (
                  matieres.map((matiere) => (
                    <option key={matiere.id} value={matiere.id}>
                      {matiere.nomMat}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    Aucune matière disponible
                  </option>
                )}
              </select>
            </div>
          </div>

          {/* Mention et Niveau */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Mention
              </label>
              <select
                name="mentionId"
                value={data.mentionId || ""}
                onChange={handleChange}
                className="w-full border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700"
                required
              >
                <option value="" disabled>
                  Choisir une mention
                </option>
                {mentions.map((mention, index) => (
                  <option key={index} value={mention.idMent}>
                    {mention.nomMention}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Niveau
              </label>
              <select
                name="niveauId"
                value={data.niveauId || ""}
                onChange={handleChange}
                className="w-full border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700"
                required
              >
                <option value="" disabled>
                  Choisir un niveau
                </option>
                {niveaux.map((niveau, index) => (
                  <option key={index} value={niveau.idNiv}>
                    {niveau.intitule}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Salle */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Salle
            </label>
            <select
              name="idSalle"
              value={data.idSalle || ""}
              onChange={handleChange}
              className="w-full border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700"
              required
            >
              <option value="" disabled>
                Choisir une salle
              </option>
              {salles.map((salle, index) => (
                <option key={index} value={salle.idsalle}>
                  {salle.nomsalle} ({salle.capacite} places)
                </option>
              ))}
            </select>
          </div>

          {/* Horaires (Heure début et Heure fin) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Heure de début
              </label>
              <select
                name="hDeb"
                value={data.hDeb || ""}
                onChange={handleChange}
                className="w-full border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700"
                required
              >
                <option value="" disabled>
                  Heure début
                </option>
                {horaires.map((hour, index) => (
                  <option key={index} value={hour.heure}>
                    {hour.heure}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Heure de fin
              </label>
              <select
                name="hFin"
                value={data.hFin || ""}
                onChange={handleChange}
                className="w-full border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700"
                required
              >
                <option value="" disabled>
                  Heure fin
                </option>
                {horaires.map((hour, index) => (
                  <option key={index} value={hour.heure}>
                    {hour.heure}
                  </option>
                ))}
              </select>
            </div>
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
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-95"
            >
              {modalType === "create" ? "Enregistrer" : "Mettre à jour"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlanningForm;
