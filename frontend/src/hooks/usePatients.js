import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as patientsApi from '../api/patients';

export const usePatients = () =>
  useQuery({
    queryKey: ['patients'],
    queryFn: patientsApi.getAll,
  });

export const usePatient = (id) =>
  useQuery({
    queryKey: ['patients', id],
    queryFn: () => patientsApi.getById(id),
    enabled: !!id,
  });

export const useMyPatientProfile = () =>
  useQuery({
    queryKey: ['my-patient-profile'],
    queryFn: patientsApi.getMyProfile,
  });

export const useUpdatePatientProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: patientsApi.updateMyProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-patient-profile'] });
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
};

export const useCreatePatient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: patientsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
};

export const useUpdatePatient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => patientsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
};

export const useDeletePatient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: patientsApi.deletePatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
};
