import React, { useEffect, useState } from "react";
import { FaChalkboardTeacher, FaDoorOpen, FaCalendarAlt } from "react-icons/fa";
import PieCard from "./chart/pie";
import Select from "react-select";
import api from "../hooks/api";
import { Loader, Loader2 } from "./spin/Spinner";

const Dashboard = () => {
  const [mentions, setMentions] = useState([]);
  const [niveaux, setNiveaux] = useState([]);

  const [selectedMention, setSelectedMention] = useState(null);
  const [selectedNiveau, setSelectedNiveau] = useState(null);
  const [userId, setUserId] = useState(null);

  const [enseignants, setEnseignants] = useState([]);
  const [Man, setMan] = useState([]);
  const [Women, setWomen] = useState([]);

  const [salles, setSalles] = useState([]);

  const [planning, setPlanning] = useState([]);
  const [progressPlan, setProgressPlan] = useState([]);

  const [semestriel, setSemestriel] = useState([]);
  const [partiel, setPartiel] = useState([]);
  const [hebdomadaire, setHebdomadaire] = useState([]);

  const [infoEnseignants, setInfoEnseignants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  useEffect(() => {
    api.get("/mention").then((rep) => {
      setMentions(rep.data);
    });

    api.get("/niveau").then((rep) => {
      setNiveaux(rep.data);
    });

    api
      .get("/user/profile")
      .then((rep) => {
        setUserId(rep.data.userId);
        setRole(rep.data.userRole);
      })
      .catch((err) => {
        console.error(err.message);
      });

    api
      .get("/user/teacher")
      .then((rep) => {
        setEnseignants(rep.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      });

    api
      .get("/edt/all")
      .then((rep) => {
        setPlanning(rep.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      });

    api
      .get("/salle")
      .then((rep) => {
        setSalles(rep.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      });

    api
      .get("/user/teacher/info/all")
      .then((res) => {
        setInfoEnseignants(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      });
  }, []);

  const formatDate = (date) => {
    const dateFormat = new Date(date);
    const year = dateFormat.getFullYear();
    const month = String(dateFormat.getMonth() + 1).padStart(2, "0");
    const day = String(dateFormat.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const [filteredProgressPlan, setFilteredProgressPlan] = useState([]);

  useEffect(() => {
    const man = enseignants.filter((item) => item.genre === "Masculin");
    setMan(man);

    const fem = enseignants.filter((item) => item.genre === "Féminin");
    setWomen(fem);

    const plan = planning.filter((item) => item.dispo === "En cours");
    setProgressPlan(plan);

    const sem = planning.filter((item) => item.type === "Semestriel");
    setSemestriel(sem);

    const part = planning.filter((item) => item.type === "Partiel");
    setPartiel(part);

    const hebd = planning.filter((item) => item.type === "Hebdomadaire");
    setHebdomadaire(hebd);
  }, [enseignants, planning]);

  const sortByHeure = (data) => {
    return [...data].sort((a, b) => {
      const hA = new Date(`1970-01-01T${a.hDeb}`);
      const hB = new Date(`1970-01-01T${b.hDeb}`);
      return hA - hB;
    });
  };

  useEffect(() => {
    const filtered = progressPlan.filter(
      (p) => p.jour === formatDate(Date.now()),
    );
    const sorted = sortByHeure(filtered);
    setFilteredProgressPlan(sorted);
  }, [progressPlan]);

  const mentionOptions = mentions.map((ment) => ({
    value: ment.nomMention,
    label: ment.nomMention,
  }));

  const niveauOptions = niveaux.map((ment) => ({
    value: ment.intitule,
    label: ment.intitule,
  }));

  const filtrerData = (mention, niveau) => {
    const today = formatDate(Date.now());
    const filtered = progressPlan.filter(
      (item) =>
        item.jour === today &&
        (!mention || item.mention === mention.value) &&
        (!niveau || item.niveau === niveau.value),
    );
    setFilteredProgressPlan(sortByHeure(filtered));
  };

  useEffect(() => {
    if (selectedMention || selectedNiveau) {
      filtrerData(selectedMention, selectedNiveau);
    }
  }, [selectedMention, selectedNiveau]);

  const handleMentionChange = (mention) => {
    setSelectedMention(mention);
  };

  const handleNiveauChange = (niveau) => {
    setSelectedNiveau(niveau);
  };

  const total = enseignants?.length || 0;
  const manPercent = total ? Math.floor((Man.length * 100) / total) : 0;
  const womenPercent = total ? Math.floor((Women.length * 100) / total) : 0;

  const getUser = (key) => {
    api
      .get(`/user/info?id=${key}&role=${role}`)
      .then((res) => {
        // Utilisé si besoin
      })
      .catch((err) => console.error("Erreur de recuperation: ", err));
  };

  useEffect(() => {
    if (userId && role) {
      getUser(userId);
    }
  }, [userId, role]);

  return (
    <div className="space-y-6 pb-12">
      {/* En-tête de bienvenue */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Bienvenue sur{" "}
            <span className="font-extrabold text-indigo-600">
              Sched<span className="text-blue-500">Connect</span>
            </span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Voici un aperçu global de l'activité et des plannings de votre
            établissement.
          </p>
        </div>
      </div>

      {/* Cartes de statistiques (KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow-xs border border-slate-100 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total enseignants
            </p>
            {loading ? (
              <div className="mt-2">
                <Loader />
              </div>
            ) : (
              <p className="text-3xl font-extrabold text-slate-900 mt-1">
                {enseignants?.length}
              </p>
            )}
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <FaChalkboardTeacher className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white shadow-xs border border-slate-100 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total salles
            </p>
            {loading ? (
              <div className="mt-2">
                <Loader />
              </div>
            ) : (
              <p className="text-3xl font-extrabold text-slate-900 mt-1">
                {salles?.length}
              </p>
            )}
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <FaDoorOpen className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white shadow-xs border border-slate-100 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Plannings en cours
            </p>
            {loading ? (
              <div className="mt-2">
                <Loader />
              </div>
            ) : (
              <p className="text-3xl font-extrabold text-slate-900 mt-1">
                {progressPlan?.length ?? "0"}
              </p>
            )}
          </div>
          <div className="w-12 h-12 rounded-2xl bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-600">
            <FaCalendarAlt className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Grille principale : Plannings du jour & Diversité de genre */}
      <div className="grid gap-6 grid-cols-1 xl:grid-cols-3">
        {/* Plannings aujourd'hui */}
        <div className="xl:col-span-2 bg-white shadow-xs border border-slate-100 rounded-2xl p-6 flex flex-col">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <h3 className="text-lg font-bold text-slate-900">
              Plannings aujourd'hui
            </h3>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Select
                className="w-full sm:w-52 text-sm"
                options={mentionOptions}
                placeholder="Mention"
                value={selectedMention}
                onChange={handleMentionChange}
                isClearable
              />
              <Select
                className="w-full sm:w-52 text-sm"
                options={niveauOptions}
                placeholder="Niveau"
                value={selectedNiveau}
                onChange={handleNiveauChange}
                isClearable
              />
            </div>
          </div>

          <div className="border border-slate-100 rounded-xl overflow-hidden flex-1">
            <div className="max-h-[300px] overflow-y-auto">
              <table className="min-w-full text-left border-collapse">
                <thead className="bg-slate-50 text-slate-400 font-semibold text-xs uppercase tracking-wider sticky top-0 border-b border-slate-100">
                  <tr>
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Horaire</th>
                    <th className="px-4 py-3">Matière</th>
                    <th className="px-4 py-3">Enseignant</th>
                    <th className="px-4 py-3">Salle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredProgressPlan && filteredProgressPlan.length > 0 ? (
                    filteredProgressPlan.map((item, index) => (
                      <tr
                        key={index}
                        className="hover:bg-slate-50/60 transition-colors"
                      >
                        <td className="px-4 py-3 text-slate-500 font-medium">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3 font-bold text-slate-800">
                          {item.hDeb?.slice(0, 5)} - {item.hFin?.slice(0, 5)}
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          {item.nomMatiere}
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          {item.prenomEns}
                        </td>
                        <td className="px-4 py-3 font-semibold text-indigo-600">
                          {item.nomSalle}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center py-12 text-slate-400 italic"
                      >
                        Aucun programme trouvé pour aujourd'hui.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Diversité de genre */}
        <div className="bg-white shadow-xs border border-slate-100 rounded-2xl p-6 flex flex-col justify-between">
          <h3 className="text-lg font-bold text-slate-900 mb-6">
            Diversité de genre
          </h3>

          <div className="space-y-6 text-slate-700 my-auto">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-slate-600">Homme</span>
                <span className="text-indigo-600">{manPercent} %</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${manPercent}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-slate-600">Femme</span>
                <span className="text-pink-500">{womenPercent} %</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-pink-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${womenPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-400 text-center">
            Basé sur l'ensemble des enseignants enregistrés
          </div>
        </div>
      </div>

      {/* Grille secondaire : Répartition des plannings & Suivi des enseignants */}
      <div className="grid gap-6 grid-cols-1 xl:grid-cols-3">
        {/* Répartition des plannings (Graphique / PieCard) */}
        <div className="bg-white shadow-xs border border-slate-100 rounded-2xl p-6 flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            Répartition des plannings
          </h3>
          <div className="flex-1 flex items-center justify-center min-h-[250px]">
            {loading ? (
              <Loader />
            ) : hebdomadaire && semestriel && partiel ? (
              <PieCard
                hebdomadaire={hebdomadaire}
                semetriel={semestriel}
                partiel={partiel}
              />
            ) : (
              <p className="text-slate-400 italic">Aucune donnée disponible.</p>
            )}
          </div>
        </div>

        {/* Suivi des activités des enseignants */}
        <div className="bg-white shadow-xs border border-slate-100 rounded-2xl p-6 xl:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900">
              Suivi des activités des enseignants
            </h3>
          </div>

          <div className="border border-slate-100 rounded-xl overflow-hidden flex-1">
            <div className="max-h-[320px] overflow-y-auto">
              <table className="min-w-full text-left border-collapse">
                <thead className="bg-slate-50 text-slate-400 font-semibold text-xs uppercase tracking-wider sticky top-0 border-b border-slate-100">
                  <tr>
                    <th className="px-4 py-3">Nom & Prénom</th>
                    <th className="px-4 py-3">Grade</th>
                    <th className="px-4 py-3">Performance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {loading ? (
                    <tr>
                      <td colSpan={3} className="py-12 text-center">
                        <Loader2 />
                      </td>
                    </tr>
                  ) : infoEnseignants && infoEnseignants.length > 0 ? (
                    infoEnseignants.map((ens, index) => {
                      const totalPrevue = ens.matiereInfo.reduce(
                        (sum, mat) => sum + mat.hPrevue,
                        0,
                      );
                      const totalEffectue = ens.matiereInfo.reduce(
                        (sum, mat) => sum + mat.hEffectue,
                        0,
                      );
                      const performance =
                        totalPrevue > 0
                          ? Math.round((totalEffectue / totalPrevue) * 100)
                          : 0;

                      return (
                        <tr
                          key={index}
                          className="hover:bg-slate-50/60 transition-colors"
                        >
                          <td className="px-4 py-3 font-medium text-slate-800">
                            {ens.nom} {ens.prenom}
                          </td>
                          <td className="px-4 py-3 text-slate-500">
                            {ens.grade}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                                <div
                                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                                  style={{ width: `${performance}%` }}
                                ></div>
                              </div>
                              <span className="text-xs font-bold text-slate-600 shrink-0 w-10 text-right">
                                {performance}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        className="text-center py-12 text-slate-400 italic"
                      >
                        Aucun enseignant trouvé.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
