import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as drugsApi from '../api/drugs';

export const useDrugs = () =>
  useQuery({
    queryKey: ['drugs'],
    queryFn: drugsApi.getAll,
  });

export const useCreateDrug = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: drugsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drugs'] });
    },
  });
};

export const useUpdateDrug = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => drugsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drugs'] });
    },
  });
};

export const useDeleteDrug = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: drugsApi.deleteDrug,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drugs'] });
    },
  });
};
