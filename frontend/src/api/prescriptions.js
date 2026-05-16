import api from './axios';

export const getAll = async () => {
  try {
    const { data } = await api.get('/prescription');
    return data;
  } catch (error) {
    throw error;
  }
};

export const create = async (data) => {
  try {
    const { data: res } = await api.post('/prescription', data);
    return res;
  } catch (error) {
    throw error;
  }
};

export const update = async (id, data) => {
  try {
    const { data: res } = await api.put(`/prescription/${id}`, data);
    return res;
  } catch (error) {
    throw error;
  }
};

export const deletePrescription = async (id) => {
  try {
    const { data } = await api.delete(`/prescription/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
};
