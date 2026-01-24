import { useState } from "react";
import NavButton from "./NavButton";
import NavItem from "./NavItem";
import { TiThMenu } from "react-icons/ti";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useRef } from "react";
import { useEffect } from "react";
import { FiUser } from "react-icons/fi";
import { FiSettings } from "react-icons/fi";
import { FiLogOut } from "react-icons/fi";



function NavBar() {
  const [open, setOpen] = useState(false);
  const [isDropdownOpen, setIsDropDownOpen] = useState(false);
  const navigate = useNavigate();
  const {user, logout, isAuthenticated} = useAuth();
  const dropdownRef = useRef(null);
  

  useEffect(() => {
    const handleClickOutSide = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropDownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutSide);
    return () => document.removeEventListener("mousedown", handleClickOutSide);
  }, []);

  const handleLogout = () => {
    logout();
    setIsDropDownOpen(false);
    setOpen(false);
    navigate("/");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const names = name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // const getFirstName = (fullName) => {
  //   if (!fullName) return "User";
  //   return fullName.split(" ")[0];
  // };
  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <nav className="max-w-7xl mx-auto bg-[#77aabc] rounded-full px-6 py-3 flex items-center justify-between shadow-lg">
        {/* Logo */}
        <div className="text-white font-black md:text-logo-size text-2xl font-nunito">
          DocChannel
        </div>

        <div className="md:hidden text-white">
          <TiThMenu size={25} onClick={() => setOpen(!open)} />
        </div>

        {/* Menu */}
        <div className="hidden md:flex items-center gap-10">
          <NavItem text="Home" />
          <NavItem text="Service" />
          <NavItem text="About Us" />
          <NavItem text="Contact Us" />
          {isAuthenticated && <NavItem text="Dashboard" />}
        </div>

        <div className="md:hidden">
          {isAuthenticated && user ? (
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#77aabc] font-bold shadow-md">
              {user.fullName}
            </div>
          ) : (
            <button className="bg-white text-[#000000] px-4 py-2 rounded-full font-medium hover:bg-gray-100 transition">
              <FaArrowRight
                color="#77aabc"
                onClick={() => navigate("/login")}
              />
            </button>
          )}
          {/* <button className="bg-white text-[#000000] px-4 py-2 md:px-5 md:py-2 md:overflow-hidden rounded-full font-medium hover:bg-gray-100 transition">
            {!isSignIn ? (
              <FaArrowRight color="#77aabc" onClick={() => navigate("/")} />
            ) : (
              <FaArrowRight
                color="#77aabc"
                onClick={() => navigate("/login")}
              />
            )}
          </button> */}
        </div>

        <div className="hidden md:block">
          {isAuthenticated && user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center space-x-3 bg-white rounded-full px-4 py-2 hover:bg-gray-100 transition focus:outline-none"
                onClick={() => setIsDropDownOpen(!isDropdownOpen)}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#77aabc] to-[#5d8a9c] flex items-center justify-center text-white font-bold text-sm shadow-md">
                  {getInitials(user.fullName)}
                </div>

                <span className="text-[#77aabc] font-semibold font-nunito">
                  {user.fullName}
                </span>

                <svg
                  className={`w-4 h-4 text-[#77aabc] transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50">
                  {/* User Info Section */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-bold text-gray-900 font-nunito">
                      {user.fullName}
                    </p>
                    <p className="text-xs text-gray-500 truncate mt-1">
                      {user.email}
                    </p>
                  </div>

                  {/* Menu Items */}
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setIsDropDownOpen(false);
                    }}
                    className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-[#77aabc] hover:text-white transition-colors font-nunito font-medium"
                  >
                    <FiUser className="mr-3" size={18} />
                    My Profile
                  </button>

                  <button
                    onClick={() => {
                      navigate("/searchdoc");
                      setIsDropDownOpen(false);
                    }}
                    className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-[#77aabc] hover:text-white transition-colors font-nunito font-medium"
                  >
                    <FiSettings className="mr-3" size={18} />
                    Book Appointment
                  </button>

                  <hr className="my-2 border-gray-100" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors font-nunito font-medium"
                  >
                    <FiLogOut className="mr-3" size={18} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <NavButton text="Log In" OnClick={() => navigate("/login")} />
          )}
          {/* {isSignIn ? (
            <NavButton text="Log In" OnClick={() => navigate("/login")} />
          ) : (
            <NavButton text="Book Appointment" OnClick={() => navigate("/")} />
          )} */}
        </div>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden mt-2 bg-[#77aabc] rounded-3xl p-4 flex flex-col gap-4 text-center max-w-7xl mx-auto">
          <NavItem text="Home" />
          <NavItem text="Service" />
          <NavItem text="About Us" />
          <NavItem text="Contact Us" />

          {isAuthenticated && user && (
            <>
              <NavItem text="Dashboard" />
              <hr className="border-white/30" />

              <div className="bg-white/10 rounded-2xl p-4 text-white">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#77aabc] font-bold shadow-md">
                    {getInitials(user.fullName)}
                  </div>
                  <div className="text-left">
                    <p className="font-bold font-nunito">{user.fullName}</p>
                    <p className="text-sm opacity-90">{user.email}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    navigate("/profile");
                  }}
                  className="w-full bg-white text-[#77aabc] py-2 rounded-full font-nunito font-semibold mb-2 hover:bg-gray-100 transition"
                >
                  My Profile
                </button>

                <button
                  onClick={() => {
                    navigate("/searchdoc");
                    setOpen(false);
                  }}
                  className="w-full bg-white text-[#77aabc] py-2 rounded-full font-nunito font-semibold mb-2 hover:bg-gray-100 transition"
                >
                  Book Appointment
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full bg-red-500 text-white py-2 rounded-full font-nunito font-semibold hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default NavBar;
