import api from './axios';

export const getAll = async () => {
  const { data } = await api.get('/doctorjobrecommendation');
  return data;
};

export const create = async (payload) => {
  const { data } = await api.post('/doctorjobrecommendation', payload);
  return data;
};

export const update = async (id, payload) => {
  const { data } = await api.put(`/doctorjobrecommendation/${id}`, payload);
  return data;
};

export const deleteRecommendation = async (id) => {
  const { data } = await api.delete(`/doctorjobrecommendation/${id}`);
  return data;
};
