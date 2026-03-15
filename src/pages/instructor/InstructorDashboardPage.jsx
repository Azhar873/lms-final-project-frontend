import { useState, useEffect } from 'react';
import { Row, Col, Card, Spinner, Alert, Table, Badge } from 'react-bootstrap';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend,
} from 'recharts';
import {
    FaBook, FaUserGraduate, FaClock, FaTrophy,
    FaChartBar, FaChartPie, FaHistory, FaArrowUp,
} from 'react-icons/fa';
import DashboardLayout from '../../components/DashboardLayout';
import { getInstructorAnalytics } from '../../services/enrollmentService';
import { useAuth } from '../../context/AuthContext';

// ── colour palette ────────────────────────────────────────────────────────────
const PIE_COLORS = ['#6366f1', '#f59e0b', '#ef4444'];

// ── tiny helpers ──────────────────────────────────────────────────────────────
const statusColor = (s) => ({ approved: 'success', pending: 'warning', rejected: 'danger' }[s] || 'secondary');

const CustomBarTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{ background: '#1e1b4b', borderRadius: 12, padding: '10px 16px', color: '#fff', fontSize: 13 }}>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>{label}</div>
            <div style={{ color: '#a5b4fc' }}>{payload[0].value} enrollments</div>
        </div>
    );
};

const CustomPieTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{ background: '#1e1b4b', borderRadius: 12, padding: '8px 14px', color: '#fff', fontSize: 13 }}>
            <strong>{payload[0].name}</strong>: {payload[0].value}
        </div>
    );
};

// ── stat card ─────────────────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, gradient, sub }) => (
    <Card className="border-0 shadow-sm rounded-4 h-100 overflow-hidden position-relative">
        <div style={{ background: gradient, position: 'absolute', inset: 0, opacity: 0.08 }} />
        <Card.Body className="p-4 position-relative">
            <div className="d-flex align-items-center justify-content-between mb-3">
                <div
                    className="rounded-3 d-flex align-items-center justify-content-center"
                    style={{ width: 46, height: 46, background: gradient, color: '#fff', fontSize: 18 }}
                >
                    {icon}
                </div>
                <span className="small text-muted d-flex align-items-center gap-1">
                    <FaArrowUp size={10} className="text-success" /> Live
                </span>
            </div>
            <h2 className="fw-bold mb-0" style={{ fontSize: '2rem', lineHeight: 1 }}>{value ?? '—'}</h2>
            <p className="text-muted small mb-0 mt-1 fw-semibold text-uppercase" style={{ letterSpacing: '.05em', fontSize: 11 }}>{label}</p>
            {sub && <p className="text-muted mt-1 mb-0" style={{ fontSize: 12 }}>{sub}</p>}
        </Card.Body>
    </Card>
);

