import { useAuth } from '@app/provider/AuthProvider.jsx';
import { useServerQuery } from '@shared/hooks/useServerQuery.js';

export const useCurrentUserServers = () => {
  const { user } = useAuth();
  return useServerQuery(user?.id);
};
