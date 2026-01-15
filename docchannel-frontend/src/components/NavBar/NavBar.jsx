import { useState } from "react";
import NavButton from "./NavButton";
import NavItem from "./NavItem";
import { TiThMenu } from "react-icons/ti";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function NavBar() {
  const [open, setOpen] = useState(false);
  const [isSignIn, setIsSignIn] = useState(true);
  const navigate = useNavigate();
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
        </div>

        <div className="md:hidden">
          <button className="bg-white text-[#000000] px-4 py-2 md:px-5 md:py-2 md:overflow-hidden rounded-full font-medium hover:bg-gray-100 transition">
          
          {!isSignIn ? <FaArrowRight color="#77aabc" onClick={() => navigate('/')}/> : <FaArrowRight color="#77aabc" onClick={() => navigate('/login')}/>}
          </button>
        </div>

        <div className="hidden md:block">
          {isSignIn ? <NavButton text="Log In" OnClick={() => navigate("/login")}/> : <NavButton text="Book Appointment" OnClick={() => navigate("/")} /> }
        </div>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden mt-2 bg-[#77aabc] rounded-3xl p-4 flex flex-col gap-4 text-center max-w-7xl mx-auto">
          <NavItem text="Home" />
          <NavItem text="Service" />
          <NavItem text="About Us" />
          <NavItem text="Contact Us" />
        </div>
      )}
    </div>
  );
}

export default NavBar;
