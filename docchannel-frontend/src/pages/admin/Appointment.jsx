import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDoctors } from '../../hooks/useDoctors';
import { useAppointments } from '../../hooks/useAppointments';

// ─── DATA ────────────────────────────────────────────────────────────────────
const DOCTORS = [
  { id: 1, name: 'Dr. Amara Smith', specialty: 'Cardiology', avatar: 'AS', color: 'from-rose-400 to-pink-500', available: true },
  { id: 2, name: 'Dr. Leo Williams', specialty: 'Neurology', avatar: 'LW', color: 'from-violet-400 to-purple-500', available: true },
  { id: 3, name: 'Dr. Maya Brown', specialty: 'Orthopedics', avatar: 'MB', color: 'from-emerald-400 to-teal-500', available: false },
  { id: 4, name: 'Dr. James Taylor', specialty: 'Psychiatry', avatar: 'JT', color: 'from-amber-400 to-orange-500', available: true },
  { id: 5, name: 'Dr. Priya Patel', specialty: 'Dermatology', avatar: 'PP', color: 'from-cyan-400 to-blue-500', available: true },
  { id: 6, name: 'Dr. Oliver Chen', specialty: 'Gastroenterology', avatar: 'OC', color: 'from-indigo-400 to-blue-500', available: false },
  { id: 7, name: 'Dr. Sofia Martinez', specialty: 'Endocrinology', avatar: 'SM', color: 'from-fuchsia-400 to-pink-500', available: true },
  { id: 8, name: 'Dr. Noah Harris', specialty: 'Pulmonology', avatar: 'NH', color: 'from-lime-400 to-green-500', available: true },
];

const INITIAL_APPOINTMENTS = [
  { id: 1, patient: 'Sarah Johnson', email: 'sarah.j@email.com', date: '2024-02-14', time: '09:00', duration: '30', status: 'Confirmed', type: 'Consultation', doctorId: 1, notes: 'Follow-up checkup' },
  { id: 2, patient: 'Michael Chen', email: 'mchen@email.com', date: '2024-02-14', time: '10:30', duration: '45', status: 'Pending', type: 'Surgery', doctorId: 2, notes: 'Pre-surgery consultation' },
  { id: 3, patient: 'Emily Davis', email: 'emily.d@email.com', date: '2024-02-14', time: '14:00', duration: '30', status: 'Completed', type: 'Checkup', doctorId: 3, notes: 'Annual physical' },
  { id: 4, patient: 'James Wilson', email: 'jwilson@email.com', date: '2024-02-15', time: '11:00', duration: '60', status: 'Cancelled', type: 'Therapy', doctorId: 4, notes: 'Patient cancelled' },
  { id: 5, patient: 'Lisa Anderson', email: 'l.anderson@email.com', date: '2024-02-15', time: '15:30', duration: '30', status: 'Confirmed', type: 'Consultation', doctorId: 1, notes: 'Initial consultation' },
];

const TYPES = ['Consultation', 'Checkup', 'Surgery', 'Therapy', 'Emergency'];
const STATUSES = ['All', 'Confirmed', 'Pending', 'Completed', 'Cancelled'];
const DURATIONS = ['15', '30', '45', '60', '90'];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const statusStyle = (s) => ({
  Confirmed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Pending: 'bg-amber-100  text-amber-700  border-amber-200',
  Completed: 'bg-sky-100    text-sky-700    border-sky-200',
  Cancelled: 'bg-rose-100   text-rose-700   border-rose-200',
}[s] || 'bg-slate-100 text-slate-600 border-slate-200');

const fmt12 = (t) => {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  return `${((h % 12) || 12).toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${suffix}`;
};

