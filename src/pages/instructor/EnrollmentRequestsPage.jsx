import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { FaCheckCircle, FaTimesCircle, FaUserCircle, FaBookOpen, FaClock, FaHourglassHalf } from 'react-icons/fa';
import DashboardLayout from '../../components/DashboardLayout';
import { getInstructorEnrollments, handleEnrollmentRequest } from '../../services/enrollmentService';
import { toast } from 'react-toastify';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const EnrollmentRequestsPage = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'approved'

    const fetchEnrollments = async () => {
        try {
            const { data } = await getInstructorEnrollments();
            setEnrollments(data);
        } catch {
            toast.error('Failed to load enrollments');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchEnrollments(); }, []);

    const handleAction = async (id, status) => {
        setActionLoading(id + status);
        try {
            await handleEnrollmentRequest(id, status);
            toast.success(`Request ${status === 'approved' ? 'approved ✓' : 'rejected'} successfully`);
            setEnrollments(prev => prev.map(e => e._id === id ? { ...e, status } : e));
        } catch (err) {
            toast.error(err.response?.data?.message || 'Action failed');
        } finally {
            setActionLoading(null);
        }
    };

    const filtered = enrollments.filter(e => e.status === activeTab);
    const pendingCount = enrollments.filter(e => e.status === 'pending').length;
    const approvedCount = enrollments.filter(e => e.status === 'approved').length;

    return (
        <DashboardLayout>
            <div className="dash-header mb-5">
                <h2 className="dash-title font-weight-bold">Enrollment Management</h2>
                <p className="text-muted">Review pending requests and oversee students enrolled in your courses.</p>
            </div>

            <div className="d-flex gap-4 mb-5 border-bottom">
                <button 
                    className={`pb-3 px-2 bg-transparent border-0 font-weight-bold transition-all position-relative ${activeTab === 'pending' ? 'text-primary' : 'text-muted'}`}
                    onClick={() => setActiveTab('pending')}
                    style={{ fontSize: '1rem' }}
                >
                    Pending Requests {pendingCount > 0 && <Badge bg="primary" pill className="ms-2 small">{pendingCount}</Badge>}
                    {activeTab === 'pending' && <div className="position-absolute bottom-0 start-0 w-100 bg-primary rounded-pill" style={{ height: '3px' }}></div>}
                </button>
                <button 
                    className={`pb-3 px-2 bg-transparent border-0 font-weight-bold transition-all position-relative ${activeTab === 'approved' ? 'text-primary' : 'text-muted'}`}
                    onClick={() => setActiveTab('approved')}
                    style={{ fontSize: '1rem' }}
                >
                    Enrolled Students {approvedCount > 0 && <Badge bg="light" text="dark" pill className="ms-2 small border">{approvedCount}</Badge>}
                    {activeTab === 'approved' && <div className="position-absolute bottom-0 start-0 w-100 bg-primary rounded-pill" style={{ height: '3px' }}></div>}
                </button>
            </div>

            {loading && (
                <div className="text-center py-10">
                    <Spinner animation="border" variant="primary" />
                </div>
            )}

            {!loading && filtered.length === 0 && (
                <div className="text-center py-10 bg-white rounded-4xl shadow-sm border border-light">
                    {activeTab === 'pending' ? <FaHourglassHalf size={64} className="text-muted opacity-20 mb-4" /> : <FaCheckCircle size={64} className="text-muted opacity-20 mb-4" />}
                    <h4 className="font-weight-bold">{activeTab === 'pending' ? 'No pending requests' : 'No students enrolled'}</h4>
                    <p className="text-muted mb-0">
                        {activeTab === 'pending' ? 'All caught up! No students are waiting for approval right now.' : "Looks like no students have been approved for your courses yet."}
                    </p>
                </div>
            )}

            {!loading && filtered.length > 0 && (
                <div className="d-flex flex-column gap-3">
                    {filtered.map((req) => (
                        <Card key={req._id} className="border-0 shadow-sm rounded-4xl overflow-hidden transition-all hover-lift">
                            <Card.Body className="p-4 p-md-5">
                                <Row className="align-items-center g-4">
                                    {/* Course Info */}
                                    <Col md={5} className="d-flex align-items-center gap-4">
                                        <div
                                            className="flex-shrink-0 rounded-3xl overflow-hidden bg-primary-soft"
                                            style={{ width: '64px', height: '64px' }}
                                        >
                                            {req.course?.thumbnail ? (
                                                <img 
                                                    src={req.course.thumbnail.startsWith('/uploads/') ? `${BACKEND_URL}${req.course.thumbnail}` : req.course.thumbnail} 
                                                    alt={req.course.title} 
                                                    className="w-100 h-100 object-fit-cover" 
                                                />
                                            ) : (
                                                <div className="d-flex h-100 align-items-center justify-content-center">
                                                    <FaBookOpen className="text-primary-custom" size={24} />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="small text-primary-custom font-weight-bold text-uppercase mb-1" style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}>
                                                {req.course?.category}
                                            </div>
                                            <h6 className="font-weight-bold mb-0 course-title-dark">{req.course?.title}</h6>
                                        </div>
                                    </Col>

                                    {/* Student Info */}
                                    <Col md={activeTab === 'pending' ? 4 : 5} className="d-flex align-items-center gap-3">
                                        <div className="d-flex align-items-center justify-content-center bg-primary-soft rounded-circle flex-shrink-0" style={{ width: '44px', height: '44px' }}>
                                            <span className="font-weight-bold text-primary-custom" style={{ fontSize: '1rem' }}>
                                                {req.student?.name?.[0]?.toUpperCase() || '?'}
                                            </span>
                                        </div>
                                        <div>
                                            <div className="font-weight-bold course-title-dark">{req.student?.name}</div>
                                            <div className="small text-muted">{req.student?.email}</div>
                                            <div className="small text-muted d-flex align-items-center gap-1 mt-1">
                                                <FaClock size={11} />
                                                {activeTab === 'approved' ? 'Enrolled on ' : 'Requested on '}
                                                {new Date(activeTab === 'approved' ? req.updatedAt : req.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                        </div>
                                    </Col>

                                    {/* Actions or Status */}
                                    <Col md={activeTab === 'pending' ? 3 : 2} className="d-flex gap-2 justify-content-md-end">
                                        {activeTab === 'pending' ? (
                                            <>
                                                <Button
                                                    size="sm"
                                                    className="rounded-pill px-4 py-2 border-0 font-weight-bold d-flex align-items-center gap-2 bg-success text-white"
                                                    disabled={actionLoading !== null}
                                                    onClick={() => handleAction(req._id, 'approved')}
                                                >
                                                    {actionLoading === req._id + 'approved'
                                                        ? <Spinner animation="border" size="sm" />
                                                        : <><FaCheckCircle /> Approve</>
                                                    }
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    className="rounded-pill px-4 py-2 border-0 font-weight-bold d-flex align-items-center gap-2 bg-danger text-white"
                                                    disabled={actionLoading !== null}
                                                    onClick={() => handleAction(req._id, 'rejected')}
                                                >
                                                    {actionLoading === req._id + 'rejected'
                                                        ? <Spinner animation="border" size="sm" />
                                                        : <><FaTimesCircle /> Reject</>
                                                    }
                                                </Button>
                                            </>
                                        ) : (
                                            <Badge bg="success" className="bg-opacity-10 text-success border border-success border-opacity-20 rounded-pill px-4 py-2 font-weight-bold d-flex align-items-center gap-2">
                                                <FaCheckCircle /> Approved Student
                                            </Badge>
                                        )}
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
};

export default EnrollmentRequestsPage;
