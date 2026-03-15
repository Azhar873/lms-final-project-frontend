import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Container, Form, Button, Spinner, InputGroup } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { FaGraduationCap, FaLock, FaKey, FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ResetPasswordPage = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { resetPassword } = useAuth();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(window.location.search);
    const email = queryParams.get('email');
    const otp = queryParams.get('otp');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            return toast.error('Passwords do not match');
        }

        if (password.length < 6) {
            return toast.error('Password must be at least 6 characters');
        }

        setLoading(true);
        try {
            const res = await resetPassword(email, otp, password);
            if (res.success) {
                toast.success('Password updated successfully! Please login.');
                navigate('/login');
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
                <div className="auth-glass-container mx-auto animate-fade-in-up" style={{ maxWidth: '550px' }}>
                    <div className="p-4 p-md-5 auth-glass-form position-relative">
                        <div className="mb-5 text-center">
                            <Link to="/" className="text-decoration-none d-flex align-items-center justify-content-center gap-2 mb-4">
                                <FaGraduationCap size={40} className="text-primary-custom" />
                                <span className="font-outfit font-weight-bold fs-3 text-dark">LearnHub</span>
                            </Link>
                            <h3 className="font-outfit font-weight-extra-bold mb-2">Reset Password</h3>
                            <p className="text-muted">Enter your new elite password below.</p>
                        </div>

                        <Form onSubmit={handleSubmit} className="premium-form">
                            <Form.Group className="mb-4">
                                <Form.Label className="small font-weight-bold text-muted text-uppercase letter-spacing-1">New Password</Form.Label>
                                <InputGroup className="premium-input-group shadow-sm">
                                    <InputGroup.Text className="bg-light border-end-0"><FaLock className='text-primary-custom' /></InputGroup.Text>
                                    <Form.Control
                                        type={showPassword ? "text" : "password"}
                                        className="bg-light border-start-0 border-end-0 py-3"
                                        placeholder="Enter new password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <InputGroup.Text
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="bg-light border-start-0 text-muted cursor-pointer"
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </InputGroup.Text>
                                </InputGroup>
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label className="small font-weight-bold text-muted text-uppercase letter-spacing-1">Confirm New Password</Form.Label>
                                <InputGroup className="premium-input-group shadow-sm">
                                    <InputGroup.Text className="bg-light border-end-0"><FaLock className='text-primary-custom' /></InputGroup.Text>
                                    <Form.Control
                                        type={showConfirmPassword ? "text" : "password"}
                                        className="bg-light border-start-0 border-end-0 py-3"
                                        placeholder="Repeat new password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                    <InputGroup.Text
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="bg-light border-start-0 text-muted cursor-pointer"
                                    >
                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                    </InputGroup.Text>
                                </InputGroup>
                            </Form.Group>

                            <Button
                                type="submit"
                                className="w-100 rounded-3xl py-3 font-weight-bold shadow-primary mt-3 text-uppercase letter-spacing-1 btn-primary-custom"
                                disabled={loading}
                            >
                                {loading ? <Spinner animation="border" size="sm" /> : <>Reset Password <FaKey className="ms-2" /></>}
                            </Button>
                        </Form>

                        <div className="text-center mt-5 pt-4 border-top border-light">
                            <p className="text-muted mb-0">
                                <Link to="/login" className="text-primary-custom font-weight-bold text-decoration-none hover-underline d-inline-flex align-items-center gap-2">
                                    <FaArrowLeft size={12} /> Back to Login
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default ResetPasswordPage;
