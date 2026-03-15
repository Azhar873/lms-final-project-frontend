import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getEnrollmentById } from '../services/enrollmentService';
import { Container, Button, Spinner, Alert } from 'react-bootstrap';
import { FaPrint, FaArrowLeft, FaAward, FaGraduationCap } from 'react-icons/fa';
import '../index.css';

const CertificatePage = () => {
    const { id } = useParams();
    const [enrollment, setEnrollment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEnrollment = async () => {
            try {
                const { data } = await getEnrollmentById(id);
                if (data.progress < 100) {
                    setError('Course is not fully completed yet.');
                } else {
                    setEnrollment(data);
                }
            } catch (err) {
                setError('Failed to load certificate details. Please check if you have permission to view it.');
            } finally {
                setLoading(false);
            }
        };
        fetchEnrollment();
    }, [id]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) return <div className="text-center py-5 mt-5"><Spinner animation="border" variant="primary" /></div>;
    
    if (error) return (
        <Container className="py-5 mt-5 text-center">
            <Alert variant="danger">{error}</Alert>
            <Button as={Link} to="/" variant="outline-primary">Return Home</Button>
        </Container>
    );

    const studentName = enrollment.student?.name || 'Student';
    const courseTitle = enrollment.course?.title || 'Course';
    const instructorName = enrollment.course?.instructor?.name || 'Instructor';
    const completionDate = new Date(enrollment.completedAt || enrollment.updatedAt).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <React.Fragment>
            <div className="d-print-none text-center py-4 bg-light shadow-sm mb-4 sticky-top z-index-1030">
                <Button variant="outline-secondary" as={Link} to={-1} className="me-3 rounded-pill fw-medium">
                    <FaArrowLeft className="me-2 mb-1"/> Back
                </Button>
                <Button variant="primary" onClick={handlePrint} className="rounded-pill shadow-primary px-4 fw-medium">
                    <FaPrint className="me-2 mb-1"/> Print Certificate
                </Button>
            </div>
            
            <Container className="d-flex justify-content-center mb-5 print-container w-100">
                <div className="certificate-wrapper bg-white">
                    <div className="certificate-border">
                        {/* LearnHub Watermark */}
                        <div
                            className="position-absolute top-50 start-50 translate-middle d-flex flex-column align-items-center justify-content-center gap-2 pointer-events-none"
                            style={{ opacity: 0.05, zIndex: 0, userSelect: 'none', width: '80%' }}
                        >
                            <FaGraduationCap size={180} color="#7c3aed" />
                            <span style={{
                                fontSize: '4rem',
                                fontFamily: "'Outfit', sans-serif",
                                fontWeight: 800,
                                color: '#7c3aed',
                                letterSpacing: '-0.02em',
                                whiteSpace: 'nowrap'
                            }}>LearnHub</span>
                        </div>
                        <div className="certificate-content text-center">
                            <div className="certificate-header">
                                <FaAward className="certificate-icon text-warning mb-3" size={60} />
                                <h1 className="certificate-title font-serif text-primary-custom fw-bold">Certificate of Completion</h1>
                                <p className="certificate-subtitle text-muted tracking-wider text-uppercase small mt-3">This is proudly presented to</p>
                            </div>
                            
                            <div className="certificate-body my-5">
                                <h2 className="student-name font-weight-bold display-4 text-dark mb-4 border-bottom border-2 pb-3 d-inline-block px-5">{studentName}</h2>
                                <p className="completion-text mb-4 text-secondary fs-5 lh-lg">
                                    for successfully completing all requirements and showing dedication in <br/> the course
                                </p>
                                <h3 className="course-title text-primary-custom font-weight-bold display-5 mb-0 mt-3">{courseTitle}</h3>
                            </div>
                            
                            <div className="certificate-footer mt-5 pt-4 d-flex justify-content-between align-items-end px-md-5">
                                <div className="signature-box text-center">
                                    <div className="signature-line border-bottom border-dark pb-2 mb-2 px-4 shadow-sm-none">
                                        <span className="signature-font fs-2 text-dark">{instructorName}</span>
                                    </div>
                                    <p className="text-muted small text-uppercase tracking-wider m-0">Course Instructor</p>
                                </div>
                                <div className="date-box text-center">
                                    <div className="date-line border-bottom border-dark pb-2 mb-2 px-4 shadow-sm-none">
                                        <span className="fs-4 text-dark fw-bold">{completionDate}</span>
                                    </div>
                                    <p className="text-muted small text-uppercase tracking-wider m-0">Date Completed</p>
                                </div>
                            </div>
                            
                            <div className="certificate-stamp">
                                <div className="stamp-inner tracking-wider">Official</div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </React.Fragment>
    );
};

export default CertificatePage;
