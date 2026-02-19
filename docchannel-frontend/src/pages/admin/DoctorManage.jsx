import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Modal ─────────────────────────────────────────────────────────────────────
const Modal = ({ isOpen, onClose, children, wide = false }) => {
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 40 }}
          transition={{ type: "spring", duration: 0.45 }}
          className={`bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full ${wide ? "sm:max-w-2xl" : "sm:max-w-lg"} max-h-[92vh] overflow-y-auto`}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const SPECIALTY_COLORS = {
  Cardiology: "from-red-500 to-pink-500",
  Neurology: "from-purple-500 to-indigo-500",
  Pediatrics: "from-green-500 to-teal-500",
  Orthopedics: "from-blue-500 to-cyan-500",
  Dermatology: "from-orange-500 to-amber-500",
  General: "from-slate-500 to-gray-500",
  Ophthalmology: "from-sky-500 to-blue-400",
  Psychiatry: "from-violet-500 to-purple-400",
  Oncology: "from-rose-600 to-red-400",
};

const getSpecialtyColor = (s) =>
  SPECIALTY_COLORS[s] || SPECIALTY_COLORS.General;

const getStatusColor = (status) =>
  ({
    Active: "bg-emerald-100 text-emerald-700 border-emerald-300",
    "On Leave": "bg-amber-100 text-amber-700 border-amber-300",
    Inactive: "bg-slate-100 text-slate-500 border-slate-300",
  })[status] || "bg-slate-100 text-slate-500 border-slate-300";

const initials = (name) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

const EMPTY_DOCTOR = {
  name: "",
  specialty: "",
  email: "",
  phone: "",
  experience: "",
  patients: 0,
  rating: 5.0,
  status: "Active",
  availability: "",
  education: "",
  languages: "",
};

// const SPECIALTIES_ALL = ["All", ...Object.keys(SPECIALTY_COLORS)];
// const SPECIALTIES = Object.keys(SPECIALTY_COLORS);
const STATUSES_ALL = ["All", "Active", "On Leave", "Inactive"];
const STATUSES = ["Active", "On Leave", "Inactive"];

// ── Field component ───────────────────────────────────────────────────────────
const Field = ({ label, children }) => (
  <div>
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
      {label}
    </label>
    {children}
  </div>
);

const inputCls =
  "w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 outline-none text-sm text-slate-700 font-medium focus:border-emerald-400 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.1)] transition-all";
const selectCls = inputCls + " cursor-pointer bg-white";

