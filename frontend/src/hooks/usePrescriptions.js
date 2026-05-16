import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as prescriptionsApi from '../api/prescriptions';

export const usePrescriptions = () =>
  useQuery({
    queryKey: ['prescriptions'],
    queryFn: prescriptionsApi.getAll,
  });

export const useCreatePrescription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: prescriptionsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
    },
  });
};

export const useUpdatePrescription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => prescriptionsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
    },
  });
};

export const useDeletePrescription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: prescriptionsApi.deletePrescription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
    },
  });
};
