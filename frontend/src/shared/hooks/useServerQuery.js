import { useQuery } from '@tanstack/react-query';
import serverApi from '@shared/api/server.js';

export const useServerQuery = (userId) => {
  return useQuery({
    queryKey: ['servers'],
    queryFn: () => serverApi.getAll(userId),
  });
};

export const useAvailableServers = (userId) => {
  return useQuery({
    queryKey: ['servers', 'available'],
    queryFn: () => serverApi.findAvailable(userId)
  });
};