// ── Main Component ────────────────────────────────────────────────────────────
const DoctorManage = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState(null);
  const [formData, setFormData] = useState(EMPTY_DOCTOR);
  const [formError, setFormError] = useState("");
  const [specializations, setSpecializations] = useState([]);

  const [doctors, setDoctors] = useState([]);

  const [doctorStats, setDoctorStats] = useState({
    totalDoctors: 0,
    activeDoctors: 0,
    inactiveDoctors: 0,
    totalSpecialties: 0,
  });

  const getDoctorStats = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/doctorstats`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch doctor stats");
      }
      const data = await response.json();
      console.log("Doctor stats:", data);
      setDoctorStats(data.data);
    } catch (error) {
      console.error("Error fetching doctor stats:", error);
    }
  };

  const getAllDoctors = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/getalldoctors?search=${searchQuery}&specialty=${specialtyFilter}&status=${statusFilter}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch doctors");
      }
      const data = await response.json();
      console.log("All doctors:", data.data);
      setDoctors(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const getSpecializations = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/specializations`,
      );
      const data = await response.json();
      console.log("Specializations:", data.data);
      setSpecializations(data.data ?? []);
    } catch (error) {
      console.error("Error fetching specializations:", error);
    }
  };

  useEffect(() => {
    getDoctorStats();
    getAllDoctors();
  }, [searchQuery, specialtyFilter, statusFilter]);
  useEffect(() => {
    getSpecializations();
  }, []);
  // ── Filtering ───────────────────────────────────────────────────────────────
  const filteredDoctors = doctors;

  // ── Stats ───────────────────────────────────────────────────────────────────
  const statsData = [
    {
      label: "Total Doctors",
      value: doctorStats.totalDoctors,
      icon: "👨‍⚕️",
      color: "from-teal-500 to-emerald-500",
    },
    {
      label: "Active Now",
      value: doctorStats.activeDoctors,
      icon: "✓",
      color: "from-green-500 to-teal-500",
    },
    {
      label: "Inactive Now",
      value: doctorStats.inactiveDoctors,
      icon: "✗",
      color: "from-red-500 to-orange-500",
    },
    {
      label: "Specialties",
      value: doctorStats.totalSpecialties,
      icon: "🏥",
      color: "from-blue-500 to-cyan-500",
    },
  ];

  // ── CRUD handlers ───────────────────────────────────────────────────────────
  const openAdd = () => {
    setFormData(EMPTY_DOCTOR);
    setFormError("");
    setShowAddModal(true);
  };

  const openEdit = (doc) => {
    setCurrentDoctor(doc);
    setFormData({
      ...doc,
      languages: Array.isArray(doc.languages)
        ? doc.languages.join(", ")
        : doc.languages,
    });
    setFormError("");
    setShowEditModal(true);
  };

  const openView = (doc) => {
    setCurrentDoctor(doc);
    setShowViewModal(true);
  };
  const openDelete = (doc) => {
    setCurrentDoctor(doc);
    setShowDeleteModal(true);
  };

  const validateForm = (data) => {
    if (!data.name.trim()) return "Name is required.";
    if (!data.email.trim()) return "Email is required.";
    if (!data.phone.trim()) return "Phone is required.";
    if (!data.experience.trim()) return "Experience is required.";
    return "";
  };

  const handleAdd = () => {
    const err = validateForm(formData);
    if (err) {
      setFormError(err);
      return;
    }
    const newDoc = {
      ...formData,
      id: Date.now(),
      patients: Number(formData.patients) || 0,
      rating: Number(formData.rating) || 5.0,
    };
    setDoctors((prev) => [...prev, newDoc]);
    setShowAddModal(false);
  };

  const handleEdit = () => {
    const err = validateForm(formData);
    if (err) {
      setFormError(err);
      return;
    }
    setDoctors((prev) =>
      prev.map((d) =>
        d.id === currentDoctor.id
          ? {
              ...formData,
              id: d.id,
              patients: Number(formData.patients) || 0,
              rating: Number(formData.rating) || 5.0,
            }
          : d,
      ),
    );
    setShowEditModal(false);
  };

  const handleDelete = () => {
    setDoctors((prev) => prev.filter((d) => d.id !== currentDoctor.id));
    setShowDeleteModal(false);
    setCurrentDoctor(null);
  };

  const setField = (key, val) =>
    setFormData((prev) => ({ ...prev, [key]: val }));

  // ── Form UI (shared by Add & Edit) ─────────────────────────────────────────
  const DoctorForm = ({ onSubmit, submitLabel }) => (
    <div className="p-5 sm:p-7">
      <div className="space-y-4">
        {formError && (
          <div className="bg-rose-50 border border-rose-200 text-rose-600 text-sm font-semibold px-4 py-3 rounded-xl">
            {formError}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Full Name *">
            <input
              className={inputCls}
              value={formData.name}
              onChange={(e) => setField("name", e.target.value)}
              placeholder="Dr. John Smith"
            />
          </Field>
          <Field label="Specialty *">
            <select
              className={selectCls}
              value={formData.specialty}
              onChange={(e) => setField("specialty", e.target.value)}
            >
              <option value="">Select Specialty</option>
              {specializations.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Email *">
            <input
              className={inputCls}
              type="email"
              value={formData.email}
              onChange={(e) => setField("email", e.target.value)}
              placeholder="doctor@hospital.com"
            />
          </Field>
          <Field label="Phone *">
            <input
              className={inputCls}
              type="tel"
              value={formData.phone}
              onChange={(e) => setField("phone", e.target.value)}
              placeholder="+1 (555) 000-0000"
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Experience *">
            <input
              className={inputCls}
              value={formData.experience}
              onChange={(e) => setField("experience", e.target.value)}
              placeholder="10 years"
            />
          </Field>
          <Field label="SLMC Number *">
            <input
              className={inputCls}
              value={formData.slmc_number}
              onChange={(e) => setField("slmc_number", e.target.value)}
              placeholder="SLMC-12345"
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Status">
            <select
              className={selectCls}
              value={formData.status}
              onChange={(e) => setField("status", e.target.value)}
            >
              {STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Field>
          <Field label="Availability">
            <input
              className={inputCls}
              value={formData.availability == 1 ? "Available" : "Not Available"}
              onChange={(e) =>
                setField("availability", e.target.value == "Available" ? 1 : 0)
              }
              placeholder="Mon–Fri, 9AM–5PM"
            />
          </Field>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={onSubmit}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-3 rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all shadow-md"
          >
            {submitLabel}
          </button>
          <button
            onClick={() => {
              setShowAddModal(false);
              setShowEditModal(false);
            }}
            className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-200 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  // ── Doctor Card (Grid) ──────────────────────────────────────────────────────
  const DoctorCard = ({ doctor, index }) => (
    <motion.div
      key={doctor.id}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ delay: index * 0.05 }}
      className="doctor-card rounded-2xl shadow-lg overflow-hidden"
      style={{ "--sg": getSpecialtyColor(doctor.specialty) }}
    >
      <div
        className={`h-1.5 w-full bg-gradient-to-r ${getSpecialtyColor(doctor.specialty)}`}
      />
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg bg-gradient-to-br ${getSpecialtyColor(doctor.specialty)}`}
          >
            {initials(doctor.name)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-800 text-base mb-1 truncate">
              {doctor.name}
            </h3>
            <span
              className={`inline-block px-3 py-1 rounded-lg text-xs font-bold text-white bg-gradient-to-r ${getSpecialtyColor(doctor.specialty)}`}
            >
              {doctor.specialty}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-1">
            <span className="font-bold text-slate-800 text-sm">
              {doctor.Note}
            </span>
          </div>
          <span className="text-slate-500 text-sm">
            {doctor.experience} Years Of Experience.
          </span>
          <span
            className={`ml-auto px-2.5 py-1 rounded-lg text-xs font-bold border ${getStatusColor(doctor.status)}`}
          >
            {doctor.status}
          </span>
        </div>

        <div className="space-y-2 mb-4 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-emerald-500 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span className="truncate">{doctor.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-emerald-500 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <span>{doctor.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-emerald-500 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              {doctor.availability == 1 ? "Available" : "Not Available"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-emerald-500 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="font-semibold">{doctor.patients} Patients</span>
          </div>
        </div>

        <div className="flex gap-2 pt-4 border-t border-slate-100">
          <button
            onClick={() => openView(doctor)}
            className="action-btn flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            View
          </button>
          <button
            onClick={() => openEdit(doctor)}
            className="action-btn flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit
          </button>
          <button
            onClick={() => openDelete(doctor)}
            className="action-btn-danger flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-500 hover:text-white transition-all"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </motion.div>
  );

  // ── Doctor Row (List) ───────────────────────────────────────────────────────
  const DoctorRow = ({ doctor, index }) => (
    <motion.div
      key={doctor.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.05 }}
      className="doctor-card rounded-2xl p-5 shadow-lg"
      style={{ "--sg": getSpecialtyColor(doctor.specialty) }}
    >
      <div
        className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r ${getSpecialtyColor(doctor.specialty)}`}
      />
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div
            className={`w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg bg-gradient-to-br ${getSpecialtyColor(doctor.specialty)} flex-shrink-0`}
          >
            {initials(doctor.name)}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-slate-800 text-lg truncate">
              {doctor.name}
            </h3>
            <div className="flex items-center gap-3 flex-wrap mt-0.5">
              <span
                className={`inline-block px-2.5 py-0.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r ${getSpecialtyColor(doctor.specialty)}`}
              >
                {doctor.specialty}
              </span>
              <span className="text-amber-400 text-sm font-bold">
                ★ {doctor.rating}
              </span>
              <span className="text-slate-500 text-sm">
                {doctor.experience}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${getStatusColor(doctor.status)}`}
              >
                {doctor.status}
              </span>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-8 flex-shrink-0">
          <div className="text-center">
            <p className="text-xl font-bold text-emerald-600">
              {doctor.patients}
            </p>
            <p className="text-xs text-slate-400 font-semibold">Patients</p>
          </div>
          <div className="text-sm text-slate-600 max-w-[180px]">
            <p className="font-semibold">{doctor.availability}</p>
            <p className="text-xs text-slate-400 truncate">
              {doctor.education}
            </p>
          </div>
        </div>

        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => openView(doctor)}
            className="action-btn p-2.5 rounded-xl"
            title="View"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </button>
          <button
            onClick={() => openEdit(doctor)}
            className="action-btn p-2.5 rounded-xl"
            title="Edit"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={() => openDelete(doctor)}
            className="p-2.5 rounded-xl bg-rose-50 text-rose-500 border border-rose-200 hover:bg-rose-500 hover:text-white transition-all"
            title="Delete"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-green-50 p-4 sm:p-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&family=Manrope:wght@400;500;600;700&display=swap');
        * { font-family: 'Manrope', sans-serif; }
        h1,h2,h3 { font-family: 'Poppins', sans-serif; }

        .doctor-card {
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.5);
          transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
          position: relative;
        }
        .doctor-card:hover {
          transform: translateY(-6px) scale(1.015);
          box-shadow: 0 24px 48px rgba(16,185,129,0.18);
          border-color: rgba(16,185,129,0.35);
        }
        .stat-card {
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255,255,255,0.4);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .stat-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
        .search-input {
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(16,185,129,0.2);
          transition: all 0.3s ease;
        }
        .search-input:focus { border-color:#10b981; box-shadow:0 0 0 4px rgba(16,185,129,0.1); }
        .filter-btn {
          background: rgba(255,255,255,0.8);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(16,185,129,0.2);
          transition: all 0.3s ease;
        }
        .filter-btn:hover { border-color:#10b981; }
        .view-toggle { background:rgba(255,255,255,0.6); backdrop-filter:blur(10px); border:1px solid rgba(16,185,129,0.2); transition:all 0.3s ease; }
        .view-toggle.active { background:linear-gradient(135deg,#10b981,#059669); color:white; box-shadow:0 4px 12px rgba(16,185,129,0.4); }
        .action-btn { background:rgba(255,255,255,0.9); backdrop-filter:blur(10px); border:1px solid rgba(16,185,129,0.3); transition:all 0.2s ease; }
        .action-btn:hover { background:linear-gradient(135deg,#10b981,#059669); color:white; transform:translateY(-2px); box-shadow:0 8px 16px rgba(16,185,129,0.3); }
        .gradient-text { background:linear-gradient(135deg,#10b981,#059669); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
      `}</style>

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-4xl sm:text-5xl font-bold gradient-text mb-1">
            Doctor Management
          </h1>
          <p className="text-slate-500 text-base sm:text-lg">
            Manage profiles, schedules, and specialties
          </p>
        </div>
        <button
          onClick={openAdd}
          className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 whitespace-nowrap"
        >
          + Add New Doctor
        </button>
      </motion.div>

      {/* ── Stats ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        {statsData.map((stat, i) => (
          <div key={i} className="stat-card rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{stat.icon}</span>
              <span
                className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
              >
                {stat.value}
              </span>
            </div>
            <p className="text-slate-500 font-semibold text-xs uppercase tracking-wider">
              {stat.label}
            </p>
          </div>
        ))}
      </motion.div>

      {/* ── Filters ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 shadow-lg border border-white/40 mb-8"
      >
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
          <div className="flex-1 relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search by name, specialty, email…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input w-full pl-12 pr-4 py-3 rounded-xl outline-none text-slate-700 font-medium"
            />
          </div>
          <div className="flex gap-3 flex-wrap">
            <select
              value={specialtyFilter}
              onChange={(e) => setSpecialtyFilter(e.target.value)}
              className="filter-btn px-4 py-3 rounded-xl outline-none text-slate-700 font-semibold cursor-pointer"
            >
              <option value="All">All Specialties</option>
              {specializations.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-btn px-4 py-3 rounded-xl outline-none text-slate-700 font-semibold cursor-pointer"
            >
              {STATUSES_ALL.map((s) => (
                <option key={s}>{s === "All" ? "All Status" : s}</option>
              ))}
            </select>
            <div className="flex gap-1 bg-white/60 p-1 rounded-xl border border-emerald-200">
              <button
                onClick={() => setViewMode("grid")}
                className={`view-toggle px-3 py-2 rounded-lg ${viewMode === "grid" ? "active" : "text-slate-500"}`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`view-toggle px-3 py-2 rounded-lg ${viewMode === "list" ? "active" : "text-slate-500"}`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Doctor List/Grid ── */}
      <AnimatePresence mode="wait">
        {viewMode === "grid" ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredDoctors.map((doc, i) => (
                <DoctorCard key={doc.id} doctor={doc} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <AnimatePresence>
              {filteredDoctors.map((doc, i) => (
                <DoctorRow key={doc.id} doctor={doc} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Empty State ── */}
      {filteredDoctors.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl p-16 text-center shadow-lg mt-4"
        >
          <svg
            className="w-16 h-16 mx-auto text-slate-300 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <p className="text-slate-500 text-xl font-bold mb-2">
            No doctors found
          </p>
          <p className="text-slate-400">
            Try adjusting your filters or search criteria
          </p>
        </motion.div>
      )}

      {/* ════════════════════════════════════════════════════════════
          MODALS
      ════════════════════════════════════════════════════════════ */}

      {/* Add Doctor */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} wide>
        <div className="p-5 sm:p-7 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Add New Doctor</h2>
            <p className="text-slate-400 text-sm mt-0.5">
              Fill in the details below
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(false)}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <DoctorForm onSubmit={handleAdd} submitLabel="Add Doctor" />
      </Modal>

      {/* Edit Doctor */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        wide
      >
        <div className="p-5 sm:p-7 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Edit Doctor</h2>
            <p className="text-slate-400 text-sm mt-0.5">
              {currentDoctor?.name}
            </p>
          </div>
          <button
            onClick={() => setShowEditModal(false)}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <DoctorForm onSubmit={handleEdit} submitLabel="Save Changes" />
      </Modal>

      {/* View Doctor */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        wide
      >
        {currentDoctor && (
          <div>
            {/* Hero */}
            <div
              className={`p-6 bg-gradient-to-br ${getSpecialtyColor(currentDoctor.specialty)} rounded-t-2xl text-white`}
            >
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`px-3 py-1 rounded-lg text-xs font-bold bg-white/20 border border-white/30`}
                >
                  {currentDoctor.specialty}
                </span>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-white/70 hover:text-white p-1"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center text-3xl font-bold border-2 border-white/30">
                  {initials(currentDoctor.name)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{currentDoctor.name}</h2>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="text-white/90 text-sm">
                      {currentDoctor.Note ?? "N/A"}
                    </span>
                    <span className="text-white/70 text-sm">·</span>
                    <span className="text-white/90 text-sm">
                      {currentDoctor.experience} Years Of Experience
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-lg text-xs font-bold ${
                        currentDoctor.status === "Active"
                          ? "bg-white text-emerald-600"
                          : currentDoctor.status === "On Leave"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {currentDoctor.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: "✉", label: "Email", value: currentDoctor.email },
                  { icon: "📞", label: "Phone", value: currentDoctor.phone },
                  {
                    icon: "🕐",
                    label: "Availability",
                    value:
                      currentDoctor.availability == 1
                        ? "Available"
                        : "Not Available",
                  },
                  {
                    icon: "👥",
                    label: "Patients",
                    value: currentDoctor.patients ?? "N/A",
                  },
                  {
                    icon: "🎓",
                    label: "SLMC Number",
                    value: currentDoctor.slmc_number,
                  },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">
                      {icon} {label}
                    </p>
                    <p className="text-slate-700 font-semibold text-sm">
                      {value || "—"}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    openEdit(currentDoctor);
                  }}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-3 rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all"
                >
                  Edit Doctor
                </button>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    openDelete(currentDoctor);
                  }}
                  className="flex-1 bg-rose-50 text-rose-600 font-bold py-3 rounded-xl border border-rose-200 hover:bg-rose-500 hover:text-white transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirm */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-rose-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Delete Doctor
          </h2>
          <p className="text-slate-500 mb-6">
            Are you sure you want to remove{" "}
            <span className="font-bold text-slate-700">
              {currentDoctor?.name}
            </span>
            ? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleDelete}
              className="flex-1 bg-gradient-to-r from-rose-500 to-red-500 text-white font-bold py-3 rounded-xl hover:from-rose-600 hover:to-red-600 transition-all"
            >
              Yes, Delete
            </button>
            <button
              onClick={() => setShowDeleteModal(false)}
              className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DoctorManage;
