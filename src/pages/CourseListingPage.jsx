import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, InputGroup, Spinner, Alert, Badge } from 'react-bootstrap';
import { FaSearch, FaFilter, FaBookOpen } from 'react-icons/fa';
import CourseCard from '../components/CourseCard';
import { getCourses } from '../services/courseService';
import { enrollInCourse, getMyCourses } from '../services/enrollmentService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const CourseListingPage = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [enrolledIds, setEnrolledIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({ search: '', category: '' });

    const categories = ['Web Development', 'Mobile Development', 'Data Science', 'UI/UX Design', 'DevOps'];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const { data } = await getCourses();
            setCourses(data);
            if (user && user.role === 'student') {
                const { data: myEnc } = await getMyCourses();
                setEnrolledIds(myEnc.filter(e => e.course).map(e => e.course._id));
            }
        } catch (err) {
            setError('Failed to fetch courses. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleEnroll = async (courseId) => {
        if (!user) return toast.info('Please login to enroll');
        try {
            await enrollInCourse(courseId);
            setEnrolledIds([...enrolledIds, courseId]);
            toast.success('Successfully enrolled!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Enrollment failed');
        }
    };

    const filteredCourses = courses.filter(c =>
        c.title.toLowerCase().includes(filters.search.toLowerCase()) &&
        (filters.category === '' || c.category === filters.category)
    );

    return (
        <div className="course-listing-page pb-5">
            {/* New Premium Hero Section */}
            <section className="listing-hero bg-gradient-premium py-10 mb-5 overflow-hidden position-relative">
                <div className="cta-mesh-gradient"></div>
                <Container className="position-relative z-index-10 pt-5 mt-5">
                    <Row className="justify-content-center text-center">
                        <Col lg={8}>
                            <Badge bg="primary" className="mb-3 px-3 py-2 rounded-pill letter-spacing-2 text-uppercase">
                                <FaBookOpen className="me-2" /> Our Catalog
                            </Badge>
                            <h1 className="display-4 font-weight-extra-bold text-white mb-3">
                                Advance Your Skills with <span className="text-primary-custom">Premium Courses</span>
                            </h1>
                            <p className="text-light opacity-75 lead mb-0">
                                Discover expert-led courses designed to help you master new skills and accelerate your career growth.
                            </p>
                        </Col>
                    </Row>
                </Container>
            </section>

            <Container className="mt-2 position-relative z-index-20">
                {/* Redesigned Search & Filter Bar */}
                <div className="bg-white p-4 rounded-3xl shadow-premium border border-light mb-5 animate-fade-in-up">
                    <Row className="g-3 align-items-center">
                        <Col md={5}>
                            <label className="small font-weight-bold text-muted mb-2 d-block ms-1">SEARCH COURSES</label>
                            <InputGroup className="premium-input-group">
                                <InputGroup.Text className="bg-transparent border-end-0 text-muted"><FaSearch /></InputGroup.Text>
                                <Form.Control
                                    placeholder="What do you want to learn today?"
                                    className="border-start-0 ps-0"
                                    value={filters.search}
                                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                />
                            </InputGroup>
                        </Col>
                        <Col md={4}>
                            <label className="small font-weight-bold text-muted mb-2 d-block ms-1">CATEGORY FILTER</label>
                            <InputGroup className="premium-input-group">
                                <InputGroup.Text className="bg-transparent border-end-0 text-muted"><FaFilter /></InputGroup.Text>
                                <Form.Select
                                    className="border-start-0 ps-0"
                                    value={filters.category}
                                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                >
                                    <option value="">All Categories</option>
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </Form.Select>
                            </InputGroup>
                        </Col>
                        <Col md={3}>
                            <label className="small font-weight-bold text-muted mb-2 d-block ms-1">RESULTS</label>
                            <div className="d-flex align-items-center h-100 pb-2">
                                <h5 className="mb-0 font-weight-bold text-primary-custom">
                                    {filteredCourses.length} Found
                                </h5>
                            </div>
                        </Col>
                    </Row>
                </div>

                {error && <Alert variant="danger" className="rounded-2xl shadow-sm">{error}</Alert>}

                {loading ? (
                    <div className="text-center py-10">
                        <Spinner animation="border" variant="primary" size="lg" />
                        <p className="mt-3 text-muted">Curating top courses for you...</p>
                    </div>
                ) : (
                    <div className="animate-fade-in-up">
                        {filteredCourses.length > 0 ? (
                            <Row className="g-4">
                                {filteredCourses.map(course => (
                                    <Col key={course._id} md={6} lg={4}>
                                        <CourseCard
                                            course={course}
                                            onEnroll={user?.role === 'student' ? handleEnroll : null}
                                            enrolled={enrolledIds.includes(course._id)}
                                        />
                                    </Col>
                                ))}
                            </Row>
                        ) : (
                            <div className="empty-state py-10 text-center bg-white rounded-4xl border border-dashed">
                                <div className="icon-container-bg mx-auto mb-4 bg-light p-4 rounded-circle d-inline-block">
                                    <FaBookOpen size={60} className="text-muted opacity-40" />
                                </div>
                                <h3 className="font-weight-bold">No courses match your search</h3>
                                <p className="text-muted max-w-400 mx-auto">
                                    We couldn't find any courses matching your current filters. Try adjusting your keywords or category.
                                </p>
                                <button
                                    className="btn btn-outline-primary rounded-pill mt-3 px-4"
                                    onClick={() => setFilters({ search: '', category: '' })}
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </Container>
        </div>
    );
};

export default CourseListingPage;
