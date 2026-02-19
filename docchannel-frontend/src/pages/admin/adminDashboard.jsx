import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    usersGrowth: 0,
    appointments: 0,
    appointmentsGrowth: 0,
    products: 0,
    productsGrowth: 0,
  });

  const [recentAppointments, setRecentAppointments] = useState([]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const getStatusColor = (status) => {
    const colors = {
      success: "bg-emerald-100 text-emerald-700 border-emerald-200",
      info: "bg-blue-100 text-blue-700 border-blue-200",
      warning: "bg-amber-100 text-amber-700 border-amber-200",
      error: "bg-rose-100 text-rose-700 border-rose-200",
    };
    return colors[status] || colors.info;
  };
  useEffect(() => {
    fetchStats();
    getAppointmentData();
  }, []);
  const fetchStats = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/stats`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch stats");
      }

      const data = await response.json();

      if (data.success) {
        setStats({
          totalUsers: data.data.userCount,
          usersGrowth: 10,
          appointments: data.data.appointmentCount,
          appointmentsGrowth: 123,
          products: 500,
          productsGrowth: 10,
        });
      } else {
        throw new Error("Failed to fetch stats");
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const getAppointmentData = async () => {
    try {
       const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/recentappointments`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch appointment data");
      }

        const data = await response.json();
        console.log("Appointment Data:", data);

       const formatted = data.data.map((appointment) => ({

      id: appointment.appointment_id,

      user: appointment.f_name+" "+appointment.l_name || "Unknown",

      action: "Booked Appointment",

      date: new Date(appointment.updateAt).toLocaleDateString(),

      time: new Date(appointment.updateAt).toLocaleTimeString(),

      status: appointment.payment_status || "info"

    }));

    setRecentAppointments(formatted);


    } catch (error) {
      console.error("Failed to fetch appointment data:", error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');
        
        * {
          font-family: 'Inter', sans-serif;
        }
        
        h1, h2, h3 {
          font-family: 'Sora', sans-serif;
        }

        .stat-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.3);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .stat-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
          border-color: rgba(99, 102, 241, 0.3);
        }

        .stat-icon {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          transition: all 0.3s ease;
        }

        .stat-card:hover .stat-icon {
          transform: rotate(10deg) scale(1.1);
        }

        .activity-table {
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.3);
        }

        .table-row {
          transition: all 0.2s ease;
          border-bottom: 1px solid rgba(226, 232, 240, 0.5);
        }

        .table-row:hover {
          background: linear-gradient(90deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%);
          transform: translateX(4px);
        }

        .status-badge {
          transition: all 0.2s ease;
        }

        .status-badge:hover {
          transform: scale(1.05);
        }

        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        .floating {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl font-bold gradient-text mb-2">Dashboard</h1>
        <p className="text-slate-500 text-lg mb-8">
          Welcome back! Here's what's happening today.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
      >
        <motion.div
          variants={itemVariants}
          className="stat-card rounded-2xl p-8 shadow-lg"
        >
          {/* <div className="flex flex-row justify-between"></div> */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium uppercase tracking-wide mb-2">
                Total Users
              </p>
              <h3 className="text-4xl font-bold text-slate-800 mb-1">
                {stats.totalUsers.toLocaleString()}
              </h3>
              <p className="text-emerald-600 text-sm font-semibold flex items-center gap-1">
                <span>↑ 12.5%</span>
                <span className="text-slate-400 font-normal">
                  vs last month
                </span>
              </p>
            </div>
            <div className="stat-icon w-14 h-14 rounded-xl flex items-center justify-center text-white floating">
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="stat-card rounded-2xl p-8 shadow-lg"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium uppercase tracking-wide mb-2">
                Appointments
              </p>
              <h3 className="text-4xl font-bold text-slate-800 mb-1">
                {stats.appointments.toLocaleString()}
              </h3>
              <p className="text-emerald-600 text-sm font-semibold flex items-center gap-1">
                <span>↑ 8.2%</span>
                <span className="text-slate-400 font-normal">
                  vs last month
                </span>
              </p>
            </div>
            <div
              className="stat-icon w-14 h-14 rounded-xl flex items-center justify-center text-white floating"
              style={{ animationDelay: "0.2s" }}
            >
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* <motion.div
          variants={itemVariants}
          className="stat-card rounded-2xl p-8 shadow-lg"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium uppercase tracking-wide mb-2">
                Products
              </p>
              <h3 className="text-4xl font-bold text-slate-800 mb-1">
                {stats.products.toLocaleString()}
              </h3>
              <p className="text-amber-600 text-sm font-semibold flex items-center gap-1">
                <span>↓ 2.1%</span>
                <span className="text-slate-400 font-normal">
                  vs last month
                </span>
              </p>
            </div>
            <div
              className="stat-icon w-14 h-14 rounded-xl flex items-center justify-center text-white floating"
              style={{ animationDelay: "0.4s" }}
            >
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
          </div>
        </motion.div> */}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-slate-800">
            Recent Appointments
          </h2>
          {/* <button className="px-4 py-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-all">
            View All
          </button> */}
        </div>

        <div className="activity-table rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                  <th className="py-4 px-6 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    User
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentAppointments.map((activity, index) => (
                  <motion.tr
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="table-row"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-semibold shadow-md">
                          {activity.user
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <span className="font-semibold text-slate-800">
                          {activity.user}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-slate-600 font-medium">
                        {activity.action}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="text-slate-700 font-medium">
                          {activity.date}
                        </span>
                        <span className="text-slate-400 text-sm">
                          {activity.time}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`status-badge inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(activity.status)}`}
                      >
                        {activity.status.charAt(0).toUpperCase() +
                          activity.status.slice(1)}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
