import api from './axios';

export const getAll = async () => {
  try {
    const { data } = await api.get('/medicalrecord');
    return data;
  } catch (error) {
    throw error;
  }
};

export const create = async (data) => {
  try {
    const { data: res } = await api.post('/medicalrecord', data);
    return res;
  } catch (error) {
    throw error;
  }
};

export const update = async (id, data) => {
  try {
    const { data: res } = await api.put(`/medicalrecord/${id}`, data);
    return res;
  } catch (error) {
    throw error;
  }
};

export const deleteRecord = async (id) => {
  try {
    const { data } = await api.delete(`/medicalrecord/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
};
