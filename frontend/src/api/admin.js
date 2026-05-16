import api from './axios';

export const getUsers = async () => {
  try {
    const { data } = await api.get('/admin/users');
    return data;
  } catch (error) {
    throw error;
  }
};

export const toggleActive = async (id) => {
  try {
    const { data } = await api.put(`/admin/users/${id}/toggle-active`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const { data } = await api.delete(`/admin/users/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
};
