import { useState, useEffect } from 'react';
import { Table, Button, Badge, Spinner, Alert, Card } from 'react-bootstrap';
import { FaBook, FaTrash, FaUserTie, FaLayerGroup, FaTags } from 'react-icons/fa';
import DashboardLayout from '../../components/DashboardLayout';
import { getCourses, deleteCourse } from '../../services/courseService';

const ManageCoursesAdminPage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchCourses = async () => {
        try {
            const { data } = await getCourses();
            setCourses(data);
        } catch {
            setError('Failed to fetch courses');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCourses(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this course globally? This action cannot be undone.')) return;
        try {
            await deleteCourse(id);
            setCourses(courses.filter(c => c._id !== id));
        } catch (err) {
            alert('Delete failed');
        }
    };

    if (loading) return <DashboardLayout><div className="text-center py-10"><Spinner animation="border" variant="primary" /></div></DashboardLayout>;

    return (
        <DashboardLayout>
            <div className="dash-header mb-5">
                <h2 className="dash-title font-weight-bold">Manage All Courses</h2>
                <p className="text-muted">Global oversight of all learning content on the platform.</p>
            </div>

            {error && <Alert variant="danger" className="rounded-2xl">{error}</Alert>}

            <div className="bg-white rounded-4xl shadow-sm border border-light overflow-hidden">
                <Table hover responsive className="mb-0 premium-table align-middle">
                    <thead className="bg-light">
                        <tr>
                            <th className="px-4 py-3">Course Title</th>
                            <th className="py-3">Instructor</th>
                            <th className="py-3">Category</th>
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
                                        <div>
                                            <div className="font-weight-bold">{c.title}</div>
                                            <div className="small text-muted">{c.lessons?.length || 0} Lessons</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="d-flex align-items-center gap-2 small">
                                        <FaUserTie className="text-muted" /> {c.instructor?.name || 'Unknown'}
                                    </div>
                                </td>
                                <td>
                                    <Badge bg="primary" className="bg-opacity-10 text-primary border border-primary border-opacity-20 px-2 py-1">
                                        <FaLayerGroup size={10} className="me-1" /> {c.category}
                                    </Badge>
                                </td>
                                <td className="text-end px-4">
                                    <Button variant="outline-danger" size="sm" className="rounded-circle p-2 border-0 shadow-sm" onClick={() => handleDelete(c._id)}>
                                        <FaTrash size={14} />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        {courses.length === 0 && (
                            <tr><td colSpan="5" className="text-center py-5 text-muted">No courses found on the platform.</td></tr>
                        )}
                    </tbody>
                </Table>
            </div>
        </DashboardLayout>
    );
};

export default ManageCoursesAdminPage;
