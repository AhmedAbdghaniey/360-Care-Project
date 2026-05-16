import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as medicalRecordsApi from '../api/medicalRecords';

export const useMedicalRecords = () =>
  useQuery({
    queryKey: ['medical-records'],
    queryFn: medicalRecordsApi.getAll,
  });

export const useCreateMedicalRecord = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: medicalRecordsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medical-records'] });
    },
  });
};

export const useUpdateMedicalRecord = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => medicalRecordsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medical-records'] });
    },
  });
};

export const useDeleteMedicalRecord = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: medicalRecordsApi.deleteRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medical-records'] });
    },
  });
};
