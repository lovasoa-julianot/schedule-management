import React, { useState, useEffect } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import ClassForm from "./forms/class-form";
import AlertInfo from "./notification/alert";
import Confirm from "./notification/confirm";
import api from "../hooks/api";
import { Loader } from "./spin/Spinner";
import { can } from "../hooks/permission";
import Swal from "sweetalert2";

const ClassRoom = () => {
  const [salles, setSalles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtered, setFiltered] = useState([]);

  const [formData, setFormData] = useState({
    id: "",
    nomsalle: "",
    typesalle: "",
    capacite: "",
    localisation: "",
  });

  const loadData = () => {
    setLoading(true);
    api
      .get("/salle")
      .then((res) => {
        setSalles(res.data);
        setFiltered(res.data);
      })
      .catch((err) => console.error("Erreur de chargement:", err.message))
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 800);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [searchfield, setSearchfield] = useState("");

  const [alert, setAlert] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openModal = () => {
    setFormData({
      id: "",
      nomsalle: "",
      typesalle: "",
      capacite: "",
      localisation: "",
    });
    setShowModal(true);
  };

  const openModalEdit = (sl) => {
    setFormData({
      id: sl.idsalle,
      nomsalle: sl.nomsalle,
      typesalle: sl.typesalle,
      capacite: sl.capacite,
      localisation: sl.localisation,
    });
    setShowModalEdit(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api
      .post("/salle", formData)
      .then(() => {
        loadData();
        setFormData({
          id: "",
          nomsalle: "",
          typesalle: "",
          capacite: "",
          localisation: "",
        });
        Swal.fire({
          title: "Succès",
          text: "Données enregistrées avec succès.",
          icon: "success",
          confirmButtonText: "OK",
        });
      })
      .catch((err) => console.error("Erreur d'envoi:", err.message));
    setShowModal(false);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!formData.id) {
      console.error("ID de la salle manquant pour la mise à jour");
      return;
    }
    api
      .put(`/salle/${formData.id}`, formData)
      .then(() => {
        loadData();
        setFormData({
          id: "",
          nomsalle: "",
          typesalle: "",
          capacite: "",
          localisation: "",
        });
        Swal.fire({
          title: "Succès",
          text: "Données modifiées avec succès.",
          icon: "success",
          confirmButtonText: "OK",
        });
      })
      .catch((err) => console.error("Erreur d'envoi:", err.message));
    setShowModalEdit(false);
  };

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const askDelete = (id) => {
    setDeleteId(id);
    setConfirmDelete(true);
  };

  const handleDelete = () => {
    api
      .delete(`/salle/${deleteId}`)
      .then(() => {
        loadData();
        Swal.fire({
          title: "Succès",
          text: "Données supprimées avec succès.",
          icon: "success",
          confirmButtonText: "OK",
        });
      })
      .catch((err) => {
        console.error("Erreur: ", err.message);
      })
      .finally(() => {
        setConfirmDelete(false);
      });
  };

  // Filtrage réactif
  const filter = salles.filter((sl) =>
    (
      (sl.nomsalle || "") +
      " " +
      (sl.typesalle || "") +
      " " +
      (sl.capacite || "") +
      " " +
      (sl.localisation || "")
    )
      .toLowerCase()
      .includes(searchfield.toLowerCase()),
  );

  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    api
      .get("/user/profile")
      .then((rep) => {
        setUserRole(rep.data.userRole);
      })
      .catch(() => {
        setUserRole(null);
      });
  }, []);

  return (
    <div className="classroom-container min-h-screen p-6 md:p-8 bg-slate-50/70 font-sans">
      {showAlert && alert && (
        <AlertInfo alert={alert} setShowAlert={setShowAlert} />
      )}

      {confirmDelete && (
        <Confirm
          handleDelete={handleDelete}
          setConfirmDelete={setConfirmDelete}
        />
      )}

      {/* En-tête de la page */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-100 mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            {userRole === "Admin" ? "Gestion des salles" : "Liste des salles"}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Consultez et gérez les amphithéâtres, salles de cours et
            laboratoires.
          </p>
        </div>

        {/* Barre de recherche moderne */}
        <div className="w-full md:w-80">
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
              <FiSearch className="w-4 h-4 text-slate-400" />
            </div>
            <input
              type="search"
              value={searchfield}
              onChange={(e) => setSearchfield(e.target.value)}
              className="w-full border border-slate-200 bg-white py-2.5 ps-10 pe-4 text-sm text-slate-800 rounded-xl shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              placeholder="Rechercher une salle..."
            />
          </div>
        </div>
      </div>

      {/* Bouton Nouveau */}
      {can(userRole === "Admin" ? "admin" : "secretary", "add") && (
        <div className="flex items-center justify-end mb-6">
          <button
            onClick={openModal}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-95"
          >
            <FiPlus className="w-4 h-4" />
            <span>Nouvelle salle</span>
          </button>
        </div>
      )}

      {showModal && (
        <ClassForm
          data={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          isEdit={false}
          setShowModal={setShowModal}
        />
      )}

      {showModalEdit && (
        <ClassForm
          data={formData}
          handleChange={handleChange}
          handleSubmit={handleUpdate}
          isEdit={true} // Corrigé ici
          setShowModal={setShowModalEdit}
        />
      )}

      {/* Tableau moderne type carte */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <th className="px-5 py-3.5">#</th>
                <th className="px-5 py-3.5">Nom de la salle</th>
                <th className="px-5 py-3.5">Type</th>
                <th className="px-5 py-3.5">Capacité</th>
                <th className="px-5 py-3.5">Localisation</th>
                {can(userRole === "Admin" ? "admin" : "secretary", "edit") && (
                  <th className="px-5 py-3.5 text-end">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <Loader />
                  </td>
                </tr>
              ) : filter.length > 0 ? (
                filter.map((sl, index) => (
                  <tr
                    key={sl.idsalle || index}
                    className="hover:bg-slate-50/60 transition-colors group"
                  >
                    <td className="px-5 py-4 font-medium text-slate-400">
                      {index + 1}
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-900">
                      {sl.nomsalle}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-600">
                        {sl.typesalle}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-800">
                      {sl.capacite} places
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {sl.localisation}
                    </td>
                    {can(
                      userRole === "Admin" ? "admin" : "secretary",
                      "edit",
                    ) && (
                      <td className="px-5 py-4 text-end">
                        <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openModalEdit(sl)}
                            className="text-slate-400 hover:text-indigo-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                            title="Modifier"
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => askDelete(sl.idsalle)}
                            className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                            title="Supprimer"
                          >
                            <FaTrashAlt className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-16 text-slate-400">
                    Aucune salle trouvée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClassRoom;
