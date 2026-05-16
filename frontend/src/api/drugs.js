import api from './axios';

export const getAll = async () => {
  try {
    const { data } = await api.get('/drug');
    return data;
  } catch (error) {
    throw error;
  }
};

export const create = async (data) => {
  try {
    const { data: res } = await api.post('/drug', data);
    return res;
  } catch (error) {
    throw error;
  }
};

export const update = async (id, data) => {
  try {
    const { data: res } = await api.put(`/drug/${id}`, data);
    return res;
  } catch (error) {
    throw error;
  }
};

export const deleteDrug = async (id) => {
  try {
    const { data } = await api.delete(`/drug/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
};
