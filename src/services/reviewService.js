import api from './api';

export const addReview = (data) => api.post('/reviews', data);
export const getCourseReviews = (courseId) => api.get(`/reviews/course/${courseId}`);
export const getInstructorReviews = () => api.get('/reviews/instructor');
export const deleteReview = (id) => api.delete(`/reviews/${id}`);
