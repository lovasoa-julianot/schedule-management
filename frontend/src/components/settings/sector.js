import { useEffect, useState } from "react";
import { FaRegCalendarAlt, FaUniversity } from "react-icons/fa";
import { MdSchool } from "react-icons/md";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import api from "../../hooks/api";
import Swal from "sweetalert2";

const Sector = () => {
  const [mentions, setMentions] = useState([]);
  const [niveaux, setNiveaux] = useState([]);
  const [nomMention, setNomMention] = useState("");
  const [intitule, setIntitule] = useState("");
  const [annee, setAnnee] = useState([]);

  const [anneeData, setAnneeData] = useState({
    debut: "",
    fin: "",
    status: "Inactive",
  });

  const loadData = () => {
    api
      .get("/mention")
      .then((res) => setMentions(res.data))
      .catch((err) => console.error("Erreur de chargement:", err.message));

    api
      .get("/niveau")
      .then((res) => setNiveaux(res.data))
      .catch((err) => console.error("Erreur de chargement:", err.message));

    api
      .get("/annee")
      .then((res) => setAnnee(res.data))
      .catch((err) => console.error("Erreur de chargement:", err.message));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveMention = (e) => {
    e.preventDefault();
    if (!nomMention.trim()) return;
    api.post("/mention", { nomMention }).then(() => {
      loadData();
      setNomMention("");
      Swal.fire({
        title: "Succès",
        text: "Mention ajoutée avec succès.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    });
  };

  const handleSaveNiveau = (e) => {
    e.preventDefault();
    if (!intitule.trim()) return;
    api.post("/niveau", { intitule }).then(() => {
      loadData();
      setIntitule("");
      Swal.fire({
        title: "Succès",
        text: "Niveau ajouté avec succès.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAnneeData((prev) => {
      const updated = { ...prev, [name]: value };
      // Auto-générer l'année de fin (début + 1) si la fin n'est pas remplie manuellement ou pour aider
      if (name === "debut" && value) {
        updated.fin = String(Number(value) + 1);
      }
      return updated;
    });
  };

  const handleToggle = (id) => {
    // Logique de bascule du statut de l'année
    const updated = annee.map((a) =>
      a.idAnnee === id
        ? { ...a, status: a.status === "Active" ? "Inactive" : "Active" }
        : a,
    );
    setAnnee(updated);
    // TODO: Ajouter l'appel API pour sauvegarder le statut si nécessaire
  };

  const ajouterAnnee = (e) => {
    e.preventDefault();
    if (!anneeData.debut || !anneeData.fin) {
      Swal.fire(
        "Erreur",
        "Veuillez sélectionner les années de début et de fin.",
        "error",
      );
      return;
    }

    api
      .post("/annee", anneeData)
      .then(() => {
        loadData();
        setAnneeData({ debut: "", fin: "", status: "Inactive" });
        Swal.fire({
          title: "Succès",
          text: "Année scolaire ajoutée avec succès",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      })
      .catch((err) => console.error("Erreur de l'envoie:", err.message));
  };

  return (
    <main className="space-y-6 pb-12">
      {/* En-tête de la page */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Paramètres Généraux
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-3xl">
          Cette section vous permet de gérer les éléments fondamentaux de votre
          système : les <strong>mentions</strong>, les{" "}
          <strong>niveaux d'études</strong> ainsi que l’
          <strong>année scolaire active</strong>. Assurez-vous que ces
          informations sont correctement configurées.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section Mentions / Filières */}
        <section className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <FaUniversity className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Mentions / Filières
              </h2>
            </div>
            <p className="text-sm text-slate-500 mb-6">
              Ajoutez ou gérez les filières proposées dans votre établissement.
            </p>

            <form
              onSubmit={handleSaveMention}
              className="flex flex-col sm:flex-row gap-3 mb-6"
            >
              <input
                type="text"
                name="nomMention"
                value={nomMention}
                onChange={(e) => setNomMention(e.target.value)}
                placeholder="Ex: Informatique, Droit..."
                className="flex-1 border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder-slate-400"
              />
              <button
                type="submit"
                className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition-all text-sm font-semibold shadow-sm cursor-pointer shrink-0"
              >
                <FiPlus className="w-4 h-4" />
                Ajouter
              </button>
            </form>

            <div className="border border-slate-100 rounded-xl overflow-hidden">
              <div className="max-h-[300px] overflow-y-auto">
                <table className="min-w-full text-left border-collapse">
                  <thead className="bg-slate-50 text-slate-400 font-semibold text-xs uppercase tracking-wider sticky top-0 border-b border-slate-100">
                    <tr>
                      <th className="px-4 py-3">Nom de la mention</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {mentions.length > 0 ? (
                      mentions.map((mention) => (
                        <tr
                          key={mention.idMent}
                          className="hover:bg-slate-50/60 transition-colors"
                        >
                          <td className="px-4 py-3 font-medium text-slate-800">
                            {mention.nomMention}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer">
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          className="text-center py-8 text-slate-400 italic"
                          colSpan="2"
                        >
                          Aucune mention disponible
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Section Niveaux d'études */}
        <section className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <MdSchool className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Niveaux d'études
              </h2>
            </div>
            <p className="text-sm text-slate-500 mb-6">
              Définissez les niveaux d’études associés (ex: L1, L2, M1...).
            </p>

            <form
              onSubmit={handleSaveNiveau}
              className="flex flex-col sm:flex-row gap-3 mb-6"
            >
              <input
                type="text"
                name="intitule"
                value={intitule}
                onChange={(e) => setIntitule(e.target.value)}
                placeholder="Ex: L1, Master 2..."
                className="flex-1 border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder-slate-400"
              />
              <button
                type="submit"
                className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition-all text-sm font-semibold shadow-sm cursor-pointer shrink-0"
              >
                <FiPlus className="w-4 h-4" />
                Ajouter
              </button>
            </form>

            <div className="border border-slate-100 rounded-xl overflow-hidden">
              <div className="max-h-[300px] overflow-y-auto">
                <table className="min-w-full text-left border-collapse">
                  <thead className="bg-slate-50 text-slate-400 font-semibold text-xs uppercase tracking-wider sticky top-0 border-b border-slate-100">
                    <tr>
                      <th className="px-4 py-3">Intitulé du niveau</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {niveaux.length > 0 ? (
                      niveaux.map((niveau) => (
                        <tr
                          key={niveau.idNiv}
                          className="hover:bg-slate-50/60 transition-colors"
                        >
                          <td className="px-4 py-3 font-medium text-slate-800">
                            {niveau.intitule}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer">
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          className="text-center py-8 text-slate-400 italic"
                          colSpan="2"
                        >
                          Aucun niveau disponible
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Section Années Scolaires */}
        <section className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 lg:col-span-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <FaRegCalendarAlt className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Années Scolaires
            </h2>
          </div>
          <p className="text-sm text-slate-500 mb-6">
            Gérez la liste des années scolaires disponibles. Une seule peut être
            active à la fois.
          </p>

          <form
            onSubmit={ajouterAnnee}
            className="flex flex-col sm:flex-row gap-3 mb-8 bg-slate-50/60 p-4 rounded-xl border border-slate-100"
          >
            <div className="flex-1 space-y-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Année de début
              </label>
              <select
                name="debut"
                value={anneeData.debut}
                onChange={handleChange}
                className="w-full border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="">-- Début --</option>
                {Array.from({ length: 30 }, (_, i) => {
                  const year = 2020 + i;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="flex-1 space-y-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Année de fin
              </label>
              <select
                name="fin"
                value={anneeData.fin}
                onChange={handleChange}
                className="w-full border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="">-- Fin --</option>
                {Array.from({ length: 30 }, (_, i) => {
                  const year = 2021 + i;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-all text-sm font-semibold shadow-sm cursor-pointer"
              >
                <FiPlus className="w-4 h-4" />
                Ajouter l'année
              </button>
            </div>
          </form>

          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">
            Liste des années scolaires existantes
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {annee.length > 0 ? (
              annee.map((item) => (
                <div
                  key={item.idAnnee}
                  className="flex justify-between items-center bg-slate-50/50 border border-slate-100 p-4 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <span className="text-slate-800 font-bold">
                    {item.debut} - {item.fin}
                  </span>

                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.status === "Active"}
                      onChange={() => handleToggle(item.idAnnee)}
                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
              ))
            ) : (
              <p className="text-slate-400 italic col-span-full py-4 text-center">
                Aucune année scolaire disponible
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Sector;
