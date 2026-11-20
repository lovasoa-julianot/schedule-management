import React, { useState, useEffect } from "react";
import {
  FiPlus,
  FiSearch,
  FiMail,
  FiPhone,
  FiMapPin,
  FiUser,
} from "react-icons/fi";
import {
  FaDownload,
  FaEdit,
  FaFileExport,
  FaFileImport,
  FaFilePdf,
  FaFileExcel,
  FaUpload,
  FaTrashAlt,
} from "react-icons/fa";
import TeacherForm from "./forms/teacher-form";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Menu,
  MenuItem,
} from "@mui/material";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import AlertInfo from "./notification/alert";
import Confirm from "./notification/confirm";
import api from "../hooks/api";
import { Loader } from "./spin/Spinner";
import Swal from "sweetalert2";
import { can } from "../hooks/permission";

const Teacher = () => {
  const [enseignant, setEnseignant] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    nom: "",
    prenom: "",
    adresse: "",
    phone: "",
    genre: "",
    grade: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);

  const loadData = () => {
    setLoading(true);
    api
      .get("/user/teacher")
      .then((res) => {
        setEnseignant(res.data);
        setFiltered(res.data);
      })
      .catch((err) => console.error("Erreur de chargement:", err.message))
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 1200);
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

  const openModalEdit = (ens) => {
    setFormData({
      id: ens.id,
      nom: ens.nom,
      prenom: ens.prenom,
      adresse: ens.adresse,
      phone: ens.phone,
      genre: ens.genre,
      grade: ens.grade,
      email: ens.email,
    });
    setShowModalEdit(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api
      .post("/user/add/teacher", formData)
      .then(() => {
        loadData();
        setFormData({
          id: "",
          nom: "",
          prenom: "",
          adresse: "",
          phone: "",
          genre: "",
          grade: "",
          email: "",
        });
        Swal.fire({
          title: "Succès",
          text: "Données enregistrées avec succès.",
          icon: "success",
          confirmButtonText: "OK",
        });
      })
      .catch((err) =>
        Swal.fire({
          title: "Erreur",
          text:
            err?.response?.data ||
            "Une erreur est survenue lors de l'enregistrement.",
          icon: "error",
          confirmButtonText: "OK",
        }),
      );

    setShowModal(false);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!formData.id) return;
    api
      .put(`/user/teacher/${formData.id}`, formData)
      .then(() => {
        loadData();
        setFormData({
          id: "",
          nom: "",
          prenom: "",
          adresse: "",
          phone: "",
          genre: "",
          grade: "",
          email: "",
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
      .delete(`/user/teacher/${deleteId}`)
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
  const filter = enseignant.filter((ens) =>
    (
      (ens.nom || "") +
      " " +
      (ens.prenom || "") +
      " " +
      (ens.adresse || "") +
      " " +
      (ens.grade || "") +
      " " +
      (ens.phone || "") +
      " " +
      (ens.genre || "")
    )
      .toLowerCase()
      .includes(searchfield.toLowerCase()),
  );

  const openModal = () => {
    setFormData({
      id: "",
      nom: "",
      prenom: "",
      adresse: "",
      phone: "",
      genre: "",
      grade: "",
      email: "",
    });
    setShowModal(true);
  };

  const ExportExcel = () => {
    if (enseignant.length > 0) {
      const ws = XLSX.utils.json_to_sheet(enseignant);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, `Enseignant`);
      XLSX.writeFile(wb, "enseignants.xlsx");
    }
  };

  const ExportPDF = () => {
    const doc = new jsPDF();
    const colonnes = ["NOM", "PRENOM", "GENRE", "GRADE", "TELEPHONE"];
    if (enseignant.length > 0) {
      const ligne = enseignant.map((ligne) => [
        (ligne.nom || "").toUpperCase(),
        ligne.prenom || "",
        ligne.genre || "",
        ligne.grade || "",
        ligne.phone || "",
      ]);

      doc.text(`Liste des enseignants`, 15, 10);
      doc.autoTable({
        head: [colonnes],
        body: ligne,
        startY: 20,
      });

      doc.save(`liste_enseignants.pdf`);
    }
  };

  const [anchorElImport, setAnchorElImport] = useState(null);
  const openImportMenu = Boolean(anchorElImport);
  const [anchorElExport, setAnchorElExport] = useState(null);
  const openExportMenu = Boolean(anchorElExport);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleOpenImportMenu = (event) =>
    setAnchorElImport(event.currentTarget);
  const handleOpenExportMenu = (event) =>
    setAnchorElExport(event.currentTarget);
  const handleCloseImportMenu = () => setAnchorElImport(null);
  const handleCloseExportMenu = () => setAnchorElExport(null);

  const downloadCsvTemplate = () => {
    const headers = ["nom", "prenom", "genre", "adresse", "telephone", "grade"];
    const exampleRow = [
      "RAKOTOARIJAONA",
      "Mahafaly Germain",
      "Masculin",
      "Tanambao",
      "0345896612",
      "Professeur Titulaire",
    ];
    const csvContent = [headers.join(","), exampleRow.join(",")].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "template_enseignants.csv");
    handleCloseImportMenu();
  };

  const handleImportCsv = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImporting(true);
    setProgress(0);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      delimiter: ",",
      encoding: "UTF-8",
      complete: (results) => {
        const data = results.data;
        if (data.length === 0) {
          setImporting(false);
          alert("Le fichier CSV est vide ou mal formaté !");
          return;
        }

        let current = 0;
        const interval = setInterval(() => {
          if (current < 70) {
            current += 5;
            setProgress(current);
          }
        }, 100);

        api
          .post("/user/teacher/import", data)
          .then(() => {
            clearInterval(interval);
            const finishInterval = setInterval(() => {
              if (current < 100) {
                current += 5;
                setProgress(current);
              } else {
                clearInterval(finishInterval);
                setImporting(false);
                loadData();
                Swal.fire({
                  title: "Importation terminée !",
                  text: "Les données ont été importées avec succès.",
                  icon: "success",
                });
              }
            }, 100);
          })
          .catch((err) => {
            clearInterval(interval);
            setImporting(false);
            Swal.fire({
              title: "Erreur d'importation",
              text: "Une erreur est survenue lors de l'importation des données.",
              icon: "error",
            });
          });
      },
      error: () => {
        setImporting(false);
        setProgress(0);
        alert("Erreur lors de l'import CSV");
      },
    });

    handleCloseImportMenu();
    handleCloseExportMenu();
  };

  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    api
      .get("/user/profile")
      .then((rep) => setUserRole(rep.data.userRole))
      .catch(() => setUserRole(null));
  }, []);

  return (
    <div className="teacher-container min-h-screen p-6 md:p-8 bg-slate-50/70 font-sans">
      {showAlert && alert && (
        <AlertInfo alert={alert} setShowAlert={setShowAlert} />
      )}

      <Dialog
        open={importing}
        maxWidth="xs"
        fullWidth
        PaperProps={{ className: "rounded-2xl p-4 shadow-xl" }}
      >
        <DialogTitle className="text-center font-bold text-slate-800">
          Importation en cours…
        </DialogTitle>
        <DialogContent className="space-y-4">
          <p className="text-sm text-slate-500 text-center">
            Veuillez patienter pendant l’analyse du fichier CSV.
          </p>
          <LinearProgress
            variant="determinate"
            value={progress}
            className="h-2.5 rounded-full"
          />
          <p className="text-center text-sm font-semibold text-indigo-600">
            {progress} %
          </p>
        </DialogContent>
      </Dialog>

      {/* En-tête de la page */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-100 mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            {userRole === "Admin"
              ? "Gestion des enseignants"
              : "Liste des enseignants"}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Consultez, gérez et exportez les dossiers du corps enseignant.
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
              placeholder="Rechercher un enseignant..."
            />
          </div>
        </div>
      </div>

      {/* Barre d'outils secondaire (Export / Import / Ajout) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          {/* Bouton Export */}
          <div className="relative">
            <button
              onClick={handleOpenExportMenu}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-xs transition-all hover:bg-slate-50"
            >
              <FaFileExport className="w-4 h-4 text-slate-500" />
              <span>Exporter</span>
            </button>
            <Menu
              anchorEl={anchorElExport}
              open={openExportMenu}
              onClose={handleCloseExportMenu}
              PaperProps={{
                className: "rounded-xl shadow-lg border border-slate-100 mt-2",
              }}
            >
              <MenuItem
                onClick={ExportPDF}
                className="flex items-center gap-2.5 text-sm py-2.5"
              >
                <FaFilePdf className="w-4 h-4 text-rose-500" /> Format PDF
              </MenuItem>
              <MenuItem
                onClick={ExportExcel}
                className="flex items-center gap-2.5 text-sm py-2.5"
              >
                <FaFileExcel className="w-4 h-4 text-emerald-500" /> Format
                Excel
              </MenuItem>
            </Menu>
          </div>

          {/* Bouton Import */}
          {can(userRole === "Admin" ? "admin" : "secretary", "import") && (
            <div className="relative">
              <button
                onClick={handleOpenImportMenu}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-xs transition-all hover:bg-slate-50"
              >
                <FaFileImport className="w-4 h-4 text-slate-500" />
                <span>Importer</span>
              </button>
              <Menu
                anchorEl={anchorElImport}
                open={openImportMenu}
                onClose={handleCloseImportMenu}
                PaperProps={{
                  className:
                    "rounded-xl shadow-lg border border-slate-100 mt-2",
                }}
              >
                <MenuItem className="text-sm py-2.5">
                  <label className="flex items-center gap-2.5 cursor-pointer w-full">
                    <FaUpload className="w-4 h-4 text-indigo-500" />
                    Importer un fichier CSV
                    <input
                      type="file"
                      accept=".csv"
                      hidden
                      onChange={handleImportCsv}
                    />
                  </label>
                </MenuItem>
                <MenuItem
                  onClick={downloadCsvTemplate}
                  className="flex items-center gap-2.5 text-sm py-2.5"
                >
                  <FaDownload className="w-4 h-4 text-slate-500" /> Télécharger
                  le template CSV
                </MenuItem>
              </Menu>
            </div>
          )}
        </div>

        {/* Bouton Nouveau */}
        {can(userRole === "Admin" ? "admin" : "secretary", "add") && (
          <button
            onClick={openModal}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-95"
          >
            <FiPlus className="w-4 h-4" />
            <span>Nouveau enseignant</span>
          </button>
        )}
      </div>

      {showModal && (
        <TeacherForm
          data={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          isEdit={false}
          setShowModal={setShowModal}
        />
      )}

      {showModalEdit && (
        <TeacherForm
          data={formData}
          handleChange={handleChange}
          handleSubmit={handleUpdate}
          isEdit={true}
          setShowModal={setShowModalEdit}
        />
      )}

      {confirmDelete && (
        <Confirm
          handleDelete={handleDelete}
          setConfirmDelete={setConfirmDelete}
        />
      )}

      {/* Tableau moderne type carte */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <th className="px-5 py-3.5">#</th>
                <th className="px-5 py-3.5">Enseignant</th>
                <th className="px-5 py-3.5">Genre</th>
                <th className="px-5 py-3.5">Grade</th>
                <th className="px-5 py-3.5">Contact</th>
                <th className="px-5 py-3.5">Adresse</th>
                {can(userRole === "Admin" ? "admin" : "secretary", "edit") && (
                  <th className="px-5 py-3.5 text-end">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-20 text-center">
                    <Loader />
                  </td>
                </tr>
              ) : filter.length > 0 ? (
                filter.map((ens, index) => {
                  const initials =
                    `${ens.nom?.[0] || ""}${ens.prenom?.[0] || ""}`.toUpperCase();
                  return (
                    <tr
                      key={ens.id || index}
                      className="hover:bg-slate-50/60 transition-colors group"
                    >
                      <td className="px-5 py-4 font-medium text-slate-400">
                        {index + 1}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs tracking-wide shrink-0">
                            {initials || <FiUser className="w-4 h-4" />}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 uppercase">
                              {ens.nom}{" "}
                              <span className="font-normal capitalize">
                                {ens.prenom}
                              </span>
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-600">
                          {ens.genre || "N/A"}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-medium text-slate-800">
                        {ens.grade || "N/A"}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                            <FiPhone className="w-3.5 h-3.5 text-slate-400" />{" "}
                            {ens.phone || "N/A"}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs text-slate-400">
                            <FiMail className="w-3.5 h-3.5" />{" "}
                            {ens.email || "Aucun email"}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        <span className="flex items-center gap-1 text-xs">
                          <FiMapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />{" "}
                          {ens.adresse || "N/A"}
                        </span>
                      </td>
                      {can(
                        userRole === "Admin" ? "admin" : "secretary",
                        "edit",
                      ) && (
                        <td className="px-5 py-4 text-end">
                          <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => openModalEdit(ens)}
                              className="text-slate-400 hover:text-indigo-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                              title="Modifier"
                            >
                              <FaEdit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => askDelete(ens.id)}
                              className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                              title="Supprimer"
                            >
                              <FaTrashAlt className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-16 text-slate-400">
                    Aucun enseignant trouvé.
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

export default Teacher;
