import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './routes/PrivateRoute';
import RoleRoute from './routes/RoleRoute';

// Public Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import CourseListingPage from './pages/CourseListingPage';
import CourseDetailPage from './pages/CourseDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import VerifyOTPPage from './pages/VerifyOTPPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

// Student Pages
import MyCoursesPage from './pages/student/MyCoursesPage';
import ProfilePage from './pages/student/ProfilePage';

// Instructor Pages
import ManageCoursesPage from './pages/instructor/ManageCoursesPage';
import CreateCoursePage from './pages/instructor/CreateCoursePage';
import UploadLessonsPage from './pages/instructor/UploadLessonsPage';
import EnrollmentRequestsPage from './pages/instructor/EnrollmentRequestsPage';
import InstructorReviewsPage from './pages/instructor/InstructorReviewsPage';
import InstructorCertificatesPage from './pages/instructor/InstructorCertificatesPage';
import InstructorDashboardPage from './pages/instructor/InstructorDashboardPage';
import CertificatePage from './pages/CertificatePage';

// Admin Pages
import ManageUsersPage from './pages/admin/ManageUsersPage';
import ManageCoursesAdminPage from './pages/admin/ManageCoursesPage';
import ReportsPage from './pages/admin/ReportsPage';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function AppContent() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/student') || 
                      location.pathname.startsWith('/instructor') || 
                      location.pathname.startsWith('/admin');
  const isCertificate = location.pathname.startsWith('/certificate');

  return (
    <>
      {!isCertificate && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/courses" element={<CourseListingPage />} />
        <Route path="/courses/:id" element={<CourseDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-otp" element={<VerifyOTPPage />} />
        <Route path="/password-reset" element={<ResetPasswordPage />} />

        {/* Student Routes */}
        <Route path="/student/my-courses" element={
          <PrivateRoute>
            <RoleRoute roles={['student']}>
              <MyCoursesPage />
            </RoleRoute>
          </PrivateRoute>
        } />
        <Route path="/student/profile" element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        } />

        {/* Instructor Routes */}
        <Route path="/instructor/dashboard" element={
          <PrivateRoute>
            <RoleRoute roles={['instructor', 'admin']}>
              <InstructorDashboardPage />
            </RoleRoute>
          </PrivateRoute>
        } />
        <Route path="/instructor/courses" element={
          <PrivateRoute>
            <RoleRoute roles={['instructor', 'admin']}>
              <ManageCoursesPage />
            </RoleRoute>
          </PrivateRoute>
        } />
        <Route path="/instructor/create" element={
          <PrivateRoute>
            <RoleRoute roles={['instructor', 'admin']}>
              <CreateCoursePage />
            </RoleRoute>
          </PrivateRoute>
        } />
        <Route path="/instructor/edit/:id" element={
          <PrivateRoute>
            <RoleRoute roles={['instructor', 'admin']}>
              <CreateCoursePage />
            </RoleRoute>
          </PrivateRoute>
        } />
        <Route path="/instructor/lessons" element={
          <PrivateRoute>
            <RoleRoute roles={['instructor', 'admin']}>
              <UploadLessonsPage />
            </RoleRoute>
          </PrivateRoute>
        } />
        <Route path="/instructor/requests" element={
          <PrivateRoute>
            <RoleRoute roles={['instructor', 'admin']}>
              <EnrollmentRequestsPage />
            </RoleRoute>
          </PrivateRoute>
        } />
        <Route path="/instructor/reviews" element={
          <PrivateRoute>
            <RoleRoute roles={['instructor', 'admin']}>
              <InstructorReviewsPage />
            </RoleRoute>
          </PrivateRoute>
        } />
        <Route path="/instructor/certificates" element={
          <PrivateRoute>
            <RoleRoute roles={['instructor', 'admin']}>
              <InstructorCertificatesPage />
            </RoleRoute>
          </PrivateRoute>
        } />

        <Route path="/certificate/:id" element={
          <PrivateRoute>
            <CertificatePage />
          </PrivateRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin/users" element={
          <PrivateRoute>
            <RoleRoute roles={['admin']}>
              <ManageUsersPage />
            </RoleRoute>
          </PrivateRoute>
        } />
        <Route path="/admin/courses" element={
          <PrivateRoute>
            <RoleRoute roles={['admin']}>
              <ManageCoursesAdminPage />
            </RoleRoute>
          </PrivateRoute>
        } />
        <Route path="/admin/reports" element={
          <PrivateRoute>
            <RoleRoute roles={['admin']}>
              <ReportsPage />
            </RoleRoute>
          </PrivateRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!isDashboard && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <AppContent />
    </Router>
  );
}

export default App;
