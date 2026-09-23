import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { competitionApi } from '../api/competition.api';

export const useCompetition = (competitionId, userKey = 'guest') => {
  return useQuery({
    queryKey: ['competition', competitionId, userKey],
    queryFn: () => competitionApi.getCompetition(competitionId),
    enabled: !!competitionId,
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

