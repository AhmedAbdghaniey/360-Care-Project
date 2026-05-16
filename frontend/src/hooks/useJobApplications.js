import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as jobApplicationsApi from '../api/jobApplications';

export const useJobApplications = () =>
  useQuery({
    queryKey: ['job-applications'],
    queryFn: jobApplicationsApi.getAll,
  });

export const useMyJobApplications = () =>
  useQuery({
    queryKey: ['my-job-applications'],
    queryFn: jobApplicationsApi.getMy,
  });

export const useCreateJobApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: jobApplicationsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-applications'] });
      queryClient.invalidateQueries({ queryKey: ['my-job-applications'] });
    },
  });
};

export const useUpdateJobApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => jobApplicationsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-applications'] });
      queryClient.invalidateQueries({ queryKey: ['my-job-applications'] });
    },
  });
};

export const useDeleteJobApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: jobApplicationsApi.deleteApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-applications'] });
      queryClient.invalidateQueries({ queryKey: ['my-job-applications'] });
    },
  });
};
