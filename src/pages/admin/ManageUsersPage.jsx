import { useState, useEffect } from 'react';
import { Table, Button, Spinner, Alert, Badge, Card } from 'react-bootstrap';
import { FaTrash, FaUserShield, FaUserGraduate, FaUserTie, FaEnvelope } from 'react-icons/fa';
import DashboardLayout from '../../components/DashboardLayout';
import { getAllUsers, deleteUser } from '../../services/userService';

const ManageUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data } = await getAllUsers();
            setUsers(data);
        } catch {
            setError('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user? This cannot be undone.')) {
            try {
                await deleteUser(id);
                setUsers(users.filter(u => u._id !== id));
            } catch {
                alert('Failed to delete user');
            }
        }
    };

    const getRoleIcon = (role) => {
        if (role === 'admin') return <FaUserShield className="text-danger" />;
        if (role === 'instructor') return <FaUserTie className="text-warning" />;
        return <FaUserGraduate className="text-success" />;
    };

    if (loading) return (
        <DashboardLayout>
            <div className="d-flex align-items-center justify-content-center" style={{ minHeight: 400 }}>
                <Spinner animation="border" variant="primary" />
            </div>
        </DashboardLayout>
    );

    return (
        <DashboardLayout>
            <div className="mb-5">
                <h2 className="fw-bold mb-1">Platform Users</h2>
                <p className="text-muted mb-0">Manage all registered students, instructors and administrators.</p>
            </div>

            {error && <Alert variant="danger" className="rounded-3">{error}</Alert>}

            <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="table-responsive">
                    <Table hover className="align-middle mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th className="px-4 py-3 text-muted small fw-bold text-uppercase" style={{ letterSpacing: 1 }}>User</th>
                                <th className="py-3 text-muted small fw-bold text-uppercase" style={{ letterSpacing: 1 }}>Email</th>
                                <th className="py-3 text-muted small fw-bold text-uppercase" style={{ letterSpacing: 1 }}>Role</th>
                                <th className="py-3 text-muted small fw-bold text-uppercase" style={{ letterSpacing: 1 }}>Joined</th>
                                <th className="py-3 text-end px-4 text-muted small fw-bold text-uppercase" style={{ letterSpacing: 1 }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u._id}>
                                    <td className="px-4 py-3">
                                        <div className="d-flex align-items-center gap-3">
                                            <div 
                                                className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                                                style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', fontSize: 13 }}
                                            >
                                                {u.name[0].toUpperCase()}
                                            </div>
                                            <span className="fw-bold">{u.name}</span>
                                        </div>
                                    </td>
                                    <td className="text-muted small"><FaEnvelope size={12} className="me-2 opacity-50" /> {u.email}</td>
                                    <td>
                                        <div className="d-flex align-items-center gap-2">
                                            {getRoleIcon(u.role)}
                                            <span className="text-capitalize small fw-semibold text-muted">{u.role}</span>
                                        </div>
                                    </td>
                                    <td className="text-muted small">{new Date(u.createdAt).toLocaleDateString()}</td>
                                    <td className="text-end px-4">
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            className="rounded-circle p-2 border-0 shadow-sm hover-lift"
                                            onClick={() => handleDelete(u._id)}
                                            disabled={u.role === 'admin'}
                                        >
                                            <FaTrash size={14} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </Card>
        </DashboardLayout>
    );
};

export default ManageUsersPage;

