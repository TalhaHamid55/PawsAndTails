import { useMemo } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const navLinks = useMemo(() => {
    const baseLinks = [
      { to: "", name: "Dashboard" },
      { to: "/orders", name: "Orders" },
      { to: "/appointments", name: "Appointments" },
    ];

    const adminLinks = [
      { to: "/products", name: "Products" },
      { to: "/petadoptions", name: "Pet Adoptions" },
      { to: "/veterinaries", name: "Pet Veterinaries" },
      { to: "/petgrooming", name: "Pet Grooming" },
      { to: "/blogs", name: "Blogs" },
      { to: "/users", name: "Users" },
    ];

    return user?.role === "admin" ? [...baseLinks, ...adminLinks] : baseLinks;
  }, [user]);

  return (
    <aside>
      <nav>
        <ul className="sidebar-menu">
          {navLinks.map((k) => (
            <li>
              <NavLink
                to={`/dashboard${k.to}`}
                end
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                {k.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
