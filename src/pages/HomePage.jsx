import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Card, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { FaGraduationCap, FaChalkboardTeacher, FaMobileAlt, FaTrophy, FaUsers, FaArrowRight, FaStar, FaPlayCircle, FaCheckCircle, FaCode, FaPalette, FaChartBar } from 'react-icons/fa';
import { HiLightningBolt } from 'react-icons/hi';

const HomePage = () => {
    const { user } = useAuth();

    const features = [
        { icon: <FaChalkboardTeacher className='text-white' />, title: 'Expert Instructors', desc: 'Learn from industry professionals with real-world experience.' },
        { icon: <FaMobileAlt className='text-white' />, title: 'Learn Anywhere', desc: 'Access your courses on any device, anytime. Seamless learning.' },
        { icon: <FaTrophy className='text-white' />, title: 'Earn Certificates', desc: 'Validate your skills with industry-recognized certifications.' },
        { icon: <FaUsers className='text-white' />, title: 'Community Support', desc: 'Engage with fellow learners and get direct help from our community.' },
    ];

    const stats = [
        { value: '500+', label: 'Courses' },
        { value: '10K+', label: 'Students' },
        { value: '200+', label: 'Instructors' },
        { value: '98%', label: 'Satisfaction' },
    ];

    const featuredCourses = [
        {
            id: 1,
            title: 'Full Stack Web Development',
            instructor: 'Sarah Johnson',
            rating: 4.9,
            reviews: 342,
            students: 1200,
            category: 'Web Dev',
            level: 'Intermediate',
            duration: '42 hours',
            description: 'Build modern web apps with React, Node.js, and MongoDB from scratch.',
            gradient: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)',
            icon: <FaCode size={40} color="#fff" />,
        },
        {
            id: 2,
            title: 'UI/UX Design Masterclass',
            instructor: 'Michael Chen',
            rating: 4.8,
            reviews: 218,
            students: 850,
            category: 'Design',
            level: 'Beginner',
            duration: '28 hours',
            description: 'Master Figma, user research, wireframing, and design systems.',
            gradient: 'linear-gradient(135deg, #ec4899 0%, #fb923c 100%)',
            icon: <FaPalette size={40} color="#fff" />,
        },
        {
            id: 3,
            title: 'Data Science with Python',
            instructor: 'David Miller',
            rating: 5.0,
            reviews: 511,
            students: 2100,
            category: 'Data Science',
            level: 'Advanced',
            duration: '56 hours',
            description: 'From pandas & NumPy to machine learning models and data visualisation.',
            gradient: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
            icon: <FaChartBar size={40} color="#fff" />,
        },
    ];

    return (
        <div className="home-page overflow-hidden">
            {/* Hero Section */}
            <section className="hero-section text-white d-flex align-items-center py-10 min-vh-100">
                <div className="hero-glow"></div>
                <Container className="position-relative z-index-10 pt-5">
                    <Row className="align-items-center">
                        <Col lg={6} className="text-center text-lg-start animate-fade-in-up">
                            <div className="hero-badge-premium d-inline-flex align-items-center gap-2 mb-4 px-4 py-2 rounded-pill bg-white bg-opacity-10 border border-white border-opacity-10 text-white small font-weight-bold backdrop-blur">
                                <HiLightningBolt className="text-warning" /> The Future of Learning is Here
                            </div>
                            <h1 className="display-1 font-weight-extra-bold mb-4 mt-2 letter-spacing-tight">
                                Master New <br />
                                <span className="text-gradient">Skills</span> Today
                            </h1>
                            <p className="lead mb-5 opacity-75 max-w-500 mx-auto mx-lg-0 fs-4">
                                Join over 10,000+ students learning from industry experts and accelerating their careers.
                            </p>
                            <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-lg-start">
                                <Button as={Link} to="/courses" variant="primary" size="lg" className="rounded-pill px-5 py-3 shadow-premium-lg d-flex align-items-center gap-2 border-0">
                                    Browse All Courses <FaArrowRight size={14} />
                                </Button>
                                {!user && (
                                    <Button as={Link} to="/register" variant="outline-light" size="lg" className="rounded-pill px-5 py-3 border-width-2">
                                        Sign Up Free
                                    </Button>
                                )}
                            </div>
                        </Col>
                        <Col lg={6} className="mt-5 mt-lg-0 d-none d-lg-block position-relative">
                            <div className="hero-image-vignette position-relative py-5">
                                <div className="hero-icon-blob shadow-premium-lg mx-auto">
                                    <FaGraduationCap size={160} className="text-white opacity-95" />
                                </div>

                                {/* Floating Cards */}
                                <div className="floating-card p-3 rounded-3xl backdrop-blur border border-white border-opacity-10 position-absolute bg-white bg-opacity-10 shadow-lg animate-float floating-card-top-right">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="bg-success rounded-circle shadow-sm indicator-dot"></div>
                                        <div>
                                            <div className="small font-weight-bold">Live Mentoring</div>
                                            <div className="text-xs opacity-70">24/7 Available</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="floating-card p-3 rounded-3xl backdrop-blur border border-white border-opacity-10 position-absolute bg-white bg-opacity-10 shadow-lg animate-float-delayed floating-card-bottom-left">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="p-2 bg-primary bg-opacity-20 rounded-2xl">
                                            <FaUsers className="text-white" />
                                        </div>
                                        <div>
                                            <div className="small font-weight-bold">Active Students</div>
                                            <div className="text-xs opacity-70">10,000+ Strong</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="floating-card p-3 rounded-3xl backdrop-blur border border-white border-opacity-10 position-absolute bg-white bg-opacity-10 shadow-lg animate-float floating-card-stats">
                                    <div className="d-flex align-items-center gap-3">
                                        <FaPlayCircle className="text-warning" size={24} />
                                        <div>
                                            <div className="small font-weight-bold">500+ Videos</div>
                                            <div className="text-xs opacity-70">High Quality</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Stats Bar */}
            <section className="stats-bar-section pb-4 pt-5 position-relative z-index-20 stats-bar-margin">
                <Container>
                    <div className="bg-white p-5 shadow rounded-4xl shadow-premium border border-light mx-auto max-w-1000">
                        <Row className="text-center g-4">
                            {stats.map((s) => (
                                <Col key={s.label} xs={6} md={3}>
                                    <div className="stat-item">
                                        <h2 className="stat-value text-primary-custom font-weight-extra-bold mb-1 letter-spacing-tight">{s.value}</h2>
                                        <p className="stat-label text-muted small text-uppercase letter-spacing-2 font-weight-bold mb-0">{s.label}</p>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </Container>
            </section>

            {/* Featured Courses Section */}
            <section className="featured-courses pt-10">
                <Container>
                    {/* Section Header */}
                    <div className="d-flex justify-content-between align-items-end mb-8">
                        <div>
                            <span className="badge rounded-pill px-3 py-2 mb-3 small font-weight-bold text-uppercase bg-primary-light text-primary-custom">🏆 Top Rated</span>
                            <h2 className="display-5 font-weight-bold mb-1">Featured <span className="text-primary-custom">Courses</span></h2>
                            <p className="text-muted mb-0">Handpicked by our experts for maximum career impact</p>
                        </div>
                        <Link to="/courses" className="d-flex align-items-center gap-2 font-weight-bold text-decoration-none px-4 py-2 rounded-pill bg-primary-soft text-primary-custom transition-all">
                            Explore All <FaArrowRight size={12} />
                        </Link>
                    </div>

                    {/* Course Cards */}
                    <Row className="g-4 my-4">
                        {featuredCourses.map(course => (
                            <Col key={course.id} lg={4} className="d-flex">
                                <div className="course-card w-100 d-flex flex-column course-card-wrapper">

                                    {/* Gradient Header */}
                                    <div className="course-card-header position-relative d-flex flex-column justify-content-between p-4 course-card-header-base" style={{ background: course.gradient }}>
                                        {/* Category + Level Badges */}
                                        <div className="d-flex justify-content-between align-items-start">
                                            <span className="badge rounded-pill px-3 py-1 badge-glass-white" style={{ fontSize: '0.72rem', fontWeight: 700 }}>
                                                {course.category}
                                            </span>
                                            <span className="badge rounded-pill px-3 py-1 badge-glass-soft" style={{ fontSize: '0.7rem', fontWeight: 600 }}>
                                                {course.level}
                                            </span>
                                        </div>
                                        {/* Big Icon */}
                                        <div className="d-flex align-items-center justify-content-center icon-container-glass">
                                            {course.icon}
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-4 d-flex flex-column flex-grow-1">
                                        <h5 className="font-weight-bold mb-2 course-title-dark">{course.title}</h5>
                                        <p className="text-muted small mb-3 course-desc-muted">{course.description}</p>

                                        {/* Instructor + Duration */}
                                        <div className="d-flex align-items-center justify-content-between mb-3">
                                            <div className="d-flex align-items-center gap-2 small text-muted">
                                                <FaChalkboardTeacher className="text-primary-custom" />
                                                <span className="fw-semibold text-dark-accent">{course.instructor}</span>
                                            </div>
                                            <div className="d-flex align-items-center gap-1 small text-muted">
                                                <FaPlayCircle className="text-primary-custom" />
                                                <span>{course.duration}</span>
                                            </div>
                                        </div>

                                        {/* Rating Row */}
                                        <div className="d-flex align-items-center gap-2 mb-4">
                                            <div className="d-flex gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <FaStar key={i} size={12} style={{ color: i < Math.round(course.rating) ? '#f59e0b' : '#e5e7eb' }} />
                                                ))}
                                            </div>
                                            <span className="small font-weight-bold text-dark-accent">{course.rating}</span>
                                            <span className="small text-muted">({course.reviews} reviews)</span>
                                            <span className="ms-auto small text-muted"><FaUsers size={11} className="me-1" />{course.students.toLocaleString()}</span>
                                        </div>

                                        {/* CTA */}
                                        <div className="d-flex align-items-center justify-content-center mt-auto pt-3 course-meta-divider">
                                            <Button as={Link} to="/courses" size="sm" className="rounded-pill px-5 py-2 fw-semibold border-0 bg-primary-custom text-white fs-0-9 w-100">
                                                Enroll Now
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>

                    {/* Bottom CTA */}
                    <div className="text-center mt-8">
                        <Link
                            to="/courses"
                            className="btn rounded-pill px-5 py-2 fw-semibold transition-all view-all-btn-outline"
                        >
                            View All Courses &nbsp;<FaArrowRight size={12} />
                        </Link>
                    </div>
                </Container>
            </section>

            {/* Features Section */}
            <section className="features-section py-10 bg-light-bg">
                <Container>
                    <div className="section-header text-center mb-10 max-w-700 mx-auto">
                        <span className="badge bg-primary bg-opacity-10 text-primary-custom rounded-pill px-3 py-2 mb-3 small font-weight-bold uppercase">Why Choose Us</span>
                        <h2 className="display-5 font-weight-bold">The Better Way <br />To <span className="text-primary-custom">Master New Tech</span></h2>
                    </div>
                    <Row className="g-5">
                        {features.map((f, i) => (
                            <Col key={i} md={6} lg={3}>
                                <Card className="feature-modern-card border-0 text-center h-100 p-5 rounded-4xl transition-all hover-lift bg-white shadow-sm border border-transparent hover-border-primary">
                                    <div className="feature-icon-wrapper mx-auto mb-4 bg-opacity-5 rounded-3xl d-flex align-items-center justify-content-center feature-icon-wrapper-large">
                                        {f.icon}
                                    </div>
                                    <h5 className="font-weight-bold mb-3">{f.title}</h5>
                                    <p className="text-muted small leading-relaxed">{f.desc}</p>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* CTA Section */}
            <section className="cta-modern-section mb-10">
                <Container>
                    <div className="cta-gradient-box p-10 rounded-4xl text-white shadow-premium-lg overflow-hidden">
                        <div className="cta-mesh-gradient"></div>

                        <Row className="align-items-center position-relative z-index-10 gy-5">
                            <Col lg={7} className="text-center text-lg-start">
                                <Badge bg="white" text="primary" className="rounded-pill mb-4 px-3 py-2 text-uppercase font-weight-bold shadow-sm">
                                    <HiLightningBolt className="me-1" /> Career Accelerator
                                </Badge>
                                <h2 className="display-2 font-weight-extra-bold mb-4 letter-spacing-tight lh-1">
                                    Ready to <span className="text-gradient">Elevate</span> <br />Your Future?
                                </h2>
                                <p className="lead mb-8 opacity-75 max-w-500 mx-auto mx-lg-0 fs-4">
                                    Join 10,000+ top-tier students mastering the skills of tomorrow with our expert-led tracks.
                                </p>

                                <div className="d-flex flex-wrap justify-content-center justify-content-lg-start align-items-center gap-4">
                                    <Button as={Link} to={user ? '/courses' : '/register'} variant="light" size="lg" className="rounded-pill px-5 py-3 font-weight-bold text-primary shadow-lg border-0 btn-pulse">
                                        {user ? 'Browse All Courses' : 'Sign Up For Free'}
                                    </Button>

                                    <div className="d-flex align-items-center gap-3">
                                        <div className="avatar-group">
                                            <div className="avatar-group-item bg-primary text-white">AJ</div>
                                            <div className="avatar-group-item bg-warning text-white">MC</div>
                                            <div className="avatar-group-item bg-success text-white">SM</div>
                                            <div className="avatar-group-item bg-white text-primary border-0 shadow-sm">+</div>
                                        </div>
                                        <div className="small opacity-75 fw-semibold text-start">
                                            Trusted by <br /> 10k+ Students
                                        </div>
                                    </div>
                                </div>
                            </Col>

                            <Col lg={5} className="d-none d-lg-block">
                                <div className="glass-preview-card">
                                    <div className="cta-glow-dot" style={{ top: '15%', right: '15%' }}></div>

                                    <div className="d-flex align-items-center gap-4 mb-5">
                                        <div className="p-3 bg-white bg-opacity-10 rounded-3xl">
                                            <FaGraduationCap size={40} className="text-white" />
                                        </div>
                                        <div>
                                            <div className="h4 mb-1 font-weight-bold">Web Mastery</div>
                                            <div className="small opacity-70">Expert-led Curriculum</div>
                                        </div>
                                    </div>

                                    <div className="mb-5">
                                        <div className="d-flex justify-content-between mb-2 small fw-bold">
                                            <span>Current Progress</span>
                                            <span className="text-gradient fw-extra-bold">85%</span>
                                        </div>
                                        <div className="progress progress-bar-thin bg-white bg-opacity-10 rounded-pill" style={{ height: '10px' }}>
                                            <div className="progress-bar bg-white rounded-pill shadow-sm" style={{ width: '85%' }}></div>
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="d-flex gap-1">
                                                {[...Array(5)].map((_, i) => <FaStar key={i} size={14} className="text-warning" />)}
                                            </div>
                                            <span className="small fw-bold">4.9/5 Rating</span>
                                        </div>
                                        <div className="text-xs bg-white bg-opacity-10 px-2 py-1 rounded-pill">Trending</div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Container>
            </section>
        </div>
    );
};

export default HomePage;
