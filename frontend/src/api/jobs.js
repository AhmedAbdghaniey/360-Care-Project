import api from './axios';

export const getAll = async () => {
  try {
    const { data } = await api.get('/jobs');
    return data;
  } catch (error) {
    throw error;
  }
};

export const getMyJobs = async () => {
  try {
    const { data } = await api.get('/jobs/my');
    return data;
  } catch (error) {
    throw error;
  }
};

export const getById = async (id) => {
  try {
    const { data } = await api.get(`/jobs/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const create = async (data) => {
  try {
    const { data: res } = await api.post('/jobs', data);
    return res;
  } catch (error) {
    throw error;
  }
};

export const update = async (id, data) => {
  try {
    const { data: res } = await api.put(`/jobs/${id}`, data);
    return res;
  } catch (error) {
    throw error;
  }
};

export const deleteJob = async (id) => {
  try {
    const { data } = await api.delete(`/jobs/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getApplications = async () => {
  try {
    const { data } = await api.get('/jobs/applications');
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateApplicationStatus = async (jobId, appId, status) => {
  try {
    const { data } = await api.put(`/jobs/${jobId}/applications/${appId}/status`, { status });
    return data;
  } catch (error) {
    throw error;
  }
};
