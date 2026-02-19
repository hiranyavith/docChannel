import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
// Modal Component
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
const AllUsers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showActions, setShowActions] = useState(false);

  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [showRoleChangeModal, setShowRoleChangeModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Sample user data
  const [usersStat, setUsersStat] = useState({
    totalUsers: 0,
    activeUsers: 0,
    verifiedUsers: 0,
  });

  const [users, setUsers] = useState([]);

  const roles = ["All", "Admin", "Doctor", "Patient"];
  const statuses = ["All", "Active", "Inactive"];

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "All" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "All" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleSelectUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((u) => u.id));
    }
  };

  const handleEditUser = (user) => {
    setCurrentUser(user);
    setShowEditModal(true);
  };

  const handleDeleteUser = (user) => {
    setCurrentUser(user);
    setShowDeleteModal(true);
  };

  const confirmDeleteUser = () => {
    setUsers(users.filter((u) => u.id !== currentUser.id));
    setShowDeleteModal(false);
    setCurrentUser(null);
  };

  const handleBulkDelete = () => {
    setShowBulkDeleteModal(true);
  };

  const confirmBulkDelete = () => {
    setUsers(users.filter((u) => !selectedUsers.includes(u.id)));
    setSelectedUsers([]);
    setShowBulkDeleteModal(false);
  };

  const handleRoleChange = () => {
    setShowRoleChangeModal(true);
  };

  const confirmRoleChange = (newRole) => {
    setUsers(
      users.map((u) =>
        selectedUsers.includes(u.id) ? { ...u, role: newRole } : u,
      ),
    );
    setSelectedUsers([]);
    setShowRoleChangeModal(false);
  };

  const handleExport = () => {
    setShowExportModal(true);
  };

  const confirmExport = (format) => {
    const exportUsers = users.filter((u) => selectedUsers.includes(u.id));
    console.log(`Exporting ${exportUsers.length} users as ${format}`);
    // Implement actual export logic here
    setShowExportModal(false);
  };

  const saveEditUser = async (updatedUser) => {
    // setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    // setShowEditModal(false);
    // setCurrentUser(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/updateuser/${updatedUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            first_name: updatedUser.first_name,
            s_name: updatedUser.s_name,
            last_name: updatedUser.last_name,
            email: updatedUser.email,
            mobile_number: updatedUser.mobile_number,
            nic_no: updatedUser.nic_no,
            role: updatedUser.role,
            Status_Type: updatedUser.Status_Type,
            isVerified: updatedUser.isVerified,
          }),
        },
      );

      if (!response.ok) throw new Error("Failed To Update User");

      await getAllUsers();
      setShowEditModal(false);
      setCurrentUser(null);
    } catch (error) {
      console.error("Error saving user changes:", error);
    }
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      Admin: "bg-rose-100 text-rose-700 border-rose-300",
      Moderator: "bg-violet-100 text-violet-700 border-violet-300",
      User: "bg-sky-100 text-sky-700 border-sky-300",
    };
    return colors[role] || colors.User;
  };

  const getStatusColor = (status) => {
    return status === "Active"
      ? "bg-emerald-100 text-emerald-700 border-emerald-300"
      : "bg-slate-100 text-slate-700 border-slate-300";
  };

  const getStatUser = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/userstats`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch user stats");
      }
      const data = await response.json();
      setUsersStat(data.data);
      console.log("User stats:", data);
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
  };

  const getAllUsers = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/allusers?search=${searchQuery}&role=${roleFilter}&status=${statusFilter}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data.data);
      console.log("Fetched users:", data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    getStatUser();
    getAllUsers();
  }, [searchQuery, roleFilter, statusFilter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 p-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        
        * {
          font-family: 'DM Sans', sans-serif;
        }
        
        h1, h2, h3 {
          font-family: 'Outfit', sans-serif;
        }

        .user-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.4);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .user-card:hover {
          transform: translateX(4px);
          box-shadow: 0 12px 28px rgba(0,0,0,0.08);
          border-color: rgba(251, 146, 60, 0.4);
        }

        .search-input {
          background: rgba(255,255,255,0.8);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(251, 146, 60, 0.2);
          transition: all 0.3s ease;
        }

        .search-input:focus {
          border-color: #fb923c;
          box-shadow: 0 0 0 4px rgba(251, 146, 60, 0.1);
          background: rgba(255,255,255,0.95);
        }

        .checkbox-custom {
          appearance: none;
          width: 20px;
          height: 20px;
          border: 2px solid #e5e7eb;
          border-radius: 6px;
          cursor: pointer;
          position: relative;
          transition: all 0.2s ease;
        }

        .checkbox-custom:checked {
          background: linear-gradient(135deg, #fb923c 0%, #f97316 100%);
          border-color: #fb923c;
        }

        .checkbox-custom:checked::after {
          content: '✓';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-size: 14px;
          font-weight: bold;
        }

        .action-btn {
          background: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(251, 146, 60, 0.3);
          transition: all 0.2s ease;
        }

        .action-btn:hover {
          background: linear-gradient(135deg, #fb923c 0%, #f97316 100%);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(251, 146, 60, 0.2);
        }

        .avatar-gradient {
          background: linear-gradient(135deg, #fb923c 0%, #f97316 100%);
        }

        .modal-input {
          border: 2px solid #e5e7eb;
          transition: all 0.3s ease;
        }

        .modal-input:focus {
          border-color: #fb923c;
          box-shadow: 0 0 0 4px rgba(251, 146, 60, 0.1);
        }
      `}</style>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600 mb-3">
          All Users
        </h1>
        <p className="text-slate-600 text-lg">
          Manage and monitor all registered users
        </p>
      </motion.div>

      {/* Filters & Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/40 mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
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
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input w-full pl-12 pr-4 py-3 rounded-xl outline-none text-slate-700 font-medium"
              />
            </div>
          </div>

          {/* Role Filter */}
          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="search-input w-full px-4 py-3 rounded-xl outline-none text-slate-700 font-medium cursor-pointer"
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  Role: {role}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="search-input w-full px-4 py-3 rounded-xl outline-none text-slate-700 font-medium cursor-pointer"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  Status: {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        <AnimatePresence>
          {selectedUsers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-slate-200"
            >
              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-semibold">
                  {selectedUsers.length} user
                  {selectedUsers.length !== 1 ? "s" : ""} selected
                </span>
                <div className="flex gap-3">
                  <button
                    onClick={handleExport}
                    className="action-btn px-5 py-2 rounded-lg font-semibold text-slate-700"
                  >
                    Export
                  </button>
                  <button
                    onClick={handleRoleChange}
                    className="action-btn px-5 py-2 rounded-lg font-semibold text-slate-700"
                  >
                    Change Role
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    className="action-btn px-5 py-2 rounded-lg font-semibold text-rose-600 hover:text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-xl p-5 shadow-lg border border-white/40">
          <p className="text-slate-500 text-sm font-semibold uppercase tracking-wide mb-1">
            Total Users
          </p>
          <p className="text-3xl font-bold text-slate-800">
            {usersStat?.totalUsers ?? 0}
          </p>
        </div>
        <div className="bg-white/80 backdrop-blur-xl rounded-xl p-5 shadow-lg border border-white/40">
          <p className="text-slate-500 text-sm font-semibold uppercase tracking-wide mb-1">
            Active
          </p>
          <p className="text-3xl font-bold text-emerald-600">
            {usersStat?.activeUsers ?? 0}
          </p>
        </div>
        <div className="bg-white/80 backdrop-blur-xl rounded-xl p-5 shadow-lg border border-white/40">
          <p className="text-slate-500 text-sm font-semibold uppercase tracking-wide mb-1">
            Verified
          </p>
          <p className="text-3xl font-bold text-violet-600">
            {usersStat?.verifiedUsers ?? 0}
          </p>
        </div>
      </motion.div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/40 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-200">
                <th className="py-5 px-6 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedUsers.length === filteredUsers.length &&
                      filteredUsers.length > 0
                    }
                    onChange={handleSelectAll}
                    className="checkbox-custom"
                  />
                </th>
                <th className="py-5 px-6 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  User
                </th>
                <th className="py-5 px-6 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="py-5 px-6 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Role
                </th>
                <th className="py-5 px-6 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-5 px-6 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Joined
                </th>
                <th className="py-5 px-6 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="user-card border-b border-slate-100 last:border-b-0"
                  >
                    <td className="py-4 px-6">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                        className="checkbox-custom"
                      />
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="avatar-gradient w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                          {user.avatar}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">
                            {user.name}
                          </p>
                          {user.verified && (
                            <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                              <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Verified
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-slate-600 font-medium">
                        {user.email}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-3 py-1 rounded-lg text-xs font-bold border ${getRoleBadgeColor(user.role)}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-3 py-1 rounded-lg text-xs font-bold border ${getStatusColor(user.status)}`}
                      >
                        {user.Status_Type}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-slate-600 font-medium">
                        {user.joined}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-2 hover:bg-orange-50 rounded-lg transition-all group"
                        >
                          <svg
                            className="w-5 h-5 text-slate-400 group-hover:text-orange-600 transition-colors"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </button>
                        {/* <button
                          onClick={() => handleDeleteUser(user)}
                          className="p-2 hover:bg-rose-50 rounded-lg transition-all group"
                        >
                          <svg
                            className="w-5 h-5 text-slate-400 group-hover:text-rose-600 transition-colors"
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
                        </button> */}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-16 text-center"
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
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <p className="text-slate-500 text-lg font-semibold">
                No users found
              </p>
              <p className="text-slate-400 mt-1">
                Try adjusting your search or filters
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Edit User Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)}>
        <div className="p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
              Edit User
            </h2>
            <button
              onClick={() => setShowEditModal(false)}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
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

          {currentUser && (
            <div className="space-y-3 sm:space-y-4">
              {/* First & Middle Name - side by side on sm+ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={currentUser.first_name ?? ""}
                    className="modal-input w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl outline-none text-sm"
                    onChange={(e) =>
                      setCurrentUser({
                        ...currentUser,
                        first_name: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    value={currentUser.s_name ?? ""}
                    className="modal-input w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl outline-none text-sm"
                    onChange={(e) =>
                      setCurrentUser({ ...currentUser, s_name: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Last Name & Mobile - side by side on sm+ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={currentUser.last_name ?? ""}
                    className="modal-input w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl outline-none text-sm"
                    onChange={(e) =>
                      setCurrentUser({
                        ...currentUser,
                        last_name: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={currentUser.mobile_number ?? ""}
                    className="modal-input w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl outline-none text-sm"
                    onChange={(e) =>
                      setCurrentUser({
                        ...currentUser,
                        mobile_number: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* Email - full width */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={currentUser.email}
                  readOnly={true}
                  className="modal-input w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl outline-none text-sm"
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, email: e.target.value })
                  }
                />
              </div>

              {/* NIC - full width */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                  NIC No
                </label>
                <input
                  type="text"
                  value={currentUser.nic_no ?? ""}
                  className="modal-input w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl outline-none text-sm"
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, nic_no: e.target.value })
                  }
                />
              </div>

              {/* Role & Status - side by side on sm+ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                    Role
                  </label>
                  <select
                    value={currentUser.role ?? ""}
                    onChange={(e) =>
                      setCurrentUser({ ...currentUser, role: e.target.value })
                    }
                    className="modal-input w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl outline-none cursor-pointer text-sm"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Doctor">Doctor</option>
                    <option value="Patient">Patient</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                    Status
                  </label>
                  <select
                    value={currentUser.Status_Type}
                    onChange={(e) =>
                      setCurrentUser({
                        ...currentUser,
                        Status_Type: e.target.value,
                      })
                    }
                    className="modal-input w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl outline-none cursor-pointer text-sm"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Verified checkbox */}
              <div className="flex items-center gap-3 py-1">
                <input
                  type="checkbox"
                  checked={!!currentUser.isVerified}
                  onChange={(e) =>
                    setCurrentUser({
                      ...currentUser,
                      isVerified: e.target.checked,
                    })
                  }
                  className="checkbox-custom flex-shrink-0"
                  id="verified"
                />
                <label
                  htmlFor="verified"
                  className="text-xs sm:text-sm font-semibold text-slate-700 cursor-pointer"
                >
                  Verified User
                </label>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                <button
                  onClick={() => saveEditUser(currentUser)}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-2.5 sm:py-3 rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all text-sm sm:text-base"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-slate-100 text-slate-700 font-bold py-2.5 sm:py-3 rounded-xl hover:bg-slate-200 transition-all text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>
      {/* Delete User Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <div className="p-6">
          <div className="text-center mb-6">
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
              Delete User
            </h2>
            <p className="text-slate-600">
              Are you sure you want to delete{" "}
              <span className="font-bold">{currentUser?.name}</span>? This
              action cannot be undone.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={confirmDeleteUser}
              className="flex-1 bg-gradient-to-r from-rose-500 to-red-500 text-white font-bold py-3 rounded-xl hover:from-rose-600 hover:to-red-600 transition-all"
            >
              Delete User
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

      {/* Bulk Delete Modal */}
      <Modal
        isOpen={showBulkDeleteModal}
        onClose={() => setShowBulkDeleteModal(false)}
      >
        <div className="p-6">
          <div className="text-center mb-6">
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
              Delete Multiple Users
            </h2>
            <p className="text-slate-600">
              Are you sure you want to delete{" "}
              <span className="font-bold">
                {selectedUsers.length} user
                {selectedUsers.length !== 1 ? "s" : ""}
              </span>
              ? This action cannot be undone.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={confirmBulkDelete}
              className="flex-1 bg-gradient-to-r from-rose-500 to-red-500 text-white font-bold py-3 rounded-xl hover:from-rose-600 hover:to-red-600 transition-all"
            >
              Delete Users
            </button>
            <button
              onClick={() => setShowBulkDeleteModal(false)}
              className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Role Change Modal */}
      <Modal
        isOpen={showRoleChangeModal}
        onClose={() => setShowRoleChangeModal(false)}
      >
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Change User Role
            </h2>
            <p className="text-slate-600">
              Select a new role for{" "}
              <span className="font-bold">
                {selectedUsers.length} selected user
                {selectedUsers.length !== 1 ? "s" : ""}
              </span>
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <button
              onClick={() => confirmRoleChange("Admin")}
              className="w-full p-4 bg-rose-50 hover:bg-rose-100 border-2 border-rose-200 rounded-xl text-left transition-all group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-800 group-hover:text-rose-700">
                    Admin
                  </p>
                  <p className="text-sm text-slate-600">
                    Full system access and permissions
                  </p>
                </div>
                <svg
                  className="w-5 h-5 text-slate-400 group-hover:text-rose-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </button>

            <button
              onClick={() => confirmRoleChange("Moderator")}
              className="w-full p-4 bg-violet-50 hover:bg-violet-100 border-2 border-violet-200 rounded-xl text-left transition-all group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-800 group-hover:text-violet-700">
                    Moderator
                  </p>
                  <p className="text-sm text-slate-600">
                    Moderate content and users
                  </p>
                </div>
                <svg
                  className="w-5 h-5 text-slate-400 group-hover:text-violet-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </button>

            <button
              onClick={() => confirmRoleChange("User")}
              className="w-full p-4 bg-sky-50 hover:bg-sky-100 border-2 border-sky-200 rounded-xl text-left transition-all group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-800 group-hover:text-sky-700">
                    User
                  </p>
                  <p className="text-sm text-slate-600">Standard user access</p>
                </div>
                <svg
                  className="w-5 h-5 text-slate-400 group-hover:text-sky-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </button>
          </div>

          <button
            onClick={() => setShowRoleChangeModal(false)}
            className="w-full bg-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-200 transition-all"
          >
            Cancel
          </button>
        </div>
      </Modal>

      {/* Export Modal */}
      <Modal isOpen={showExportModal} onClose={() => setShowExportModal(false)}>
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Export Users
            </h2>
            <p className="text-slate-600">
              Export{" "}
              <span className="font-bold">
                {selectedUsers.length} selected user
                {selectedUsers.length !== 1 ? "s" : ""}
              </span>{" "}
              in your preferred format
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <button
              onClick={() => confirmExport("CSV")}
              className="w-full p-4 bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-200 rounded-xl text-left transition-all group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-800 group-hover:text-emerald-700">
                    CSV File
                  </p>
                  <p className="text-sm text-slate-600">
                    Comma-separated values for spreadsheets
                  </p>
                </div>
                <svg
                  className="w-5 h-5 text-slate-400 group-hover:text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </button>

            <button
              onClick={() => confirmExport("JSON")}
              className="w-full p-4 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-xl text-left transition-all group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-800 group-hover:text-blue-700">
                    JSON File
                  </p>
                  <p className="text-sm text-slate-600">
                    JavaScript object notation for developers
                  </p>
                </div>
                <svg
                  className="w-5 h-5 text-slate-400 group-hover:text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </button>

            <button
              onClick={() => confirmExport("Excel")}
              className="w-full p-4 bg-green-50 hover:bg-green-100 border-2 border-green-200 rounded-xl text-left transition-all group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-800 group-hover:text-green-700">
                    Excel File
                  </p>
                  <p className="text-sm text-slate-600">
                    Microsoft Excel workbook format
                  </p>
                </div>
                <svg
                  className="w-5 h-5 text-slate-400 group-hover:text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </button>
          </div>

          <button
            onClick={() => setShowExportModal(false)}
            className="w-full bg-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-200 transition-all"
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AllUsers;
