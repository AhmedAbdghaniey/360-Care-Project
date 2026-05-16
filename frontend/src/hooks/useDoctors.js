import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as doctorsApi from '../api/doctors';

export const useDoctors = () =>
  useQuery({
    queryKey: ['doctors'],
    queryFn: doctorsApi.getAll,
  });

export const useDoctor = (id) =>
  useQuery({
    queryKey: ['doctors', id],
    queryFn: () => doctorsApi.getById(id),
    enabled: !!id,
  });

export const useMyDoctorProfile = () =>
  useQuery({
    queryKey: ['my-doctor-profile'],
    queryFn: doctorsApi.getMyProfile,
  });

export const useUpdateDoctorProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: doctorsApi.updateMyProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-doctor-profile'] });
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
    },
  });
};

export const useCreateDoctor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: doctorsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
    },
  });
};

export const useUpdateDoctor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => doctorsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
    },
  });
};

export const useDeleteDoctor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: doctorsApi.deleteDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
    },
  });
};
