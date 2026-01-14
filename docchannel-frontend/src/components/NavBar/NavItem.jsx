import { NavLink } from "react-router-dom";

function NavItem({ text, to = "/" }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `text-white font-medium transition font-nunitod font-normal ${
          isActive ? "" : "underline"
        }`
      }
    >
      {text}
    </NavLink>
  );
}
export default NavItem;
