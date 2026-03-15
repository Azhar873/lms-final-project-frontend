import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    MdLibraryBooks,
    MdPerson,
    MdDashboard,
    MdAddBox,
    MdVideoLibrary,
    MdPeople,
    MdPendingActions,
    MdRateReview,
    MdWorkspacePremium,
    MdAnalytics,
} from 'react-icons/md';
import { FaUserCircle } from 'react-icons/fa';

const DashboardLayout = ({ children }) => {
    const { user } = useAuth();
    const location = useLocation();

    const studentLinks = [
        { path: '/student/my-courses', label: 'My Courses', icon: <MdLibraryBooks /> },
        { path: '/student/profile', label: 'Profile', icon: <MdPerson /> },
    ];
    const instructorLinks = [
        { path: '/instructor/dashboard', label: 'Dashboard', icon: <MdAnalytics /> },
        { path: '/instructor/courses', label: 'Manage Courses', icon: <MdDashboard /> },
        { path: '/instructor/create', label: 'Create Course', icon: <MdAddBox /> },
        { path: '/instructor/lessons', label: 'Upload Lessons', icon: <MdVideoLibrary /> },
        { path: '/instructor/requests', label: 'Enrollment Requests', icon: <MdPendingActions /> },
        { path: '/instructor/reviews', label: 'Course Reviews', icon: <MdRateReview /> },
        { path: '/instructor/certificates', label: 'Certificates', icon: <MdWorkspacePremium /> },
    ];
    const adminLinks = [
        { path: '/admin/reports', label: 'Dashboard', icon: <MdAnalytics /> },
        { path: '/admin/users', label: 'Manage Users', icon: <MdPeople /> },
        { path: '/admin/courses', label: 'Manage Courses', icon: <MdLibraryBooks /> },
    ];

    const links =
        user?.role === 'admin'
            ? adminLinks
            : user?.role === 'instructor'
                ? instructorLinks
                : studentLinks;

    return (
        <div className="dashboard-layout-container">
            <aside className="dashboard-sidebar shadow-sm">
                <div className="sidebar-header p-4 text-center border-bottom border-light">
                    <div className="sidebar-avatar-wrapper mb-3">
                        {user?.name ? (
                            <div className="avatar-circle mx-auto">
                                {user.name[0].toUpperCase()}
                            </div>
                        ) : (
                            <FaUserCircle size={64} className="text-secondary opacity-50" />
                        )}
                    </div>
                    <div className="sidebar-user-info">
                        <h6 className="mb-0 font-weight-bold text-truncate">{user?.name}</h6>
                        <span className={`badge-role role-${user?.role} mt-1 d-inline-block small`}>{user?.role}</span>
                    </div>
                </div>
                <Nav className="flex-column sidebar-nav p-3 gap-1">
                    {links.map((link) => (
                        <Nav.Link
                            key={link.path}
                            as={Link}
                            to={link.path}
                            className={`sidebar-link d-flex align-items-center gap-3 px-3 py-2 rounded-lg ${location.pathname === link.path ? 'active shadow-sm' : ''}`}
                        >
                            <span className="link-icon fs-5 d-flex">{link.icon}</span>
                            <span className="link-label font-weight-medium">{link.label}</span>
                        </Nav.Link>
                    ))}
                </Nav>
            </aside>
            <main className="dashboard-main-content">
                <div className="container-fluid p-4 p-lg-5">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
