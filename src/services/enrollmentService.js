import api from './api';

export const enrollInCourse = (courseId) => api.post('/enroll', { courseId });
export const getMyCourses = () => api.get('/enroll/my-courses');
export const updateProgress = (enrollmentId, progress) =>
    api.put(`/enroll/${enrollmentId}/progress`, { progress });
export const getPendingRequests = () => api.get('/enroll/pending');
export const handleEnrollmentRequest = (id, status) =>
    api.put(`/enroll/${id}/status`, { status });
export const getInstructorEnrollments = () => api.get('/enroll/instructor');
export const getEnrollmentById = (id) => api.get(`/enroll/${id}`);
export const completeLesson = (id, lessonIndex) => api.post(`/enroll/${id}/lesson-complete`, { lessonIndex });
export const getInstructorAnalytics = () => api.get('/enroll/instructor-analytics');

