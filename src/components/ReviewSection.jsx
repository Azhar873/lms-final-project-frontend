import { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import { FaStar, FaRegStar, FaUserCircle, FaPaperPlane, FaQuoteLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { addReview, getCourseReviews } from '../services/reviewService';
import { useAuth } from '../context/AuthContext';

const ReviewSection = ({ courseId, isApproved }) => {
    const { user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [hasReviewed, setHasReviewed] = useState(false);

    useEffect(() => {
        fetchReviews();
    }, [courseId, user]);

    const fetchReviews = async () => {
        try {
            const { data } = await getCourseReviews(courseId);
            setReviews(data.data);
            if (user) {
                const found = data.data.find(r => r.student._id === user._id);
                if (found) setHasReviewed(true);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return toast.error('Please add a comment');
        setSubmitting(true);
        try {
            await addReview({ courseId, rating, comment });
            toast.success('Review submitted successfully');
            setComment('');
            setRating(5);
            fetchReviews();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    const renderStars = (num) => {
        return [...Array(5)].map((_, i) => (
            i < num ? <FaStar key={i} className="text-warning" /> : <FaRegStar key={i} className="text-warning" />
        ));
    };

    return (
        <div className="review-section mt-5">
            <div className="d-flex flex-column align-items-center text-center mb-5">
                <span className="badge bg-primary-soft text-primary-custom rounded-pill px-3 py-2 small font-weight-bold text-uppercase mb-3">Community</span>
                <h2 className="display-6 font-weight-extra-bold mb-2">Student <span className="text-primary-custom">Reviews</span></h2>
                <div className="course-meta-divider w-25 mt-2"></div>
            </div>

            <Row className="g-5">
                {/* Review Form */}
                {isApproved && !hasReviewed && (
                    <Col lg={12}>
                        <Card className="rounded-4xl shadow-premium border-0 p-4 p-md-5 animate-fade-in-up bg-white">
                            <h4 className="font-weight-bold mb-4 d-flex align-items-center gap-3">
                                <FaQuoteLeft className="text-primary-custom opacity-25" />
                                Leave a Review
                            </h4>
                            <Form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="small font-weight-bold text-uppercase letter-spacing-1 text-muted mb-2">Overall Rating</label>
                                    <div className="d-flex gap-2 fs-3">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <div 
                                                key={s} 
                                                className="cursor-pointer transition-all hover-scale" 
                                                onClick={() => setRating(s)}
                                            >
                                                {s <= rating ? <FaStar className="text-warning" /> : <FaRegStar className="text-warning opacity-25" />}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <Form.Group className="mb-4">
                                    <label className="small font-weight-bold text-uppercase letter-spacing-1 text-muted mb-2">Your Experience</label>
                                    <Form.Control
                                        as="textarea"
                                        rows={4}
                                        placeholder="What did you think about this course?"
                                        className="rounded-3xl border-light bg-light-soft p-4"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                    />
                                </Form.Group>
                                <Button 
                                    type="submit" 
                                    disabled={submitting} 
                                    className="rounded-pill px-5 py-3 font-weight-bold border-0 bg-primary-custom text-white shadow-primary d-flex align-items-center gap-2"
                                >
                                    {submitting ? <Spinner size="sm" /> : <FaPaperPlane />}
                                    {submitting ? 'Submitting...' : 'Post Review'}
                                </Button>
                            </Form>
                        </Card>
                    </Col>
                )}

                {/* Reviews List */}
                <Col lg={12}>
                    {loading ? (
                        <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
                    ) : reviews.length > 0 ? (
                        <Row className="g-4">
                            {reviews.map((r, i) => (
                                <Col md={6} key={i}>
                                    <Card className="h-100 rounded-4xl shadow-sm border-light p-4 transition-all hover-lift bg-white">
                                        <Card.Body>
                                            <div className="d-flex align-items-center gap-3 mb-4">
                                                <div className="avatar-circle avatar-mini-fixed flex-shrink-0" style={{ width: '45px', height: '45px', fontSize: '16px' }}>
                                                    {r.student.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h6 className="font-weight-bold mb-0">{r.student.name}</h6>
                                                    <div className="small d-flex gap-1 mt-1">
                                                        {renderStars(r.rating)}
                                                    </div>
                                                </div>
                                                <div className="ms-auto small text-muted opacity-50">
                                                    {new Date(r.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <p className="text-muted mb-0" style={{ lineHeight: '1.7', fontStyle: 'italic' }}>
                                                "{r.comment}"
                                            </p>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <div className="text-center py-5 bg-white rounded-4xl border border-light shadow-sm">
                            <FaRegStar size={48} className="text-muted opacity-20 mb-3" />
                            <h5 className="font-weight-bold text-muted">No reviews yet</h5>
                            <p className="text-muted opacity-75 small">Be the first one to share your feedback!</p>
                        </div>
                    )}
                </Col>
            </Row>
        </div>
    );
};

export default ReviewSection;
