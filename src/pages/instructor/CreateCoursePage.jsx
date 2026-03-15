import { useState, useEffect } from 'react';
import { Form, Button, Alert, Spinner, Row, Col, Card, InputGroup } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { FaBook, FaLayerGroup, FaTags, FaImage, FaPlusCircle, FaCloudUploadAlt, FaSave } from 'react-icons/fa';
import DashboardLayout from '../../components/DashboardLayout';
import { createCourse, updateCourse, uploadImage, getCourseById } from '../../services/courseService';
import { toast } from 'react-toastify';

const CATEGORIES = ['Web Development', 'Mobile Development', 'Data Science', 'UI/UX Design', 'DevOps', 'Other'];

const CreateCoursePage = () => {
    const { id } = useParams();
    const isEditMode = !!id;
    
    const [form, setForm] = useState({ title: '', description: '', category: 'Web Development', thumbnail: '' });
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEditMode);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (isEditMode) {
            const fetchCourse = async () => {
                try {
                    const { data } = await getCourseById(id);
                    setForm({
                        title: data.title,
                        description: data.description,
                        category: data.category,
                        thumbnail: data.thumbnail || ''
                    });
                } catch (err) {
                    setError('Failed to load course details.');
                } finally {
                    setFetching(false);
                }
            };
            fetchCourse();
        }
    }, [id, isEditMode]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (isEditMode) {
                await updateCourse(id, form);
                toast.success('Course updated successfully!');
            } else {
                await createCourse(form);
                toast.success('Success! Course created.');
            }
            navigate('/instructor/courses');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save course.');
        } finally {
            setLoading(false);
        }
    };

    const handleThumbnailUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        setUploading(true);
        setUploadProgress(0);

        try {
            const { data } = await uploadImage(formData, (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setUploadProgress(percentCompleted);
            });

            setForm({ ...form, thumbnail: data.imageUrl });
            toast.success('Thumbnail uploaded successfully!');
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Failed to upload thumbnail');
        } finally {
            setUploading(false);
        }
    };

    if (fetching) return (
        <DashboardLayout>
            <div className="d-flex align-items-center justify-content-center" style={{ minHeight: 400 }}>
                <Spinner animation="border" variant="primary" />
            </div>
        </DashboardLayout>
    );

    return (
        <DashboardLayout>
            <div className="dash-header mb-5">
                <h2 className="dash-title font-weight-bold">{isEditMode ? 'Edit Course' : 'Create New Course'}</h2>
                <p className="text-muted">{isEditMode ? 'Update your course information below.' : 'Fill in the details below to launch your new masterpiece.'}</p>
            </div>

            {error && <Alert variant="danger" className="rounded-2xl">{error}</Alert>}

            <Card className="border-0 shadow-sm rounded-4xl p-4 p-lg-5">
                <Form onSubmit={handleSubmit} className="premium-form">
                    <Form.Group className="mb-4">
                        <Form.Label className="small font-weight-bold text-muted">Course Title</Form.Label>
                        <InputGroup className="premium-input-group">
                            <InputGroup.Text><FaBook /></InputGroup.Text>
                            <Form.Control
                                name="title"
                                placeholder="e.g. Master React & Redux"
                                value={form.title}
                                onChange={handleChange}
                                required
                            />
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label className="small font-weight-bold text-muted">Course Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            name="description"
                            className="rounded-3xl border-light p-3"
                            placeholder="Tell your students what they will achieve..."
                            value={form.description}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Row>
                        <Col md={12}>
                            <Form.Group className="mb-4">
                                <Form.Label className="small font-weight-bold text-muted">Category</Form.Label>
                                <InputGroup className="premium-input-group">
                                    <InputGroup.Text><FaLayerGroup /></InputGroup.Text>
                                    <Form.Select name="category" value={form.category} onChange={handleChange}>
                                        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                                    </Form.Select>
                                </InputGroup>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-5">
                        <Form.Label className="small font-weight-bold text-muted">Course Thumbnail</Form.Label>
                        <InputGroup className="premium-input-group mb-3">
                            <InputGroup.Text><FaImage /></InputGroup.Text>
                            <Form.Control
                                type="text"
                                name="thumbnail"
                                placeholder="https://images.unsplash.com/... or uploaded path"
                                value={form.thumbnail}
                                onChange={handleChange}
                            />
                        </InputGroup>

                        <div className="upload-container bg-light p-3 rounded-4xl border border-dashed border-2 border-primary border-opacity-25 text-center transition-all">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleThumbnailUpload}
                                id="thumbnail-upload"
                                className="d-none"
                                disabled={uploading}
                            />
                            <label htmlFor="thumbnail-upload" className="mb-0 cursor-pointer d-block py-2">
                                <FaCloudUploadAlt className="text-primary mb-2" size={32} />
                                <div className="small font-weight-bold">Upload from Computer</div>
                                <div className="extra-small text-muted">JPG, PNG, WEBP (Max 5MB)</div>
                            </label>

                            {uploading && (
                                <div className="mt-3 px-4">
                                    <div className="progress rounded-pill bg-white shadow-sm" style={{ height: '8px' }}>
                                        <div 
                                            className="progress-bar progress-bar-striped progress-bar-animated bg-primary" 
                                            role="progressbar" 
                                            style={{ width: `${uploadProgress}%` }}
                                        ></div>
                                    </div>
                                    <div className="extra-small text-primary mt-1 font-weight-bold">{uploadProgress}% Uploaded</div>
                                </div>
                            )}

                            {form.thumbnail && !uploading && (
                                <div className="mt-3">
                                    <img 
                                        src={form.thumbnail.startsWith('http') ? form.thumbnail : `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}${form.thumbnail}`} 
                                        alt="Thumbnail Preview" 
                                        className="rounded-3xl shadow-sm border" 
                                        style={{ maxWidth: '100%', maxHeight: '150px', objectFit: 'cover' }} 
                                    />
                                </div>
                            )}
                        </div>
                    </Form.Group>

                    <div className="d-flex gap-3">
                        <Button type="submit" variant="primary" disabled={loading || uploading} className="rounded-pill px-5 py-3 font-weight-bold shadow-primary">
                            {loading ? <Spinner animation="border" size="sm" /> : <>{isEditMode ? <FaSave className="me-2" /> : <FaPlusCircle className="me-2" />} {isEditMode ? 'Update Course' : 'Launch Course'}</>}
                        </Button>
                        <Button variant="outline-light" onClick={() => navigate('/instructor/courses')} className="rounded-pill px-4 text-muted">Cancel</Button>
                    </div>
                </Form>
            </Card>
        </DashboardLayout>
    );
};

export default CreateCoursePage;

