import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { FaGraduationCap, FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';

const Footer = () => (
    <footer className="site-footer">
        <Container>
            <Row className="py-5">
                <Col md={4} className="mb-4">
                    <h5 className="footer-brand d-flex align-items-center gap-2">
                        <FaGraduationCap size={28} className="brand-icon" /> LearnHub
                    </h5>
                    <p className="footer-desc mt-3">
                        Empowering learners and instructors worldwide with a premium, industry-standard education platform. Join us to reshape your future.
                    </p>
                    <div className="social-links d-flex gap-3 mt-4">
                        <a href="#"><FaFacebook /></a>
                        <a href="#"><FaTwitter /></a>
                        <a href="#"><FaLinkedin /></a>
                        <a href="#"><FaInstagram /></a>
                    </div>
                </Col>
                <Col md={2} className="mb-4 offset-md-1">
                    <h6 className="footer-heading">Platform</h6>
                    <ul className="footer-links list-unstyled">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/courses">Courses</Link></li>
                        <li><Link to="/about">About Us</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                    </ul>
                </Col>
                <Col md={2} className="mb-4">
                    <h6 className="footer-heading">Account</h6>
                    <ul className="footer-links list-unstyled">
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/register">Register</Link></li>
                        <li><Link to="/student/my-courses">My Learning</Link></li>
                    </ul>
                </Col>
                <Col md={3} className="mb-4">
                    <h6 className="footer-heading">Newsletter</h6>
                    <p className="small">Subscribe to get latest updates and course news.</p>
                    <div className="newsletter-box mt-3">
                        <input type="email" placeholder="Email address" className="form-control form-control-sm" />
                    </div>
                </Col>
            </Row>
            <hr className="footer-hr" />
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 pb-3">
                <p className="footer-copy mb-0">© {new Date().getFullYear()} LearnHub LMS. All rights reserved.</p>
                <div className="footer-sub-links d-flex gap-4 small">
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Service</a>
                </div>
            </div>
        </Container>
    </footer>
);

export default Footer;
