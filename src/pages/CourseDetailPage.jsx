import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { FaUserCircle, FaPlayCircle, FaCheckCircle, FaLock, FaBookOpen, FaChevronDown, FaChevronUp, FaVideo, FaClock, FaHourglassHalf, FaTimesCircle, FaAward } from 'react-icons/fa';
import { getCourseById } from '../services/courseService';
import { enrollInCourse, getMyCourses, completeLesson } from '../services/enrollmentService';
import { useAuth } from '../context/AuthContext';
import { ProgressBar } from 'react-bootstrap';
import { toast } from 'react-toastify';

/* Convert a YouTube/Vimeo watch URL → embed URL */
const getEmbedUrl = (url) => {
    if (!url) return null;
    // If it's a local upload, don't try to embed it as an iframe
    if (url.startsWith('/uploads/')) return null;

    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?rel=0&modestbranding=1`;
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    return url;
};

import ReviewSection from '../components/ReviewSection';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const CourseDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [course, setCourse] = useState(null);
    const [enrollmentStatus, setEnrollmentStatus] = useState(null); // null | 'pending' | 'approved' | 'rejected'
    const [loading, setLoading] = useState(true);
    const [enrollLoading, setEnrollLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeLesson, setActiveLesson] = useState(0);
    const [currentEnrollment, setCurrentEnrollment] = useState(null);
    const [completing, setCompleting] = useState(false);
    const [watchProgress, setWatchProgress] = useState(0); // 0 to 100
    const [isWatchThresholdMet, setIsWatchThresholdMet] = useState(false);
    const [lessonStartTime, setLessonStartTime] = useState(Date.now());

    const isApproved = enrollmentStatus === 'approved';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await getCourseById(id);
                setCourse(data);
                if (user && user.role === 'student') {
                    const { data: myEnc } = await getMyCourses();
                    const found = myEnc.find(e => e.course._id === id);
                    if (found) {
                        setEnrollmentStatus(found.status);
                        setCurrentEnrollment(found);
                    }
                }
            } catch (err) {
                setError('Course not found');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, user]);

    // Reset watch progress when changing lessons
    useEffect(() => {
        setWatchProgress(0);
        setIsWatchThresholdMet(false);
        setLessonStartTime(Date.now());
        
        // If lesson is already completed, unlock it immediately
        if (currentEnrollment?.completedLessons?.includes(activeLesson)) {
            setIsWatchThresholdMet(true);
            setWatchProgress(100);
        }
    }, [activeLesson, currentEnrollment]);

    // Simple timer-based progress for IFrames (YouTube/Vimeo)
    useEffect(() => {
        if (isWatchThresholdMet || !course?.lessons?.[activeLesson]) return;
        
        const currentLesson = course.lessons[activeLesson];
        const isEmbed = getEmbedUrl(currentLesson.videoUrl);
        
        if (!isEmbed) return; // Native video handles itself via onTimeUpdate

        // Parse duration (e.g. "10:30")
        const parseDuration = (dur) => {
            if (!dur) return 300; // Default 5 mins if no duration provided
            const parts = dur.split(':').map(Number);
            if (parts.length === 2) return parts[0] * 60 + parts[1];
            if (parts.length === 1) return parts[0] * 60;
            return 300;
        };

        const durationInSeconds = parseDuration(currentLesson.duration);
        const thresholdSeconds = durationInSeconds * 0.75;

        const interval = setInterval(() => {
            const elapsed = (Date.now() - lessonStartTime) / 1000;
            const progress = Math.min((elapsed / thresholdSeconds) * 75, 75); // Cap at 75 for timer
            
            setWatchProgress(progress);
            
            if (elapsed >= thresholdSeconds) {
                setIsWatchThresholdMet(true);
                setWatchProgress(100);
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [activeLesson, lessonStartTime, isWatchThresholdMet, course, currentEnrollment]);

    const handleEnroll = async () => {
        if (!user) return navigate('/login');
        setEnrollLoading(true);
        try {
            const { data } = await enrollInCourse(id);
            setEnrollmentStatus('pending');
            // enrollment might be immediate if platform is configured so, 
            // but here we keep it pending.
            toast.success('Request sent! Waiting for instructor approval.');
        } catch (err) {
            const msg = err.response?.data?.message || 'Request failed';
            const status = err.response?.data?.status;
            if (status) setEnrollmentStatus(status);
            toast.error(msg);
        } finally {
            setEnrollLoading(false);
        }
    };

    const handleMarkComplete = async (index) => {
        if (!currentEnrollment) return;
        setCompleting(true);
        try {
            const { data } = await completeLesson(currentEnrollment._id, index);
            setCurrentEnrollment(data);
            toast.success('Lesson marked as complete!');
            
            // Auto move to next lesson
            if (index < (course?.lessons?.length || 0) - 1) {
                setActiveLesson(index + 1);
                window.scrollTo({ top: document.querySelector('.course-content-section').offsetTop - 80, behavior: 'smooth' });
            }
        } catch (err) {
            toast.error('Failed to update progress');
        } finally {
            setCompleting(false);
        }
    };

    // Enroll button state
    const renderEnrollButton = () => {
        if (enrollmentStatus === 'approved') {
            return (
                <Button disabled className="w-100 rounded-pill py-3 font-weight-bold mb-3 d-flex align-items-center justify-content-center gap-2 border-0 bg-success text-white">
                    <FaCheckCircle /> You are Enrolled
                </Button>
            );
        }
        if (enrollmentStatus === 'pending') {
            return (
                <Button disabled className="w-100 rounded-pill py-3 font-weight-bold mb-3 d-flex align-items-center justify-content-center gap-2 border-0" style={{ background: '#f59e0b', color: '#fff' }}>
                    <FaHourglassHalf /> Request Sent — Pending Approval
                </Button>
            );
        }
        if (enrollmentStatus === 'rejected') {
            return (
                <Button disabled className="w-100 rounded-pill py-3 font-weight-bold mb-3 d-flex align-items-center justify-content-center gap-2 border-0 bg-danger text-white">
                    <FaTimesCircle /> Request Rejected
                </Button>
            );
        }
        return (
            <Button
                onClick={handleEnroll}
                disabled={enrollLoading}
                className="w-100 rounded-pill py-3 font-weight-bold mb-3 shadow-primary btn-pulse border-0 bg-primary-custom text-white fs-5"
            >
                {enrollLoading ? 'Sending Request...' : 'Request Access'}
            </Button>
        );
    };

    if (loading) return <div className="text-center py-10 mt-10 min-vh-100 d-flex align-items-center justify-content-center"><Spinner animation="border" variant="primary" /></div>;
    if (error) return <Container className="mt-10 pt-10 min-vh-100"><Alert variant="danger">{error}</Alert></Container>;

    return (
        <div className="course-detail-page bg-light-bg overflow-hidden pt-0">
            {/* Hero Section */}
            <section className="hero-section text-white d-flex align-items-center py-10 position-relative ">
                <div className="hero-glow"></div>
                <Container className="position-relative z-index-10 mt-4">
                    <Row className="align-items-center g-5">
                        <Col lg={7} className="text-center text-lg-start animate-fade-in-up">
                            <div className="hero-badge-premium d-inline-flex align-items-center gap-2 mb-4 px-4 py-2 rounded-pill bg-white bg-opacity-10 border border-white border-opacity-10 text-white small font-weight-bold backdrop-blur">
                                <FaBookOpen className="text-warning" /> {course?.category || 'General'}
                            </div>
                            <h1 className="display-3 font-weight-extra-bold mb-4 letter-spacing-tight">
                                {course?.title}
                            </h1>
                            <p className="lead mb-5 opacity-75 max-w-700 mx-auto mx-lg-0 fs-4">
                                {course?.description}
                            </p>

                            <div className="d-flex flex-wrap gap-4 align-items-center justify-content-center justify-content-lg-start">
                                <div className="d-flex align-items-center gap-3 bg-white bg-opacity-10 px-4 py-2 rounded-pill backdrop-blur border border-white border-opacity-10">
                                    <FaUserCircle size={28} className="text-primary-custom" />
                                    <div className="d-flex flex-column text-start">
                                        <span className="small opacity-70 text-uppercase font-weight-bold" style={{ fontSize: '0.7rem' }}>Instructor</span>
                                        <span className="font-weight-bold text-white">{course?.instructor?.name || 'Expert Instructor'}</span>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center gap-3 bg-white bg-opacity-10 px-4 py-2 rounded-pill backdrop-blur border border-white border-opacity-10">
                                    <FaVideo size={22} className="text-info" />
                                    <div className="d-flex flex-column text-start">
                                        <span className="small opacity-70 text-uppercase font-weight-bold" style={{ fontSize: '0.7rem' }}>Lessons</span>
                                        <span className="font-weight-bold text-white">{course?.lessons?.length || 0} Lessons</span>
                                    </div>
                                </div>
                            </div>
                        </Col>

                        <Col lg={5} className="mt-5 mt-lg-0 d-flex align-items-center justify-content-center">
                            <div className="enroll-card-compact bg-white rounded-4xl shadow-premium-lg overflow-hidden" style={{ maxWidth: '360px', width: '100%', border: '1px solid rgba(255,255,255,0.15)' }}>
                                {/* Gradient top accent + thumbnail */}
                                <div className="position-relative" style={{ height: '160px', background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 60%, #ec4899 100%)' }}>
                                    {course?.thumbnail ? (
                                        <img
                                            src={course.thumbnail.startsWith('/uploads/') ? `${BACKEND_URL}${course.thumbnail}` : course.thumbnail}
                                            alt={course.title}
                                            className="w-100 h-100 object-fit-cover"
                                            style={{ opacity: 0.35, mixBlendMode: 'multiply' }}
                                        />
                                    ) : null}
                                    <div className="position-absolute bottom-0 start-0 end-0 p-3 text-white">
                                        <div className="small opacity-75 text-uppercase fw-bold" style={{ fontSize: '0.65rem', letterSpacing: '0.12em' }}>Course Access</div>
                                        <div className="fw-bold" style={{ fontSize: '0.95rem', lineHeight: 1.3 }}>{course?.title?.length > 40 ? course.title.substring(0, 40) + '…' : course?.title}</div>
                                    </div>
                                </div>

                                <div className="p-4">
                                    {/* Status banners */}
                                    {enrollmentStatus === 'pending' && (
                                        <div className="rounded-3 p-2 mb-3 d-flex align-items-center gap-2" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)' }}>
                                            <FaHourglassHalf style={{ color: '#d97706', flexShrink: 0 }} />
                                            <span className="small fw-medium" style={{ color: '#d97706' }}>Awaiting Instructor Approval</span>
                                        </div>
                                    )}
                                    {enrollmentStatus === 'rejected' && (
                                        <div className="rounded-3 p-2 mb-3 d-flex align-items-center gap-2" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}>
                                            <FaTimesCircle className="text-danger" style={{ flexShrink: 0 }} />
                                            <span className="small fw-medium text-danger">Enrollment Request Rejected</span>
                                        </div>
                                    )}

                                    {renderEnrollButton()}

                                    {/* Perks row */}
                                    <div className="d-flex justify-content-around text-center mt-3 pt-3" style={{ borderTop: '1px solid #f1f5f9' }}>
                                        <div className="d-flex flex-column align-items-center gap-1">
                                            <div className="d-flex align-items-center justify-content-center rounded-circle" style={{ width: 36, height: 36, background: 'rgba(16,185,129,0.1)' }}>
                                                <FaCheckCircle className="text-success" size={15} />
                                            </div>
                                            <span className="text-muted" style={{ fontSize: '0.68rem' }}>Lifetime Access</span>
                                        </div>
                                        <div className="d-flex flex-column align-items-center gap-1">
                                            <div className="d-flex align-items-center justify-content-center rounded-circle" style={{ width: 36, height: 36, background: 'rgba(124,58,237,0.1)' }}>
                                                <FaAward className="text-primary" size={15} />
                                            </div>
                                            <span className="text-muted" style={{ fontSize: '0.68rem' }}>Certificate</span>
                                        </div>
                                        <div className="d-flex flex-column align-items-center gap-1">
                                            <div className="d-flex align-items-center justify-content-center rounded-circle" style={{ width: 36, height: 36, background: 'rgba(6,182,212,0.1)' }}>
                                                <FaVideo className="text-info" size={15} />
                                            </div>
                                            <span className="text-muted" style={{ fontSize: '0.68rem' }}>All Devices</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Course Content Section */}
            <section className="course-content-section py-10 bg-light-bg">
                <Container>
                    <div className={isApproved ? "mx-auto" : "max-w-1000 mx-auto"}>
                        <div className="d-flex flex-column align-items-center text-center mb-8">
                            <span className="badge bg-primary-soft text-primary-custom rounded-pill px-3 py-2 small font-weight-bold text-uppercase mb-3">Curriculum</span>
                            <h2 className="display-5 font-weight-extra-bold mb-2">Course <span className="text-primary-custom">Content</span></h2>
                            <p className="text-muted max-w-700">
                                {isApproved
                                    ? 'Select a lesson from the sidebar to start learning.'
                                    : enrollmentStatus === 'pending'
                                        ? 'Your request is pending. You\'ll get access once approved.'
                                        : 'Request access to unlock all lessons.'}
                            </p>
                        </div>

                        {course?.lessons?.length > 0 ? (
                            isApproved ? (
                                <Row className="g-4">
                                    {/* MAIN VIDEO AREA */}
                                    <Col lg={8} className="order-1 order-lg-1">
                                        <div className="lesson-main-content bg-white p-2 p-md-4 rounded-4xl shadow-premium border border-light h-100">
                                            {course.lessons[activeLesson] ? (() => {
                                                const currentLesson = course.lessons[activeLesson];
                                                const embedUrl = getEmbedUrl(currentLesson.videoUrl);
                                                return (
                                                    <div className="animate-fade-in">
                                                        {embedUrl ? (
                                                            <div className="video-player-wrapper rounded-3xl overflow-hidden shadow-sm mb-4 bg-light" style={{ aspectRatio: '16/9' }}>
                                                                <iframe
                                                                    src={embedUrl}
                                                                    title={currentLesson.title}
                                                                    width="100%"
                                                                    height="100%"
                                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                    allowFullScreen
                                                                    style={{ border: 'none', display: 'block' }}
                                                                />
                                                            </div>
                                                        ) : currentLesson.videoUrl ? (
                                                            <div className="video-player-wrapper rounded-3xl overflow-hidden shadow-sm bg-black mb-4" style={{ aspectRatio: '16/9' }}>
                                                                <video
                                                                    controls
                                                                    className="w-100 h-100"
                                                                    poster={course?.thumbnail && course.thumbnail.startsWith('/uploads/') ? `${BACKEND_URL}${course.thumbnail}` : course?.thumbnail}
                                                                    onTimeUpdate={(e) => {
                                                                        const video = e.target;
                                                                        const progress = (video.currentTime / video.duration) * 100;
                                                                        if (progress > watchProgress) setWatchProgress(progress);
                                                                        if (progress >= 75 && !isWatchThresholdMet) {
                                                                            setIsWatchThresholdMet(true);
                                                                        }
                                                                    }}
                                                                >
                                                                    <source
                                                                        src={currentLesson.videoUrl.startsWith('http') ? currentLesson.videoUrl : `${BACKEND_URL}${currentLesson.videoUrl}`}
                                                                        type="video/mp4"
                                                                    />
                                                                    Your browser does not support the video tag.
                                                                </video>
                                                            </div>
                                                        ) : (
                                                            <div className="d-flex flex-column align-items-center justify-content-center py-5 rounded-3xl bg-light-soft border border-light mb-4 shadow-sm" style={{ aspectRatio: '16/9' }}>
                                                                <FaVideo size={48} className="text-muted opacity-30 mb-3" />
                                                                <p className="text-muted font-weight-bold mb-0">No video available for this lesson.</p>
                                                            </div>
                                                        )}

                                                        <div className="lesson-details p-3 p-md-2">
                                                            <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                                                                <span className="badge bg-primary-soft text-primary-custom px-3 py-2 rounded-pill font-weight-bold" style={{ fontSize: '0.75rem' }}>
                                                                    Lesson {activeLesson + 1}
                                                                </span>
                                                                {currentLesson.duration && (
                                                                    <span className="badge bg-light text-muted px-3 py-2 rounded-pill d-flex align-items-center gap-1 font-weight-bold" style={{ fontSize: '0.75rem' }}>
                                                                        <FaClock size={12} /> {currentLesson.duration}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <h3 className="font-weight-bold mb-3">{currentLesson.title}</h3>
                                                            {currentLesson.content && (
                                                                <div className="p-4 bg-light-soft rounded-3xl border border-light content-reading mb-4">
                                                                    <h6 className="font-weight-bold mb-2 text-primary-custom d-flex align-items-center gap-2">
                                                                        <FaBookOpen size={16} /> Lesson Notes
                                                                    </h6>
                                                                    <p className="text-muted small mb-0" style={{ lineHeight: '1.8' }}>{currentLesson.content}</p>
                                                                </div>
                                                            )}

                                                            <div className="watch-validation-info mb-4">
                                                                <div className="d-flex justify-content-between align-items-center mb-1">
                                                                    <span className="small font-weight-bold text-muted">
                                                                        {isWatchThresholdMet 
                                                                            ? "✅ Watch Requirement Met (75%+)" 
                                                                            : "📺 Watch 75% to unlock completion"}
                                                                    </span>
                                                                    <span className="small font-weight-bold text-primary-custom">{Math.round(Math.min(watchProgress * (100/75), 100))}%</span>
                                                                </div>
                                                                <ProgressBar 
                                                                    now={Math.min(watchProgress * (100/75), 100)} 
                                                                    variant={isWatchThresholdMet ? "success" : "info"} 
                                                                    className="rounded-pill" 
                                                                    style={{ height: '6px' }} 
                                                                />
                                                            </div>

                                                            <div className="d-flex justify-content-center my-4">
                                                                {currentEnrollment?.completedLessons?.includes(activeLesson) ? (
                                                                    <Button disabled className="rounded-pill px-5 py-2 fw-bold border-0 bg-success bg-opacity-10 text-success d-flex align-items-center gap-2">
                                                                        <FaCheckCircle /> Lesson Completed
                                                                    </Button>
                                                                ) : (
                                                                    <Button 
                                                                        onClick={() => handleMarkComplete(activeLesson)}
                                                                        disabled={completing || !isWatchThresholdMet}
                                                                        className={`rounded-pill px-5 py-2 fw-bold border-0 transition-all ${!isWatchThresholdMet ? 'bg-secondary bg-opacity-25 text-muted shadow-none' : 'bg-primary-custom text-white shadow-primary'}`}
                                                                    >
                                                                        {completing ? 'Updating...' : !isWatchThresholdMet ? 'Watch Video to Complete' : 'Mark as Completed'}
                                                                    </Button>
                                                                )}
                                                            </div>

                                                            {/* Navigation Buttons */}
                                                            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center mt-4 pt-4 border-top border-light gap-3">
                                                                <Button
                                                                    variant="light"
                                                                    className="rounded-pill px-4 py-2 font-weight-bold border w-100 w-sm-auto"
                                                                    disabled={activeLesson === 0}
                                                                    onClick={() => window.scrollTo({ top: document.querySelector('.course-content-section').offsetTop - 80, behavior: 'smooth' }) || setActiveLesson(prev => Math.max(0, prev - 1))}
                                                                >
                                                                    &larr; Previous Lesson
                                                                </Button>
                                                                <Button
                                                                    variant="primary"
                                                                    className="rounded-pill px-4 py-2 font-weight-bold bg-primary-custom border-0 shadow-sm w-100 w-sm-auto"
                                                                    disabled={activeLesson === course.lessons.length - 1}
                                                                    onClick={() => window.scrollTo({ top: document.querySelector('.course-content-section').offsetTop - 80, behavior: 'smooth' }) || setActiveLesson(prev => Math.min(course.lessons.length - 1, prev + 1))}
                                                                >
                                                                    Next Lesson &rarr;
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })() : (
                                                <div className="text-center py-5">
                                                    <Spinner animation="border" variant="primary" />
                                                </div>
                                            )}
                                        </div>
                                    </Col>

                                    {/* SIDEBAR */}
                                    <Col lg={4} className="order-2 order-lg-2">
                                        <div className="lessons-sidebar bg-white rounded-4xl shadow-premium border border-light overflow-hidden d-flex flex-column" style={{ maxHeight: '800px', height: '100%' }}>
                                            <div className="p-4 border-bottom border-light bg-light-soft">
                                                <h5 className="font-weight-bold mb-0 d-flex align-items-center gap-2 text-dark">
                                                    <FaVideo className="text-primary-custom" size={20} /> Course Content
                                                </h5>
                                                <div className="mt-3">
                                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                                        <span className="small font-weight-bold text-dark">Your Progress</span>
                                                        <span className="small font-weight-bold text-primary-custom">{currentEnrollment?.progress || 0}%</span>
                                                    </div>
                                                    <ProgressBar now={currentEnrollment?.progress || 0} variant="primary" className="rounded-pill" style={{ height: '8px' }} />
                                                </div>
                                            </div>
                                            <div className="overflow-auto flex-grow-1 p-3 custom-scrollbar" style={{ maxHeight: '650px' }}>
                                                {course.lessons.map((l, i) => {
                                                    const isActive = activeLesson === i;
                                                    const isCompleted = currentEnrollment?.completedLessons?.includes(i);
                                                    return (
                                                        <div
                                                            key={i}
                                                            className={`d-flex align-items-center gap-3 p-3 mb-2 rounded-3xl cursor-pointer transition-all ${isActive ? 'bg-primary-soft border border-primary border-opacity-25' : 'hover-bg-light border border-transparent'}`}
                                                            onClick={() => setActiveLesson(i)}
                                                            style={{
                                                                boxShadow: isActive ? 'inset 4px 0 0 0 var(--primary)' : 'none'
                                                            }}
                                                        >
                                                            <div
                                                                className={`d-flex align-items-center justify-content-center flex-shrink-0 rounded-circle font-weight-bold transition-all`}
                                                                style={{
                                                                    width: '44px', height: '44px', fontSize: '0.85rem',
                                                                    background: isActive ? 'var(--primary)' : isCompleted ? '#10b98120' : 'rgba(124,58,237,0.08)',
                                                                    color: isActive ? '#fff' : isCompleted ? '#059669' : 'var(--primary)',
                                                                    border: isCompleted && !isActive ? '1px solid #10b98140' : 'none'
                                                                }}
                                                            >
                                                                {isCompleted ? <FaCheckCircle size={18} /> : isActive ? <FaPlayCircle size={18} /> : <span>{i + 1}</span>}
                                                            </div>
                                                            <div className="flex-grow-1 overflow-hidden">
                                                                <h6 className={`mb-1 font-weight-bold text-truncate ${isActive ? 'text-primary-custom' : 'text-dark'}`} style={{ fontSize: '0.95rem' }}>
                                                                    {l.title}
                                                                </h6>
                                                                <div className="d-flex align-items-center gap-2 small text-muted" style={{ fontSize: '0.8rem' }}>
                                                                    {l.duration ? (
                                                                        <span className="d-flex align-items-center gap-1"><FaClock size={11} /> {l.duration}</span>
                                                                    ) : (
                                                                        <span className="d-flex align-items-center gap-1"><FaVideo size={11} /> Video Lesson</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            ) : (
                                <div className="lessons-accordion bg-white rounded-4xl shadow-premium border border-light overflow-hidden">
                                    {course.lessons.map((l, i) => {
                                        return (
                                            <div key={i} className={`lesson-item border-bottom border-light transition-all`}>
                                                <div
                                                    className={`d-flex align-items-center justify-content-between px-4 px-md-5 py-4 transition-all`}
                                                    style={{ userSelect: 'none' }}
                                                >
                                                    <div className="d-flex align-items-center gap-4">
                                                        <div
                                                            className="d-flex align-items-center justify-content-center flex-shrink-0 rounded-circle font-weight-bold"
                                                            style={{
                                                                width: '48px', height: '48px', fontSize: '0.85rem',
                                                                background: '#f1f5f9',
                                                                color: '#94a3b8',
                                                                transition: 'all 0.3s ease'
                                                            }}
                                                        >
                                                            <FaLock size={16} />
                                                        </div>

                                                        <div>
                                                            <div className="small text-primary-custom font-weight-bold mb-1" style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                                                Lesson {i + 1}{l.duration ? ` · ${l.duration}` : ''}
                                                            </div>
                                                            <h5 className="mb-0 font-weight-bold course-title-dark text-muted">{l.title}</h5>
                                                        </div>
                                                    </div>

                                                    <div className="d-flex align-items-center gap-3 flex-shrink-0">
                                                        <span className="badge bg-light text-muted rounded-pill px-3 py-2 border d-none d-md-inline-flex">
                                                            {enrollmentStatus === 'pending' ? '⏳ Pending' : 'Locked'}
                                                        </span>
                                                        <FaLock className="text-muted d-md-none" size={14} />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )
                        ) : (
                            <div className="text-center py-5 bg-white rounded-4xl shadow-sm border border-light">
                                <FaBookOpen size={64} className="text-muted opacity-20 mb-3" />
                                <h5 className="font-weight-bold text-muted">No lessons available yet.</h5>
                                <p className="text-muted opacity-75 small">Check back soon for course updates.</p>
                            </div>
                        )}

                        {/* CTA if not requested yet */}
                        {!enrollmentStatus && course?.lessons?.length > 0 && (
                            <div className="text-center py-5 px-4 bg-white rounded-4xl shadow-sm border border-light mt-4">
                                <FaLock size={36} className="text-primary-custom opacity-50 mb-3" />
                                <h5 className="font-weight-bold mb-2">Request Access to Unlock All Lessons</h5>
                                <p className="text-muted small mb-4">Send a request to the instructor. Once approved, you'll get full access to all videos.</p>
                                <Button onClick={handleEnroll} disabled={enrollLoading} className="rounded-pill px-5 py-3 font-weight-bold border-0 bg-primary-custom text-white shadow-primary">
                                    {enrollLoading ? 'Sending...' : `Request Access — Free`}
                                </Button>
                            </div>
                        )}

                        <ReviewSection courseId={id} isApproved={isApproved} />
                    </div>
                </Container>
            </section>
        </div>
    );
};

export default CourseDetailPage;
