import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as hospitalsApi from '../api/hospitals';

export const useHospitals = () =>
  useQuery({
    queryKey: ['hospitals'],
    queryFn: hospitalsApi.getAll,
  });

export const useHospital = (id) =>
  useQuery({
    queryKey: ['hospitals', id],
    queryFn: () => hospitalsApi.getById(id),
    enabled: !!id,
  });

export const useMyHospitalProfile = () =>
  useQuery({
    queryKey: ['my-hospital-profile'],
    queryFn: hospitalsApi.getMyProfile,
  });

export const useUpdateHospitalProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: hospitalsApi.updateMyProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-hospital-profile'] });
      queryClient.invalidateQueries({ queryKey: ['hospitals'] });
    },
  });
};

export const useCreateHospital = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: hospitalsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hospitals'] });
    },
  });
};

export const useUpdateHospital = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => hospitalsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hospitals'] });
    },
  });
};

export const useDeleteHospital = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: hospitalsApi.deleteHospital,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hospitals'] });
    },
  });
};
