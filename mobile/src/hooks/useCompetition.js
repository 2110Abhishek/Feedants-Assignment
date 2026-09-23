import { useQuery } from '@tanstack/react-query';
import { competitionApi } from '../api/competition.api';

export const useCompetition = (competitionId, userKey = 'guest') => {
  return useQuery({
    queryKey: ['competition', competitionId, userKey],
    queryFn: () => competitionApi.getCompetition(competitionId),
    enabled: !!competitionId,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};
