import { Outlet } from "react-router-dom";
import "../pages/styles/dashboard.css";
import Sidebar from "./Sidebar";

const DashboardLayout = () => {
  return (
    <div className="dashboard-layout-container">
      <Sidebar />
      <section>
        <Outlet />
      </section>
    </div>
  );
};

export default DashboardLayout;
