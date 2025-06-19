import React, { useEffect, useState } from "react";
import { getAllBlogs, createBlog, updateBlog, deleteBlog } from "src/api/blogapi";
import { Col, Row, Modal, Form, Button, Badge, Card, Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import { FaEdit, FaTrash, FaEye, FaSearch, FaFilter, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import TopBar from "src/components/Dashboard/Admin/Blogs/TopBar/Index";
import package1 from "src/assets/package/package1.png";
import DOMPurify from 'dompurify';

function Blog() {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedBlogId, setExpandedBlogId] = useState(null);
    const [imageModal, setImageModal] = useState({ show: false, src: "" });
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [languageFilter, setLanguageFilter] = useState("en");
    const [showCategoryManager, setShowCategoryManager] = useState(false);
    const [availableCategories, setAvailableCategories] = useState([]);

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const { data } = await getAllBlogs();
            const blogsArray = Array.isArray(data) ? data : data.blogs || [];
            
            // Process each blog to ensure proper data structure
            const processedBlogs = blogsArray.map(blog => ({
                ...blog,
                // Ensure proper parsing of JSON fields
                title: typeof blog.title === 'string' ? 
                    (blog.title.startsWith('{') ? JSON.parse(blog.title) : { en: blog.title, ar: "" }) : 
                    blog.title || { en: "", ar: "" },
                written_by: typeof blog.written_by === 'string' ? 
                    (blog.written_by.startsWith('{') ? JSON.parse(blog.written_by) : { en: blog.written_by, ar: "" }) : 
                    blog.written_by || { en: "", ar: "" },
                content: typeof blog.content === 'string' ? 
                    (blog.content.startsWith('{') ? JSON.parse(blog.content) : { en: blog.content, ar: "" }) : 
                    blog.content || { en: "", ar: "" },
                excerpt: blog.excerpt || { en: "", ar: "" },
                // Handle categories as bilingual object
                categories: (() => {
                    if (typeof blog.categories === 'string') {
                        try {
                            const parsed = JSON.parse(blog.categories);
                            if (typeof parsed === 'object' && !Array.isArray(parsed) && parsed.en !== undefined) {
                                return parsed; // New bilingual format
                            }
                            if (Array.isArray(parsed)) {
                                return { en: parsed, ar: [] }; // Old array format, put in English
                            }
                        } catch {
                            return { en: [], ar: [] };
                        }
                    }
                    if (typeof blog.categories === 'object' && !Array.isArray(blog.categories)) {
                        return blog.categories; // Already bilingual object
                    }
                    if (Array.isArray(blog.categories)) {
                        return { en: blog.categories, ar: [] }; // Old array format
                    }
                    return { en: [], ar: [] };
                })(),
                tags: blog.tags || [],
                status: blog.status || "draft",
                featured: blog.featured || false,
                seo: blog.seo || {
                    metaTitle: { en: "", ar: "" },
                    metaDescription: { en: "", ar: "" },
                    slug: blog.slug || "",
                    imageAlt: { en: "", ar: "" },
                    focusKeywords: "",
                    ogTitle: { en: "", ar: "" },
                    ogDescription: { en: "", ar: "" }
                }
            }));

            setBlogs(processedBlogs);
            
            // Extract and update available categories
            updateAvailableCategories(processedBlogs);
        } catch (err) {
            console.error("Error fetching blogs:", err);
            toast.error("Failed to fetch blogs");
        } finally {
            setLoading(false);
        }
    };

    const updateAvailableCategories = (blogsData) => {
        // Extract all unique categories from blogs (both English and Arabic)
        const categorySet = new Set();
        blogsData.forEach(blog => {
            if (blog.categories && typeof blog.categories === 'object') {
                // Add English categories
                if (Array.isArray(blog.categories.en)) {
                    blog.categories.en.forEach(category => {
                        if (category && typeof category === 'string' && category.trim()) {
                            categorySet.add(category.trim());
                        }
                    });
                }
                // Add Arabic categories
                if (Array.isArray(blog.categories.ar)) {
                    blog.categories.ar.forEach(category => {
                        if (category && typeof category === 'string' && category.trim()) {
                            categorySet.add(category.trim());
                        }
                    });
                }
            }
        });

        // Convert to array with counts
        const categoriesWithCounts = Array.from(categorySet).map(categoryName => ({
            name: categoryName,
            count: blogsData.filter(blog => 
                blog.categories && 
                ((Array.isArray(blog.categories.en) && blog.categories.en.includes(categoryName)) ||
                 (Array.isArray(blog.categories.ar) && blog.categories.ar.includes(categoryName)))
            ).length
        })).sort((a, b) => a.name.localeCompare(b.name));

        setAvailableCategories(categoriesWithCounts);
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this blog post?")) return;
        try {
            await deleteBlog(id);
            toast.success("Blog deleted successfully");
            fetchBlogs(); // Refresh the list
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("Failed to delete blog");
        }
    };

    const handleEdit = (blog) => {
        navigate(`/en/admin/blogs/edit/${blog.id}`);
    };

    const handleView = (blog) => {
        setExpandedBlogId(blog.id);
    };

    const handleStatusChange = async (blogId, newStatus) => {
        try {
            const blog = blogs.find(b => b.id === blogId);
            if (!blog) return;

            await updateBlog(blogId, { ...blog, status: newStatus });
            toast.success(`Blog ${newStatus} successfully`);
            fetchBlogs(); // Refresh the list
        } catch (error) {
            console.error("Status update error:", error);
            toast.error("Failed to update status");
        }
    };

    // Filter blogs based on search and filters
    const filteredBlogs = blogs.filter(blog => {
        const matchesSearch = !searchTerm || 
            blog.title[languageFilter]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            blog.written_by[languageFilter]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (Array.isArray(blog.tags) && blog.tags.some(tag => tag && tag.toLowerCase().includes(searchTerm.toLowerCase()))) ||
            (blog.categories && 
             ((Array.isArray(blog.categories.en) && blog.categories.en.some(category => category && category.toLowerCase().includes(searchTerm.toLowerCase()))) ||
              (Array.isArray(blog.categories.ar) && blog.categories.ar.some(category => category && category.toLowerCase().includes(searchTerm.toLowerCase())))));

        const matchesStatus = statusFilter === "all" || blog.status === statusFilter;
        
        const matchesCategory = categoryFilter === "all" || 
            (blog.categories && 
             ((Array.isArray(blog.categories.en) && blog.categories.en.includes(categoryFilter)) ||
              (Array.isArray(blog.categories.ar) && blog.categories.ar.includes(categoryFilter))));

        return matchesSearch && matchesStatus && matchesCategory;
    });

    const getStatusBadge = (status) => {
        const statusConfig = {
            draft: { variant: "secondary", text: "Draft" },
            published: { variant: "success", text: "Published" },
            archived: { variant: "warning", text: "Archived" }
        };
        const config = statusConfig[status] || statusConfig.draft;
        return <Badge bg={config.variant}>{config.text}</Badge>;
    };

    const truncateHtml = (html, maxLength = 100) => {
        const textOnly = html?.replace(/<[^>]*>/g, '') || '';
        return textOnly.length > maxLength ? textOnly.substring(0, maxLength) + '...' : textOnly;
    };

    const formatDate = (dateString) => {
        if (!dateString) return "No date";
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    const getCategoryNames = (categories) => {
        if (!categories || typeof categories !== 'object') return [];
        
        // Combine both English and Arabic categories
        const allCategories = [];
        if (Array.isArray(categories.en)) {
            allCategories.push(...categories.en.filter(cat => cat && typeof cat === 'string'));
        }
        if (Array.isArray(categories.ar)) {
            allCategories.push(...categories.ar.filter(cat => cat && typeof cat === 'string'));
        }
        
        // Remove duplicates
        return [...new Set(allCategories)];
    };

    // Helper function to check SEO field existence
    const checkSEOField = (blog, field, needsLanguage = true) => {
        try {
            // Parse SEO data if it's a string
            let seoData = blog.seo;
            if (typeof blog.seo === 'string' && blog.seo.trim().startsWith('{')) {
                seoData = JSON.parse(blog.seo);
            }

            if (needsLanguage) {
                // Check nested structure first, then flat structure
                const nestedValue = seoData?.[field]?.[languageFilter];
                const flatValue = blog[field] ? 
                    (typeof blog[field] === 'string' ? 
                        (blog[field].startsWith('{') ? JSON.parse(blog[field])[languageFilter] : blog[field]) : 
                        blog[field][languageFilter]) : '';
                
                const value = nestedValue || flatValue;
                // Return true only if the value exists and has meaningful content (not just whitespace)
                return value && typeof value === 'string' && value.trim().length > 0;
            } else {
                // For non-language specific fields like slug, focusKeywords
                const value = seoData?.[field] || blog[field];
                // Return true only if the value exists and has meaningful content (not just whitespace)
                return value && typeof value === 'string' && value.trim().length > 0;
            }
        } catch (error) {
            console.error('Error parsing SEO data:', error);
            return false;
        }
    };

    return (
        <div className="blog-management">
            {/* Header */}
            <div className="mb-4">
                <TopBar />
            </div>

            {/* Filters and Search */}
            <Card className="mb-4">
                <Card.Body>
                    <Row className="align-items-center">
                        <Col md={3}>
                            <div className="search-box">
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <FaSearch />
                                    </span>
                                    <Form.Control
                                        type="text"
                                        placeholder="Search blogs..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                        </Col>
                        <Col md={2}>
                            <Form.Select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                                <option value="archived">Archived</option>
                            </Form.Select>
                        </Col>
                        <Col md={2}>
                            <Form.Select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                            >
                                <option value="all">All Categories</option>
                                {availableCategories.map((category, idx) => (
                                    <option key={idx} value={category.name}>
                                        {category.name} ({category.count})
                                    </option>
                                ))}
                            </Form.Select>
                        </Col>
                        <Col md={2}>
                            <Form.Select
                                value={languageFilter}
                                onChange={(e) => setLanguageFilter(e.target.value)}
                            >
                                <option value="en">English</option>
                                <option value="ar">Arabic</option>
                            </Form.Select>
                        </Col>
                        <Col md={2}>
                            <Button
                                variant="outline-secondary"
                                onClick={() => setShowCategoryManager(true)}
                            >
                                <FaFilter /> Categories ({availableCategories.length})
                            </Button>
                        </Col>
                        <Col md={2} className="text-end">
                            <span className="text-muted">
                                {filteredBlogs.length} of {blogs.length} blogs
                            </span>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Category Overview */}
            {availableCategories.length > 0 && (
                <Card className="mb-4">
                    <Card.Header>
                        <h6 className="mb-0">Categories Overview</h6>
                    </Card.Header>
                    <Card.Body>
                        <Row>
                            {availableCategories.map((category, idx) => (
                                <Col md={3} key={idx} className="mb-2">
                                    <div 
                                        className={`category-stat ${categoryFilter === category.name ? 'active' : ''}`}
                                        style={{ 
                                            cursor: 'pointer',
                                            padding: '8px 12px',
                                            borderRadius: '6px',
                                            backgroundColor: categoryFilter === category.name ? '#e3f2fd' : 'transparent',
                                            border: categoryFilter === category.name ? '1px solid #2196f3' : '1px solid transparent'
                                        }}
                                        onClick={() => setCategoryFilter(categoryFilter === category.name ? 'all' : category.name)}
                                    >
                                        <span className="category-name">
                                            {category.name}
                                        </span>
                                        <Badge bg={category.count > 0 ? "primary" : "light"} className="ms-2">
                                            {category.count}
                                        </Badge>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </Card.Body>
                </Card>
            )}

            {/* Blogs List */}
            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <Card>
                    <Card.Header>
                        <h6 className="mb-0">Blog Posts</h6>
                    </Card.Header>
                    <Card.Body className="p-0">
                        {filteredBlogs.length === 0 ? (
                            <div className="text-center py-5">
                                <p className="text-muted">No blogs found matching your criteria.</p>
                                <Button 
                                    variant="primary" 
                                    onClick={() => navigate('/en/admin/blogs/add')}
                                >
                                    Create Your First Blog
                                </Button>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th style={{ width: '80px' }}>Image</th>
                                            <th>Title</th>
                                            <th>Author</th>
                                            <th>Status</th>
                                            <th>Categories</th>
                                            <th>Date</th>
                                            <th>SEO</th>
                                            <th style={{ width: '150px' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredBlogs.map((blog) => (
                                            <tr key={blog.id}>
                                                <td>
                                                    <img
                                                        src={blog.image || package1}
                                                        alt={blog.seo?.imageAlt?.[languageFilter] || "Blog image"}
                                                        className="blog-thumbnail"
                                                        style={{
                                                            width: '60px',
                                                            height: '60px',
                                                            objectFit: 'cover',
                                                            borderRadius: '4px',
                                                            cursor: 'pointer'
                                                        }}
                                                        onClick={() => setImageModal({ show: true, src: blog.image || package1 })}
                                                    />
                                                </td>
                                                <td>
                                                    <div>
                                                        <strong>{blog.title?.[languageFilter] || "Untitled"}</strong>
                                                        {blog.featured && (
                                                            <FaStar className="text-warning ms-2" title="Featured" />
                                                        )}
                                                        <br />
                                                        <small className="text-muted">
                                                            {truncateHtml(blog.excerpt?.[languageFilter] || blog.content?.[languageFilter], 80)}
                                                        </small>
                                                    </div>
                                                </td>
                                                <td>{blog.written_by?.[languageFilter] || "Unknown"}</td>
                                                <td>
                                                    <div className="d-flex flex-column gap-1">
                                                        {getStatusBadge(blog.status)}
                                                        <div className="btn-group-vertical btn-group-sm">
                                                            {blog.status !== 'published' && (
                                                                <button
                                                                    className="btn btn-outline-success btn-sm"
                                                                    onClick={() => handleStatusChange(blog.id, 'published')}
                                                                    style={{ fontSize: '10px', padding: '2px 6px' }}
                                                                >
                                                                    Publish
                                                                </button>
                                                            )}
                                                            {blog.status !== 'draft' && (
                                                                <button
                                                                    className="btn btn-outline-secondary btn-sm"
                                                                    onClick={() => handleStatusChange(blog.id, 'draft')}
                                                                    style={{ fontSize: '10px', padding: '2px 6px' }}
                                                                >
                                                                    Draft
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        {getCategoryNames(blog.categories).map((catName, idx) => (
                                                            <Badge 
                                                                key={idx} 
                                                                bg="info" 
                                                                className="me-1 mb-1"
                                                                style={{ cursor: 'pointer' }}
                                                                onClick={() => setCategoryFilter(catName)}
                                                                title={`Filter by ${catName}`}
                                                            >
                                                                {catName}
                                                            </Badge>
                                                        ))}
                                                        {blog.categories?.length === 0 && (
                                                            <span className="text-muted">No categories</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td>
                                                    <small>{formatDate(blog.date)}</small>
                                                </td>
                                                <td>
                                                    <div className="seo-indicators">
                                                        <div className="d-flex flex-column gap-1">
                                                            <Badge 
                                                                bg={checkSEOField(blog, 'metaTitle', true) ? "success" : "danger"}
                                                                className="small-badge"
                                                                title={checkSEOField(blog, 'metaTitle', true) ? "Meta title is set" : "Meta title is missing"}
                                                            >
                                                                Meta Title
                                                            </Badge>
                                                            <Badge 
                                                                bg={checkSEOField(blog, 'metaDescription', true) ? "success" : "danger"}
                                                                className="small-badge"
                                                                title={checkSEOField(blog, 'metaDescription', true) ? "Meta description is set" : "Meta description is missing"}
                                                            >
                                                                Meta Desc
                                                            </Badge>
                                                            <Badge 
                                                                bg={checkSEOField(blog, 'slug', false) ? "success" : "danger"}
                                                                className="small-badge"
                                                                title={checkSEOField(blog, 'slug', false) ? "URL slug is set" : "URL slug is missing"}
                                                            >
                                                                URL Slug
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="action-buttons d-flex gap-1">
                                                        <Button
                                                            variant="outline-primary"
                                                            size="sm"
                                                            onClick={() => handleView(blog)}
                                                            title="View"
                                                        >
                                                            <FaEye />
                                                        </Button>
                                                        <Button
                                                            variant="outline-success"
                                                            size="sm"
                                                            onClick={() => handleEdit(blog)}
                                                            title="Edit"
                                                        >
                                                            <FaEdit />
                                                        </Button>
                                                        <Button
                                                            variant="outline-danger"
                                                            size="sm"
                                                            onClick={() => handleDelete(blog.id)}
                                                            title="Delete"
                                                        >
                                                            <FaTrash />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </Card.Body>
                </Card>
            )}

            {/* View More Modal */}
            <Modal
                show={!!expandedBlogId}
                onHide={() => setExpandedBlogId(null)}
                centered
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Blog Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {(() => {
                        const blog = blogs.find((b) => b.id === expandedBlogId);
                        if (!blog) return <div>Blog not found</div>;

                        return (
                            <div>
                                <Row>
                                    <Col md={8}>
                                        <h4>{blog.title?.[languageFilter] || "Untitled"}</h4>
                                        <p><strong>Author:</strong> {blog.written_by?.[languageFilter] || "Unknown"}</p>
                                        <p><strong>Date:</strong> {formatDate(blog.date)}</p>
                                        <p><strong>Status:</strong> {getStatusBadge(blog.status)}</p>
                                        
                                        {blog.categories?.length > 0 && (
                                            <div className="mb-3">
                                                <strong>Categories:</strong>
                                                <div className="mt-1">
                                                    {getCategoryNames(blog.categories).map((catName, idx) => (
                                                        <Badge 
                                                            key={idx} 
                                                            bg="info" 
                                                            className="me-1"
                                                            style={{ cursor: 'pointer' }}
                                                            onClick={() => setCategoryFilter(catName)}
                                                            title={`Filter by ${catName}`}
                                                        >
                                                            {catName}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {blog.tags?.length > 0 && (
                                            <div className="mb-3">
                                                <strong>Tags:</strong>
                                                <div className="mt-1">
                                                    {blog.tags.map((tag, idx) => (
                                                        <Badge key={idx} bg="secondary" className="me-1">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="content-preview">
                                            <strong>Content Preview:</strong>
                                            <div 
                                                className="mt-2 p-3 border rounded"
                                                style={{ maxHeight: '300px', overflowY: 'auto' }}
                                                dangerouslySetInnerHTML={{ 
                                                    __html: DOMPurify.sanitize(blog.content?.[languageFilter] || "No content") 
                                                }}
                                            />
                                        </div>
                                    </Col>
                                    <Col md={4}>
                                        {blog.image && (
                                            <div className="mb-3">
                                                <img
                                                    src={blog.image}
                                                    alt={checkSEOField(blog, 'imageAlt', true) || "Blog image"}
                                                    className="img-fluid rounded"
                                                />
                                            </div>
                                        )}
                                        
                                        <div className="seo-info">
                                            <h6>SEO Information</h6>
                                            <div className="small">
                                                <p>
                                                    <strong>Meta Title:</strong> 
                                                    <span className={checkSEOField(blog, 'metaTitle', true) ? "text-success" : "text-danger"}>
                                                        {checkSEOField(blog, 'metaTitle', true) || "Not set"}
                                                    </span>
                                                </p>
                                                <p>
                                                    <strong>Meta Description:</strong> 
                                                    <span className={checkSEOField(blog, 'metaDescription', true) ? "text-success" : "text-danger"}>
                                                        {checkSEOField(blog, 'metaDescription', true) || "Not set"}
                                                    </span>
                                                </p>
                                                <p>
                                                    <strong>URL Slug:</strong> 
                                                    <span className={checkSEOField(blog, 'slug', false) ? "text-success" : "text-danger"}>
                                                        {checkSEOField(blog, 'slug', false) || "Not set"}
                                                    </span>
                                                </p>
                                                <p>
                                                    <strong>Focus Keywords:</strong> 
                                                    <span className={checkSEOField(blog, 'focusKeywords', false) ? "text-success" : "text-warning"}>
                                                        {checkSEOField(blog, 'focusKeywords', false) || "Not set"}
                                                    </span>
                                                </p>
                                                <p>
                                                    <strong>Image Alt Text:</strong> 
                                                    <span className={checkSEOField(blog, 'imageAlt', true) ? "text-success" : "text-warning"}>
                                                        {checkSEOField(blog, 'imageAlt', true) || "Not set"}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        );
                    })()}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setExpandedBlogId(null)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Image Modal */}
            <Modal
                show={imageModal.show}
                onHide={() => setImageModal({ show: false, src: "" })}
                centered
                size="md"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Image Preview</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ textAlign: "center" }}>
                    <img
                        src={imageModal.src}
                        alt="Preview"
                        style={{ maxWidth: "100%", maxHeight: "60vh", borderRadius: 8 }}
                    />
                </Modal.Body>
            </Modal>

            {/* Category Manager Modal */}
            <Modal
                show={showCategoryManager}
                onHide={() => setShowCategoryManager(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Category Overview</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Alert variant="info">
                        <strong>Categories are now managed dynamically!</strong> Categories are automatically created when you add them to blog posts. 
                        You can simply type them in the category field when creating or editing a blog.
                    </Alert>
                    
                    {availableCategories.length > 0 ? (
                        <div className="category-list">
                            <h6 className="mb-3">Current Categories ({availableCategories.length})</h6>
                            {availableCategories.map((category, idx) => (
                                <div key={idx} className="d-flex justify-content-between align-items-center mb-2 p-3 border rounded">
                                    <div>
                                        <strong>{category.name}</strong>
                                        <br />
                                        <small className="text-muted">Click to filter blogs by this category</small>
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <Badge bg={category.count > 0 ? "primary" : "light"}>
                                            {category.count} blog{category.count !== 1 ? 's' : ''}
                                        </Badge>
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            onClick={() => {
                                                setCategoryFilter(category.name);
                                                setShowCategoryManager(false);
                                            }}
                                        >
                                            Filter
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <p className="text-muted">No categories found.</p>
                            <p className="text-muted">Categories will appear here once you create blog posts with categories.</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCategoryManager(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Blog;
