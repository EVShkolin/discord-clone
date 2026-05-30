import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../provider/AuthProvider.jsx';
import { MediasoupProvider } from '@app/provider/MediasoupProvider.jsx';

const PrivateRoute = () => {
  const { logout, isAuthenticated } = useAuth();

  if (!isAuthenticated()) {
    logout();
    return <Navigate to="/login" replace />;
  }
  return (
    <MediasoupProvider>
      <Outlet />
    </MediasoupProvider>
  );
};

export default PrivateRoute;
