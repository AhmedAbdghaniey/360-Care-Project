import api from './axios';

export const getConversations = async () => {
  try {
    const { data } = await api.get('/messages/conversations');
    return data;
  } catch (error) {
    throw error;
  }
};

export const getMessages = async (userId) => {
  try {
    const { data } = await api.get(`/messages/${userId}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const send = async (data) => {
  try {
    const { data: res } = await api.post('/messages', data);
    return res;
  } catch (error) {
    throw error;
  }
};
