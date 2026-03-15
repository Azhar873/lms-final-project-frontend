import { Navbar as BSNavbar, Nav, Container, Button, Badge, Offcanvas } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { FaGraduationCap, FaSignOutAlt, FaUser, FaChalkboardTeacher, FaUserShield } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Only apply transparency on Home, About and Auth pages. Dashboard needs solid navbar.
    const isTransparentPage = ['/', '/about', '/login', '/register'].includes(location.pathname) || location.pathname.startsWith('/courses/');
    const navbarClass = `main-navbar ${isTransparentPage && !isScrolled ? 'navbar-transparent' : 'shadow-sm solid-nav'}`;

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const getDashboardLink = () => {
        if (!user) return null;
        if (user.role === 'admin') return '/admin/reports';
        if (user.role === 'instructor') return '/instructor/dashboard';
        return '/student/my-courses';
    };

    const roleBadgeVariant = () => {
        if (user?.role === 'admin') return 'danger';
        if (user?.role === 'instructor') return 'warning';
        return 'success';
    };

    return (
        <BSNavbar expand="lg" className={navbarClass} fixed="top" variant={isTransparentPage && !isScrolled ? 'dark' : 'light'}>
            <Container>
                <BSNavbar.Brand as={Link} to="/" className="navbar-brand-custom">
                    <FaGraduationCap className="brand-icon me-2" />
                    <span className={isTransparentPage && !isScrolled ? 'text-white' : ''}>LearnHub</span>
                </BSNavbar.Brand>
                <BSNavbar.Toggle aria-controls={`offcanvasNavbar-expand-lg`} />
                <BSNavbar.Offcanvas
                    id={`offcanvasNavbar-expand-lg`}
                    aria-labelledby={`offcanvasNavbarLabel-expand-lg`}
                    placement="end"
                    className="navbar-offcanvas-custom"
                >
                    <Offcanvas.Header closeButton className="border-bottom px-4">
                        <Offcanvas.Title id={`offcanvasNavbarLabel-expand-lg`} className="font-weight-bold d-flex align-items-center">
                            <FaGraduationCap className="brand-icon me-2" /> LearnHub
                        </Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body className="px-4">
                        <Nav className="me-auto gap-2">
                            <Nav.Link as={Link} to="/" onClick={() => document.querySelector('.btn-close')?.click()}>Home</Nav.Link>
                            <Nav.Link as={Link} to="/courses" onClick={() => document.querySelector('.btn-close')?.click()}>Courses</Nav.Link>
                            <Nav.Link as={Link} to="/about" onClick={() => document.querySelector('.btn-close')?.click()}>About</Nav.Link>
                        </Nav>
                        <hr className="d-lg-none my-3 opacity-10" />
                        <Nav className="align-items-start align-items-lg-center gap-3">
                            {user ? (
                                <>
                                    <div className={`d-flex align-items-center gap-2 ${isTransparentPage && !isScrolled ? 'text-lg-white' : 'text-dark'}`}>
                                        <div className="user-avatar-mini">
                                            {user.name[0].toUpperCase()}
                                        </div>
                                        <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center">
                                            <strong>{user.name.split(' ')[0]}</strong>
                                            <Badge bg={roleBadgeVariant()} className="ms-lg-1 role-badge-nav mt-1 mt-lg-0">{user.role}</Badge>
                                        </div>
                                    </div>
                                    <Nav.Link 
                                        as={Link} 
                                        to={getDashboardLink()} 
                                        className="dash-link d-flex align-items-center gap-2 px-0"
                                        onClick={() => document.querySelector('.btn-close')?.click()}
                                    >
                                        <MdDashboard /> Dashboard
                                    </Nav.Link>
                                    <Button 
                                        variant={isTransparentPage && !isScrolled ? "outline-light" : "outline-primary"} 
                                        size="sm" 
                                        onClick={() => { handleLogout(); document.querySelector('.btn-close')?.click(); }} 
                                        className="logout-btn d-flex align-items-center gap-1 rounded-pill px-4 w-100 w-lg-auto justify-content-center mt-2 mt-lg-0"
                                    >
                                        <FaSignOutAlt /> Logout
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Nav.Link as={Link} to="/login" onClick={() => document.querySelector('.btn-close')?.click()}>Login</Nav.Link>
                                    <Button as={Link} to="/register" variant="primary" size="sm" className="rounded-pill px-4 shadow-sm w-100 w-lg-auto" onClick={() => document.querySelector('.btn-close')?.click()}>Register</Button>
                                </>
                            )}
                        </Nav>
                    </Offcanvas.Body>
                </BSNavbar.Offcanvas>
            </Container>
        </BSNavbar>
    );
};

export default Navbar;
