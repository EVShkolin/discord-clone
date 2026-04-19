import { BrowserRouter, Route, Routes } from 'react-router';
import Login from '@pages/Login/Login.jsx';
import PrivateRoute from '@app/routing/PrivateRoute.jsx';
import Main from '@pages/Main/Main.jsx';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<h1 style={{ backgroundColor: 'purple' }}>Hello</h1>} />
        <Route path="*" element={<div>Page not found</div>} />

        <Route element={<PrivateRoute />}>
          <Route path="/channels/:serverId/:channelId" element={<Main />} />
          <Route path="channels/@me" element={<Main />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
