import { Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaCheckCircle, FaBookOpen, FaStar, FaUsers } from 'react-icons/fa';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const CourseCard = ({ course, onEnroll, enrolled }) => {
    const categoryColors = {
        'Web Development': 'primary',
        'Mobile Development': 'success',
        'Data Science': 'warning',
        'UI/UX Design': 'info',
        'DevOps': 'danger',
        'Other': 'secondary',
    };

    return (
        <Card className="course-card-wrapper h-100 border-0 shadow-sm overflow-hidden d-flex flex-column">
            {/* Premium Header with Thumbnail */}
            <div className="course-card-header-base position-relative overflow-hidden">
                {course.thumbnail ? (
                    <img
                        src={course.thumbnail.startsWith('/uploads/') ? `${BACKEND_URL}${course.thumbnail}` : course.thumbnail}
                        alt={course.title}
                        className="w-100 h-100 object-fit-cover transition-all"
                        style={{ position: 'absolute', top: 0, left: 0 }}
                    />
                ) : (
                    <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-gradient-premium">
                        <FaBookOpen size={48} className="text-white opacity-20" />
                    </div>
                )}

                {/* Overlay for better readability of badges if needed */}
                <div className="position-absolute w-100 h-100" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, transparent 40%)' }}></div>

                <div className="position-relative z-index-10 p-3 d-flex justify-content-between align-items-start">
                    <Badge className="badge-glass-white border-0 px-3 py-2 rounded-pill shadow-sm">
                        {course.category}
                    </Badge>
                    <Badge className="badge-glass-soft border-0 px-3 py-2 rounded-pill">
                        {course.level || 'Ongoing'}
                    </Badge>
                </div>
            </div>

            {/* Card Body */}
            <Card.Body className="p-4 d-flex flex-column flex-grow-1">
                <div className="instructor-info d-flex align-items-center gap-2 mb-2">
                    <FaUserCircle className="text-primary-custom" />
                    <span className="small fw-semibold text-muted">{course.instructor?.name || 'Expert Instructor'}</span>
                </div>

                <Card.Title className="course-title-dark fw-bold mb-2 h5">
                    {course.title}
                </Card.Title>

                <Card.Text className="course-desc-muted text-muted small mb-4">
                    {course.description?.length > 95
                        ? `${course.description.substring(0, 95)}...`
                        : course.description}
                </Card.Text>

                {/* Rating & Stats Row (Mocked for consistent premium look) */}
                <div className="d-flex align-items-center gap-2 mb-4 mt-auto">
                    <div className="d-flex gap-1">
                        {[...Array(5)].map((_, i) => (
                            <FaStar key={i} size={12} style={{ color: i < 4 ? '#f59e0b' : '#e5e7eb' }} />
                        ))}
                    </div>
                    <span className="small fw-bold text-dark-accent">4.8</span>
                    <span className="ms-auto small text-muted">
                        <FaUsers size={12} className="me-1" /> 1.2k
                    </span>
                </div>

                {/* Footer Section with Actions */}
                <div className="course-meta-divider pt-3 d-flex align-items-center justify-content-between">
                    <div className="d-flex gap-2 w-100 justify-content-between">
                        <Button
                            as={Link}
                            to={`/courses/${course._id}`}
                            variant="link"
                            className="p-0 text-primary-custom text-decoration-none small fw-bold"
                        >
                            Details
                        </Button>
                        {onEnroll && (
                            <Button
                                onClick={() => onEnroll(course._id)}
                                variant={enrolled ? 'success' : 'primary-custom'}
                                size="sm"
                                disabled={enrolled}
                                className="rounded-pill px-4 fw-semibold border-0 text-white shadow-sm"
                            >
                                {enrolled ? <><FaCheckCircle size={14} /> Enrolled</> : 'Enroll'}
                            </Button>
                        )}
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};

export default CourseCard;
