import api from './axios';

export const getAll = async () => {
  try {
    const { data } = await api.get('/patients');
    return data;
  } catch (error) {
    throw error;
  }
};

export const getById = async (id) => {
  try {
    const { data } = await api.get(`/patients/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getMyProfile = async () => {
  try {
    const { data } = await api.get('/patients/me');
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateMyProfile = async (data) => {
  try {
    const { data: res } = await api.put('/patients/me', data);
    return res;
  } catch (error) {
    throw error;
  }
};

export const create = async (data) => {
  try {
    const { data: res } = await api.post('/patients', data);
    return res;
  } catch (error) {
    throw error;
  }
};

export const update = async (id, data) => {
  try {
    const { data: res } = await api.put(`/patients/${id}`, data);
    return res;
  } catch (error) {
    throw error;
  }
};

export const deletePatient = async (id) => {
  try {
    const { data } = await api.delete(`/patients/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
};
