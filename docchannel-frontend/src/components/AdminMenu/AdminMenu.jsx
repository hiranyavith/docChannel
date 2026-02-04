import React, { useState } from "react";

import { IoBarChart } from "react-icons/io5";
import { FaChevronDown } from "react-icons/fa";
import { FiFileText } from "react-icons/fi";
import { GoPackage } from "react-icons/go";
import { IoIosSettings } from "react-icons/io";
import { FaUsers } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

const AdminMenu = ({ menuItems }) => {
  //   const [activeItem, setActiveItem] = useState(menuItems[0]?.id || null);
  const navigate = useNavigate();
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState(null);

  const getActiveItem = () => {
    const currentPath = location.pathname;
    for (const item of menuItems) {
      if (item.path && currentPath === `/admin-panel${item.path}`)
        return item.id;
      if (item.submenu) {
        const activeSubItem = item.submenu.find(
          (sub) => sub.path && currentPath === `/admin-panel${sub.path}`,
        );
        if (activeSubItem) return activeSubItem.id;
      }
    }
    return menuItems[0]?.id;
  };
  const activeItem = getActiveItem();
 const handleItemClick = (item) => {
    if (item.submenu) {
      setOpenDropdown(openDropdown === item.id ? null : item.id);
    } else {
      setOpenDropdown(null);
      if (item.path) {
        navigate(`/admin-panel${item.path}`);
      }
    }
  };

 const handleSubItemClick = (parentId, subItem) => {
    setOpenDropdown(null);
    if (subItem.path) {
      navigate(`/admin-panel${subItem.path}`);
    }
  };
  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0 mr-8">
            <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
          </div>

          {/* Menu Items */}
          <div className="flex space-x-1 flex-1">
            {menuItems.map((item) => (
              <div key={item.id} className="relative">
                <button
                  onClick={() => handleItemClick(item)}
                  className={`
                    flex items-center px-4 py-2 rounded-md text-sm font-medium
                    transition-colors duration-200
                    ${
                      activeItem === item.id
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }
                  `}
                >
                  {item.icon && <item.icon className="w-5 h-5 mr-2" />}
                  <span>{item.label}</span>
                  {item.submenu && (
                    <FaChevronDown
                      className={`w-4 h-4 ml-1 transition-transform ${
                        openDropdown === item.id ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>

                {/* Dropdown Submenu */}
                {item.submenu && openDropdown === item.id && (
                  <div className="absolute left-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                    <div className="py-1">
                      {item.submenu.map((subItem) => (
                        <button
                          key={subItem.id}
                          onClick={() => handleSubItemClick(item.id, subItem)}
                          className={`
                            w-full text-left px-4 py-2 text-sm
                            transition-colors duration-200
                            ${
                              activeItem === subItem.id
                                ? "bg-blue-50 text-blue-700"
                                : "text-gray-700 hover:bg-gray-100"
                            }
                          `}
                        >
                          {subItem.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right side actions (optional) */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md">
              <IoIosSettings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminMenu;
