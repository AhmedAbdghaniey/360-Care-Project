import api from './axios';

export const getAll = async () => {
  try {
    const { data } = await api.get('/jobapplication');
    return data;
  } catch (error) {
    throw error;
  }
};

export const getMy = async () => {
  try {
    const { data } = await api.get('/jobapplication/my');
    return data;
  } catch (error) {
    throw error;
  }
};

export const create = async (data) => {
  try {
    const { data: res } = await api.post('/jobapplication', data);
    return res;
  } catch (error) {
    throw error;
  }
};

export const update = async (id, data) => {
  try {
    const { data: res } = await api.put(`/jobapplication/${id}`, data);
    return res;
  } catch (error) {
    throw error;
  }
};

export const deleteApplication = async (id) => {
  try {
    const { data } = await api.delete(`/jobapplication/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
};
