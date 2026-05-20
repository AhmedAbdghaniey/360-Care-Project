import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as availabilityApi from '../api/availability';

export const useDoctorAvailability = (doctorId) =>
  useQuery({
    queryKey: ['doctor-availability', doctorId],
    queryFn: () => availabilityApi.getDoctorAvailability(doctorId),
    enabled: !!doctorId,
  });

export const useSetDoctorAvailability = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ doctorId, slots }) => availabilityApi.setDoctorAvailability(doctorId, slots),
    onSuccess: (_, { doctorId }) => {
      queryClient.invalidateQueries({ queryKey: ['doctor-availability', doctorId] });
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
    },
  });
};
