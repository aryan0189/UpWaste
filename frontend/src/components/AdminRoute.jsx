import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("upwaste-admin-token");

  if (!token) {
    return <Navigate to="/admin-login" />;
  }

  return children;
};

export default AdminRoute;
