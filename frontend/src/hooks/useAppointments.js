import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as appointmentsApi from '../api/appointments';

export const useAppointments = () =>
  useQuery({
    queryKey: ['appointments'],
    queryFn: appointmentsApi.getAll,
  });

export const useMyAppointments = () =>
  useQuery({
    queryKey: ['my-appointments'],
    queryFn: appointmentsApi.getMy,
  });

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: appointmentsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['my-appointments'] });
    },
  });
};

export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => appointmentsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['my-appointments'] });
    },
  });
};

export const useDeleteAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: appointmentsApi.deleteAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['my-appointments'] });
    },
  });
};
