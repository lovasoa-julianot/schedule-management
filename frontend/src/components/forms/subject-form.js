import React from "react";
import { FiX } from "react-icons/fi";

const SubjectForm = ({
  data,
  handleChange,
  handleSubmit,
  isEdit,
  mentions,
  niveaux,
  enseignants,
  setShowModal,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-xl shadow-xl border border-slate-100 my-8">
        {/* En-tête de la modale */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {isEdit ? "Modifier la matière" : "Nouvelle matière"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Renseignez les détails pédagogiques de la matière.
            </p>
          </div>
          <button
            onClick={() => setShowModal(false)}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nom de la matière */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Nom de la matière
            </label>
            <input
              type="text"
              name="nomMat"
              placeholder="Ex: Algorithmique Avancée"
              value={data.nomMat}
              onChange={handleChange}
              className="w-full border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800"
              required
            />
          </div>

          {/* Nombre d'heures et Coefficient */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Nombre d'heures
              </label>
              <input
                type="number"
                name="nbH"
                placeholder="Ex: 30"
                value={data.nbH}
                onChange={handleChange}
                className="w-full border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Coefficient
              </label>
              <input
                type="number"
                name="coeff"
                placeholder="Ex: 3"
                value={data.coeff}
                onChange={handleChange}
                className="w-full border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800"
                required
              />
            </div>
          </div>

          {/* Enseignant */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Enseignant responsable
            </label>
            <select
              name="enseignantId"
              value={data.enseignantId}
              onChange={handleChange}
              className="w-full border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700"
            >
              <option value="" disabled>
                Choisir un enseignant
              </option>
              {enseignants.length > 0 ? (
                enseignants.map((m, index) => (
                  <option key={index} value={m.id}>
                    {m.nom} {m.prenom}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  Aucun enseignant disponible
                </option>
              )}
            </select>
          </div>

          {/* Section Mentions et Niveaux cibles */}
          <div className="pt-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Sélectionnez les mentions et niveaux cibles (Multi-sélection)
            </label>
            <p className="text-[11px] text-slate-400 mb-2">
              Maintenez la touche Ctrl (ou Cmd sur Mac) enfoncée pour
              sélectionner plusieurs éléments.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Mentions */}
              <div>
                <span className="block text-xs font-medium text-slate-600 mb-1">
                  Mentions
                </span>
                <select
                  name="mentionId"
                  multiple
                  value={data.mentionId}
                  onChange={handleChange}
                  className="w-full border border-slate-200 bg-slate-50/50 p-2.5 h-36 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700"
                >
                  {mentions.length > 0 ? (
                    mentions.map((m) => (
                      <option
                        key={m.idMent}
                        value={m.idMent}
                        className="py-1 px-2 rounded-md"
                      >
                        {m.nomMention}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      Aucune mention disponible
                    </option>
                  )}
                </select>
              </div>

              {/* Niveaux */}
              <div>
                <span className="block text-xs font-medium text-slate-600 mb-1">
                  Niveaux
                </span>
                <select
                  name="niveauId"
                  multiple
                  value={data.niveauId}
                  onChange={handleChange}
                  className="w-full border border-slate-200 bg-slate-50/50 p-2.5 h-36 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700"
                >
                  {niveaux.length > 0 ? (
                    niveaux.map((m) => (
                      <option
                        key={m.idNiv}
                        value={m.idNiv}
                        className="py-1 px-2 rounded-md"
                      >
                        {m.intitule}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      Aucun niveau disponible
                    </option>
                  )}
                </select>
              </div>
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
              {isEdit ? "Mettre à jour" : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubjectForm;
