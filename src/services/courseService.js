import api from './api';

export const getCourses = (params) => api.get('/courses', { params });
export const getCourseById = (id) => api.get(`/courses/${id}`);
export const createCourse = (data) => api.post('/courses', data);
export const updateCourse = (id, data) => api.put(`/courses/${id}`, data);
export const deleteCourse = (id) => api.delete(`/courses/${id}`);
export const addLesson = (courseId, data) => api.post(`/courses/${courseId}/lessons`, data);
export const uploadVideo = (formData, onUploadProgress) => api.post('/courses/upload-video', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress
});
export const uploadImage = (formData, onUploadProgress) => api.post('/courses/upload-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress
});
