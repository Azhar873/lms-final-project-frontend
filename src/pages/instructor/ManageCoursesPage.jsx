import { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { FaTrash, FaEdit, FaPlus, FaBook, FaPlusCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { getCourses, deleteCourse } from '../../services/courseService';
import { useAuth } from '../../context/AuthContext';

const ManageCoursesPage = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const { data } = await getCourses();
            // Only show instructor's courses if not admin
            const filtered = user.role === 'admin' ? data : data.filter(c => c.instructor?._id === user._id);
            setCourses(filtered);
        } catch {
            setError('Failed to fetch courses');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                await deleteCourse(id);
                setCourses(courses.filter(c => c._id !== id));
            } catch {
                alert('Failed to delete course');
            }
        }
    };

    if (loading) return <DashboardLayout><div className="text-center py-10"><Spinner animation="border" variant="primary" /></div></DashboardLayout>;

    return (
        <DashboardLayout>
            <div className="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-3">
                <div>
                    <h2 className="dash-title font-weight-bold mb-0">Manage Courses</h2>
                    <p className="text-muted mb-0">Create, edit and manage your platform content.</p>
                </div>
                <Button as={Link} to="/instructor/create" variant="primary" className="rounded-pill px-4 py-2 d-flex align-items-center gap-2 shadow-primary">
                    <FaPlusCircle /> Create New Course
                </Button>
            </div>

            {error && <Alert variant="danger" className="rounded-2xl">{error}</Alert>}

            <div className="bg-white rounded-4xl shadow-sm border border-light overflow-hidden">
                <Table hover responsive className="mb-0 premium-table align-middle">
                    <thead className="bg-light">
                        <tr>
                            <th className="px-4 py-3">Course Title</th>
                            <th className="py-3">Category</th>
                            <th className="py-3 text-center">Lessons</th>
                            <th className="py-3 text-end px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map(c => (
                            <tr key={c._id}>
                                <td className="px-4 py-3">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="course-avatar-mini bg-primary bg-opacity-10 text-primary rounded-lg d-flex align-items-center justify-content-center avatar-mini-fixed">
                                            <FaBook />
                                        </div>
                                        <span className="font-weight-medium">{c.title}</span>
                                    </div>
                                </td>
                                <td><Badge bg="primary" className="bg-opacity-10 text-primary border border-primary border-opacity-20 px-2 py-1">{c.category}</Badge></td>
                                <td className="text-center"><Badge pill bg="light" className="text-dark border">{c.lessons?.length || 0}</Badge></td>
                                <td className="text-end px-4 gap-2">
                                    <div className="d-flex justify-content-end gap-2">
                                        <Button as={Link} to={`/courses/${c._id}`} variant="outline-info" size="sm" className="rounded-circle p-2 border-0"><FaPlus /></Button>
                                        <Button as={Link} to={`/instructor/edit/${c._id}`} variant="outline-primary" size="sm" className="rounded-circle p-2 border-0"><FaEdit /></Button>
                                        <Button variant="outline-danger" size="sm" className="rounded-circle p-2 border-0" onClick={() => handleDelete(c._id)}><FaTrash /></Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {courses.length === 0 && (
                            <tr><td colSpan="5" className="text-center py-5 text-muted">No courses found. Start by creating one!</td></tr>
                        )}
                    </tbody>
                </Table>
            </div>
        </DashboardLayout>
    );
};

export default ManageCoursesPage;
