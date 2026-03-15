import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Container, Form, Button, Spinner, InputGroup, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { FaGraduationCap, FaShieldAlt, FaKey, FaArrowLeft, FaInfoCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';

const VerifyOTPPage = () => {
    const { verifyOTP } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Get email and otp from query params
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');
    const otpFromUrl = queryParams.get('otp') || '';

    const [otp, setOtp] = useState(otpFromUrl);
    const [loading, setLoading] = useState(false);

    if (!email) {
        navigate('/forgot-password');
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (otp.length !== 6) {
            return toast.error('OTP must be 6 digits');
        }

        setLoading(true);
        try {
            const res = await verifyOTP(email, otp);
            if (res.success) {
                toast.success('OTP verified! Choose your new password.');
                navigate(`/password-reset?email=${encodeURIComponent(email)}&otp=${otp}`);
            } else {
                toast.error(res.message);
            }
        } catch (err) {
            toast.error('Verification failed. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page-wrapper px-3 my-4">
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
                            <h3 className="font-outfit font-weight-extra-bold mb-2">Verify OTP</h3>
                            <p className="text-muted">Enter the 6-digit security code for <strong>{email}</strong></p>
                        </div>

                        {/* Show OTP directly on screen (no email needed) */}
                        {otpFromUrl && (
                            <Alert variant="info" className="d-flex align-items-center gap-2 mb-4 rounded-3">
                                <FaInfoCircle className="flex-shrink-0" />
                                <div>
                                    Your reset code is: <strong className="fs-5 letter-spacing-4">{otpFromUrl}</strong>
                                    <div className="small text-muted mt-1">It has been auto-filled below. Expires in 10 minutes.</div>
                                </div>
                            </Alert>
                        )}

                        <Form onSubmit={handleSubmit} className="premium-form">
                            <Form.Group className="mb-4">
                                <Form.Label className="small font-weight-bold text-muted text-uppercase letter-spacing-1">Security Code</Form.Label>
                                <InputGroup className="premium-input-group shadow-sm">
                                    <InputGroup.Text className="bg-light border-end-0"><FaShieldAlt className='text-primary-custom' /></InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        maxLength="6"
                                        className="bg-light border-start-0 py-3 text-center fs-4 letter-spacing-4 font-weight-bold"
                                        placeholder="000000"
                                        required
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                    />
                                </InputGroup>
                            </Form.Group>

                            <Button
                                type="submit"
                                className="w-100 rounded-3xl py-3 font-weight-bold shadow-primary mt-3 text-uppercase letter-spacing-1 btn-primary-custom"
                                disabled={loading}
                            >
                                {loading ? <Spinner animation="border" size="sm" /> : <>Verify Code <FaKey className="ms-2" /></>}
                            </Button>
                        </Form>

                        <div className="text-center mt-5 pt-4 border-top border-light">
                            <p className="text-muted mb-0">
                                Didn't get the code? <Link to="/forgot-password" className="text-primary-custom text-decoration-none font-weight-bold">Try Again</Link>
                            </p>
                            <Link to="/login" className="text-muted small text-decoration-none d-inline-flex align-items-center gap-2 mt-3">
                                <FaArrowLeft size={10} /> Back to Login
                            </Link>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default VerifyOTPPage;
