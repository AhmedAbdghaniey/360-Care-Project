import api from './axios';

export const getStats = async () => {
  try {
    const { data } = await api.get('/dashboard');
    return data;
  } catch (error) {
    throw error;
  }
};
