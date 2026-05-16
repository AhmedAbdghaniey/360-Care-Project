import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as jobRecApi from '../api/jobRecommendations';

export const jobRecKeys = {
  all: ['doctorJobRecommendations'],
};

export function useJobRecommendations() {
  return useQuery({
    queryKey: jobRecKeys.all,
    queryFn: () => jobRecApi.getAll().then((r) => r?.data || r),
  });
}

export function useCreateJobRecommendation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => jobRecApi.create(payload),
    onSettled: () => qc.invalidateQueries({ queryKey: jobRecKeys.all }),
  });
}

export function useDeleteJobRecommendation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => jobRecApi.deleteRecommendation(id),
    onSettled: () => qc.invalidateQueries({ queryKey: jobRecKeys.all }),
  });
}
