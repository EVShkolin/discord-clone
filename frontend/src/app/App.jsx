import { BrowserRouter, Route, Routes, useNavigate } from 'react-router';
import Login from '../pages/Login/Login.jsx';
import Main from '../pages/AppLayout/Main.jsx';
import PrivateRoute from './routing/PrivateRoute.jsx';
import { AuthProvider } from './provider/AuthProvider.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import './styles/fonts.css';
import './styles/normalize.css';
import './styles/global.css';
import './styles/variables.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/register" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/channels/:serverId/:channelId"
              element={
                <PrivateRoute>
                  <Main />
                </PrivateRoute>
              }
            />
            <Route
              path="channels/@me"
              element={
                <PrivateRoute>
                  <Main />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<h1 style={{ backgroundColor: 'purple' }}>Hello</h1>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
