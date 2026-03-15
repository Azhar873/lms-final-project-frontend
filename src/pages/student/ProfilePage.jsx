import { Container, Card, Badge, Row, Col } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { FaUserCircle, FaEnvelope, FaUserTag, FaIdBadge, FaCalendarAlt, FaShieldAlt } from 'react-icons/fa';
import DashboardLayout from '../../components/DashboardLayout';

const ProfilePage = () => {
    const { user } = useAuth();

    return (
        <DashboardLayout>
            <div className="mb-5">
                <h2 className="fw-bold mb-1">My Profile</h2>
                <p className="text-muted mb-0">Manage your personal information and account settings.</p>
            </div>

            <Row className="justify-content-center">
                <Col lg={11} xl={10}>
                    <Card className="border-0 shadow-sm rounded-4 overflow-hidden bg-white">
                        <div 
                            className="profile-cover position-relative" 
                            style={{ 
                                height: '160px', 
                                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' 
                            }}
                        >
                            <div className="position-absolute w-100 h-100 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 0)', backgroundSize: '20px 20px' }} />
                        </div>
                        <Card.Body className="p-4 p-md-5 pt-0 text-center position-relative">
                            <div 
                                className="mx-auto mb-4 bg-white shadow rounded-4 d-flex align-items-center justify-content-center text-primary fw-bold"
                                style={{ 
                                    width: '120px', 
                                    height: '120px', 
                                    marginTop: '-60px', 
                                    fontSize: '3rem',
                                    border: '5px solid #fff'
                                }}
                            >
                                {user?.name?.[0]?.toUpperCase()}
                            </div>

                            <h3 className="fw-bold mb-1">{user?.name}</h3>
                            <Badge pill bg="primary" className="bg-opacity-10 text-primary px-3 py-2 text-uppercase mb-4" style={{ letterSpacing: 1, fontSize: 10 }}>
                                {user?.role} Account
                            </Badge>

                            <Row className="g-4 mt-2 text-start">
                                <Col md={6} lg={3}>
                                    <div className="p-4 bg-light bg-opacity-50 rounded-4 border border-light h-100 transition-all hover-shadow-sm">
                                        <div className="d-flex align-items-center gap-2 mb-2 text-primary small fw-bold text-uppercase opacity-75">
                                            <FaEnvelope size={14} /> Email
                                        </div>
                                        <div className="fw-semibold text-truncate">{user?.email}</div>
                                    </div>
                                </Col>
                                <Col md={6} lg={3}>
                                    <div className="p-4 bg-light bg-opacity-50 rounded-4 border border-light h-100 transition-all hover-shadow-sm">
                                        <div className="d-flex align-items-center gap-2 mb-2 text-primary small fw-bold text-uppercase opacity-75">
                                            <FaIdBadge size={14} /> ID Details
                                        </div>
                                        <div className="fw-bold text-primary">{user?.idNo || 'UNASSIGNED'}</div>
                                    </div>
                                </Col>
                                <Col md={6} lg={3}>
                                    <div className="p-4 bg-light bg-opacity-50 rounded-4 border border-light h-100 transition-all hover-shadow-sm">
                                        <div className="d-flex align-items-center gap-2 mb-2 text-primary small fw-bold text-uppercase opacity-75">
                                            <FaShieldAlt size={14} /> Role
                                        </div>
                                        <div className="fw-semibold text-capitalize">{user?.role}</div>
                                    </div>
                                </Col>
                                <Col md={6} lg={3}>
                                    <div className="p-4 bg-light bg-opacity-50 rounded-4 border border-light h-100 transition-all hover-shadow-sm">
                                        <div className="d-flex align-items-center gap-2 mb-2 text-primary small fw-bold text-uppercase opacity-75">
                                            <FaCalendarAlt size={14} /> Member Since
                                        </div>
                                        <div className="fw-semibold">
                                            {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </DashboardLayout>
    );
};

export default ProfilePage;

