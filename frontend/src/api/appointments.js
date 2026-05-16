import api from './axios';

export const getAll = async () => {
  try {
    const { data } = await api.get('/appointments');
    return data;
  } catch (error) {
    throw error;
  }
};

export const getMy = async () => {
  try {
    const { data } = await api.get('/appointments/my');
    return data;
  } catch (error) {
    throw error;
  }
};

export const create = async (data) => {
  try {
    const { data: res } = await api.post('/appointments', data);
    return res;
  } catch (error) {
    throw error;
  }
};

export const update = async (id, data) => {
  try {
    const { data: res } = await api.put(`/appointments/${id}`, data);
    return res;
  } catch (error) {
    throw error;
  }
};

export const deleteAppointment = async (id) => {
  try {
    const { data } = await api.delete(`/appointments/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
};
