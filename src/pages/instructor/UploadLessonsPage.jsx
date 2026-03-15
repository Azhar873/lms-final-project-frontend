import { useState, useEffect } from 'react';
import { Form, Button, Alert, Spinner, Table, Modal, Card, InputGroup, Row, Col, Badge, ProgressBar } from 'react-bootstrap';
import { useLocation, Link } from 'react-router-dom';
import { FaVideo, FaPlus, FaCheckCircle, FaBook, FaClock, FaAlignLeft, FaPlayCircle, FaCloudUploadAlt } from 'react-icons/fa';
import DashboardLayout from '../../components/DashboardLayout';
import { getCourses, addLesson, uploadVideo } from '../../services/courseService';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const UploadLessonsPage = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [lessonForm, setLessonForm] = useState({ title: '', content: '', videoUrl: '', duration: '' });
    const [btnLoading, setBtnLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [selectedVideoInfo, setSelectedVideoInfo] = useState(null);


    const { user } = useAuth();
    const location = useLocation();


    const fetchCourses = async () => {
        try {
            const { data } = await getCourses();
            const mine = data.filter(c => c.instructor?._id === user?._id);
            setCourses(mine);

            const params = new URLSearchParams(location.search);
            const courseId = params.get('courseId');
            if (courseId) {
                const found = mine.find(c => c._id === courseId);
                if (found) setSelectedCourse(found);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleAddLesson = async (e) => {
        e.preventDefault();
        setBtnLoading(true);
        try {
            const { data } = await addLesson(selectedCourse._id, lessonForm);
            setSelectedCourse(data);
            setLessonForm({ title: '', content: '', videoUrl: '', duration: '' });
            setShowModal(false);
            fetchCourses();
            toast.success('Lesson added successfully!');
        } catch (err) {
            toast.error('Failed to add lesson');
        } finally {
            setBtnLoading(false);
        }
    };

    const handleVideoSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
        setSelectedVideoInfo({
            file,
            sizeMB: parseFloat(sizeMB),
            isTooLarge: sizeMB > 100
        });
    };

    const handleVideoUpload = async () => {
        const file = selectedVideoInfo?.file;
        if (!file) return;

        const formData = new FormData();
        formData.append('video', file);

        setUploading(true);
        setUploadProgress(0);

        try {
            const { data } = await uploadVideo(formData, (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setUploadProgress(percentCompleted);
            });

            setLessonForm({ ...lessonForm, videoUrl: data.videoUrl });
            setSelectedVideoInfo(null);
            toast.success('Video uploaded successfully!');
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Failed to upload video');
        } finally {
            setUploading(false);
        }
    };



    return (
        <DashboardLayout>
            <div className="dash-header mb-5">
                <h2 className="dash-title font-weight-bold">Upload Lessons</h2>
                <p className="text-muted">Manage curriculum for your courses and add new learning materials.</p>
            </div>

            <Row className="g-4">
                <Col lg={5}>
                    <Card className="border-0 shadow-sm rounded-4xl overflow-hidden mb-4">
                        <Card.Header className="bg-light-soft border-0 p-4">
                            <h5 className="mb-0 font-weight-bold d-flex align-items-center gap-2">
                                <FaBook className="text-primary" /> Select Course
                            </h5>
                        </Card.Header>
                        <Card.Body className="p-0">
                            {loading ? (
                                <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
                            ) : (
                                <div className="course-selection-list">
                                    {courses.map(c => (
                                        <div
                                            key={c._id}
                                            onClick={() => setSelectedCourse(c)}
                                            className={`p-4 border-bottom transition-all cursor-pointer ${selectedCourse?._id === c._id ? 'bg-primary bg-opacity-5 border-start border-primary border-width-4' : 'hover-bg-light'}`}
                                        >
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div className="font-weight-bold mb-1">{c.title}</div>
                                                <Badge pill bg="light" className="text-dark border">{c.lessons?.length || 0} Lessons</Badge>
                                            </div>
                                            <div className="small text-muted">{c.category}</div>
                                        </div>
                                    ))}
                                    {courses.length === 0 && <div className="p-5 text-center text-muted">No courses found.</div>}
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={7}>
                    {selectedCourse ? (
                        <div className="animate-fade-in-up">
                            <Card className="border-0 shadow-sm rounded-4xl overflow-hidden mb-4">
                                <Card.Header className="bg-white border-0 p-4 d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0 font-weight-bold">Curriculum: {selectedCourse.title}</h5>
                                    <Button variant="primary" size="sm" className="rounded-pill px-3 shadow-primary" onClick={() => setShowModal(true)}>
                                        <FaPlus className="me-2" /> Add Lesson
                                    </Button>
                                </Card.Header>
                                <Card.Body className="p-4">
                                    {selectedCourse.lessons?.length === 0 ? (
                                        <div className="text-center py-5 text-muted">
                                            <FaVideo size={48} className="opacity-20 mb-3" />
                                            <p>No lessons yet. Click "Add Lesson" to start building your course.</p>
                                        </div>
                                    ) : (
                                        <div className="lesson-timeline">
                                            {selectedCourse.lessons.map((l, i) => (
                                                <div key={i} className="d-flex gap-3 mb-4 last-mb-0 align-items-center">
                                                    <div className="flex-shrink-0">
                                                        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center timeline-step">
                                                            {i + 1}
                                                        </div>
                                                    </div>
                                                    <div className="flex-grow-1 p-3 bg-light-soft rounded-3xl border border-light">
                                                        <div className="d-flex justify-content-between mb-2">
                                                            <div className="font-weight-bold">{l.title}</div>
                                                            <div className="small text-muted d-flex align-items-center gap-1"><FaClock size={12} /> {l.duration}</div>
                                                        </div>
                                                        <div className="small text-muted opacity-75 text-truncate mb-0 max-w-400">{l.content}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>
                        </div>
                    ) : (
                        <div className="text-center py-10 opacity-50 d-none d-lg-block">
                            <FaPlayCircle size={80} className="mb-4 text-muted" />
                            <h4>Select a course on the left to manage curriculum</h4>
                        </div>
                    )}
                </Col>
            </Row>

            <Modal show={showModal} onHide={() => { if (!uploading) { setShowModal(false); setSelectedVideoInfo(null); } }} centered className="premium-modal">
                <Modal.Header closeButton className="border-0 p-4"><Modal.Title className="font-weight-bold">Add New Lesson</Modal.Title></Modal.Header>
                <Modal.Body className="p-4 pt-0">
                    <Form onSubmit={handleAddLesson} className="premium-form">
                        <Form.Group className="mb-3">
                            <Form.Label className="small font-weight-bold text-muted">Lesson Title</Form.Label>
                            <InputGroup className="premium-input-group">
                                <InputGroup.Text><FaAlignLeft /></InputGroup.Text>
                                <Form.Control
                                    required
                                    placeholder="e.g. Introduction to React"
                                    value={lessonForm.title}
                                    onChange={e => setLessonForm({ ...lessonForm, title: e.target.value })}
                                />
                            </InputGroup>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="small font-weight-bold text-muted">Duration (e.g. 15 mins)</Form.Label>
                            <InputGroup className="premium-input-group">
                                <InputGroup.Text><FaClock /></InputGroup.Text>
                                <Form.Control
                                    value={lessonForm.duration}
                                    placeholder="How long is this lesson?"
                                    onChange={e => setLessonForm({ ...lessonForm, duration: e.target.value })}
                                />
                            </InputGroup>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="small font-weight-bold text-muted">Video Source</Form.Label>
                            <div className="d-flex flex-column gap-3">
                                <InputGroup className="premium-input-group">
                                    <InputGroup.Text><FaVideo /></InputGroup.Text>
                                    <Form.Control
                                        placeholder="YouTube/Vimeo link or uploaded path"
                                        value={lessonForm.videoUrl}
                                        onChange={e => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
                                    />
                                </InputGroup>

                                <div className={`upload-container p-3 rounded-4xl border border-dashed border-2 text-center transition-all ${selectedVideoInfo?.isTooLarge ? 'border-danger bg-danger bg-opacity-5' : 'border-primary border-opacity-25 bg-light'}`}>
                                    <input
                                        type="file"
                                        accept="video/*"
                                        onChange={handleVideoSelect}
                                        id="video-upload"
                                        className="d-none"
                                        disabled={uploading}
                                    />

                                    {!selectedVideoInfo ? (
                                        <label htmlFor="video-upload" className="mb-0 cursor-pointer d-block py-2">
                                            <FaCloudUploadAlt className="text-primary mb-2" size={32} />
                                            <div className="small font-weight-bold">Upload from Computer</div>
                                            <div className="extra-small text-muted">MP4, MKV, WEBM (Max 100MB for Cloudinary)</div>
                                        </label>
                                    ) : (
                                        <div className="py-2">
                                            <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                                                <FaVideo className={selectedVideoInfo.isTooLarge ? 'text-danger' : 'text-success'} />
                                                <span className="small font-weight-bold text-truncate" style={{ maxWidth: '200px' }}>{selectedVideoInfo.file.name}</span>
                                                <Badge bg={selectedVideoInfo.isTooLarge ? 'danger' : 'success'} className="rounded-pill">
                                                    {selectedVideoInfo.sizeMB} MB
                                                </Badge>
                                            </div>

                                            {selectedVideoInfo.isTooLarge && (
                                                <div className="alert-mini rounded-3xl p-2 mb-3 bg-danger bg-opacity-10 border border-danger border-opacity-20 text-danger extra-small">
                                                    <b>Size Warning:</b> Video exceeds 100MB limit. Cloudinary may have issues with very large files.
                                                </div>
                                            )}

                                            <div className="d-flex flex-column gap-2 justify-content-center">
                                                <div className="d-flex gap-2 justify-content-center">
                                                    <Button
                                                        variant={selectedVideoInfo.isTooLarge ? "outline-danger" : "primary"}
                                                        size="sm"
                                                        className="rounded-pill px-4"
                                                        onClick={handleVideoUpload}
                                                        disabled={uploading}
                                                    >
                                                        {uploading ? <Spinner animation="border" size="sm" /> : 'Start Upload'}
                                                    </Button>

                                                    <Button
                                                        variant="link"
                                                        size="sm"
                                                        className="text-muted text-decoration-none"
                                                        onClick={() => setSelectedVideoInfo(null)}
                                                        disabled={uploading}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {uploading && (
                                        <div className="mt-3 px-3">
                                            <div className="extra-small text-primary mb-1 font-weight-bold d-flex justify-content-between">
                                                <span>Uploading to Cloudinary...</span>
                                                <span>{uploadProgress}%</span>
                                            </div>
                                            <ProgressBar
                                                variant="primary"
                                                now={uploadProgress}
                                                className="rounded-pill bg-white shadow-sm"
                                                style={{ height: '8px' }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label className="small font-weight-bold text-muted">Content / Lesson Notes</Form.Label>
                            <Form.Control
                                as="textarea" rows={3}
                                className="rounded-3xl border-light p-3"
                                placeholder="Key takeaways from this lesson..."
                                value={lessonForm.content}
                                onChange={e => setLessonForm({ ...lessonForm, content: e.target.value })}
                            />
                        </Form.Group>
                        <Button type="submit" variant="primary" size="lg" className="w-100 rounded-pill py-3 font-weight-bold shadow-primary" disabled={btnLoading || uploading}>
                            {btnLoading ? <Spinner animation="border" size="sm" /> : <><FaCheckCircle className="me-2" /> Save Lesson</>}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </DashboardLayout>
    );
};

export default UploadLessonsPage;
