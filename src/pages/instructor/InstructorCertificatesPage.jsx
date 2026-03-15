import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Spinner, Alert, Badge, Form, InputGroup, ProgressBar } from 'react-bootstrap';
import { FaCertificate, FaSearch, FaEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { getInstructorEnrollments } from '../../services/enrollmentService';
import { useAuth } from '../../context/AuthContext';

const InstructorCertificatesPage = () => {
    const { user } = useAuth();
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchEnrollments();
    }, []);

    const fetchEnrollments = async () => {
        try {
            const { data } = await getInstructorEnrollments();
            // Show all approved enrollments so instructor can track progress
            const approved = data.filter(e => e.status === 'approved');
            setEnrollments(approved);
        } catch {
            setError('Failed to fetch student progress data');
        } finally {
            setLoading(false);
        }
    };

    const filteredEnrollments = enrollments.filter(e =>
        e.student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.course?.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <DashboardLayout><div className="text-center py-10"><Spinner animation="border" variant="primary" /></div></DashboardLayout>;

    return (
        <DashboardLayout>
            <div className="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-3">
                <div>
                    <h2 className="dash-title font-weight-bold mb-0">Student Progress & Certificates</h2>
                    <p className="text-muted mb-0">Monitor your students' learning progress and view issued certificates.</p>
                </div>
            </div>

            {error && <Alert variant="danger" className="rounded-2xl">{error}</Alert>}

            <Card className="border-0 shadow-sm rounded-4xl overflow-hidden mb-4">
                <Card.Header className="bg-white border-bottom-0 pt-4 pb-0 px-4">
                    <Row className="align-items-center mb-3">
                        <Col md={6}>
                            <h5 className="mb-0 font-weight-bold text-dark"><FaCertificate className="text-warning me-2" /> Active Students</h5>
                        </Col>
                        <Col md={6}>
                            <InputGroup className="shadow-none border rounded-pill overflow-hidden mt-3 mt-md-0">
                                <InputGroup.Text className="bg-white border-0 text-muted"><FaSearch /></InputGroup.Text>
                                <Form.Control
                                    className="border-0 shadow-none ps-0"
                                    placeholder="Search by student or course..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </InputGroup>
                        </Col>
                    </Row>
                </Card.Header>
                <Card.Body className="p-0">
                    <Table hover responsive className="mb-0 premium-table align-middle">
                        <thead className="bg-light">
                            <tr>
                                <th className="px-4 py-3">Student Name</th>
                                <th className="py-3">Course</th>
                                <th className="py-3">Progress</th>
                                <th className="py-3 text-center">Status</th>
                                <th className="py-3 text-end px-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEnrollments.map(e => (
                                <tr key={e._id}>
                                    <td className="px-4 py-3">
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="user-avatar-mini bg-primary bg-opacity-10 text-primary">
                                                {e.student?.name?.[0]?.toUpperCase() || 'S'}
                                            </div>
                                            <div>
                                                <h6 className="mb-0 font-weight-medium text-dark">{e.student?.name}</h6>
                                                <small className="text-muted">{e.student?.email}</small>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="font-weight-medium text-dark" style={{ maxWidth: '200px', display: 'block' }}>{e.course?.title}</span>
                                    </td>
                                    <td style={{ minWidth: '150px' }}>
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="flex-grow-1">
                                                <div className="d-flex justify-content-between mb-1" style={{ fontSize: '0.7rem' }}>
                                                    <span className="text-muted">{e.completedLessons?.length || 0}/{e.course?.lessons?.length || 0} Lessons</span>
                                                    <span className="font-weight-bold text-primary">{e.progress}%</span>
                                                </div>
                                                <ProgressBar now={e.progress} variant={e.progress === 100 ? "success" : "primary"} style={{ height: '6px' }} className="rounded-pill" />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="text-center">
                                        {e.progress === 100 ? (
                                            <Badge bg="success" className="bg-opacity-10 text-success border border-success border-opacity-20 px-3 py-2 rounded-pill">
                                                Completed
                                            </Badge>
                                        ) : (
                                            <Badge bg="primary" className="bg-opacity-10 text-primary border border-primary border-opacity-20 px-3 py-2 rounded-pill">
                                                In Progress
                                            </Badge>
                                        )}
                                    </td>
                                    <td className="text-end px-4">
                                        {e.progress === 100 ? (
                                            <Button
                                                as={Link}
                                                to={`/certificate/${e._id}`}
                                                variant="outline-success"
                                                size="sm"
                                                className="rounded-pill px-3 py-1 fw-medium"
                                            >
                                                <FaEye className="me-1 mb-1" /> Certificate
                                            </Button>
                                        ) : (
                                            <span className="text-muted small">Learning...</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {filteredEnrollments.length === 0 && (
                                <tr><td colSpan="5" className="text-center py-5 text-muted">No students are currently enrolled in your courses.</td></tr>
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </DashboardLayout>
    );
};

export default InstructorCertificatesPage;
