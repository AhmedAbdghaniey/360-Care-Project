import api from './axios';

export const getById = async (id) => {
  try {
    const { data } = await api.get(`/hospital/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getAll = async () => {
  try {
    const { data } = await api.get('/hospital');
    return data;
  } catch (error) {
    throw error;
  }
};

export const getMyProfile = async () => {
  try {
    const { data } = await api.get('/hospital/me');
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateMyProfile = async (data) => {
  try {
    const { data: res } = await api.put('/hospital/me', data);
    return res;
  } catch (error) {
    throw error;
  }
};

export const create = async (data) => {
  try {
    const { data: res } = await api.post('/hospital', data);
    return res;
  } catch (error) {
    throw error;
  }
};

export const update = async (id, data) => {
  try {
    const { data: res } = await api.put(`/hospital/${id}`, data);
    return res;
  } catch (error) {
    throw error;
  }
};

export const deleteHospital = async (id) => {
  try {
    const { data } = await api.delete(`/hospital/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
};
