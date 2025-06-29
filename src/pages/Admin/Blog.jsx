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
    const [categories, setCategories] = useState([]);
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState(null);

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
                categories: (() => {
                    // Parse categories properly
                    let cats = blog.categories;
                    if (typeof cats === 'string') {
                        try {
                            // Try to parse as JSON first
                            const parsed = JSON.parse(cats);
                            if (Array.isArray(parsed)) {
                                // Handle new format with category objects containing names
                                return parsed.map(cat => {
                                    if (cat && typeof cat === 'object' && cat.name) {
                                        // This is a category object with name, extract the name
                                        return {
                                            name: cat.name.en || cat.name.ar || 'Unknown Category',
                                            nameObj: cat.name // Keep the full name object for language switching
                                        };
                                    }
                                    // Legacy format - just return the category ID/name
                                    return typeof cat === 'string' ? cat : String(cat);
                                });
                            } else if (parsed && typeof parsed === 'object' && parsed.en) {
                                // If it's an object with language keys, extract the English categories
                                return Array.isArray(parsed.en) ? parsed.en : [];
                            }
                        } catch (e) {
                            console.warn('Failed to parse categories:', cats);
                        }
                    }
                    return Array.isArray(cats) ? cats : [];
                })(),
                tags: (() => {
                    // Parse tags properly
                    let tagsData = blog.tags;
                    if (typeof tagsData === 'string') {
                        try {
                            const parsed = JSON.parse(tagsData);
                            return Array.isArray(parsed) ? parsed : [];
                        } catch (e) {
                            console.warn('Failed to parse tags:', tagsData);
                        }
                    }
                    return Array.isArray(tagsData) ? tagsData : [];
                })(),
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
            
            // Extract and set all unique categories from blog data
            extractAndSetCategories(processedBlogs);
        } catch (err) {
            console.error("Error fetching blogs:", err);
            toast.error("Failed to fetch blogs");
        } finally {
            setLoading(false);
        }
    };

    const extractAndSetCategories = (blogsData) => {
        // Extract all unique categories from blog data
        const categoryMap = new Map();
        
        blogsData.forEach(blog => {
            if (blog.categories && Array.isArray(blog.categories)) {
                blog.categories.forEach(category => {
                    let catKey, catName, catNameObj;
                    
                    // Handle new format with category objects
                    if (category && typeof category === 'object' && category.nameObj) {
                        catKey = category.nameObj.en || category.nameObj.ar || 'unknown';
                        catName = category.nameObj;
                        catNameObj = category.nameObj;
                    } else if (category && typeof category === 'object' && category.name) {
                        catKey = category.name;
                        catName = { en: category.name, ar: category.name };
                        catNameObj = catName;
                    } else if (category && String(category).trim()) {
                        // Legacy format
                        catKey = String(category).trim();
                        catName = { en: catKey, ar: catKey };
                        catNameObj = catName;
                    }
                    
                    if (catKey && !categoryMap.has(catKey)) {
                        categoryMap.set(catKey, {
                            id: catKey,
                            name: catNameObj,
                            count: 0
                        });
                    }
                });
            }
        });
        
        // Count blogs for each category
        const categoriesArray = Array.from(categoryMap.values()).map(category => ({
            ...category,
            count: blogsData.filter(blog => {
                if (!blog.categories || !Array.isArray(blog.categories)) return false;
                
                return blog.categories.some(cat => {
                    if (cat && typeof cat === 'object' && cat.nameObj) {
                        return (cat.nameObj.en === category.name.en) || (cat.nameObj.ar === category.name.ar);
                    } else if (cat && typeof cat === 'object' && cat.name) {
                        return cat.name === category.id;
                    } else {
                        return String(cat) === category.id;
                    }
                });
            }).length
        }));
        
        // Sort categories by count (descending) then by name
        categoriesArray.sort((a, b) => {
            if (b.count !== a.count) return b.count - a.count;
            return a.name.en.localeCompare(b.name.en);
        });
        
        setCategories(categoriesArray);
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
        
        const matchesCategory = !selectedCategoryFilter || 
            (blog.categories && Array.isArray(blog.categories) && blog.categories.some(cat => {
                // Handle new format with category objects
                if (cat && typeof cat === 'object' && cat.nameObj) {
                    return cat.nameObj.en === selectedCategoryFilter || cat.nameObj.ar === selectedCategoryFilter;
                } else if (cat && typeof cat === 'object' && cat.name) {
                    return cat.name === selectedCategoryFilter;
                } else {
                    return String(cat) === selectedCategoryFilter;
                }
            }));

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

    const getCategoryNames = (categoryData) => {
        if (!categoryData || !Array.isArray(categoryData)) return [];
        
        return categoryData.map(cat => {
            // Handle new format with category objects
            if (cat && typeof cat === 'object' && cat.nameObj) {
                // Use the language-specific name
                return cat.nameObj[languageFilter] || cat.nameObj.en || cat.nameObj.ar || 'Unknown Category';
            }
            
            // Handle simple category name
            if (cat && typeof cat === 'object' && cat.name) {
                return cat.name;
            }
            
            // Legacy format - try to find in categories list
            const category = categories.find(existingCat => existingCat.id === cat);
            if (category) {
                return category.name[languageFilter];
            }
            
            // Fallback - return as string
            return String(cat);
        });
    };

    const handleCategoryFilter = (categoryId) => {
        if (selectedCategoryFilter === categoryId) {
            // If the same category is clicked, remove the filter
            setSelectedCategoryFilter(null);
        } else {
            // Set the new category filter
            setSelectedCategoryFilter(categoryId);
        }
        // Close the category manager modal
        setShowCategoryManager(false);
    };

    const clearCategoryFilter = () => {
        setSelectedCategoryFilter(null);
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
                            <div className="d-flex flex-column align-items-end">
                                <span className="text-muted">
                                    {filteredBlogs.length} of {blogs.length} blogs
                                </span>
                                {selectedCategoryFilter && (
                                    <div className="mt-1">
                                        <Badge bg="info" className="me-1">
                                            Filtered by: {selectedCategoryFilter}
                                        </Badge>
                                        <Button
                                            variant="outline-secondary"
                                            size="sm"
                                            onClick={clearCategoryFilter}
                                            className="py-0 px-1"
                                        >
                                            ×
                                        </Button>
                                    </div>
                                )}
                            </div>
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
                                            <div className="d-flex align-items-center mb-3">
                                                <h6 className="mb-0 me-2">🚀 SEO Information</h6>
                                                <Badge bg="info" className="small">
                                                    {languageFilter === 'en' ? 'English' : 'Arabic'}
                                                </Badge>
                                            </div>
                                            
                                            <div className="seo-cards">
                                                {/* Meta Title */}
                                                <div className="seo-card mb-3 p-3 border rounded" style={{ backgroundColor: '#f8f9fa' }}>
                                                    <div className="d-flex align-items-center mb-2">
                                                        <strong className="text-primary me-2">📝 Meta Title</strong>
                                                        {checkSEOField(blog, 'metaTitle', true) ? (
                                                            <Badge bg="success" className="small">✓ Set</Badge>
                                                        ) : (
                                                            <Badge bg="danger" className="small">✗ Missing</Badge>
                                                        )}
                                                    </div>
                                                    <div className="seo-value">
                                                        {checkSEOField(blog, 'metaTitle', true) ? (
                                                            <div>
                                                                <p className="mb-1 text-dark">{checkSEOField(blog, 'metaTitle', true)}</p>
                                                                <small className="text-muted">
                                                                    Length: {checkSEOField(blog, 'metaTitle', true).length} characters
                                                                    {checkSEOField(blog, 'metaTitle', true).length > 60 && (
                                                                        <span className="text-warning ms-1">(Too long for optimal SEO)</span>
                                                                    )}
                                                                </small>
                                                            </div>
                                                        ) : (
                                                            <small className="text-muted">Meta title helps search engines understand your content</small>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Meta Description */}
                                                <div className="seo-card mb-3 p-3 border rounded" style={{ backgroundColor: '#f8f9fa' }}>
                                                    <div className="d-flex align-items-center mb-2">
                                                        <strong className="text-primary me-2">📄 Meta Description</strong>
                                                        {checkSEOField(blog, 'metaDescription', true) ? (
                                                            <Badge bg="success" className="small">✓ Set</Badge>
                                                        ) : (
                                                            <Badge bg="danger" className="small">✗ Missing</Badge>
                                                        )}
                                                    </div>
                                                    <div className="seo-value">
                                                        {checkSEOField(blog, 'metaDescription', true) ? (
                                                            <div>
                                                                <p className="mb-1 text-dark">{checkSEOField(blog, 'metaDescription', true)}</p>
                                                                <small className="text-muted">
                                                                    Length: {checkSEOField(blog, 'metaDescription', true).length} characters
                                                                    {checkSEOField(blog, 'metaDescription', true).length > 160 && (
                                                                        <span className="text-warning ms-1">(Too long for search results)</span>
                                                                    )}
                                                                </small>
                                                            </div>
                                                        ) : (
                                                            <small className="text-muted">Meta description appears in search results</small>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* URL Slug */}
                                                <div className="seo-card mb-3 p-3 border rounded" style={{ backgroundColor: '#f8f9fa' }}>
                                                    <div className="d-flex align-items-center mb-2">
                                                        <strong className="text-primary me-2">🔗 URL Slug</strong>
                                                        {checkSEOField(blog, 'slug', false) ? (
                                                            <Badge bg="success" className="small">✓ Set</Badge>
                                                        ) : (
                                                            <Badge bg="warning" className="small">⚠ Default</Badge>
                                                        )}
                                                    </div>
                                                    <div className="seo-value">
                                                        {checkSEOField(blog, 'slug', false) ? (
                                                            <div>
                                                                <code className="bg-light p-1 rounded">{checkSEOField(blog, 'slug', false)}</code>
                                                                <div className="mt-1">
                                                                    <small className="text-muted">Full URL: /blog/{checkSEOField(blog, 'slug', false)}</small>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <small className="text-muted">URL slug makes your links SEO-friendly</small>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Focus Keywords */}
                                                <div className="seo-card mb-3 p-3 border rounded" style={{ backgroundColor: '#f8f9fa' }}>
                                                    <div className="d-flex align-items-center mb-2">
                                                        <strong className="text-primary me-2">🎯 Focus Keywords</strong>
                                                        {checkSEOField(blog, 'focusKeywords', false) ? (
                                                            <Badge bg="success" className="small">✓ Set</Badge>
                                                        ) : (
                                                            <Badge bg="warning" className="small">⚠ Optional</Badge>
                                                        )}
                                                    </div>
                                                    <div className="seo-value">
                                                        {checkSEOField(blog, 'focusKeywords', false) ? (
                                                            <div>
                                                                <div className="keywords-list">
                                                                    {checkSEOField(blog, 'focusKeywords', false).split(',').map((keyword, idx) => (
                                                                        <Badge key={idx} bg="primary" className="me-1 mb-1">
                                                                            {keyword.trim()}
                                                                        </Badge>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <small className="text-muted">Keywords help target specific search terms</small>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Image Alt Text */}
                                                <div className="seo-card mb-3 p-3 border rounded" style={{ backgroundColor: '#f8f9fa' }}>
                                                    <div className="d-flex align-items-center mb-2">
                                                        <strong className="text-primary me-2">🖼️ Image Alt Text</strong>
                                                        {checkSEOField(blog, 'imageAlt', true) ? (
                                                            <Badge bg="success" className="small">✓ Set</Badge>
                                                        ) : (
                                                            <Badge bg="warning" className="small">⚠ Missing</Badge>
                                                        )}
                                                    </div>
                                                    <div className="seo-value">
                                                        {checkSEOField(blog, 'imageAlt', true) ? (
                                                            <p className="mb-1 text-dark">{checkSEOField(blog, 'imageAlt', true)}</p>
                                                        ) : (
                                                            <small className="text-muted">Alt text improves accessibility and SEO</small>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* SEO Score Summary */}
                                                <div className="seo-summary p-3 border rounded" style={{ backgroundColor: '#e8f5e8' }}>
                                                    <div className="d-flex align-items-center mb-2">
                                                        <strong className="text-success me-2">📊 SEO Score</strong>
                                                    </div>
                                                    <div className="seo-score">
                                                        {(() => {
                                                            let score = 0;
                                                            let maxScore = 5;
                                                            
                                                            if (checkSEOField(blog, 'metaTitle', true)) score += 1;
                                                            if (checkSEOField(blog, 'metaDescription', true)) score += 1;
                                                            if (checkSEOField(blog, 'slug', false)) score += 1;
                                                            if (checkSEOField(blog, 'focusKeywords', false)) score += 1;
                                                            if (checkSEOField(blog, 'imageAlt', true)) score += 1;
                                                            
                                                            const percentage = Math.round((score / maxScore) * 100);
                                                            const scoreColor = percentage >= 80 ? 'success' : percentage >= 60 ? 'warning' : 'danger';
                                                            
                                                            return (
                                                                <div>
                                                                    <div className="d-flex align-items-center mb-2">
                                                                        <div className="progress flex-grow-1 me-2" style={{ height: '20px' }}>
                                                                            <div 
                                                                                className={`progress-bar bg-${scoreColor}`}
                                                                                style={{ width: `${percentage}%` }}
                                                                            >
                                                                                {percentage}%
                                                                            </div>
                                                                        </div>
                                                                        <Badge bg={scoreColor}>{score}/{maxScore}</Badge>
                                                                    </div>
                                                                    <small className="text-muted">
                                                                        {percentage >= 80 ? '🌟 Excellent SEO optimization!' : 
                                                                         percentage >= 60 ? '👍 Good SEO, room for improvement' : 
                                                                         '⚠️ Needs SEO optimization'}
                                                                    </small>
                                                                </div>
                                                            );
                                                        })()}
                                                    </div>
                                                </div>
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
                        <strong>Note:</strong> These are all categories found in your blog data. Click on any category to filter blogs by that category.
                    </Alert>
                    
                    {selectedCategoryFilter && (
                        <Alert variant="success" className="mb-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <span>Currently filtering by: <strong>{selectedCategoryFilter}</strong></span>
                                <Button variant="outline-success" size="sm" onClick={clearCategoryFilter}>
                                    Clear Filter
                                </Button>
                            </div>
                        </Alert>
                    )}
                    
                    <div className="category-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {categories.length === 0 ? (
                            <div className="text-center text-muted py-4">
                                <p>No categories found in your blog data.</p>
                                <small>Categories will appear here once you create blogs with categories.</small>
                            </div>
                        ) : (
                            categories.map(category => (
                                <div 
                                    key={category.id} 
                                    className={`d-flex justify-content-between align-items-center mb-2 p-3 border rounded category-item ${selectedCategoryFilter === category.id ? 'border-primary bg-primary bg-opacity-10' : ''}`}
                                    style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                                    onClick={() => handleCategoryFilter(category.id)}
                                    onMouseEnter={(e) => {
                                        if (selectedCategoryFilter !== category.id) {
                                            e.target.style.backgroundColor = '#f8f9fa';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (selectedCategoryFilter !== category.id) {
                                            e.target.style.backgroundColor = 'transparent';
                                        }
                                    }}
                                >
                                    <div>
                                        <strong className="d-block">{category.name.en}</strong>
                                        {category.name.en !== category.name.ar && (
                                            <small className="text-muted">{category.name.ar}</small>
                                        )}
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <Badge bg={category.count > 0 ? "primary" : "light"} className="me-2">
                                            {category.count} blog{category.count !== 1 ? 's' : ''}
                                        </Badge>
                                        {selectedCategoryFilter === category.id && (
                                            <Badge bg="success">
                                                Active Filter
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
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
