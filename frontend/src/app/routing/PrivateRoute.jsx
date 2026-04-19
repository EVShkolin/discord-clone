import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../provider/AuthProvider.jsx';

const PrivateRoute = () => {
  const { logout, isAuthenticated } = useAuth();

  if (!isAuthenticated()) {
    logout();
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default PrivateRoute;
