import React from "react";
import { FiX } from "react-icons/fi";

const ClassForm = ({
  data,
  handleChange,
  handleSubmit,
  isEdit,
  setShowModal,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-lg shadow-xl border border-slate-100 my-8">
        {/* En-tête de la modale */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {isEdit ? "Modifier la salle" : "Nouvelle salle"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Renseignez les caractéristiques physiques de la salle.
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
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Nom de la salle
            </label>
            <input
              type="text"
              name="nomsalle"
              value={data.nomsalle}
              onChange={handleChange}
              className="w-full border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800"
              placeholder="Ex: Salle 101 ou Amphi A"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Type de salle
              </label>
              <select
                name="typesalle"
                value={data.typesalle}
                onChange={handleChange}
                className="w-full border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700"
                required
              >
                <option value="" disabled>
                  Choisir un type
                </option>
                <option value="Salle de cours">Salle de cours</option>
                <option value="Amphithéâtre">Amphithéâtre</option>
                <option value="Salle informatique">Salle informatique</option>
                <option value="Laboratoire">Laboratoire</option>
                <option value="Salle de réunion">Salle de réunion</option>
                <option value="Salle de visioconférence">
                  Salle de visioconférence
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Capacité (places)
              </label>
              <input
                type="number"
                name="capacite"
                value={data.capacite}
                onChange={handleChange}
                className="w-full border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800"
                placeholder="Ex: 50"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Localisation
            </label>
            <select
              name="localisation"
              value={data.localisation}
              onChange={handleChange}
              className="w-full border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700"
              required
            >
              <option value="" disabled>
                Choisir l'emplacement...
              </option>
              <option value="Rez-de-chaussée">Rez-de-chaussée</option>
              <option value="Etage 1">Étage 1</option>
              <option value="Etage 2">Étage 2</option>
              <option value="Etage 3">Étage 3</option>
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

export default ClassForm;
