import { Routes, Route, Navigate } from 'react-router-dom';
import { FaUsers } from "react-icons/fa";
import { IoBarChart } from "react-icons/io5";
import { FiFileText } from "react-icons/fi";
import { FaHome } from "react-icons/fa";
import { GoPackage } from "react-icons/go";

import AdminMenu from "../components/AdminMenu/AdminMenu";
import Dashboard from './admin/adminDashboard';
import AllUsers from './admin/AllUsers';
import DoctorManage from './admin/DoctorManage';
import PatientManage from './admin/PatientManage';
import Appointments from './admin/Appointment';

function AdminPanel() {
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: FaHome,
      path: "/dashboard",
    },
    {
      id: "users",
      label: "Users",
      icon: FaUsers,
      submenu: [
        { id: "Users", label: "All Users", path: "/users/all" },
        { id: "Docotor", label: "Doctor Manage", path: "/users/doctors" },
        { id: "patient", label: "Patient Manage", path: "/users/patients" },
      ],
    },
    {
      id: "appointments",
      label: "Appointments",
      icon: IoBarChart,
      path: "/appointments",
    },
    {
      id: "content",
      label: "Content",
      icon: FiFileText,
      submenu: [
        { id: "posts", label: "Posts", path: "/content/posts" },
        { id: "pages", label: "Pages", path: "/content/pages" },
        { id: "media", label: "Media", path: "/content/media" },
      ],
    },
    {
      id: "products",
      label: "Products",
      icon: GoPackage,
      path: "/products",
    },
  ];

  //   const handleMenuItemClick = (item) => {
  //     console.log('Clicked:', item);
  //     // Handle navigation or state changes here
  //   };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminMenu menuItems={menuItems} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Routes>
          {/* Default redirect to dashboard */}
          <Route
            path="/"
            element={<Navigate to="/admin-panel/dashboard" replace />}
          />

          {/* Admin routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users/all" element={<AllUsers />} />
          <Route path="/users/doctors" element={<DoctorManage />} />
          <Route path="/users/patients" element={<PatientManage />} />
          <Route path="/appointments" element={<Appointments />} />
          {/* <Route path="/products" element={<Products />} /> */}

          {/* Add more routes as needed */}
          <Route
            path="/content/posts"
            element={<div className="p-6">Posts Page</div>}
          />
          <Route
            path="/content/pages"
            element={<div className="p-6">Pages Page</div>}
          />
          <Route
            path="/content/media"
            element={<div className="p-6">Media Page</div>}
          />
        </Routes>
      </main>
    </div>
  );
}

export default AdminPanel;
