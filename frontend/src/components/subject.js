import React, { useState, useEffect } from "react";
import {
  FiPlus,
  FiSearch,
  FiChevronDown,
  FiBookOpen,
  FiClock,
  FiAward,
} from "react-icons/fi";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import SubjectForm from "./forms/subject-form";
import Confirm from "./notification/confirm";
import AlertInfo from "./notification/alert";
import api from "../hooks/api";
import { Loader } from "./spin/Spinner";
import { can } from "../hooks/permission";
import Swal from "sweetalert2";

const Subject = () => {
  const [matieres, setMatieres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});

  const loadSubject = () => {
    setLoading(true);
    api
      .get("/matiere")
      .then((res) => setMatieres(res.data))
      .catch((err) => {
        console.error("Erreur de chargement:", err);
        Swal.fire({
          title: "Erreur",
          text: "Une erreur est survenue lors du chargement des matières.",
          icon: "error",
          confirmButtonText: "OK",
        });
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 1200);
      });
  };

  useEffect(() => {
    loadSubject();
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);

  const [alert, setAlert] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    id: "",
    nomMat: "",
    nbH: 0,
    coeff: 0,
    enseignantId: "",
    mentionId: [],
    niveauId: [],
  });

  const [mentions, setMentions] = useState([]);
  const [niveaux, setNiveaux] = useState([]);
  const [enseignants, setEnseignants] = useState([]);
  const [searchfield, setSearchfield] = useState("");

  const loadData = () => {
    api.get("/mention").then((res) => setMentions(res.data));
    api.get("/niveau").then((res) => setNiveaux(res.data));
    api.get("/user/teacher").then((res) => {
      setEnseignants(res.data);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const teachersWithSubjects = enseignants
    .map((ens) => {
      const fullName = `${ens.nom} ${ens.prenom}`;
      const assignedSubjects = matieres.filter((mt) =>
        mt.enseignants?.includes(fullName),
      );
      const initials =
        `${ens.nom?.[0] || ""}${ens.prenom?.[0] || ""}`.toUpperCase();
      return {
        ...ens,
        fullName,
        initials,
        subjects: assignedSubjects,
      };
    })
    .filter((ens) => {
      const matchesSearch =
        ens.fullName.toLowerCase().includes(searchfield.toLowerCase()) ||
        ens.subjects.some((s) =>
          s.nomMat.toLowerCase().includes(searchfield.toLowerCase()),
        );
      return matchesSearch && ens.subjects.length > 0;
    });

  useEffect(() => {
    if (teachersWithSubjects.length > 0) {
      setExpandedRows({
        [teachersWithSubjects[0].id]: true,
      });
    } else {
      setExpandedRows({});
    }
  }, [matieres, enseignants, searchfield]);

  const toggleRow = (teacherId) => {
    setExpandedRows((prev) => ({
      [teacherId]: !prev[teacherId],
    }));
  };

  const handleChange = (e) => {
    const { name, value, multiple, selectedOptions } = e.target;
    let finalValue;

    if (multiple) {
      finalValue = Array.from(selectedOptions, (option) =>
        parseInt(option.value),
      );
    } else if (name === "nbH" || name === "coeff") {
      finalValue = parseInt(value) || 0;
    } else {
      finalValue = value;
    }

    setFormData((prev) => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      api.post("/matiere", formData).then(() => {
        loadSubject();
        setFormData({
          id: "",
          nomMat: "",
          nbH: 0,
          coeff: 0,
          enseignantId: "",
          mentionId: [],
          niveauId: [],
        });
        Swal.fire({
          title: "Succès",
          text: "Données enregistrées avec succès.",
          icon: "success",
          confirmButtonText: "OK",
        });
        setShowModal(false);
      });
    } catch (error) {
      console.error("Erreur d'envoi des données: ", error.message);
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!formData.id) return;
    api
      .put(`/matiere/${formData.id}`, formData)
      .then(() => {
        loadSubject();
        setFormData({
          id: "",
          nomMat: "",
          nbH: 0,
          coeff: 0,
          enseignantId: "",
          mentionId: [],
          niveauId: [],
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

  const openModalEdit = (sub) => {
    setFormData({
      id: sub.id,
      nomMat: sub.nomMat,
      nbH: sub.nbH,
      coeff: sub.coeff,
      enseignantId: sub.enseignantId || "",
      mentionId: sub.mentionId || [],
      niveauId: sub.niveauId || [],
    });
    setShowModalEdit(true);
  };

  const askDelete = (id) => {
    setDeleteId(id);
    setConfirmDelete(true);
  };

  const handleDelete = () => {
    api
      .delete(`/matiere/${deleteId}`)
      .then(() => {
        loadSubject();
        Swal.fire({
          title: "Succès",
          text: "Données supprimées avec succès.",
          icon: "success",
          confirmButtonText: "OK",
        });
      })
      .catch((err) => console.error("Erreur: ", err.message))
      .finally(() => setConfirmDelete(false));
  };

  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    api
      .get("/user/profile")
      .then((rep) => setUserRole(rep.data.userRole))
      .catch(() => setUserRole(null));
  }, []);

  return (
    <div className="subject-container min-h-screen p-6 md:p-8 bg-slate-50/70 font-sans">
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
          <h2 className="text-2xl font-semibold text-gray-800">
            {userRole === "Admin"
              ? "Gestion des matières"
              : "Liste des matières"}
          </h2>
          <p className="text-base text-slate-500 mt-1.5">
            Organisez et consultez les attributions de cours par enseignant.
          </p>
        </div>

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
              placeholder="Rechercher..."
            />
          </div>
        </div>
      </div>

      {/* Bouton d'ajout */}
      <div className="flex items-center justify-end mb-6">
        {can(userRole === "Admin" ? "admin" : "secretary", "add") && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-95"
          >
            <FiPlus className="w-4 h-4" />
            <span>Nouvelle matière</span>
          </button>
        )}
      </div>

      {showModal && (
        <SubjectForm
          data={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          isEdit={false}
          mentions={mentions}
          niveaux={niveaux}
          enseignants={enseignants}
          setShowModal={setShowModal}
        />
      )}

      {showModalEdit && (
        <SubjectForm
          data={formData}
          handleChange={handleChange}
          handleSubmit={handleUpdate}
          isEdit={true}
          mentions={mentions}
          niveaux={niveaux}
          enseignants={enseignants}
          setShowModal={setShowModalEdit}
        />
      )}

      {/* Liste des cartes d'enseignants */}
      <div className="space-y-5">
        {loading ? (
          <div className="flex justify-center items-center py-24 bg-white rounded-3xl border border-slate-100 shadow-xs">
            <Loader />
          </div>
        ) : teachersWithSubjects.length > 0 ? (
          teachersWithSubjects.map((teacher) => {
            const isOpen = !!expandedRows[teacher.id];
            return (
              <div
                key={teacher.id}
                className={`bg-white rounded-3xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "border-indigo-200 shadow-lg ring-4 ring-indigo-50/50"
                    : "border-slate-200/80 shadow-xs hover:border-slate-300"
                }`}
              >
                {/* Ligne Enseignant */}
                <div
                  onClick={() => toggleRow(teacher.id)}
                  className="flex items-center justify-between p-6 cursor-pointer select-none bg-white hover:bg-slate-50/60 transition-colors"
                >
                  <div className="flex items-center gap-5">
                    {/* Avatar initiales */}
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg tracking-wide">
                      {teacher.initials || "PR"}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">
                        {teacher.fullName}
                      </h3>
                      <p className="text-sm font-medium text-slate-400 mt-0.5">
                        {teacher.grade}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-50/80 rounded-full border border-indigo-100/50">
                      <FiBookOpen className="w-4 h-4" />
                      {teacher.subjects.length} cours dispensé
                      {teacher.subjects.length > 1 ? "s" : ""}
                    </span>
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-200 ${isOpen ? "bg-indigo-100 text-indigo-700 rotate-180" : "bg-slate-100 text-slate-500"}`}
                    >
                      <FiChevronDown className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Section Dropdown (Grid élargie) */}
                {isOpen && (
                  <div className="border-t border-slate-100 bg-slate-50/50 p-6 md:p-8 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {teacher.subjects.map((mat) => (
                        <div
                          key={mat.id}
                          className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between gap-4 hover:border-indigo-200 hover:shadow-md transition-all group"
                        >
                          <div>
                            <div className="flex justify-between items-start gap-3">
                              <h4 className="font-bold text-slate-900 text-base tracking-tight group-hover:text-indigo-600 transition-colors">
                                {mat.nomMat}
                              </h4>
                              {can(
                                userRole === "Admin" ? "admin" : "secretary",
                                "edit",
                              ) && (
                                <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                                  <button
                                    className="text-slate-400 hover:text-indigo-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openModalEdit(mat);
                                    }}
                                    title="Modifier"
                                  >
                                    <FaEdit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      askDelete(mat.id);
                                    }}
                                    className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                                    title="Supprimer"
                                  >
                                    <FaTrashAlt className="w-4 h-4" />
                                  </button>
                                </div>
                              )}
                            </div>

                            {/* Badges métriques agrandis */}
                            <div className="flex flex-wrap items-center gap-2.5 mt-4">
                              <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 text-sm px-3 py-1.5 rounded-lg font-medium">
                                <FiClock className="w-4 h-4 text-slate-400" />{" "}
                                {mat.nbH}h
                              </span>
                              <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 text-sm px-3 py-1.5 rounded-lg font-medium">
                                <FiAward className="w-4 h-4 text-slate-400" />{" "}
                                Coeff {mat.coeff}
                              </span>
                            </div>
                          </div>

                          {/* Classes associées */}
                          <div className="text-sm text-slate-500 pt-3.5 border-t border-slate-100 flex items-center gap-1.5">
                            <span className="font-medium text-slate-400">
                              Classe :
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {mat.mention?.map((m, i) => (
                                <span
                                  key={i}
                                  className="font-semibold text-slate-800"
                                >
                                  {m} ({mat.niveau?.join(", ")})
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 text-slate-400 text-lg">
            Aucun enseignant ou matière correspondant n'a été trouvé.
          </div>
        )}
      </div>
    </div>
  );
};

export default Subject;
