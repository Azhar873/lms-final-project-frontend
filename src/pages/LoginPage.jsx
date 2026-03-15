import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Form, Button, Card, Spinner, InputGroup } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { FaGraduationCap, FaEnvelope, FaLock, FaSignInAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await login(formData.email, formData.password);
            if (res.success) {
                toast.success(`Welcome back, ${res.data.name}!`);
                if (res.data.role === 'admin') navigate('/admin/users');
                else if (res.data.role === 'instructor') navigate('/instructor/courses');
                else navigate('/student/my-courses');
            } else {
                toast.error(res.message);
            }
        } catch (err) {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page-wrapper px-3 my-4">
            {/* Dynamic Background Elements */}
            <div className="auth-bg-blob blob-1"></div>
            <div className="auth-bg-blob blob-2"></div>
            <div className="auth-bg-blob blob-3"></div>

            <Container>
                <div className="auth-glass-container mx-auto animate-fade-in-up">
                    <div className="row g-0">
                        {/* Visual Side (Hidden on Mobile) */}
                        <div className="col-lg-5 d-none d-lg-flex flex-column align-items-center justify-content-center p-5 text-white text-center auth-glass-visual">
                            <div className="auth-logo-float mb-4">
                                <FaGraduationCap size={64} className="text-white filter-drop-shadow" />
                            </div>
                            <h2 className="font-outfit font-weight-extra-bold mb-3">LearnHub</h2>
                            <p className="opacity-80 fs-5 mb-0">Transform your future with elite online education.</p>
                            <div className="mt-5 w-100">
                                <div className="d-flex align-items-center gap-3 mb-3 text-start bg-white bg-opacity-10 p-3 rounded-3xl border border-white border-opacity-10 backdrop-blur">
                                    <div className="p-2 bg-white bg-opacity-20 rounded-circle"><FaSignInAlt className='text-primary-custom' /></div>
                                    <div className="small">Trusted by 10,000+ students worldwide</div>
                                </div>
                            </div>
                        </div>

                        {/* Form Side */}
                        <div className="col-lg-7 p-4 p-md-5 auth-glass-form position-relative">
                            <div className="mb-5">
                                <Link to="/" className="text-decoration-none d-flex align-items-center gap-2 mb-4 d-lg-none">
                                    <FaGraduationCap size={32} className="text-primary" />
                                    <span className="font-outfit font-weight-bold fs-4 text-dark">LearnHub</span>
                                </Link>
                                <h3 className="font-outfit font-weight-extra-bold mb-2">Welcome Back</h3>
                                <p className="text-muted">Enter your email or username to access your dashboard</p>
                            </div>

                            <Form onSubmit={handleSubmit} className="premium-form">
                                <Form.Group className="mb-4">
                                    <Form.Label className="small font-weight-bold text-muted text-uppercase letter-spacing-1">Email or Username</Form.Label>
                                    <InputGroup className="premium-input-group shadow-sm">
                                        <InputGroup.Text className="bg-light border-end-0"><FaEnvelope className='text-primary-custom' /></InputGroup.Text>
                                        <Form.Control
                                            type="text"
                                            className="bg-light border-start-0 py-3"
                                            placeholder="Email or username"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </InputGroup>
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <Form.Label className="small font-weight-bold text-muted text-uppercase letter-spacing-1">Password</Form.Label>
                                        <Link to="/forgot-password" size="sm" className="small text-primary-custom text-decoration-none font-weight-bold">Forgot Password?</Link>
                                    </div>
                                    <InputGroup className="premium-input-group shadow-sm">
                                        <InputGroup.Text className="bg-light border-end-0"><FaLock className='text-primary-custom' /></InputGroup.Text>
                                        <Form.Control
                                            type={showPassword ? "text" : "password"}
                                            className="bg-light border-start-0 border-end-0 py-3"
                                            placeholder="Enter your password"
                                            required
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        />
                                        <InputGroup.Text
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="bg-light border-start-0 text-muted cursor-pointer"
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </InputGroup.Text>
                                    </InputGroup>
                                </Form.Group>

                                <Button
                                    type="submit"
                                    className="w-100 rounded-3xl py-3 font-weight-bold shadow-primary mt-3 text-uppercase letter-spacing-1 btn-primary-custom"
                                    disabled={loading}
                                >
                                    {loading ? <Spinner animation="border" size="sm" /> : <>Sign In <FaSignInAlt className="ms-2" /></>}
                                </Button>
                            </Form>

                            <div className="text-center mt-5 pt-4 border-top border-light">
                                <p className="text-muted mb-0">
                                    New to LearnHub? <Link to="/register" className="text-primary-custom font-weight-bold text-decoration-none hover-underline">Create Account</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );

};

export default LoginPage;
