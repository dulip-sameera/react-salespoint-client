import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Outlet />;
  } else {
    return <Navigate to={"/login"} />;
  }
};

export default ProtectedRoute;
