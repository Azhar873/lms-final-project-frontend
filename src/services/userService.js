import api from './api';

export const getAllUsers = () => api.get('/users');
export const deleteUser = (id) => api.delete(`/users/${id}`);
export const getAnalytics = () => api.get('/users/analytics');
