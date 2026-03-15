import { useState, useEffect } from 'react';
import { Row, Col, Card, ProgressBar, Spinner, Alert, Button } from 'react-bootstrap';
import { FaPlayCircle, FaCheckCircle, FaBookOpen, FaHourglassHalf, FaTimesCircle, FaAward } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { getMyCourses } from '../../services/enrollmentService';

const statusConfig = {
    approved: { label: 'Enrolled', bg: '#10b98120', color: '#059669', icon: <FaCheckCircle size={11} /> },
    pending: { label: 'Pending Approval', bg: '#f59e0b20', color: '#d97706', icon: <FaHourglassHalf size={11} /> },
    rejected: { label: 'Rejected', bg: '#ef444420', color: '#dc2626', icon: <FaTimesCircle size={11} /> },
};

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const CourseCard = ({ en }) => {
    const status = statusConfig[en.status] || statusConfig.pending;
    const isApproved = en.status === 'approved';

    return (
        <Card className="border-0 shadow-sm rounded-4xl overflow-hidden h-100 transition-all hover-lift">
            <div className="position-relative card-media-height">
                {en.course?.thumbnail ? (
                    <img 
                        src={en.course.thumbnail.startsWith('/uploads/') ? `${BACKEND_URL}${en.course.thumbnail}` : en.course.thumbnail} 
                        alt={en.course?.title} 
                        className="w-100 h-100 object-fit-cover opacity-90" 
                    />
                ) : (
                    <div className="bg-primary bg-opacity-10 d-flex h-100 align-items-center justify-content-center text-primary">
                        <FaBookOpen size={40} />
                    </div>
                )}
                <div className="position-absolute top-0 start-0 m-3">
                    <span
                        className="d-inline-flex align-items-center gap-1 px-3 py-1 rounded-pill font-weight-bold"
                        style={{ background: status.bg, color: status.color, backdropFilter: 'blur(8px)', fontSize: '0.72rem' }}
                    >
                        {status.icon} {status.label}
                    </span>
                </div>
                {isApproved && (
                    <div className="play-overlay"><FaPlayCircle size={40} className="text-white" /></div>
                )}
            </div>
            <Card.Body className="p-4">
                <h6 className="font-weight-bold mb-3 text-truncate">{en.course?.title}</h6>
                {isApproved && (
                    <>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="small text-muted">Progress</span>
                            <span className="small font-weight-bold text-primary">{en.progress}%</span>
                        </div>
                        <ProgressBar now={en.progress} variant="primary" className="mb-4 rounded-pill progress-bar-thin" />
                        <Button as={Link} to={`/courses/${en.course?._id}`} className="w-100 rounded-pill py-2 small border-0 bg-primary-custom text-white">
                            Continue Course
                        </Button>
                        {en.progress === 100 && (
                            <Button as={Link} to={`/certificate/${en._id}`} className="w-100 rounded-pill py-2 small mt-2 fw-medium border border-primary text-primary bg-white hover-bg-light shadow-sm" style={{borderColor: '#7c3aed', color: '#7c3aed'}}>
                                <FaAward className="me-1 mb-1" /> View Certificate
                            </Button>
                        )}
                    </>
                )}
                {en.status === 'pending' && (
                    <div className="small p-3 rounded-3xl" style={{ background: '#fef9c3', color: '#854d0e', border: '1px solid #fde68a' }}>
                        ⏳ Waiting for instructor approval.
                    </div>
                )}
                {en.status === 'rejected' && (
                    <div className="d-flex flex-column gap-2">
                        <div className="small p-3 rounded-3xl" style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca' }}>
                            ❌ Request was rejected by the instructor.
                        </div>
                        <Button as={Link} to={`/courses/${en.course?._id}`} size="sm" className="w-100 rounded-pill border-0 bg-light text-muted">
                            View Course
                        </Button>
                    </div>
                )}
            </Card.Body>
        </Card>
    );
};

const MyCoursesPage = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetch = async () => {
            try {
                const { data } = await getMyCourses();
                setEnrollments(data);
            } catch {
                setError('Failed to fetch enrolled courses');
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    if (loading) return <DashboardLayout><div className="text-center py-10"><Spinner animation="border" variant="primary" /></div></DashboardLayout>;

    const validEnrollments = enrollments.filter(e => e.course);
    const approved = validEnrollments.filter(e => e.status === 'approved');
    const pending = validEnrollments.filter(e => e.status === 'pending');
    const rejected = validEnrollments.filter(e => e.status === 'rejected');

    return (
        <DashboardLayout>
            <div className="dash-header mb-5">
                <h2 className="dash-title font-weight-bold">My Learning Journey</h2>
                <p className="text-muted">Track your courses and pending access requests.</p>
            </div>

            {error && <Alert variant="danger" className="rounded-2xl">{error}</Alert>}

            {enrollments.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-4xl shadow-sm border border-light">
                    <FaBookOpen size={64} className="text-muted opacity-20 mb-4" />
                    <h4 className="font-weight-bold">No courses yet</h4>
                    <p className="text-muted mb-4">Start your journey by exploring our available courses.</p>
                    <Button as={Link} to="/courses" className="rounded-pill px-5 bg-primary-custom border-0 text-white">Explore Courses</Button>
                </div>
            ) : (
                <>
                    {approved.length > 0 && (
                        <div className="mb-5">
                            <h5 className="font-weight-bold mb-3 d-flex align-items-center gap-2">
                                <FaCheckCircle className="text-success" /> Enrolled Courses
                            </h5>
                            <Row className="g-4">
                                {approved.map(en => <Col key={en._id} md={6} xl={4}><CourseCard en={en} /></Col>)}
                            </Row>
                        </div>
                    )}
                    {pending.length > 0 && (
                        <div className="mb-5">
                            <h5 className="font-weight-bold mb-3 d-flex align-items-center gap-2" style={{ color: '#d97706' }}>
                                <FaHourglassHalf /> Pending Approval
                            </h5>
                            <Row className="g-4">
                                {pending.map(en => <Col key={en._id} md={6} xl={4}><CourseCard en={en} /></Col>)}
                            </Row>
                        </div>
                    )}
                    {rejected.length > 0 && (
                        <div className="mb-4">
                            <h5 className="font-weight-bold mb-3 d-flex align-items-center gap-2 text-danger">
                                <FaTimesCircle /> Rejected Requests
                            </h5>
                            <Row className="g-4">
                                {rejected.map(en => <Col key={en._id} md={6} xl={4}><CourseCard en={en} /></Col>)}
                            </Row>
                        </div>
                    )}
                </>
            )}
        </DashboardLayout>
    );
};

export default MyCoursesPage;
