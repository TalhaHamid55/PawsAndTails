import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const RoleRoute = ({ allowedRoles }) => {
  const user = useSelector((state) => state.auth.user);
  const isAuthorized = user && allowedRoles.includes(user.role);

  return isAuthorized ? (
    <Outlet />
  ) : (
    <Navigate to="/dashboard/unauthorized" replace />
  );
};

export default RoleRoute;
