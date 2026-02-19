import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Appointments = () => {
  const [viewMode, setViewMode] = useState('list'); // 'list', 'calendar', 'timeline'
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Sample appointment data - replace with actual API data
  const [appointments, setAppointments] = useState([
    { 
      id: 1, 
      patient: 'Sarah Johnson', 
      email: 'sarah.j@email.com',
      date: '2024-02-14', 
      time: '09:00 AM', 
      duration: '30 min',
      status: 'Confirmed', 
      type: 'Consultation',
      doctor: 'Dr. Smith',
      notes: 'Follow-up checkup'
    },
    { 
      id: 2, 
      patient: 'Michael Chen', 
      email: 'mchen@email.com',
      date: '2024-02-14', 
      time: '10:30 AM', 
      duration: '45 min',
      status: 'Pending', 
      type: 'Surgery',
      doctor: 'Dr. Williams',
      notes: 'Pre-surgery consultation'
    },
    { 
      id: 3, 
      patient: 'Emily Davis', 
      email: 'emily.d@email.com',
      date: '2024-02-14', 
      time: '02:00 PM', 
      duration: '30 min',
      status: 'Completed', 
      type: 'Checkup',
      doctor: 'Dr. Brown',
      notes: 'Annual physical'
    },
    { 
      id: 4, 
      patient: 'James Wilson', 
      email: 'jwilson@email.com',
      date: '2024-02-15', 
      time: '11:00 AM', 
      duration: '60 min',
      status: 'Cancelled', 
      type: 'Therapy',
      doctor: 'Dr. Taylor',
      notes: 'Patient cancelled'
    },
    { 
      id: 5, 
      patient: 'Lisa Anderson', 
      email: 'l.anderson@email.com',
      date: '2024-02-15', 
      time: '03:30 PM', 
      duration: '30 min',
      status: 'Confirmed', 
      type: 'Consultation',
      doctor: 'Dr. Smith',
      notes: 'Initial consultation'
    },
  ]);

  const statuses = ['All', 'Confirmed', 'Pending', 'Completed', 'Cancelled'];
  const appointmentTypes = ['Consultation', 'Checkup', 'Surgery', 'Therapy', 'Emergency'];

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.patient.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         apt.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' || apt.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    const colors = {
      Confirmed: 'bg-emerald-100 text-emerald-700 border-emerald-300',
      Pending: 'bg-amber-100 text-amber-700 border-amber-300',
      Completed: 'bg-blue-100 text-blue-700 border-blue-300',
      Cancelled: 'bg-rose-100 text-rose-700 border-rose-300'
    };
    return colors[status] || colors.Pending;
  };

  const getTypeIcon = (type) => {
    const icons = {
      Consultation: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      Checkup: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      Surgery: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
      Therapy: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    };
    return icons[type] || icons.Consultation;
  };

  const statsData = [
    { label: 'Total', value: appointments.length, color: 'from-cyan-500 to-blue-500', icon: '📅' },
    { label: 'Confirmed', value: appointments.filter(a => a.status === 'Confirmed').length, color: 'from-emerald-500 to-teal-500', icon: '✓' },
    { label: 'Pending', value: appointments.filter(a => a.status === 'Pending').length, color: 'from-amber-500 to-orange-500', icon: '⏳' },
    { label: 'Today', value: appointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length, color: 'from-violet-500 to-purple-500', icon: '📌' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 p-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        
        * {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        
        h1, h2, h3 {
          font-family: 'Lexend', sans-serif;
        }

        .appointment-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.5);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .appointment-card:hover {
          transform: translateY(-4px) scale(1.01);
          box-shadow: 0 20px 40px rgba(59, 130, 246, 0.15);
          border-color: rgba(59, 130, 246, 0.4);
        }

        .view-toggle {
          background: rgba(255,255,255,0.6);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(59, 130, 246, 0.2);
          transition: all 0.3s ease;
        }

        .view-toggle.active {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
          border-color: transparent;
        }

        .stat-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255,255,255,0.4);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--gradient-color));
        }

        .stat-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 32px rgba(0,0,0,0.1);
        }

        .timeline-dot {
          position: relative;
        }

        .timeline-dot::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: currentColor;
          opacity: 0.2;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.2; }
          50% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
        }

        .search-box {
          background: rgba(255,255,255,0.8);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(59, 130, 246, 0.2);
          transition: all 0.3s ease;
        }

        .search-box:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
          background: rgba(255,255,255,0.95);
        }

        .filter-select {
          background: rgba(255,255,255,0.8);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(59, 130, 246, 0.2);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .filter-select:hover {
          border-color: #3b82f6;
        }

        .action-button {
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(59, 130, 246, 0.3);
          transition: all 0.2s ease;
        }

        .action-button:hover {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);
        }

        .gradient-text {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .slide-in-up {
          animation: slideInUp 0.5s ease-out forwards;
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
            <h1 className="text-5xl font-bold gradient-text mb-2">Appointments</h1>
            <p className="text-slate-600 text-lg">View and manage all appointments efficiently</p>
          </div>
          <button 
            onClick={() => setShowAppointmentModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            + New Appointment
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
            style={{ '--gradient-color': stat.color }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl">{stat.icon}</span>
              <span className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                {stat.value}
              </span>
            </div>
            <p className="text-slate-600 font-semibold">{stat.label} Appointments</p>
          </div>
        ))}
      </motion.div>

      {/* Filters & View Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/40 mb-6"
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
                placeholder="Search patients, emails..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-box w-full pl-12 pr-4 py-3 rounded-xl outline-none text-slate-700 font-medium"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-3 w-full md:w-auto">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select px-4 py-3 rounded-xl outline-none text-slate-700 font-semibold"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            {/* View Toggle */}
            <div className="flex gap-2 bg-white/60 backdrop-blur-lg p-1 rounded-xl border border-blue-200">
              <button
                onClick={() => setViewMode('list')}
                className={`view-toggle px-4 py-2 rounded-lg font-semibold ${viewMode === 'list' ? 'active' : 'text-slate-600'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('timeline')}
                className={`view-toggle px-4 py-2 rounded-lg font-semibold ${viewMode === 'timeline' ? 'active' : 'text-slate-600'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Appointments List */}
      {viewMode === 'list' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="space-y-4"
        >
          <AnimatePresence>
            {filteredAppointments.map((appointment, index) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="appointment-card rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6 flex-1">
                    {/* Patient Info */}
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {appointment.patient.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 text-lg">{appointment.patient}</h3>
                        <p className="text-slate-500 text-sm">{appointment.email}</p>
                      </div>
                    </div>

                    {/* Appointment Details */}
                    <div className="hidden md:flex items-center gap-8 flex-1">
                      <div className="flex items-center gap-2 text-slate-600">
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-semibold">{appointment.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-semibold">{appointment.time}</span>
                        <span className="text-slate-400">({appointment.duration})</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-lg">
                        {getTypeIcon(appointment.type)}
                        <span className="font-semibold text-blue-700">{appointment.type}</span>
                      </div>
                      <div className="text-slate-600">
                        <span className="font-semibold">{appointment.doctor}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex items-center gap-4">
                    <span className={`px-4 py-2 rounded-xl text-sm font-bold border ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                    <div className="flex gap-2">
                      <button className="action-button p-2 rounded-lg">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button className="action-button p-2 rounded-lg">
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

          {filteredAppointments.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl p-16 text-center shadow-lg"
            >
              <svg className="w-20 h-20 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-slate-500 text-xl font-bold mb-2">No appointments found</p>
              <p className="text-slate-400">Try adjusting your filters or search criteria</p>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Timeline View */}
      {viewMode === 'timeline' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-white/40"
        >
          <div className="space-y-8">
            {filteredAppointments.map((appointment, index) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-6 items-start relative"
              >
                {/* Timeline */}
                <div className="flex flex-col items-center">
                  <div className={`timeline-dot w-4 h-4 rounded-full ${appointment.status === 'Completed' ? 'bg-emerald-500' : appointment.status === 'Confirmed' ? 'bg-blue-500' : appointment.status === 'Pending' ? 'bg-amber-500' : 'bg-slate-400'}`}></div>
                  {index < filteredAppointments.length - 1 && (
                    <div className="w-0.5 h-full bg-gradient-to-b from-blue-300 to-transparent mt-2"></div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-8">
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-blue-600">{appointment.time}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-600 font-semibold">{appointment.duration}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{appointment.patient}</h3>
                    <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                      <span className="flex items-center gap-2">
                        {getTypeIcon(appointment.type)}
                        {appointment.type}
                      </span>
                      <span>•</span>
                      <span>{appointment.doctor}</span>
                    </div>
                    <p className="text-slate-500 italic">{appointment.notes}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Appointments;