// ── main page ─────────────────────────────────────────────────────────────────
const InstructorDashboardPage = () => {
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        (async () => {
            try {
                const { data: res } = await getInstructorAnalytics();
                setData(res);
            } catch {
                setError('Failed to load analytics. Please try again.');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) return (
        <DashboardLayout>
            <div className="d-flex align-items-center justify-content-center" style={{ minHeight: 400 }}>
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                    <p className="text-muted mt-3 small">Loading your analytics...</p>
                </div>
            </div>
        </DashboardLayout>
    );

    const stats = [
        {
            icon: <FaBook />,
            label: 'My Courses',
            value: data?.totalCourses,
            gradient: 'linear-gradient(135deg,#6366f1,#818cf8)',
            sub: 'Total published courses',
        },
        {
            icon: <FaUserGraduate />,
            label: 'Total Students',
            value: data?.totalStudents,
            gradient: 'linear-gradient(135deg,#10b981,#34d399)',
            sub: 'Approved enrollments',
        },
        {
            icon: <FaClock />,
            label: 'Pending Requests',
            value: data?.pendingRequests,
            gradient: 'linear-gradient(135deg,#f59e0b,#fbbf24)',
            sub: 'Awaiting your approval',
        },
        {
            icon: <FaTrophy />,
            label: 'Completions',
            value: data?.completedEnrollments,
            gradient: 'linear-gradient(135deg,#ef4444,#f87171)',
            sub: 'Students who finished',
        },
    ];

    const pieData = [
        { name: 'Approved', value: data?.approvedCount || 0 },
        { name: 'Pending', value: data?.pendingRequests || 0 },
        { name: 'Rejected', value: data?.rejectedCount || 0 },
    ].filter(d => d.value > 0);

    return (
        <DashboardLayout>
            {/* ── Header ── */}
            <div className="mb-5">
                <h2 className="fw-bold mb-1" style={{ fontSize: '1.6rem' }}>
                    Welcome back, {user?.name?.split(' ')[0]} 👋
                </h2>
                <p className="text-muted mb-0">Here's what's happening across your courses today.</p>
            </div>

            {error && <Alert variant="danger" className="rounded-3">{error}</Alert>}

            {data && (
                <>
                    {/* ── Stat Cards ── */}
                    <Row className="g-4 mb-5">
                        {stats.map(s => (
                            <Col key={s.label} xs={12} sm={6} xl={3}>
                                <StatCard {...s} />
                            </Col>
                        ))}
                    </Row>

                    {/* ── Charts Row ── */}
                    <Row className="g-4 mb-5">
                        {/* Bar Chart */}
                        <Col xs={12} lg={7}>
                            <Card className="border-0 shadow-sm rounded-4 h-100">
                                <Card.Body className="p-4">
                                    <div className="d-flex align-items-center gap-2 mb-4">
                                        <div
                                            className="rounded-3 d-flex align-items-center justify-content-center"
                                            style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#6366f1,#818cf8)', color: '#fff', fontSize: 15 }}
                                        >
                                            <FaChartBar />
                                        </div>
                                        <div>
                                            <h6 className="fw-bold mb-0">Monthly Enrollments</h6>
                                            <p className="text-muted mb-0" style={{ fontSize: 12 }}>Last 6 months</p>
                                        </div>
                                    </div>
                                    <ResponsiveContainer width="100%" height={240}>
                                        <BarChart data={data.monthlyEnrollments} barSize={32} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                            <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                            <Tooltip content={<CustomBarTooltip />} cursor={{ fill: '#f8faff', radius: 8 }} />
                                            <Bar
                                                dataKey="enrollments"
                                                radius={[8, 8, 0, 0]}
                                                fill="url(#barGrad)"
                                            />
                                            <defs>
                                                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#6366f1" />
                                                    <stop offset="100%" stopColor="#818cf8" stopOpacity={0.6} />
                                                </linearGradient>
                                            </defs>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Pie Chart */}
                        <Col xs={12} lg={5}>
                            <Card className="border-0 shadow-sm rounded-4 h-100">
                                <Card.Body className="p-4">
                                    <div className="d-flex align-items-center gap-2 mb-4">
                                        <div
                                            className="rounded-3 d-flex align-items-center justify-content-center"
                                            style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#10b981,#34d399)', color: '#fff', fontSize: 15 }}
                                        >
                                            <FaChartPie />
                                        </div>
                                        <div>
                                            <h6 className="fw-bold mb-0">Enrollment Status</h6>
                                            <p className="text-muted mb-0" style={{ fontSize: 12 }}>Approved / Pending / Rejected</p>
                                        </div>
                                    </div>
                                    {pieData.length === 0 ? (
                                        <div className="d-flex align-items-center justify-content-center h-75 text-muted small">
                                            No enrollment data yet.
                                        </div>
                                    ) : (
                                        <ResponsiveContainer width="100%" height={240}>
                                            <PieChart>
                                                <Pie
                                                    data={pieData}
                                                    cx="50%"
                                                    cy="45%"
                                                    innerRadius={60}
                                                    outerRadius={95}
                                                    paddingAngle={3}
                                                    dataKey="value"
                                                >
                                                    {pieData.map((_, i) => (
                                                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip content={<CustomPieTooltip />} />
                                                <Legend
                                                    iconType="circle"
                                                    iconSize={8}
                                                    formatter={(v) => <span style={{ fontSize: 12, color: '#64748b' }}>{v}</span>}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    {/* ── Recent Activity ── */}
                    <Card className="border-0 shadow-sm rounded-4">
                        <Card.Body className="p-4">
                            <div className="d-flex align-items-center gap-2 mb-4">
                                <div
                                    className="rounded-3 d-flex align-items-center justify-content-center"
                                    style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#f59e0b,#fbbf24)', color: '#fff', fontSize: 15 }}
                                >
                                    <FaHistory />
                                </div>
                                <div>
                                    <h6 className="fw-bold mb-0">Recent Activity</h6>
                                    <p className="text-muted mb-0" style={{ fontSize: 12 }}>Latest 6 enrollment events</p>
                                </div>
                            </div>

                            {data.recentActivity?.length === 0 ? (
                                <p className="text-muted text-center py-4 mb-0">No activity yet. Share your courses to get started!</p>
                            ) : (
                                <div className="table-responsive">
                                    <Table hover className="mb-0 align-middle" style={{ fontSize: 13 }}>
                                        <thead style={{ background: '#f8fafc' }}>
                                            <tr>
                                                <th className="px-3 py-3 fw-semibold text-muted text-uppercase" style={{ fontSize: 11, letterSpacing: '.05em' }}>Student</th>
                                                <th className="py-3 fw-semibold text-muted text-uppercase" style={{ fontSize: 11, letterSpacing: '.05em' }}>Course</th>
                                                <th className="py-3 fw-semibold text-muted text-uppercase" style={{ fontSize: 11, letterSpacing: '.05em' }}>Status</th>
                                                <th className="py-3 text-end px-3 fw-semibold text-muted text-uppercase" style={{ fontSize: 11, letterSpacing: '.05em' }}>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.recentActivity.map(a => (
                                                <tr key={a._id}>
                                                    <td className="px-3 py-3">
                                                        <div className="d-flex align-items-center gap-2">
                                                            <div
                                                                className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white"
                                                                style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#6366f1,#818cf8)', fontSize: 13, flexShrink: 0 }}
                                                            >
                                                                {a.studentName[0]?.toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <div className="fw-semibold" style={{ lineHeight: 1.2 }}>{a.studentName}</div>
                                                                <div className="text-muted" style={{ fontSize: 11 }}>{a.studentEmail}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="text-muted">{a.courseTitle}</td>
                                                    <td>
                                                        <Badge
                                                            bg={statusColor(a.status)}
                                                            className="text-capitalize px-2 py-1 rounded-pill"
                                                            style={{ fontSize: 11 }}
                                                        >
                                                            {a.status}
                                                        </Badge>
                                                    </td>
                                                    <td className="text-end px-3 text-muted">
                                                        {new Date(a.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </>
            )}
        </DashboardLayout>
    );
};

export default InstructorDashboardPage;
