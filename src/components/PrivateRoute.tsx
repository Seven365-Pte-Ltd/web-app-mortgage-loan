import { Outlet, Navigate } from "react-router-dom";

const PrivateRoute = () => {
  const isLoggedIn = localStorage.getItem('apiToken') !== null;
  return isLoggedIn ? <Outlet /> : <Navigate to="/admin" />;
};

export default PrivateRoute;
