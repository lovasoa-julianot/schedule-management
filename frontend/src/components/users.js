import { useEffect, useState } from "react";
import { Loader } from "./spin/Spinner";
import { FiEdit2, FiTrash2, FiPlus, FiSearch } from "react-icons/fi";
import api from "../hooks/api";
import UserForm from "./forms/user-form";
import Swal from "sweetalert2";

const Users = () => {
  const [loading, setLoading] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [searchField, setSearchField] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [userdata, setUserdata] = useState({
    id: "",
    username: "",
    nom: "",
    prenom: "",
    email: "",
    role: "",
  });
  const [isEdit, setIsEdit] = useState(false);
  const [enseignants, setEnseignants] = useState([]);

  const loadTeacher = () => {
    api
      .get("user/teacher")
      .then((rep) => {
        setEnseignants(rep.data);
      })
      .catch(() => {
        setEnseignants([]);
      });
  };

  const fetchUsers = () => {
    setLoading(true);
    api
      .get("user/all")
      .then((rep) => {
        setUsersList(rep.data);
      })
      .catch(() => {
        setUsersList([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
    loadTeacher();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserdata({ ...userdata, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api
      .post("user/create", userdata)
      .then(() => {
        setShowModal(false);
        Swal.fire({
          title: "Succès",
          text: "Utilisateur créé avec succès.",
          icon: "success",
          confirmButtonText: "OK",
        });
        fetchUsers();
        loadTeacher();
      })
      .catch((err) => {
        console.error("Erreur lors de la création de l'utilisateur:", err);
        Swal.fire({
          title: "Erreur",
          text: "Une erreur est survenue lors de la création de l'utilisateur.",
          icon: "error",
          confirmButtonText: "OK",
        });
      });
  };

  // Filtrage dynamique des utilisateurs selon la recherche
  const filteredUsers = usersList.filter((u) => {
    const term = searchField.toLowerCase();
    const fullName = `${u.nom || ""} ${u.prenom || ""}`.toLowerCase();
    const email = (u.email || "").toLowerCase();
    return fullName.includes(term) || email.includes(term);
  });

  return (
    <div className="space-y-6 pb-12">
      {/* En-tête avec titre, barre de recherche et bouton d'ajout */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-100">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Gestion des utilisateurs
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Gérez les comptes, les rôles et les accès des utilisateurs du
            système.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Barre de recherche */}
          <div className="relative w-full sm:w-72">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-slate-400">
              <FiSearch className="w-4 h-4" />
            </div>
            <input
              type="search"
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
              className="w-full border border-slate-200 bg-slate-50/50 ps-10 pe-4 py-2.5 text-sm text-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder-slate-400"
              placeholder="Rechercher un utilisateur..."
            />
          </div>

          {/* Bouton Nouvel utilisateur */}
          <button
            onClick={() => setShowModal(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-95 cursor-pointer shrink-0"
          >
            <FiPlus className="w-4 h-4" />
            Nouvel utilisateur
          </button>
        </div>
      </div>

      {showModal && (
        <UserForm
          data={userdata}
          setShowModal={setShowModal}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          enseignants={enseignants}
        />
      )}

      {/* Tableau des utilisateurs */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <div className="max-h-[700px] overflow-y-auto">
            <table className="min-w-full text-left border-collapse">
              <thead className="bg-slate-50 text-slate-400 font-semibold text-xs uppercase tracking-wider sticky top-0 z-10 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Utilisateur</th>
                  <th className="px-6 py-4">Création</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                      <Loader size="lg" color="blue" />
                    </td>
                  </tr>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((u, index) => (
                    <tr
                      key={u.id || index}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3.5">
                          <img
                            className="h-11 w-11 rounded-xl object-cover border border-slate-200 bg-indigo-50 shrink-0"
                            src={
                              u.photo ||
                              `https://ui-avatars.com/api/?name=${u.prenom || ""}+${u.nom || ""}&background=6366f1&color=fff`
                            }
                            alt=""
                          />
                          <div>
                            <div className="font-bold text-slate-900">
                              {u.nom ? u.nom.toUpperCase() : ""}{" "}
                              {u.prenom || ""}
                            </div>
                            <div className="text-xs font-medium text-slate-500 mt-0.5">
                              {u.role || "Enseignant"}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-slate-500 font-medium text-xs">
                        {u.creation || "N/A"}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${
                            u.status === "Actif"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : "bg-amber-50 text-amber-700 border border-amber-100"
                          }`}
                        >
                          {u.status || "En attente"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-indigo-600 font-medium">
                        {u.email ? (
                          <a
                            href={`mailto:${u.email}`}
                            className="hover:underline"
                          >
                            {u.email}
                          </a>
                        ) : (
                          <span className="text-slate-400 italic">
                            Non renseigné
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            title="Modifier"
                            className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-pointer"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            title="Supprimer"
                            className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-16 text-slate-400 italic"
                    >
                      Aucun utilisateur trouvé.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
