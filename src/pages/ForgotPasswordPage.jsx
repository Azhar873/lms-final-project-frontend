import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Form, Button, Spinner, InputGroup } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { FaGraduationCap, FaEnvelope, FaPaperPlane, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const { forgotPassword } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await forgotPassword(email);
            if (res.success) {
                toast.success('Reset code generated! Check the code below.');
                navigate(`/verify-otp?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(res.otp)}`);
            } else {
                toast.error(res.message || 'Something went wrong.');
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
                            <h3 className="font-outfit font-weight-extra-bold mb-2">Forgot Password?</h3>
                            <p className="text-muted">No worries! Extra instructions will be sent to your email address.</p>
                        </div>

                        <Form onSubmit={handleSubmit} className="premium-form">
                            <Form.Group className="mb-4">
                                <Form.Label className="small font-weight-bold text-muted text-uppercase letter-spacing-1">Email Address</Form.Label>
                                <InputGroup className="premium-input-group shadow-sm">
                                    <InputGroup.Text className="bg-light border-end-0"><FaEnvelope className='text-primary-custom' /></InputGroup.Text>
                                    <Form.Control
                                        type="email"
                                        className="bg-light border-start-0 py-3"
                                        placeholder="Enter your registered email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </InputGroup>
                            </Form.Group>

                            <Button
                                type="submit"
                                className="w-100 rounded-3xl py-3 font-weight-bold shadow-primary mt-3 text-uppercase letter-spacing-1 btn-primary-custom"
                                disabled={loading}
                            >
                                {loading ? <Spinner animation="border" size="sm" /> : <>Send Reset Link <FaPaperPlane className="ms-2" /></>}
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

export default ForgotPasswordPage;
