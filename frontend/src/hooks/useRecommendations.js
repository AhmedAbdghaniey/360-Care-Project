import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as recommendationsApi from '../api/recommendations';

export const useRecommendations = () =>
  useQuery({
    queryKey: ['recommendations'],
    queryFn: recommendationsApi.getAll,
  });

export const useCreateRecommendation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: recommendationsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
    },
  });
};

export const useUpdateRecommendation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => recommendationsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
    },
  });
};

export const useDeleteRecommendation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: recommendationsApi.deleteRecommendation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
    },
  });
};
