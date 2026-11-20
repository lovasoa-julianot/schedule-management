import { useEffect, useState } from "react";
import Select from "react-select";
import SimpleBarChart from "../chart/bar";
import api from "../../hooks/api";
import { Loader } from "../spin/Spinner";
import { FiMail, FiAward, FiUser } from "react-icons/fi";

const TeacherHour = () => {
  const [enseignants, setEnseignants] = useState([]);
  const [infoEnseignants, setInfoEnseignants] = useState([]);
  const [filter, setFilter] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEnseignant, setSelectedEnseignant] = useState(null);

  const loadAll = () => {
    setLoading(true);
    setTimeout(() => {
      api
        .get("user/teacher/info/all")
        .then((res) => {
          setInfoEnseignants(res.data);
          setFilter(res.data);
        })
        .catch((err) => console.error("Erreur de chargement:", err));

      api
        .get("user/teacher")
        .then((res) => {
          setEnseignants(res.data);
        })
        .catch((err) => console.error("Erreur de chargement:", err))
        .finally(() => {
          setLoading(false);
        });
    }, 500);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const enseignantOptions = enseignants.map((ens) => ({
    value: ens.nom,
    label: `${ens.nom} ${ens.prenom}`,
  }));

  const filtrerData = (selected) => {
    if (!selected) {
      setFilter(infoEnseignants);
      return;
    }
    const filtered = infoEnseignants.filter(
      (item) => item.nom === selected.value,
    );
    setFilter(filtered);
  };

  const handleEnseignantChange = (selected) => {
    setSelectedEnseignant(selected);
    filtrerData(selected);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* En-tête de la page */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-100">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Statistiques des heures enseignées
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Suivi des heures effectuées par matière et évaluation de
            l'accomplissement des crédits.
          </p>
        </div>

        <div className="w-full md:w-80">
          <Select
            options={enseignantOptions}
            placeholder="Sélectionner un enseignant"
            value={selectedEnseignant}
            onChange={handleEnseignantChange}
            isClearable
            className="text-sm"
            styles={{
              control: (base) => ({
                ...base,
                borderRadius: "0.75rem",
                borderColor: "#e2e8f0",
                backgroundColor: "#f8fafc50",
                padding: "2px",
                boxShadow: "none",
                "&:hover": { borderColor: "#cbd5e1" },
              }),
            }}
          />
        </div>
      </div>

      {/* Contenu principal */}
      {loading ? (
        <div className="flex items-center justify-center py-20 bg-white rounded-2xl shadow-xs border border-slate-100">
          <Loader size="lg" color="blue" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Carte d'information de l'enseignant sélectionné */}
          <div className="bg-white rounded-2xl shadow-xs border border-slate-100 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl font-bold shadow-inner shrink-0">
                {filter[0]?.nom ? (
                  filter[0].nom.charAt(0).toUpperCase()
                ) : (
                  <FiUser />
                )}
                {filter[0]?.prenom
                  ? filter[0].prenom.charAt(0).toUpperCase()
                  : ""}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {filter[0]?.nom
                    ? `${filter[0].nom.toUpperCase()} ${filter[0].prenom || ""}`
                    : "Tous les enseignants"}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500 mt-1">
                  {filter[0]?.grade && (
                    <span className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md text-slate-600">
                      <FiAward className="w-3.5 h-3.5 text-indigo-500" />
                      {filter[0].grade}
                    </span>
                  )}
                  {filter[0]?.email && (
                    <span className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md text-slate-600">
                      <FiMail className="w-3.5 h-3.5 text-indigo-500" />
                      {filter[0].email}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {selectedEnseignant && (
              <button
                onClick={() => handleEnseignantChange(null)}
                className="self-start sm:self-center text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100/60 px-3 py-1.5 rounded-lg transition-colors"
              >
                Réinitialiser le filtre
              </button>
            )}
          </div>

          {/* Graphique */}
          <div className="bg-white rounded-2xl shadow-xs border border-slate-100 p-6">
            {filter.length > 0 ? (
              <SimpleBarChart data={filter} />
            ) : (
              <div className="text-center py-12 text-slate-400 italic">
                Aucune donnée disponible pour cet enseignant.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherHour;
