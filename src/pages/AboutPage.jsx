import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { FaGraduationCap, FaRocket, FaHandshake, FaGlobe, FaUserTie, FaUsersCog, FaCode, FaPaintBrush, FaUsers, FaChild } from 'react-icons/fa';
import { HiLightningBolt } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const AboutPage = () => {
    const team = [
        { name: 'Dr. Sarah Johnson', role: 'Founder & CEO', icon: <FaUserTie size={24} /> },
        { name: 'Prof. Ahmed Khan', role: 'Head of Curriculum', icon: <FaUsersCog size={24} /> },
        { name: 'Fatima Malik', role: 'Lead Developer', icon: <FaCode size={24} /> },
        { name: 'Carlos Rivera', role: 'UX Designer', icon: <FaPaintBrush size={24} /> },
    ];

    const values = [
        { icon: <HiLightningBolt size={32} className="text-warning" />, title: 'Passion', desc: 'We are passionate about education and its transformative power to change lives globally.' },
        { icon: <FaHandshake size={32} className="text-primary-custom" />, title: 'Integrity', desc: 'Transparency and trust are the cornerstones of our growing ecosystem of lifelong learners.' },
        { icon: <FaGlobe size={32} className="text-secondary" />, title: 'Inclusion', desc: 'We believe knowledge should be accessible to everyone, everywhere, without boundaries.' },
        { icon: <FaRocket size={32} className="text-success" />, title: 'Innovation', desc: 'We constantly push boundaries to refine the future of online education through tech.' },
    ];

    const stats = [
        { value: '2015', label: 'Founded' },
        { value: '50+', label: 'Countries' },
        { value: '200+', label: 'Experts' },
        { value: '1M+', label: 'Alumni' },
    ];

    return (
        <div className="about-page pb-10 overflow-hidden">

            {/* Redesigned Premium Hero Section */}
            <section className="listing-hero bg-gradient-premium py-10 mb-5 position-relative z-index-10">
                <div className="cta-mesh-gradient"></div>
                <Container className="position-relative pt-5 mt-5 pb-5 text-center">
                    <Row className="justify-content-center">
                        <Col lg={8} className="animate-fade-in-up">
                            <Badge bg="white" text="primary" className="mb-4 px-4 py-2 rounded-pill letter-spacing-1 text-uppercase shadow-sm fw-bold">
                                <FaChild className="me-2" /> Our Story
                            </Badge>
                            <h1 className="display-3 font-weight-extra-bold text-white mb-4 letter-spacing-tight">
                                Small Steps, <span className="text-primary-custom">Giant Leaps.</span>
                            </h1>
                            <p className="text-light opacity-75 lead mb-5 max-w-700 mx-auto fs-4">
                                LearnHub is dedicated to bridging the gap between traditional learning and modern industry demands through world-class online courses.
                            </p>
                            <div className="d-flex justify-content-center gap-3">
                                <Link to="/courses" className="btn btn-primary rounded-pill px-5 py-3 fw-bold shadow-lg border-0 bg-primary-custom">
                                    Explore Courses
                                </Link>
                                <Link to="/register" className="btn btn-outline-light rounded-pill px-5 py-3 fw-bold border-2">
                                    Join Our Community
                                </Link>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Stats Bar (Floating over hero) */}
            <section className="stats-bar-section position-relative z-index-20 stats-bar-margin mb-10">
                <Container>
                    <div className="bg-white p-5 shadow rounded-4xl shadow-premium border border-light mx-auto max-w-1000 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <Row className="text-center g-4">
                            {stats.map((s, idx) => (
                                <Col key={idx} xs={6} md={3}>
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

            {/* Modernized Mission Section */}
            <section className="about-mission py-10">
                <Container>
                    <Row className="align-items-center g-5">
                        <Col lg={6} className="position-relative">
                            <div className="cta-gradient-box p-5 rounded-4xl text-white shadow-premium-lg overflow-hidden h-100 d-flex align-items-center justify-content-center" style={{ minHeight: '500px' }}>
                                <div className="cta-mesh-gradient"></div>
                                <FaGraduationCap size={200} className="text-white opacity-25 position-absolute" style={{ right: '-10%', bottom: '-10%' }} />

                                <div className="position-relative z-index-10 text-center">
                                    <div className="bg-white bg-opacity-20 p-4 rounded-circle d-inline-block mb-4 backdrop-blur shadow-lg">
                                        <FaGlobe size={60} className="text-primary-custom" />
                                    </div>
                                    <h3 className="fw-bold mb-0">Democratizing Education</h3>
                                </div>

                                {/* Floating indicators mimicking HomePage */}
                                <div className="floating-card p-3 rounded-3xl backdrop-blur border border-white border-opacity-10 position-absolute bg-white bg-opacity-10 shadow-lg animate-float floating-card-top-right">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="bg-success rounded-circle shadow-sm indicator-dot"></div>
                                        <div>
                                            <div className="small font-weight-bold">Global Reach</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col lg={6}>
                            <Badge bg="primary" className="bg-opacity-10 text-primary-custom mb-3 px-3 py-2 rounded-pill letter-spacing-1 text-uppercase fw-bold">
                                Our Mission
                            </Badge>
                            <h2 className="display-4 font-weight-bold mb-4">Empowering 1 Billion Learners Through Technology</h2>
                            <p className="text-muted leading-relaxed mb-4 fs-5">
                                LearnHub was founded with a singular mission: to democratize high-quality education.
                                We believe that the best teachers shouldn't be confined to elite institutions,
                                and ambitious students shouldn't be limited by geographic or financial barriers.
                            </p>
                            <div className="mission-checklist mt-5">
                                {[
                                    'Access to 200+ industry experts',
                                    'Flexible learning schedules tailored to you',
                                    'Practical, project-based curriculum design',
                                    'Global active community of 10,000+ students'
                                ].map((item, id) => (
                                    <div key={id} className="d-flex align-items-center gap-3 mb-3 p-3 bg-light-soft rounded-3xl transition-all hover-border-primary border border-transparent">
                                        <div className="bg-primary-soft p-2 rounded-circle text-primary-custom d-flex align-items-center justify-content-center">
                                            <HiLightningBolt />
                                        </div>
                                        <span className="font-weight-medium fw-semibold text-dark">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Core Values Section using feature cards */}
            <section className="values-modern-section py-10 bg-light-bg mt-5">
                <Container>
                    <div className="section-header text-center mb-10 max-w-700 mx-auto">
                        <span className="badge bg-primary bg-opacity-10 text-primary-custom rounded-pill px-3 py-2 mb-3 small font-weight-bold uppercase">The LearnHub Way</span>
                        <h2 className="display-5 font-weight-bold">Our Core <span className="text-primary-custom">Values</span></h2>
                        <p className="text-muted fs-5">The principles that guide our growth and community every single day.</p>
                    </div>

                    <Row className="g-5">
                        {values.map((v, idx) => (
                            <Col key={idx} md={6} lg={3}>
                                <Card className="feature-modern-card border-0 text-center h-100 p-5 rounded-4xl transition-all hover-lift bg-white shadow-sm border border-transparent hover-border-primary">
                                    <div className="feature-icon-wrapper mx-auto mb-4 bg-primary-soft rounded-3xl d-flex align-items-center justify-content-center feature-icon-wrapper-large">
                                        {v.icon}
                                    </div>
                                    <h5 className="font-weight-bold mb-3">{v.title}</h5>
                                    <p className="text-muted small leading-relaxed">{v.desc}</p>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* Team Section */}
            <section className="team-modern-section py-10 mb-5">
                <Container>
                    <div className="text-center mb-10">
                        <Badge bg="primary" className="bg-opacity-10 text-primary-custom mb-3 px-3 py-2 rounded-pill letter-spacing-1 text-uppercase fw-bold">
                            Our Team
                        </Badge>
                        <h2 className="display-5 font-weight-bold">Meet The <span className="text-primary-custom">Leadership</span></h2>
                        <p className="text-muted fs-5 max-w-700 mx-auto">Passionate educators, elite innovators, and tech visionaries leading the way.</p>
                    </div>
                    <Row className="g-5 justify-content-center mt-3">
                        {team.map((m, i) => (
                            <Col key={i} sm={6} md={3}>
                                <div className="team-modern-card text-center group bg-white p-4 rounded-4xl shadow-sm border border-light transition-all hover-lift h-100">
                                    <div className="team-avatar-box mx-auto mb-4 bg-primary-soft shadow-sm rounded-circle d-flex align-items-center justify-content-center transition-all group-hover:bg-primary text-primary-custom" style={{ width: '80px', height: '80px' }}>
                                        {m.icon}
                                    </div>
                                    <h6 className="font-weight-bold mb-2 fs-5">{m.name}</h6>
                                    <Badge bg="light" text="dark" className="rounded-pill px-3 py-2 fw-semibold border shadow-sm">{m.role}</Badge>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

        </div>
    );
};

export default AboutPage;
