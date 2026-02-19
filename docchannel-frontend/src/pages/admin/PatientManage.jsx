import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PatientManage = () => {
  const [viewMode, setViewMode] = useState('cards'); // 'cards', 'table', 'timeline'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [ageGroupFilter, setAgeGroupFilter] = useState('All');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Sample patient data - replace with actual API data
  const [patients, setPatients] = useState([
    {
      id: 1,
      name: 'Emma Thompson',
      age: 34,
      gender: 'Female',
      email: 'emma.thompson@email.com',
      phone: '+1 (555) 234-5678',
      bloodType: 'A+',
      lastVisit: '2024-02-10',
      nextAppointment: '2024-03-15',
      status: 'Active',
      condition: 'Healthy',
      doctor: 'Dr. Sarah Mitchell',
      visits: 12,
      allergies: ['Penicillin'],
      medications: ['Vitamin D'],
      avatar: 'ET'
    },
    {
      id: 2,
      name: 'David Martinez',
      age: 45,
      gender: 'Male',
      email: 'david.martinez@email.com',
      phone: '+1 (555) 345-6789',
      bloodType: 'O-',
      lastVisit: '2024-02-12',
      nextAppointment: '2024-02-20',
      status: 'Under Treatment',
      condition: 'Diabetes',
      doctor: 'Dr. James Anderson',
      visits: 28,
      allergies: ['None'],
      medications: ['Metformin', 'Insulin'],
      avatar: 'DM'
    },
    {
      id: 3,
      name: 'Sophie Chen',
      age: 8,
      gender: 'Female',
      email: 'parent@email.com',
      phone: '+1 (555) 456-7890',
      bloodType: 'B+',
      lastVisit: '2024-01-28',
      nextAppointment: '2024-04-10',
      status: 'Active',
      condition: 'Healthy',
      doctor: 'Dr. Emily Chen',
      visits: 6,
      allergies: ['Peanuts'],
      medications: ['None'],
      avatar: 'SC'
    },
    {
      id: 4,
      name: 'Robert Johnson',
      age: 67,
      gender: 'Male',
      email: 'robert.j@email.com',
      phone: '+1 (555) 567-8901',
      bloodType: 'AB+',
      lastVisit: '2024-02-08',
      nextAppointment: '2024-02-22',
      status: 'Critical',
      condition: 'Heart Disease',
      doctor: 'Dr. Sarah Mitchell',
      visits: 45,
      allergies: ['Aspirin'],
      medications: ['Lisinopril', 'Atorvastatin', 'Aspirin'],
      avatar: 'RJ'
    },
    {
      id: 5,
      name: 'Maria Garcia',
      age: 29,
      gender: 'Female',
      email: 'maria.garcia@email.com',
      phone: '+1 (555) 678-9012',
      bloodType: 'A-',
      lastVisit: '2024-02-14',
      nextAppointment: 'Not Scheduled',
      status: 'Inactive',
      condition: 'Recovered',
      doctor: 'Dr. Lisa Rodriguez',
      visits: 8,
      allergies: ['Latex'],
      medications: ['None'],
      avatar: 'MG'
    },
  ]);

  const statuses = ['All', 'Active', 'Under Treatment', 'Critical', 'Inactive'];
  const ageGroups = ['All', 'Children (0-17)', 'Adults (18-64)', 'Seniors (65+)'];

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         patient.condition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || patient.status === statusFilter;
    
    let matchesAge = true;
    if (ageGroupFilter === 'Children (0-17)') matchesAge = patient.age < 18;
    if (ageGroupFilter === 'Adults (18-64)') matchesAge = patient.age >= 18 && patient.age < 65;
    if (ageGroupFilter === 'Seniors (65+)') matchesAge = patient.age >= 65;
    
    return matchesSearch && matchesStatus && matchesAge;
  });

  const getStatusColor = (status) => {
    const colors = {
      'Active': 'bg-emerald-100 text-emerald-700 border-emerald-300',
      'Under Treatment': 'bg-amber-100 text-amber-700 border-amber-300',
      'Critical': 'bg-rose-100 text-rose-700 border-rose-300',
      'Inactive': 'bg-slate-100 text-slate-700 border-slate-300'
    };
    return colors[status] || colors.Inactive;
  };

  const getConditionColor = (condition) => {
    const colors = {
      'Healthy': 'text-emerald-600',
      'Diabetes': 'text-amber-600',
      'Heart Disease': 'text-rose-600',
      'Recovered': 'text-blue-600'
    };
    return colors[condition] || 'text-slate-600';
  };

  const getBloodTypeColor = (bloodType) => {
    const colors = {
      'A+': 'from-rose-400 to-pink-500',
      'A-': 'from-rose-500 to-pink-600',
      'B+': 'from-blue-400 to-indigo-500',
      'B-': 'from-blue-500 to-indigo-600',
      'O+': 'from-purple-400 to-violet-500',
      'O-': 'from-purple-500 to-violet-600',
      'AB+': 'from-orange-400 to-amber-500',
      'AB-': 'from-orange-500 to-amber-600'
    };
    return colors[bloodType] || colors['O+'];
  };

  const statsData = [
    { label: 'Total Patients', value: patients.length, icon: '👥', color: 'from-pink-500 to-rose-500' },
    { label: 'Active Cases', value: patients.filter(p => p.status === 'Active' || p.status === 'Under Treatment').length, icon: '🏥', color: 'from-violet-500 to-purple-500' },
    { label: 'Critical', value: patients.filter(p => p.status === 'Critical').length, icon: '⚠️', color: 'from-rose-500 to-red-500' },
    { label: 'This Month', value: patients.filter(p => new Date(p.lastVisit).getMonth() === new Date().getMonth()).length, icon: '📅', color: 'from-blue-500 to-cyan-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50 p-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&family=Nunito:wght@400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Nunito', sans-serif;
        }
        
        h1, h2, h3 {
          font-family: 'Quicksand', sans-serif;
        }

        .patient-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.88) 100%);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.5);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .patient-card::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 150px;
          height: 150px;
          background: radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%);
          border-radius: 50%;
          transform: translate(50%, -50%);
        }

        .patient-card:hover {
          transform: translateY(-6px) rotate(-1deg);
          box-shadow: 0 24px 48px rgba(236, 72, 153, 0.2);
          border-color: rgba(236, 72, 153, 0.4);
        }

        .patient-avatar {
          background: linear-gradient(135deg, var(--blood-gradient));
          position: relative;
          transition: all 0.3s ease;
        }

        .patient-avatar::before {
          content: '';
          position: absolute;
          inset: -2px;
          background: linear-gradient(135deg, var(--blood-gradient));
          border-radius: inherit;
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: -1;
          filter: blur(8px);
        }

        .patient-card:hover .patient-avatar::before {
          opacity: 0.6;
        }

        .stat-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.78) 100%);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255,255,255,0.5);
          transition: all 0.35s ease;
          position: relative;
          overflow: hidden;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--stat-gradient));
        }

        .stat-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(236, 72, 153, 0.15);
        }

        .search-input {
          background: rgba(255,255,255,0.88);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(236, 72, 153, 0.2);
          transition: all 0.3s ease;
        }

        .search-input:focus {
          border-color: #ec4899;
          box-shadow: 0 0 0 4px rgba(236, 72, 153, 0.1);
          background: rgba(255,255,255,0.96);
        }

        .filter-select {
          background: rgba(255,255,255,0.88);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(236, 72, 153, 0.2);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .filter-select:hover {
          border-color: #ec4899;
        }

        .view-toggle {
          background: rgba(255,255,255,0.65);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(236, 72, 153, 0.2);
          transition: all 0.3s ease;
        }

        .view-toggle.active {
          background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(236, 72, 153, 0.4);
        }

        .action-btn {
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(236, 72, 153, 0.3);
          transition: all 0.25s ease;
        }

        .action-btn:hover {
          background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(236, 72, 153, 0.3);
        }

        .gradient-text {
          background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .health-indicator {
          position: relative;
        }

        .health-indicator::before {
          content: '';
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: currentColor;
          left: -12px;
          top: 50%;
          transform: translateY(-50%);
          animation: pulse-dot 2s ease-in-out infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: translateY(-50%) scale(1); }
          50% { opacity: 0.5; transform: translateY(-50%) scale(1.3); }
        }

        .medication-badge {
          background: linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(219, 39, 119, 0.1) 100%);
          border: 1px solid rgba(236, 72, 153, 0.3);
          transition: all 0.2s ease;
        }

        .medication-badge:hover {
          background: linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(219, 39, 119, 0.2) 100%);
          transform: translateY(-1px);
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .fade-in-scale {
          animation: fadeInScale 0.5s ease-out forwards;
        }
      `}</style>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold gradient-text mb-2">Patient Management</h1>
            <p className="text-slate-600 text-lg">Manage patient records, appointments, and health data</p>
          </div>
          <button 
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            + Add New Patient
          </button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
      >
        {statsData.map((stat, index) => (
          <div 
            key={index} 
            className="stat-card rounded-2xl p-6 shadow-lg"
            style={{ '--stat-gradient': stat.color }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl">{stat.icon}</span>
              <span className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                {stat.value}
              </span>
            </div>
            <p className="text-slate-600 font-semibold text-sm">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Filters & Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="bg-white/85 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/50 mb-8"
      >
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="flex-1 w-full md:w-auto">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search patients by name, email, condition..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input w-full pl-12 pr-4 py-3 rounded-xl outline-none text-slate-700 font-medium"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-3 w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select px-4 py-3 rounded-xl outline-none text-slate-700 font-semibold"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            <select
              value={ageGroupFilter}
              onChange={(e) => setAgeGroupFilter(e.target.value)}
              className="filter-select px-4 py-3 rounded-xl outline-none text-slate-700 font-semibold"
            >
              {ageGroups.map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>

            {/* View Toggle */}
            <div className="flex gap-2 bg-white/65 backdrop-blur-lg p-1 rounded-xl border border-pink-200">
              <button
                onClick={() => setViewMode('cards')}
                className={`view-toggle px-4 py-2 rounded-lg font-semibold ${viewMode === 'cards' ? 'active' : 'text-slate-600'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`view-toggle px-4 py-2 rounded-lg font-semibold ${viewMode === 'table' ? 'active' : 'text-slate-600'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Patients Cards View */}
      {viewMode === 'cards' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredPatients.map((patient, index) => (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className="patient-card rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="p-6 relative z-10">
                  {/* Patient Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div 
                      className="patient-avatar w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg relative z-10"
                      style={{ '--blood-gradient': getBloodTypeColor(patient.bloodType) }}
                    >
                      {patient.avatar}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-800 text-lg mb-1">{patient.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <span>{patient.age} years</span>
                        <span>•</span>
                        <span>{patient.gender}</span>
                      </div>
                      <div className={`text-xs font-bold mt-1 inline-block px-2 py-1 rounded-lg bg-gradient-to-r ${getBloodTypeColor(patient.bloodType)} text-white`}>
                        {patient.bloodType}
                      </div>
                    </div>
                  </div>

                  {/* Health Status */}
                  <div className="mb-4 pb-4 border-b border-slate-100">
                    <div className={`health-indicator font-semibold ${getConditionColor(patient.condition)} pl-3`}>
                      {patient.condition}
                    </div>
                    <div className="text-xs text-slate-500 mt-1 pl-3">Assigned to {patient.doctor}</div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-slate-600 truncate text-xs">{patient.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-slate-600 text-xs">{patient.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-slate-600 text-xs">Last Visit: {patient.lastVisit}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <span className="text-slate-600 text-xs font-semibold">{patient.visits} Total Visits</span>
                    </div>
                  </div>

                  {/* Medications */}
                  {patient.medications.length > 0 && patient.medications[0] !== 'None' && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-slate-500 mb-2">Current Medications:</p>
                      <div className="flex flex-wrap gap-1">
                        {patient.medications.map((med, idx) => (
                          <span key={idx} className="medication-badge text-xs px-2 py-1 rounded-lg text-pink-700 font-medium">
                            {med}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Status & Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getStatusColor(patient.status)}`}>
                      {patient.status}
                    </span>
                    <div className="flex gap-2">
                      <button className="action-btn p-2 rounded-lg">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button className="action-btn p-2 rounded-lg">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-white/85 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-pink-50 to-rose-50 border-b border-pink-200">
                  <th className="py-5 px-6 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Patient</th>
                  <th className="py-5 px-6 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Age/Gender</th>
                  <th className="py-5 px-6 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Blood Type</th>
                  <th className="py-5 px-6 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Condition</th>
                  <th className="py-5 px-6 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Doctor</th>
                  <th className="py-5 px-6 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Last Visit</th>
                  <th className="py-5 px-6 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Status</th>
                  <th className="py-5 px-6 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredPatients.map((patient, index) => (
                    <motion.tr
                      key={patient.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-slate-100 hover:bg-pink-50/50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg bg-gradient-to-br"
                            style={{ background: `linear-gradient(135deg, var(--tw-gradient-stops))`, '--tw-gradient-from': getBloodTypeColor(patient.bloodType).split(' ')[0], '--tw-gradient-to': getBloodTypeColor(patient.bloodType).split(' ')[2] }}
                          >
                            {patient.avatar}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{patient.name}</p>
                            <p className="text-xs text-slate-500">{patient.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-slate-700 font-medium">{patient.age} / {patient.gender}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold bg-gradient-to-r ${getBloodTypeColor(patient.bloodType)} text-white`}>
                          {patient.bloodType}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`font-semibold ${getConditionColor(patient.condition)}`}>
                          {patient.condition}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-slate-600 font-medium">{patient.doctor}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-slate-600">{patient.lastVisit}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getStatusColor(patient.status)}`}>
                          {patient.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <button className="action-btn p-2 rounded-lg">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button className="action-btn p-2 rounded-lg">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {filteredPatients.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/85 backdrop-blur-xl rounded-2xl p-16 text-center shadow-lg"
        >
          <svg className="w-20 h-20 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="text-slate-500 text-xl font-bold mb-2">No patients found</p>
          <p className="text-slate-400">Try adjusting your filters or search criteria</p>
        </motion.div>
      )}
    </div>
  );
};

export default PatientManage;