import { useMutation, useQueryClient } from '@tanstack/react-query';
import { competitionApi } from '../api/competition.api';

export const useRegistration = (competitionId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data = {}) => competitionApi.register(competitionId, data),
    onSuccess: () => {
      // Invalidate to dynamically update UI with new registration status and spots count
      queryClient.invalidateQueries({
        queryKey: ['competition', competitionId],
      });
    },
  });
};
