import api from './axios';

export const getAll = async () => {
  try {
    const { data } = await api.get('/doctorrecommendation');
    return data;
  } catch (error) {
    throw error;
  }
};

export const create = async (data) => {
  try {
    const { data: res } = await api.post('/doctorrecommendation', data);
    return res;
  } catch (error) {
    throw error;
  }
};

export const update = async (id, data) => {
  try {
    const { data: res } = await api.put(`/doctorrecommendation/${id}`, data);
    return res;
  } catch (error) {
    throw error;
  }
};

export const deleteRecommendation = async (id) => {
  try {
    const { data } = await api.delete(`/doctorrecommendation/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
};