// ─── DOCTOR SELECTOR MODAL ────────────────────────────────────────────────────
function DoctorPickerModal({ selected, onSelect, onClose }) {
  const [query, setQuery] = useState('');
  const [filterAvail, setFilterAvail] = useState(false);
  const inputRef = useRef(null);


  const { doctors, loading, error, fetchDoctors } = useDoctors();

  useEffect(() => {
    fetchDoctors({ search: query, availableOnly: filterAvail });
  }, [query, filterAvail]);


  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 80); }, []);
  // const filtered = DOCTORS.filter(d =>
  //   (d.name.toLowerCase().includes(query.toLowerCase()) ||
  //     d.specialty.toLowerCase().includes(query.toLowerCase())) &&
  //   (!filterAvail || d.available)
  // );

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 20 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
        style={{ maxHeight: '80vh' }}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow">
                <svg className="w-4.5 h-4.5 w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-800" style={{ fontFamily: 'Lexend,sans-serif' }}>
                Select Doctor
              </h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search by name or specialty…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          <button
            onClick={() => setFilterAvail(v => !v)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filterAvail ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
          >
            <span className={`w-2 h-2 rounded-full ${filterAvail ? 'bg-emerald-500' : 'bg-slate-400'}`} />
            Available only
          </button>
        </div>

        {/* List */}
        <div className="overflow-y-auto" style={{ maxHeight: '52vh' }}>
          {loading && (
            <div className="p-10 flex flex-col items-center gap-3 text-slate-400 text-sm">
              <svg className="w-8 h-8 animate-spin text-blue-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Loading doctors…
            </div>
          )}

          {error && !loading && (
            <div className="p-10 text-center">
              <p className="text-rose-400 text-sm font-medium">{error}</p>
              <button onClick={() => fetchDoctors({ search: query, availableOnly: filterAvail })}
                className="mt-3 text-xs text-blue-500 hover:underline">
                Try again
              </button>
            </div>
          )}

          {!loading && !error && doctors.length === 0 && (
            <div className="p-10 text-center text-slate-400 text-sm">
              No doctors match your search
            </div>
          )}

          {!loading && !error && doctors.length > 0 && (
            <div className="p-3 space-y-1">
              {doctors.map(doc => (
                <button
                  key={doc.id}
                  onClick={() => { onSelect(doc); onClose(); }}
                  className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all text-left group
            ${selected?.id === doc.id ? 'bg-blue-50 ring-2 ring-blue-300' : 'hover:bg-slate-50'}`}
                >
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow flex-shrink-0">
                    {doc.name?.split(' ').filter(w => w[0]?.match(/[A-Z]/)).map(w => w[0]).join('') || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 text-sm truncate">{doc.name}</p>
                    <p className="text-slate-400 text-xs">{doc.specialty}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-lg flex-shrink-0
            ${doc.available ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                    {doc.available ? 'Available' : 'Busy'}
                  </span>
                  {selected?.id === doc.id && (
                    <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ─── ADD / EDIT APPOINTMENT MODAL ─────────────────────────────────────────────
function AppointmentModal({ appointment, onClose, onSave }) {
  const isEdit = !!appointment?.id;
  const [showDoctorPicker, setShowDoctorPicker] = useState(false);
  const [form, setForm] = useState({
    patient: appointment?.patient || '',
    email: appointment?.email || '',
    date: appointment?.date || new Date().toISOString().split('T')[0],
    time: appointment?.time || '09:00',
    duration: appointment?.duration || '30',
    type: appointment?.type || 'Consultation',
    status: appointment?.status || 'Pending',
    notes: appointment?.notes || '',
    doctor: appointment?.doctorId ? DOCTORS.find(d => d.id === appointment.doctorId) : null,
  });
  const [errors, setErrors] = useState({});

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: undefined })); };

  const validate = () => {
    const e = {};
    if (!form.patient.trim()) e.patient = 'Patient name is required';
    // if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.date) e.date = 'Date is required';
    if (!form.time) e.time = 'Time is required';
    if (!form.doctor) e.doctor = 'Please select a doctor';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    onSave({
      ...(isEdit ? { id: appointment.id } : {}),
      patient_count: form.patient,   // ← form.patient holds the count
      doctorId: form.doctor?.id,
      date: form.date,
      time: form.time,
      duration: form.duration,
      notes: form.notes,
      status: form.status,
    });
    onClose();
  };
  const inputCls = (err) =>
    `w-full px-4 py-2.5 rounded-xl border text-sm text-slate-700 outline-none transition-all bg-white
     ${err ? 'border-rose-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-100' : 'border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100'}`;

  const Field = ({ label, error, children }) => (
    <div>
      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">{label}</label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mt-1 text-xs text-rose-500 font-medium flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <>
      {/* Backdrop — separate from modal card so it never creates a trapping stacking context */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 24 }}
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden pointer-events-auto"
          style={{ maxHeight: '92vh' }}
        >
          {/* Modal Header */}
          <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between"
            style={{ background: 'linear-gradient(135deg,#eff6ff 0%,#f0fdf4 100%)' }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800" style={{ fontFamily: 'Lexend,sans-serif' }}>
                  {isEdit ? 'Edit Appointment' : 'New Appointment'}
                </h2>
                <p className="text-xs text-slate-400">{isEdit ? 'Update the appointment details below' : 'Fill in the details to schedule'}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/70 rounded-xl transition-colors">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="overflow-y-auto px-8 py-6 space-y-5" style={{ maxHeight: 'calc(92vh - 160px)' }}>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Patient Count" error={errors.patient}>
                <input type="num" placeholder="Enter Patient Count" value={form.patient}
                  onChange={e => set('patient', e.target.value)} className={inputCls(errors.patient)} />
              </Field>
              {/* <Field label="Email Address" error={errors.email}>
                <input type="email" placeholder="patient@email.com" value={form.email}
                  onChange={e => set('email', e.target.value)} className={inputCls(errors.email)} />
              </Field> */}
            </div>

            {/* Doctor picker button */}
            <Field label="Assign Doctor" error={errors.doctor}>
              <button type="button" onClick={() => setShowDoctorPicker(true)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border text-left transition-all bg-white
                  ${errors.doctor ? 'border-rose-300' : form.doctor ? 'border-blue-300 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`}
              >
                {form.doctor ? (
                  <>
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${form.doctor.color} flex items-center justify-center text-white text-xs font-bold shadow flex-shrink-0`}>
                      {form.doctor.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{form.doctor.name}</p>
                      <p className="text-xs text-slate-400">{form.doctor.specialty}</p>
                    </div>
                    <span className="text-xs text-blue-500 font-semibold flex-shrink-0">Change →</span>
                  </>
                ) : (
                  <>
                    <div className="w-9 h-9 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <span className="text-sm text-slate-400 flex-1">Click to search and select a doctor…</span>
                    <svg className="w-4 h-4 text-slate-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </>
                )}
              </button>
            </Field>

            <div className="grid grid-cols-3 gap-4">
              <Field label="Date" error={errors.date}>
                <input type="date" value={form.date} onChange={e => set('date', e.target.value)} className={inputCls(errors.date)} />
              </Field>
              <Field label="Time" error={errors.time}>
                <input type="time" value={form.time} onChange={e => set('time', e.target.value)} className={inputCls(errors.time)} />
              </Field>
              <Field label="Duration">
                <select value={form.duration} onChange={e => set('duration', e.target.value)} className={inputCls(false) + ' cursor-pointer'}>
                  {DURATIONS.map(d => <option key={d} value={d}>{d} min</option>)}
                </select>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-5">
              {/* <Field label="Appointment Type">
                <div className="grid grid-cols-2 gap-2 mt-0.5">
                  {TYPES.map(t => (
                    <button key={t} type="button" onClick={() => set('type', t)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all
                        ${form.type === t
                          ? 'bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-200'
                          : 'bg-white text-slate-500 border-slate-200 hover:border-blue-300 hover:text-blue-600'}`}
                    >{t}</button>
                  ))}
                </div>
              </Field> */}
              {/* <Field label="Status">
                <div className="grid grid-cols-2 gap-2 mt-0.5">
                  {STATUSES.filter(s => s !== 'All').map(s => (
                    <button key={s} type="button" onClick={() => set('status', s)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all
                        ${form.status === s
                          ? statusStyle(s) + ' ring-2 ring-offset-1 ring-current'
                          : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}
                    >{s}</button>
                  ))}
                </div>
              </Field> */}
            </div>

            <Field label="Notes (optional)">
              <textarea rows={3} placeholder="Add any relevant notes or instructions…" value={form.notes}
                onChange={e => set('notes', e.target.value)} className={inputCls(false) + ' resize-none'} />
            </Field>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/80">
            <button onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-200 transition-colors">
              Cancel
            </button>
            <button onClick={handleSubmit}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-105 active:scale-95"
              style={{ background: 'linear-gradient(135deg,#3b82f6,#06b6d4)', boxShadow: '0 6px 20px rgba(59,130,246,.35)' }}
            >
              {isEdit ? 'Save Changes' : 'Schedule Appointment'}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Nested doctor picker */}
      <AnimatePresence>
        {showDoctorPicker && (
          <DoctorPickerModal
            selected={form.doctor}
            onSelect={doc => set('doctor', doc)}
            onClose={() => setShowDoctorPicker(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ─── DETAIL MODAL ─────────────────────────────────────────────────────────────
function DetailModal({ appointment: a, onClose, onEdit, onDelete }) {
  const rows = [
    { label: 'Doctor', val: a.initial_with_name },
    { label: 'Specialty', val: a.speciality_type },
    { label: 'Date', val: a.appointmentDate },
    { label: 'Time', val: `${fmt12(a.start_time)} – ${fmt12(a.end_time)}` },
    { label: 'Max Pts', val: `${a.max_patients} patients` },
    { label: 'Note', val: a.specialNote || <span className="text-slate-300 italic">None</span> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 20 }}
        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        className="relative z-10 w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-400 to-cyan-400" />
        <div className="px-7 py-6">
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                {a.initial_with_name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '?'}
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800 leading-tight" style={{ fontFamily: 'Lexend,sans-serif' }}>
                  {a.initial_with_name}
                </h2>
                <p className="text-xs text-slate-400">{a.speciality_type}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-xl transition-colors">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-3 text-sm mb-6">
            {rows.map(r => (
              <div key={r.label} className="flex items-center gap-3">
                <span className="w-16 text-[11px] font-bold text-slate-400 uppercase tracking-wide flex-shrink-0">{r.label}</span>
                <span className="text-slate-700 font-medium">{r.val}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-2.5">
            <button onClick={() => { onEdit(a); onClose(); }}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg,#3b82f6,#06b6d4)', boxShadow: '0 4px 14px rgba(59,130,246,.3)' }}>
              Edit
            </button>
            <button onClick={() => { onDelete(a.id); onClose(); }}
              className="px-4 py-2.5 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-50 transition-colors border border-rose-200">
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function Appointments() {
  const { appointments, loading, fetchAppointments, saveAppointment, cancelAppointment } = useAppointments();

  const [viewMode, setViewMode] = useState('list');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [detailTarget, setDetailTarget] = useState(null);
  const [toast, setToast] = useState(null);

  // Load on mount + when status filter changes
  useEffect(() => {
    fetchAppointments({ status: filterStatus });
  }, [filterStatus]);

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async (data) => {
    try {
      await saveAppointment(data);
      showToast(data.id ? 'Appointment updated!' : 'Appointment scheduled!');
      fetchAppointments({ status: filterStatus }); // refresh list
    } catch (e) {
      showToast(e.message, false);
    }
  };

  const handleCancel = async (id) => {
    try {
      await cancelAppointment(id);
      showToast('Appointment cancelled');
      fetchAppointments({ status: filterStatus });
    } catch (e) {
      showToast(e.message, false);
    }
  };

  // filtered is now just client-side search on top of server data
  const filtered = appointments.filter(a => {
    const q = searchQuery.toLowerCase();
    return (
      a.initial_with_name?.toLowerCase().includes(q) ||
      a.speciality_type?.toLowerCase().includes(q) ||
      a.appointmentDate?.includes(q)
    );
  });

  const stats = [
    { label: 'Total Slots', val: appointments.length, icon: '📅', g: 'from-cyan-500 to-blue-500' },
    { label: 'Today', val: appointments.filter(a => a.appointmentDate === new Date().toISOString().split('T')[0]).length, icon: '📌', g: 'from-violet-500 to-purple-500' },
    { label: 'Max Patients', val: appointments.reduce((sum, a) => sum + (a.max_patients || 0), 0), icon: '👥', g: 'from-emerald-500 to-teal-500' },
    { label: 'Doctors', val: new Set(appointments.map(a => a.doctor_id)).size, icon: '👨‍⚕️', g: 'from-amber-500 to-orange-500' },
  ];

  return (
    <div className="min-h-screen p-8" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', background: 'linear-gradient(135deg,#ecfeff 0%,#eff6ff 50%,#eef2ff 100%)' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        .apt-card { background: linear-gradient(135deg,rgba(255,255,255,.97),rgba(255,255,255,.88)); backdrop-filter:blur(20px); border:1px solid rgba(255,255,255,.6); transition:all .3s cubic-bezier(.4,0,.2,1); }
        .apt-card:hover { transform:translateY(-3px) scale(1.005); box-shadow:0 20px 40px rgba(59,130,246,.1); border-color:rgba(59,130,246,.3); }
        .act-btn { background:rgba(255,255,255,.9); border:1px solid rgba(203,213,225,.8); transition:all .18s ease; }
        .act-btn:hover { background:linear-gradient(135deg,#3b82f6,#06b6d4); color:#fff; border-color:transparent; transform:translateY(-1px); box-shadow:0 6px 16px rgba(59,130,246,.3); }
        .vt-btn { transition:all .22s ease; border:1px solid transparent; }
        .vt-btn.active { background:linear-gradient(135deg,#3b82f6,#2563eb); color:#fff; box-shadow:0 4px 12px rgba(59,130,246,.4); }
        .vt-btn:not(.active):hover { background:rgba(255,255,255,.7); }
      `}</style>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55 }}
        className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-extrabold mb-1"
            style={{ fontFamily: 'Lexend,sans-serif', background: 'linear-gradient(135deg,#3b82f6,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Appointments
          </h1>
          <p className="text-slate-500">Manage and track all patient appointments</p>
        </div>
        <button onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-white transition-all hover:scale-105 active:scale-95"
          style={{ background: 'linear-gradient(135deg,#3b82f6,#06b6d4)', boxShadow: '0 8px 24px rgba(59,130,246,.35)' }}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          New Appointment
        </button>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .15 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-7">
        {stats.map((s, i) => (
          <div key={i} className="rounded-2xl p-5 relative overflow-hidden"
            style={{ background: 'rgba(255,255,255,.92)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,.5)', boxShadow: '0 4px 20px rgba(0,0,0,.06)' }}>
            <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${s.g}`} />
            <div className="flex items-center justify-between mb-1">
              <span className="text-2xl">{s.icon}</span>
              <span className={`text-4xl font-extrabold bg-gradient-to-br ${s.g} bg-clip-text text-transparent`}
                style={{ fontFamily: 'Lexend,sans-serif' }}>{s.val}</span>
            </div>
            <p className="text-slate-400 text-sm font-semibold">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Toolbar */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .25 }}
        className="rounded-2xl p-5 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between"
        style={{ background: 'rgba(255,255,255,.88)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,.5)', boxShadow: '0 4px 20px rgba(0,0,0,.06)' }}>
        <div className="relative flex-1 w-full">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Search patients or emails…" value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none text-slate-700 text-sm font-medium transition-all bg-white/80" />
        </div>
        <div className="flex gap-3 items-center">
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 rounded-xl border-2 border-slate-200 hover:border-blue-300 outline-none text-slate-700 text-sm font-semibold cursor-pointer transition-all bg-white/90">
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <div className="flex gap-1 p-1 rounded-xl border border-blue-100 bg-white/70">
            {[{ id: 'list', path: 'M4 6h16M4 12h16M4 18h16' }, { id: 'timeline', path: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' }].map(v => (
              <button key={v.id} onClick={() => setViewMode(v.id)}
                className={`vt-btn px-3.5 py-2 rounded-lg text-slate-500 ${viewMode === v.id ? 'active' : ''}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={v.path} />
                </svg>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* List View */}
      <AnimatePresence mode="wait">
        {viewMode === 'list' && (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
            <AnimatePresence>
              {filtered.map((a, i) => {
                const dotClr = { Completed: '#10b981', Confirmed: '#3b82f6', Pending: '#f59e0b', Cancelled: '#94a3b8' }[a.status] || '#f59e0b';
                return (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 18 }}
                    transition={{ delay: i * 0.04 }} className="apt-card rounded-2xl px-6 py-4 shadow-md">
                    <div className="flex items-center justify-between gap-4">

                      {/* Doctor Avatar + Name */}
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow flex-shrink-0">
                          {a.initial_with_name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '?'}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 truncate text-sm">{a.initial_with_name}</p>
                          <p className="text-slate-400 text-xs truncate">{a.speciality_type}</p>
                        </div>

                        {/* Details */}
                        <div className="hidden xl:flex items-center gap-5 ml-3 flex-wrap">
                          <span className="flex items-center gap-1.5 font-medium text-xs text-slate-600">
                            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {a.appointmentDate}
                          </span>
                          <span className="flex items-center gap-1.5 font-medium text-xs text-slate-600">
                            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {fmt12(a.start_time)} – {fmt12(a.end_time)}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs">
                            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="font-semibold text-slate-600">Max: {a.max_patients}</span>
                          </span>
                          {a.specialNote && (
                            <span className="px-2 py-0.5 rounded-lg bg-amber-50 text-amber-700 text-xs font-medium italic truncate max-w-[180px]">
                              📝 {a.specialNote}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2.5 flex-shrink-0">
                        <div className="flex gap-1">
                          <button className="act-btn p-2 rounded-lg" onClick={() => setDetailTarget(a)} title="View details">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button className="act-btn p-2 rounded-lg" onClick={() => setEditTarget(a)} title="Edit">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filtered.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="rounded-2xl p-16 text-center" style={{ background: 'rgba(255,255,255,.85)' }}>
                <svg className="w-16 h-16 mx-auto text-slate-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-slate-400 font-semibold">No appointments found</p>
                <p className="text-slate-300 text-sm mt-1">Try adjusting your search or filters</p>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Timeline View */}
        {viewMode === 'timeline' && (
          <motion.div key="timeline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="rounded-2xl p-8 shadow-lg" style={{ background: 'rgba(255,255,255,.88)', backdropFilter: 'blur(20px)' }}>
            {filtered.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-slate-400 font-semibold">No appointments to show</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.map((a, i) => {
                  const doc = DOCTORS.find(d => d.id === a.doctorId);
                  const dotClr = { Completed: '#10b981', Confirmed: '#3b82f6', Pending: '#f59e0b', Cancelled: '#94a3b8' }[a.status] || '#94a3b8';
                  return (
                    <motion.div key={a.id}
                      initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                      className="flex gap-5 items-start">
                      <div className="flex flex-col items-center flex-shrink-0 pt-1">
                        <div className="w-3.5 h-3.5 rounded-full ring-[3px] ring-white shadow-md" style={{ background: dotClr }} />
                        {i < filtered.length - 1 && (
                          <div className="w-px mt-2 flex-1" style={{ background: 'linear-gradient(to bottom,#cbd5e1,transparent)', minHeight: 52 }} />
                        )}
                      </div>
                      <div className="flex-1 pb-2 cursor-pointer" onClick={() => setDetailTarget(a)}>
                        <div className="rounded-2xl p-5 border border-blue-100/60 hover:shadow-md transition-all hover:border-blue-200"
                          style={{ background: 'linear-gradient(135deg,#f0f9ff,#f0fdf4)' }}>
                          <div className="flex items-center justify-between mb-2.5">
                            <div className="flex items-center gap-2">
                              <span className="text-base font-bold text-blue-600" style={{ fontFamily: 'Lexend,sans-serif' }}>{fmt12(a.time)}</span>
                              <span className="text-slate-400 text-xs">· {a.duration} min</span>
                            </div>
                            <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${statusStyle(a.status)}`}>{a.status}</span>
                          </div>
                          <p className="font-bold text-slate-800 mb-1.5 text-sm" style={{ fontFamily: 'Lexend,sans-serif' }}>{a.patient}</p>
                          <div className="flex items-center gap-3 text-xs">
                            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-lg font-semibold">{a.type}</span>
                            {doc && (
                              <span className="flex items-center gap-1 text-slate-500">
                                <span className={`w-4 h-4 rounded bg-gradient-to-br ${doc.color} inline-flex items-center justify-center text-white text-[8px] font-bold`}>{doc.avatar}</span>
                                {doc.name}
                              </span>
                            )}
                          </div>
                          {a.notes && <p className="text-slate-400 text-xs mt-2 italic">{a.notes}</p>}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {showAddModal && (
          <AppointmentModal key="add" onClose={() => setShowAddModal(false)} onSave={handleSave} />
        )}
        {editTarget && (
          <AppointmentModal key="edit" appointment={editTarget} onClose={() => setEditTarget(null)} onSave={handleSave} />
        )}
        {detailTarget && (
          <DetailModal key="detail"
            appointment={detailTarget}
            onClose={() => setDetailTarget(null)}
            onEdit={(a) => { setEditTarget(a); setDetailTarget(null); }}
            onDelete={handleCancel}
          />
        )}
      </AnimatePresence>
    </div>
  );
}