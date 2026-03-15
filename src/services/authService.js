import api from './api';

export const loginUser = (data) => api.post('/auth/login', data);
export const registerUser = (data) => api.post('/auth/register', data);
export const forgotPasswordUser = (email) => api.post('/auth/forgotpassword', { email });
export const verifyOTPUser = (email, otp) => api.post('/auth/verify-otp', { email, otp });
export const resetPasswordUser = (email, otp, password) => api.put('/auth/resetpassword', { email, otp, password });

export const getMe = () => api.get('/auth/me');
