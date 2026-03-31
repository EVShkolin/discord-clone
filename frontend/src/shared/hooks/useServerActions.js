import { useMutation, useQueryClient } from '@tanstack/react-query';
import serverApi from '@/shared/api/server.js';

export const useServerActions = () => {
  const queryClient = useQueryClient();

  const createServer = useMutation({
    mutationFn: ({ name, description }) => serverApi.add(name, description),
    onSuccess: (newServer) => {
      const servers = queryClient.getQueryData(['servers']) || [];
      queryClient.setQueryData(['servers'], [...servers, newServer]);
    },
  });

  return { createServer };
};
