import { AuthProvider } from './provider/AuthProvider.jsx';
import { QueryClientProvider } from '@tanstack/react-query';

import './styles/fonts.css';
import './styles/normalize.css';
import './styles/global.css';
import './styles/variables.css';
import { queryClient } from '@/shared/lib/queryClient.js';
import { AppRouter } from '@/app/routing/AppRouter.jsx';

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
