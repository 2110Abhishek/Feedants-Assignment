import { useMutation, useQueryClient } from '@tanstack/react-query';
import { competitionApi } from '../api/competition.api';

export const useRegistration = (competitionId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data = {}) => competitionApi.register(competitionId, data),
    onSuccess: (res) => {
      // 1. Instantly update the cached query data so the UI stays stable without flashing skeleton
      queryClient.setQueriesData({ queryKey: ['competition', competitionId] }, (old) => {
        if (!old) return old;
        const currentCount = old.competition?.registeredCount || 0;
        const capacity = old.competition?.capacity || 10;
        return {
          ...old,
          competition: {
            ...old.competition,
            registeredCount: currentCount + 1,
            spotsRemaining: Math.max(0, capacity - (currentCount + 1)),
          },
          userState: {
            ...old.userState,
            isRegistered: true,
            registration: res?.registration || { status: 'REGISTERED', paymentStatus: 'PAID' },
            cta: {
              label: 'Submit Entry',
              action: 'SUBMIT',
              enabled: true,
              subtitle: 'Registration confirmed',
            },
          },
        };
      });

      // 2. Revalidate in the background without resetting UI state
      queryClient.invalidateQueries({
        queryKey: ['competition', competitionId],
        refetchType: 'active',
      });
    },
  });
};
