import { useQuery } from '@tanstack/react-query';
import serverApi from '../api/server.js';

export const useServerQuery = (userId) => {
  return useQuery({
    queryKey: ['servers'],
    queryFn: () => serverApi.getAll(userId),
  });
};
