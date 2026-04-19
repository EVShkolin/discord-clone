import { useLocation } from 'react-router';
import LoginForm from '@features/auth/ui/LoginForm/LoginForm.jsx';
import RegisterForm from '@features/auth/ui/RegisterForm/RegisterForm.jsx';
import styles from './Login.module.css';

const Login = () => {
  const location = useLocation();
  const isRegistration = location.pathname === '/register';

  return <div className={styles.layout}>{isRegistration ? <RegisterForm /> : <LoginForm />}</div>;
};

export default Login;
