import React, { useEffect, useState } from "react";
import { MdExpandMore } from "react-icons/md";
import { FiCalendar, FiClock, FiUserCheck } from "react-icons/fi";
import api from "../../hooks/api";
import Swal from "sweetalert2";
import { Loader } from "../spin/Spinner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Disponibility = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [disponibilites, setDisponibilites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [week, setWeek] = useState(null);

  const groupByEnseignant = (data) => {
    const map = {};

    data.forEach((item) => {
      const key = `${item.nomEns}-${item.prenomEns}`;

      if (!map[key]) {
        map[key] = {
          nomEns: item.nomEns,
          prenomEns: item.prenomEns,
          grade: item.grade,
          disponibilites: [],
        };
      }

      if (item.idDispo !== null) {
        map[key].disponibilites.push({
          idDispo: item.idDispo,
          dateDispo: item.dateDispo,
          hDeb: item.hDeb,
          hFin: item.hFin,
        });
      }
    });

    return Object.values(map);
  };

  const getCurrentWeek = (date) => {
    const day = date.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const monday = new Date(date);
    monday.setDate(date.getDate() + diffToMonday);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    return { monday, sunday };
  };

  const handleWeekChange = (date) => {
    setSelectedDate(date);
    const currentWeek = getCurrentWeek(date);
    const weekStr =
      currentWeek.monday.getDate() +
      "-" +
      currentWeek.sunday.getDate() +
      "_" +
      (date.getMonth() + 1) +
      "_" +
      currentWeek.monday.getFullYear();
    setWeek(weekStr);
  };

  const loadDisponibilites = (targetWeek) => {
    setLoading(true);
    setTimeout(() => {
      api
        .get(`/disponibilite/all?week=${targetWeek}`)
        .then((res) => {
          const grouped = groupByEnseignant(res.data);
          setDisponibilites(grouped);
        })
        .catch(() => {
          Swal.fire({
            icon: "error",
            title: "Erreur de chargement",
            text: "Impossible de charger les disponibilités. Veuillez réessayer plus tard.",
            confirmButtonText: "OK",
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }, 500); // Délai réduit pour plus de réactivité perçue
  };

  useEffect(() => {
    const currentWeek = getCurrentWeek(selectedDate);
    const actualWeek =
      week ||
      currentWeek.monday.getDate() +
        "-" +
        currentWeek.sunday.getDate() +
        "_" +
        (selectedDate.getMonth() + 1) +
        "_" +
        currentWeek.monday.getFullYear();

    loadDisponibilites(actualWeek);
  }, [selectedDate, week]);

  return (
    <div className="space-y-6 pb-12">
      {/* En-tête de la page */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-100">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Disponibilité des enseignants
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Analyse hebdomadaire de la répartition des disponibilités par
            enseignant
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <DatePicker
              selected={selectedDate}
              onChange={handleWeekChange}
              showWeekPicker
              dateFormat="yyyy '– Semaine' ww"
              popperPlacement="bottom-end"
              withPortal
              className="w-full md:w-64 border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      {loading ? (
        <div className="flex items-center justify-center py-20 bg-white rounded-2xl shadow-xs border border-slate-100">
          <Loader size="lg" color="blue" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-xs border border-slate-100 p-6 md:p-8">
          {disponibilites.length === 0 ? (
            <div className="text-center py-12 text-slate-400 italic">
              Aucune disponibilité trouvée pour cette semaine.
            </div>
          ) : (
            <ul className="space-y-4">
              {disponibilites.map((ens, index) => {
                const hasDispos = ens.disponibilites.length > 0;
                const isOpen = openIndex === index;

                return (
                  <li
                    key={index}
                    className="border border-slate-100 rounded-2xl overflow-hidden transition-all duration-200 hover:border-slate-200 bg-slate-50/30"
                  >
                    <button
                      disabled={!hasDispos}
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className={`w-full flex items-center justify-between p-4 md:p-5 text-left transition-colors ${
                        hasDispos
                          ? "hover:bg-slate-100/60 cursor-pointer"
                          : "opacity-70 cursor-not-allowed"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 md:w-14 md:h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-bold text-lg shadow-inner">
                          {ens.nomEns.charAt(0).toUpperCase()}
                          {ens.prenomEns.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-900">
                            {ens.nomEns.toUpperCase()} {ens.prenomEns}
                          </h3>
                          <p className="text-xs font-medium text-slate-500 mt-0.5">
                            {ens.grade || "Aucun grade spécifié"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full ${
                            hasDispos
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : "bg-rose-50 text-rose-700 border border-rose-100"
                          }`}
                        >
                          {hasDispos
                            ? `${ens.disponibilites.length} disponibilité${
                                ens.disponibilites.length > 1 ? "s" : ""
                              }`
                            : "Aucune disponibilité"}
                        </span>
                        {hasDispos && (
                          <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-xs">
                            <MdExpandMore
                              className={`w-5 h-5 transform transition-transform duration-200 ${
                                isOpen ? "rotate-180" : "rotate-0"
                              }`}
                            />
                          </div>
                        )}
                      </div>
                    </button>

                    {/* Liste déroulante des créneaux */}
                    {isOpen && hasDispos && (
                      <div className="px-4 pb-4 md:px-6 md:pb-6 pt-2 border-t border-slate-100 bg-white">
                        <div className="grid grid-cols-3 gap-4 text-xs font-semibold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100">
                          <div className="flex items-center gap-1.5">
                            <FiCalendar className="w-3.5 h-3.5" /> Date dispo
                          </div>
                          <div className="flex items-center gap-1.5">
                            <FiClock className="w-3.5 h-3.5" /> Heure début
                          </div>
                          <div className="flex items-center gap-1.5">
                            <FiClock className="w-3.5 h-3.5" /> Heure fin
                          </div>
                        </div>

                        <div className="mt-3 space-y-2">
                          {ens.disponibilites.map((dispo) => (
                            <div
                              key={dispo.idDispo}
                              className="grid grid-cols-3 gap-4 border border-slate-100 bg-slate-50/50 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 hover:bg-indigo-50/30 hover:border-indigo-100 transition-all"
                            >
                              <div className="font-medium">
                                {dispo.dateDispo}
                              </div>
                              <div>{dispo.hDeb}</div>
                              <div>{dispo.hFin}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Disponibility;
