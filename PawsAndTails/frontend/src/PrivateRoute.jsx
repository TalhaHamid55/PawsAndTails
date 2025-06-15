import { useSelector } from "react-redux";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { decodeToken } from "./utils/decodeToken";

const PrivateRoute = () => {
  const location = useLocation();
  const tokenFromRedux = useSelector((state) => state.auth.token);
  const token = tokenFromRedux || localStorage.getItem("token");

  const decoded = token ? decodeToken(token) : null;
  const isValid = !!decoded;

  return isValid ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
};

export default PrivateRoute;
