import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as jobsApi from '../api/jobs';

export const useJobs = () =>
  useQuery({
    queryKey: ['jobs'],
    queryFn: jobsApi.getAll,
  });

export const useMyJobs = () =>
  useQuery({
    queryKey: ['my-jobs'],
    queryFn: jobsApi.getMyJobs,
  });

export const useJob = (id) =>
  useQuery({
    queryKey: ['jobs', id],
    queryFn: () => jobsApi.getById(id),
    enabled: !!id,
  });

export const useCreateJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: jobsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['my-jobs'] });
    },
  });
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => jobsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['my-jobs'] });
    },
  });
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: jobsApi.deleteJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['my-jobs'] });
    },
  });
};

export const useJobApplications = () =>
  useQuery({
    queryKey: ['job-applications'],
    queryFn: jobsApi.getApplications,
  });

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ jobId, appId, status }) =>
      jobsApi.updateApplicationStatus(jobId, appId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['job-applications'] });
      queryClient.invalidateQueries({ queryKey: ['my-job-applications'] });
    },
  });
};
