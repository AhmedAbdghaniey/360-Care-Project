import api from './axios';

export const getDoctorAvailability = async (doctorId) => {
  const { data } = await api.get(`/doctors/${doctorId}/availability`);
  return data;
};

export const setDoctorAvailability = async (doctorId, slots) => {
  const { data } = await api.put(`/doctors/${doctorId}/availability`, slots);
  return data;
};
