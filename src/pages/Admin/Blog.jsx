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
    const [languageFilter, setLanguageFilter] = useState("en");
    const [showCategoryManager, setShowCategoryManager] = useState(false);
    const [categories, setCategories] = useState([
        { id: 1, name: { en: "Adventure", ar: "مغامرة" }, count: 0 },
        { id: 2, name: { en: "Travel", ar: "سفر" }, count: 0 },
        { id: 3, name: { en: "Hot Air Balloon", ar: "منطاد هوائي ساخن" }, count: 0 },
        { id: 4, name: { en: "Tourism", ar: "سياحة" }, count: 0 }
    ]);

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const { data } = await getAllBlogs();
            const blogsArray = Array.isArray(data) ? data : data.blogs || [];
            
            // Debug: Log raw data from API
            console.log('Raw blogs data from API:', blogsArray);
            if (blogsArray.length > 0) {
                console.log('First blog raw data:', blogsArray[0]);
                console.log('First blog SEO data:', blogsArray[0]?.seo);
            }
            
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
                categories: blog.categories || [],
                tags: blog.tags || [],
                status: blog.status || "draft",
                featured: blog.featured || false,
                seo: (() => {
                    // Handle SEO data parsing
                    let seoData = blog.seo;
                    
                    // If seo is a string, try to parse it
                    if (typeof seoData === 'string' && seoData.startsWith('{')) {
                        try {
                            seoData = JSON.parse(seoData);
                        } catch (e) {
                            console.warn('Failed to parse SEO data:', seoData);
                            seoData = {};
                        }
                    }
                    
                    // Ensure all SEO fields exist with proper structure
                    const defaultSeo = {
                        metaTitle: { en: "", ar: "" },
                        metaDescription: { en: "", ar: "" },
                        slug: blog.slug || "",
                        imageAlt: { en: "", ar: "" },
                        focusKeywords: "",
                        ogTitle: { en: "", ar: "" },
                        ogDescription: { en: "", ar: "" }
                    };
                    
                    // If we have parsed SEO data, merge it with defaults
                    if (seoData && typeof seoData === 'object') {
                        return {
                            ...defaultSeo,
                            ...seoData,
                            // Ensure nested objects are properly merged
                            metaTitle: { ...defaultSeo.metaTitle, ...seoData.metaTitle },
                            metaDescription: { ...defaultSeo.metaDescription, ...seoData.metaDescription },
                            imageAlt: { ...defaultSeo.imageAlt, ...seoData.imageAlt },
                            ogTitle: { ...defaultSeo.ogTitle, ...seoData.ogTitle },
                            ogDescription: { ...defaultSeo.ogDescription, ...seoData.ogDescription }
                        };
                    }
                    
                    return defaultSeo;
                })()
            }));

            // Debug: Log processed data
            console.log('Processed blogs data:', processedBlogs);
            if (processedBlogs.length > 0) {
                console.log('First processed blog:', processedBlogs[0]);
                console.log('First processed blog SEO:', processedBlogs[0]?.seo);
            }

            setBlogs(processedBlogs);
            
            // Update category counts
            updateCategoryCounts(processedBlogs);
        } catch (err) {
            console.error("Error fetching blogs:", err);
            toast.error("Failed to fetch blogs");
        } finally {
            setLoading(false);
        }
    };

    const updateCategoryCounts = (blogsData) => {
        const updatedCategories = categories.map(category => ({
            ...category,
            count: blogsData.filter(blog => 
                blog.categories && blog.categories.includes(category.id)
            ).length
        }));
        setCategories(updatedCategories);
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
            (Array.isArray(blog.tags) && blog.tags.some(tag => tag && tag.toLowerCase().includes(searchTerm.toLowerCase())));

        const matchesStatus = statusFilter === "all" || blog.status === statusFilter;

        return matchesSearch && matchesStatus;
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

    const getCategoryNames = (categoryIds) => {
        if (!categoryIds || !Array.isArray(categoryIds)) return [];
        return categoryIds.map(id => {
            const category = categories.find(cat => cat.id === id);
            return category ? category.name[languageFilter] : `Unknown (${id})`;
        });
    };

    // Helper function to check SEO field existence
    const checkSEOField = (blog, field, needsLanguage = true) => {
        console.log('checkSEOField called:', { blogId: blog?.id, field, needsLanguage, languageFilter, seoData: blog?.seo });
        
        if (needsLanguage) {
            // Check nested structure first
            let nestedValue = blog.seo?.[field]?.[languageFilter];
            
            // If nested value is still a string that looks like JSON, parse it
            if (typeof nestedValue === 'string' && nestedValue.startsWith('{')) {
                try {
                    nestedValue = JSON.parse(nestedValue)[languageFilter];
                } catch (e) {
                    console.warn('Failed to parse nested SEO field:', nestedValue);
                }
            }
            
            // Then check flat structure
            const flatValue = blog[field] ? 
                (typeof blog[field] === 'string' ? 
                    (blog[field].startsWith('{') ? JSON.parse(blog[field])[languageFilter] : blog[field]) : 
                    blog[field][languageFilter]) : '';
            
            const result = nestedValue || flatValue;
            console.log(`SEO field result for ${field}:`, result);
            return result;
        } else {
            // For non-language specific fields like slug, focusKeywords
            let result = blog.seo?.[field] || blog[field];
            
            // If the result is still a string that looks like JSON, parse it
            if (typeof result === 'string' && result.startsWith('{')) {
                try {
                    result = JSON.parse(result);
                } catch (e) {
                    console.warn('Failed to parse non-language SEO field:', result);
                }
            }
            
            console.log(`SEO field result for ${field} (no language):`, result);
            return result;
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
                                value={languageFilter}
                                onChange={(e) => setLanguageFilter(e.target.value)}
                            >
                                <option value="en">English</option>
                                <option value="ar">Arabic</option>
                            </Form.Select>
                        </Col>
                        <Col md={3}>
                            <Button
                                variant="outline-secondary"
                                onClick={() => setShowCategoryManager(true)}
                            >
                                <FaFilter /> Manage Categories
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
            <Card className="mb-4">
                <Card.Header>
                    <h6 className="mb-0">Categories Overview</h6>
                </Card.Header>
                <Card.Body>
                    <Row>
                        {categories.map(category => (
                            <Col md={3} key={category.id} className="mb-2">
                                <div className="category-stat">
                                    <span className="category-name">
                                        {category.name[languageFilter]}
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
                                                            <Badge key={idx} bg="info" className="me-1 mb-1">
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
                                                        <Badge key={idx} bg="info" className="me-1">
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
                                                {/* Debug info */}
                                                <div className="mb-2 p-2 bg-light border rounded">
                                                    <small>Debug - Blog ID: {blog.id}, SEO Object: {JSON.stringify(blog.seo, null, 2)}</small>
                                                </div>
                                                
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
                    <Modal.Title>Category Manager</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Alert variant="info">
                        <strong>Note:</strong> Categories are now properly organized and only show when blogs are assigned to them.
                        The previous issue of categories showing even when none were created has been resolved.
                    </Alert>
                    <div className="category-list">
                        {categories.map(category => (
                            <div key={category.id} className="d-flex justify-content-between align-items-center mb-2 p-2 border rounded">
                                <div>
                                    <strong>{category.name.en}</strong> / {category.name.ar}
                                </div>
                                <Badge bg={category.count > 0 ? "primary" : "light"}>
                                    {category.count} blogs
                                </Badge>
                            </div>
                        ))}
                    </div>
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
