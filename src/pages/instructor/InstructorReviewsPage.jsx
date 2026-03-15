import { useState, useEffect } from 'react';
import { Card, Spinner, Row, Col, Badge, Button } from 'react-bootstrap';
import { FaStar, FaUserCircle, FaBookOpen, FaQuoteLeft, FaRegStar } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import DashboardLayout from '../../components/DashboardLayout';
import { getInstructorReviews } from '../../services/reviewService';
import { toast } from 'react-toastify';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const InstructorReviewsPage = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    const fetchReviews = async () => {
        try {
            const { data } = await getInstructorReviews();
            setReviews(data.data);
        } catch (error) {
            toast.error('Failed to load reviews');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) return;

        setDeletingId(id);
        try {
            const { data } = await import('../../services/reviewService').then(m => m.deleteReview(id));
            toast.success('Review deleted successfully');
            setReviews(prev => prev.filter(r => r._id !== id));
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete review');
        } finally {
            setDeletingId(null);
        }
    };

    const renderStars = (num) => {
        return [...Array(5)].map((_, i) => (
            i < num ? <FaStar key={i} className="text-warning" /> : <FaRegStar key={i} className="text-warning" />
        ));
    };

    return (
        <DashboardLayout>
            <div className="dash-header mb-5">
                <h2 className="dash-title font-weight-bold">Course Reviews</h2>
                <p className="text-muted">See what students are saying about your courses.</p>
            </div>

            {loading ? (
                <div className="text-center py-10">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : reviews.length > 0 ? (
                <Row className="g-4">
                    {reviews.map((r) => (
                        <Col lg={6} key={r._id}>
                            <Card className="border-0 shadow-sm rounded-4xl overflow-hidden transition-all hover-lift bg-white h-100">
                                <Card.Header className="bg-primary-soft border-0 p-4">
                                    <div className="d-flex align-items-center gap-3">
                                        <div
                                            className="flex-shrink-0 rounded-3xl overflow-hidden bg-white"
                                            style={{ width: '50px', height: '50px' }}
                                        >
                                            {r.course?.thumbnail ? (
                                                <img
                                                    src={r.course.thumbnail.startsWith('/uploads/') ? `${BACKEND_URL}${r.course.thumbnail}` : r.course.thumbnail}
                                                    alt={r.course.title}
                                                    className="w-100 h-100 object-fit-cover"
                                                />
                                            ) : (
                                                <div className="d-flex h-100 align-items-center justify-content-center">
                                                    <FaBookOpen className="text-primary-custom" size={20} />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h6 className="font-weight-bold mb-0 text-dark" style={{ fontSize: '0.95rem' }}>{r.course?.title}</h6>
                                            <span className="small text-primary-custom font-weight-bold">Course Review</span>
                                        </div>
                                    </div>
                                </Card.Header>
                                <Card.Body className="p-4 p-md-5">
                                    <div className="d-flex align-items-center gap-3 mb-4">
                                        <div className="avatar-circle avatar-mini-fixed flex-shrink-0" style={{ width: '40px', height: '40px', fontSize: '14px' }}>
                                            {r.student?.name?.[0]?.toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-weight-bold text-dark">{r.student?.name}</div>
                                            <div className="d-flex gap-1">
                                                {renderStars(r.rating)}
                                            </div>
                                        </div>
                                        <div className="ms-auto d-flex align-items-center gap-3">
                                            <div className="small text-muted">
                                                {new Date(r.createdAt).toLocaleDateString()}
                                            </div>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                className="rounded-circle p-2 border-0 bg-danger bg-opacity-10"
                                                title="Delete Review"
                                                onClick={() => handleDelete(r._id)}
                                                disabled={deletingId === r._id}
                                            >
                                                {deletingId === r._id ? <Spinner size="sm" /> : <MdDelete size={18} />}
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="position-relative p-4 rounded-3xl bg-light-soft border border-light">
                                        <FaQuoteLeft className="position-absolute opacity-10" style={{ top: '10px', left: '10px', fontSize: '2rem' }} />
                                        <p className="text-muted mb-0 position-relative z-index-10" style={{ lineHeight: '1.7', fontStyle: 'italic' }}>
                                            {r.comment}
                                        </p>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            ) : (
                <div className="text-center py-10 bg-white rounded-4xl shadow-sm border border-light">
                    <FaRegStar size={64} className="text-muted opacity-20 mb-4" />
                    <h4 className="font-weight-bold">No reviews yet</h4>
                    <p className="text-muted mb-0">Once students start reviewing your courses, they'll appear here.</p>
                </div>
            )}
        </DashboardLayout>
    );
};

export default InstructorReviewsPage;
