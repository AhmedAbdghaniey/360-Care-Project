import api from './axios';

export const getAll = async () => {
  try {
    const { data } = await api.get('/doctors');
    return data;
  } catch (error) {
    throw error;
  }
};

export const getById = async (id) => {
  try {
    const { data } = await api.get(`/doctors/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getMyProfile = async () => {
  try {
    const { data } = await api.get('/doctors/me');
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateMyProfile = async (data) => {
  try {
    const { data: res } = await api.put('/doctors/me', data);
    return res;
  } catch (error) {
    throw error;
  }
};

export const create = async (data) => {
  try {
    const { data: res } = await api.post('/doctors', data);
    return res;
  } catch (error) {
    throw error;
  }
};

export const update = async (id, data) => {
  try {
    const { data: res } = await api.put(`/doctors/${id}`, data);
    return res;
  } catch (error) {
    throw error;
  }
};

export const deleteDoctor = async (id) => {
  try {
    const { data } = await api.delete(`/doctors/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
};
