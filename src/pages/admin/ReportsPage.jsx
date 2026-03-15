import { useState, useEffect } from 'react';
import { Row, Col, Card, Spinner, Alert, Table, Badge } from 'react-bootstrap';
import {
    FaUsers, FaUserGraduate, FaUserTie, FaBook, FaShoppingCart,
    FaEnvelope, FaChartLine, FaChartPie, FaHistory
} from 'react-icons/fa';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import DashboardLayout from '../../components/DashboardLayout';
import { getAnalytics } from '../../services/userService';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const ReportsPage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetch = async () => {
            try {
                const { data } = await getAnalytics();
                setData(data);
            } catch {
                setError('Failed to fetch analytics');
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    if (loading) return (
        <DashboardLayout>
            <div className="d-flex align-items-center justify-content-center" style={{ minHeight: 400 }}>
                <Spinner animation="border" variant="primary" />
            </div>
        </DashboardLayout>
    );

    const stats = [
        { label: 'Total Users', value: data?.totalUsers, icon: <FaUsers />, color: '#6366f1' },
        { label: 'Students', value: data?.totalStudents, icon: <FaUserGraduate />, color: '#10b981' },
        { label: 'Instructors', value: data?.totalInstructors, icon: <FaUserTie />, color: '#f59e0b' },
        { label: 'Courses', value: data?.totalCourses, icon: <FaBook />, color: '#0ea5e9' },
        { label: 'Enrollments', value: data?.totalEnrollments, icon: <FaShoppingCart />, color: '#f43f5e' },
    ];

    return (
        <DashboardLayout>
            <div className="mb-5">
                <h2 className="fw-bold mb-1">Platform Analytics</h2>
                <p className="text-muted mb-0">Overview of users, course distribution, and growth trends.</p>
            </div>

            {error && <Alert variant="danger" className="rounded-3">{error}</Alert>}

            {data && (
                <>
                    {/* Stat Cards */}
                    <Row className="g-4 mb-5">
                        {stats.map((s) => (
                            <Col key={s.label} xs={6} md={4} lg={2.4}>
                                <Card className="border-0 shadow-sm rounded-4 h-100 overflow-hidden position-relative">
                                    <div style={{ background: s.color, position: 'absolute', inset: 0, opacity: 0.05 }} />
                                    <Card.Body className="p-4 position-relative">
                                        <div 
                                            className="rounded-3 d-flex align-items-center justify-content-center mb-3"
                                            style={{ width: 44, height: 44, background: s.color, color: '#fff' }}
                                        >
                                            {s.icon}
                                        </div>
                                        <h3 className="fw-bold mb-0">{s.value}</h3>
                                        <p className="text-muted small fw-bold text-uppercase mb-0 mt-1" style={{ fontSize: 11 }}>{s.label}</p>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    {/* Charts Row */}
                    <Row className="g-4 mb-5">
                        {/* User Growth Line Chart */}
                        <Col xs={12} lg={7}>
                            <Card className="border-0 shadow-sm rounded-4 h-100">
                                <Card.Body className="p-4">
                                    <div className="d-flex align-items-center gap-2 mb-4">
                                        <div className="p-2 bg-primary bg-opacity-10 text-primary rounded-3">
                                            <FaChartLine />
                                        </div>
                                        <div>
                                            <h6 className="fw-bold mb-0">User Growth</h6>
                                            <p className="text-muted mb-0 small">Last 6 months trend</p>
                                        </div>
                                    </div>
                                    <ResponsiveContainer width="100%" height={260}>
                                        <LineChart data={data.userGrowth}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                                            <Tooltip 
                                                contentStyle={{ background: '#1e1b4b', border: 'none', borderRadius: 12, color: '#fff' }}
                                                itemStyle={{ color: '#fff' }}
                                            />
                                            <Line 
                                                type="monotone" 
                                                dataKey="users" 
                                                stroke="#6366f1" 
                                                strokeWidth={3} 
                                                dot={{ r: 4, fill: '#6366f1' }}
                                                activeDot={{ r: 6 }} 
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Category Distribution Pie Chart */}
                        <Col xs={12} lg={5}>
                            <Card className="border-0 shadow-sm rounded-4 h-100">
                                <Card.Body className="p-4">
                                    <div className="d-flex align-items-center gap-2 mb-4">
                                        <div className="p-2 bg-success bg-opacity-10 text-success rounded-3">
                                            <FaChartPie />
                                        </div>
                                        <div>
                                            <h6 className="fw-bold mb-0">Course Distribution</h6>
                                            <p className="text-muted mb-0 small">By Category</p>
                                        </div>
                                    </div>
                                    <ResponsiveContainer width="100%" height={260}>
                                        <PieChart>
                                            <Pie
                                                data={data.courseDistribution}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={85}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {data.courseDistribution.map((_, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    {/* Recent Users Table */}
                    <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                        <Card.Body className="p-4">
                            <div className="d-flex align-items-center gap-2 mb-4">
                                <div className="p-2 bg-warning bg-opacity-10 text-warning rounded-3">
                                    <FaHistory />
                                </div>
                                <div>
                                    <h6 className="fw-bold mb-0">Recent Registrations</h6>
                                    <p className="text-muted mb-0 small">Latest 5 platform users</p>
                                </div>
                            </div>
                            <div className="table-responsive">
                                <Table hover className="align-middle mb-0">
                                    <thead className="bg-light">
                                        <tr>
                                            <th className="px-4 py-3 text-muted small fw-bold text-uppercase" style={{ letterSpacing: 1 }}>User</th>
                                            <th className="py-3 text-muted small fw-bold text-uppercase" style={{ letterSpacing: 1 }}>Email</th>
                                            <th className="py-3 text-muted small fw-bold text-uppercase" style={{ letterSpacing: 1 }}>Role</th>
                                            <th className="py-3 text-end px-4 text-muted small fw-bold text-uppercase" style={{ letterSpacing: 1 }}>Joined</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.recentUsers?.map(u => (
                                            <tr key={u._id}>
                                                <td className="px-4 py-3">
                                                    <div className="d-flex align-items-center gap-3">
                                                        <div 
                                                            className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                                                            style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', fontSize: 12 }}
                                                        >
                                                            {u.name[0].toUpperCase()}
                                                        </div>
                                                        <span className="fw-semibold">{u.name}</span>
                                                    </div>
                                                </td>
                                                <td className="text-muted small"><FaEnvelope size={12} className="me-2 opacity-50" /> {u.email}</td>
                                                <td>
                                                    <Badge pill bg={u.role === 'admin' ? 'danger' : u.role === 'instructor' ? 'warning' : 'success'} className="px-3 py-1 text-capitalize fw-normal">
                                                        {u.role}
                                                    </Badge>
                                                </td>
                                                <td className="text-end px-4 text-muted small">{new Date(u.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </Card.Body>
                    </Card>
                </>
            )}
        </DashboardLayout>
    );
};

export default ReportsPage;

