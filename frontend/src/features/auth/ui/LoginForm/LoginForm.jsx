import { Link, useNavigate } from 'react-router';
import { useState } from 'react';
import auth from '@shared/api/auth.js';
import { useAuth } from '@app/provider/AuthProvider.jsx';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await auth.login(email, password);
      const { user, token } = data;
      login(user, token);
      navigate('/channels/@me');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Вход</h1>
      <label htmlFor="emailInput">Email</label>
      <input id="emailInput" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

      <label htmlFor="passwordInput">Пароль</label>
      <input
        id="passwordInput"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit">Войти</button>

      <p>
        Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
      </p>
    </form>
  );
};

export default LoginForm;
