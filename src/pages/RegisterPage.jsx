import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Form, Button, Spinner, InputGroup } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { FaGraduationCap, FaUser, FaEnvelope, FaLock, FaUserTag, FaRocket, FaEye, FaEyeSlash, FaSignInAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

const RegisterPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'student' });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.name.length < 3) {
            return toast.error('Full Name must be at least 3 characters long.');
        }

        if (formData.password.length < 8) {
            return toast.error('Password must be at least 8 characters long.');
        }

        setLoading(true);
        try {
            const registerData = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role
            };
            const res = await register(registerData);
            if (res.success) {
                toast.success('Account created successfully! Welcome to LearnHub.');
                if (res.data.role === 'instructor') navigate('/instructor/dashboard');
                else navigate('/student/my-courses');
            } else {
                toast.error(res.message);
            }
        } catch (err) {
            toast.error('Registration failed. Please try again.');
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
                                <FaRocket size={64} className="text-white filter-drop-shadow" />
                            </div>
                            <h2 className="font-outfit font-weight-extra-bold mb-3">Begin Your Quest</h2>
                            <p className="opacity-80 fs-5 mb-0">Join 10,000+ students and start your learning adventure.</p>
                            <div className="mt-5 w-100">
                                <div className="d-flex align-items-center gap-3 mb-3 text-start bg-white bg-opacity-10 p-3 rounded-3xl border border-white border-opacity-10 backdrop-blur">
                                    <div className="p-2 bg-white bg-opacity-20 rounded-circle"><FaUserTag className='text-primary-custom' /></div>
                                    <div className="small">Unlock premium courses and resources</div>
                                </div>
                            </div>
                        </div>

                        {/* Form Side */}
                        <div className="col-lg-7 p-4 p-md-5 auth-glass-form position-relative">
                            <div className="mb-4">
                                <Link to="/" className="text-decoration-none d-flex align-items-center gap-2 mb-4 d-lg-none">
                                    <FaGraduationCap size={32} className="text-primary" />
                                    <span className="font-outfit font-weight-bold fs-4 text-dark">LearnHub</span>
                                </Link>
                                <h3 className="font-outfit font-weight-extra-bold mb-1">Create Account</h3>
                                <p className="text-muted">Fill in your details to get started with LearnHub</p>
                            </div>

                            <Form onSubmit={handleSubmit} className="premium-form">
                                <Form.Group className="mb-3">
                                    <Form.Label className="small font-weight-bold text-muted text-uppercase letter-spacing-1">Full Name</Form.Label>
                                    <InputGroup className="premium-input-group shadow-sm">
                                        <InputGroup.Text className="bg-light border-end-0"><FaUser className='text-primary-custom' /></InputGroup.Text>
                                        <Form.Control
                                            className="bg-light border-start-0 py-2"
                                            placeholder="John Doe"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </InputGroup>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="small font-weight-bold text-muted text-uppercase letter-spacing-1">Email Address</Form.Label>
                                    <InputGroup className="premium-input-group shadow-sm">
                                        <InputGroup.Text className="bg-light border-end-0"><FaEnvelope className='text-primary-custom' /></InputGroup.Text>
                                        <Form.Control
                                            type="email"
                                            className="bg-light border-start-0 py-2"
                                            placeholder="hello@example.com"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </InputGroup>
                                </Form.Group>

                                <div className="row g-3 mb-3">
                                    <div className="col-md-6">
                                        <Form.Group>
                                            <Form.Label className="small font-weight-bold text-muted text-uppercase letter-spacing-1">Password</Form.Label>
                                            <InputGroup className="premium-input-group shadow-sm">
                                                <InputGroup.Text className="bg-light border-end-0"><FaLock className='text-primary-custom' /></InputGroup.Text>
                                                <Form.Control
                                                    type={showPassword ? "text" : "password"}
                                                    className="bg-light border-start-0 border-end-0 py-2"
                                                    placeholder="Min. 8 char"
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
                                    </div>
                                    <div className="col-md-6">
                                        <Form.Group>
                                            <Form.Label className="small font-weight-bold text-muted text-uppercase letter-spacing-1">Confirm Password</Form.Label>
                                            <InputGroup className="premium-input-group shadow-sm">
                                                <InputGroup.Text className="bg-light border-end-0"><FaLock className='text-primary-custom' /></InputGroup.Text>
                                                <Form.Control
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    className="bg-light border-start-0 border-end-0 py-2"
                                                    placeholder="Repeat password"
                                                    required
                                                    value={formData.confirmPassword}
                                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                />
                                                <InputGroup.Text
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="bg-light border-start-0 text-muted cursor-pointer"
                                                >
                                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                                </InputGroup.Text>
                                            </InputGroup>
                                        </Form.Group>
                                    </div>
                                </div>

                                <Form.Group className="mb-4">
                                    <Form.Label className="small font-weight-bold text-muted text-uppercase letter-spacing-1">Join As</Form.Label>
                                    <InputGroup className="premium-input-group shadow-sm">
                                        <InputGroup.Text className="bg-light border-end-0"><FaUserTag className='text-primary-custom' /></InputGroup.Text>
                                        <Form.Select
                                            className="bg-light border-start-0 py-2"
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        >
                                            <option value="student">Student</option>
                                            <option value="instructor">Instructor</option>
                                        </Form.Select>
                                    </InputGroup>
                                </Form.Group>

                                <Button
                                    type="submit"
                                    className="w-100 rounded-3xl py-3 font-weight-bold shadow-primary text-uppercase letter-spacing-1 btn-primary-custom"
                                    disabled={loading}
                                >
                                    {loading ? <Spinner animation="border" size="sm" /> : <>Create Account <FaRocket className="ms-2" /></>}
                                </Button>
                            </Form>

                            <div className="text-center mt-5 pt-3 border-top border-light">
                                <p className="text-muted mb-0">
                                    Already have an account? <Link to="/login" className="text-primary-custom font-weight-bold text-decoration-none hover-underline">Sign In</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default RegisterPage;

