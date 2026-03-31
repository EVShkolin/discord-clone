import { Navigate } from 'react-router';
import { isTokenValid } from '@/shared/utils/tokenValidator.js';
import { useAuth } from '../provider/AuthProvider.jsx';

const PrivateRoute = ({ children }) => {
  const { logout } = useAuth();
  const token = localStorage.getItem('jwt');

  if (!isTokenValid(token)) {
    console.log('Token invalid');
    logout();
    return <Navigate to="/login" />;
  }
  return children;
};

export default PrivateRoute;
