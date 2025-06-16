import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Row, Card, Form, Button, Modal, Badge, Collapse } from "react-bootstrap";
import { FaEye, FaImage, FaChevronDown, FaChevronUp, FaCog, FaCalendarAlt, FaGlobe, FaEyeSlash, FaTags, FaFolder, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Optional image resize module
let hasImageResize = false;
try {
  const ImageResize = require('quill-image-resize-module-react');
  if (ImageResize) {
    Quill.register('modules/imageResize', ImageResize);
    hasImageResize = true;
  }
} catch (e) {
  console.log('Image resize module not available, continuing without it');
  hasImageResize = false;
}
import Upload from "../../../../common/Upload";
import {
  getAllBlogs,
  createBlog,
  getBlogById,
  updateBlog,
  deleteBlog,
} from "../../../../../api/blogapi";
import "./styles.scss";

const initBlogObj = {
  title: { en: "", ar: "" },
  content: { en: "", ar: "" },
  excerpt: { en: "", ar: "" },
  date: "",
  image: "",
  written_by: { en: "", ar: "" },
  categories: [],
  tags: [],
  status: "draft",
  featured: false,
  format: "standard",
  seo: {
    metaTitle: { en: "", ar: "" },
    metaDescription: { en: "", ar: "" },
    slug: "",
    imageAlt: { en: "", ar: "" },
    focusKeywords: "",
    ogTitle: { en: "", ar: "" },
    ogDescription: { en: "", ar: "" }
  }
};

function EnhancedBlogForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Add error boundary
  if (!navigate) {
    return <div>Loading...</div>;
  }
  const [formData, setFormData] = useState({ ...initBlogObj });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState("");
  const [activeLanguage, setActiveLanguage] = useState("en");
  const [showPreview, setShowPreview] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  // WordPress-style collapsible sections
  const [openSections, setOpenSections] = useState({
    excerpt: false,
    customFields: false,
    discussion: false,
    seo: false,
    trackbacks: false
  });

  const [availableCategories, setAvailableCategories] = useState([
    { id: 1, name: { en: "Adventure", ar: "مغامرة" } },
    { id: 2, name: { en: "Travel", ar: "سفر" } },
    { id: 3, name: { en: "Hot Air Balloon", ar: "منطاد هوائي ساخن" } },
    { id: 4, name: { en: "Tourism", ar: "سياحة" } }
  ]);

  // Category management state
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({ en: "", ar: "" });

  const postFormats = [
    { id: 'standard', name: 'Standard', icon: '📝' },
    { id: 'aside', name: 'Aside', icon: '💭' },
    { id: 'image', name: 'Image', icon: '🖼️' },
    { id: 'video', name: 'Video', icon: '🎥' },
    { id: 'audio', name: 'Audio', icon: '🎵' },
    { id: 'quote', name: 'Quote', icon: '💬' },
    { id: 'link', name: 'Link', icon: '🔗' },
    { id: 'gallery', name: 'Gallery', icon: '🖼️' }
  ];

  const widgetRef = useRef();
  const quillRef = useRef();

  // Normalize category data to ensure consistent format
  const normalizeCategories = (categories) => {
    if (!categories) return [];
    
    if (Array.isArray(categories)) {
      return categories.map(cat => {
        if (typeof cat === 'string') {
          // If it's a string, try to parse it as JSON first
          try {
            const parsed = JSON.parse(cat);
            return typeof parsed === 'object' ? parsed.id || parsed : parsed;
          } catch {
            // If it's not JSON, treat it as a category ID
            return cat;
          }
        }
        return cat;
      });
    }
    
    if (typeof categories === 'string') {
      try {
        const parsed = JSON.parse(categories);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    
    return [];
  };

  // Debug: Log formData changes
  useEffect(() => {
    console.log("FormData updated:", formData);
    console.log("Current categories in formData:", formData.categories);
  }, [formData]);

  // Quill configuration for WordPress-like editor
  const getQuillModules = () => {
    const modules = {
      toolbar: [
        [{ 'header': [1, 2, 3, 4, false] }],
        [{ 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'align': ['', 'center', 'right', 'justify'] }],
        ['link', 'image', 'video'],
        ['blockquote', 'code-block'],
        ['clean']
      ]
    };

    // Only add image resize if module loaded successfully
    if (hasImageResize) {
      try {
        modules.imageResize = {
          modules: ['Resize', 'DisplaySize']
        };
      } catch (e) {
        console.log('Could not configure image resize');
      }
    }

    return modules;
  };

  const quillModules = getQuillModules();

  const quillFormats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
    'direction', 'align', 'code-block',
    'color', 'background', 'script'
  ];

  // Initialize form data
  useEffect(() => {
    if (id) {
      setIsEdit(true);
      setLoading(true);
      getBlogById(id)
        .then(({ data }) => {
          console.log("Raw blog data received:", data);
          
          // Parse title - handle both string and object formats
          let parsedTitle = { en: "", ar: "" };
          if (typeof data.title === 'string') {
            try {
              parsedTitle = JSON.parse(data.title);
            } catch {
              parsedTitle = { en: data.title, ar: "" };
            }
          } else if (data.title && typeof data.title === 'object') {
            parsedTitle = data.title;
          }

          // Parse content - handle both string and object formats
          let parsedContent = { en: "", ar: "" };
          if (typeof data.content === 'string') {
            try {
              parsedContent = JSON.parse(data.content);
            } catch {
              parsedContent = { en: data.content, ar: "" };
            }
          } else if (data.content && typeof data.content === 'object') {
            parsedContent = data.content;
          }

          // Parse written_by - handle both string and object formats
          let parsedWrittenBy = { en: "", ar: "" };
          if (typeof data.written_by === 'string') {
            try {
              parsedWrittenBy = JSON.parse(data.written_by);
            } catch {
              parsedWrittenBy = { en: data.written_by, ar: "" };
            }
          } else if (data.written_by && typeof data.written_by === 'object') {
            parsedWrittenBy = data.written_by;
          }

          // Parse excerpt - handle both string and object formats
          let parsedExcerpt = { en: "", ar: "" };
          if (typeof data.excerpt === 'string') {
            try {
              parsedExcerpt = JSON.parse(data.excerpt);
            } catch {
              parsedExcerpt = { en: data.excerpt, ar: "" };
            }
          } else if (data.excerpt && typeof data.excerpt === 'object') {
            parsedExcerpt = data.excerpt;
          }

          // Ensure categories is an array using the normalize function
          let parsedCategories = normalizeCategories(data.categories);

          // Ensure tags is an array
          let parsedTags = [];
          if (Array.isArray(data.tags)) {
            parsedTags = data.tags;
          } else if (typeof data.tags === 'string') {
            try {
              parsedTags = JSON.parse(data.tags);
            } catch {
              parsedTags = [];
            }
          }

          const blogData = {
            title: parsedTitle,
            content: parsedContent,
            excerpt: parsedExcerpt,
            date: data.date || "",
            image: data.image || "",
            written_by: parsedWrittenBy,
            categories: parsedCategories,
            tags: parsedTags,
            status: data.status || "draft",
            featured: data.featured || false,
            format: data.format || 'standard',
            seo: {
              metaTitle: data.seo?.metaTitle || { en: "", ar: "" },
              metaDescription: data.seo?.metaDescription || { en: "", ar: "" },
              slug: data.seo?.slug || data.slug || "",
              imageAlt: data.seo?.imageAlt || { en: "", ar: "" },
              focusKeywords: data.seo?.focusKeywords || "",
              ogTitle: data.seo?.ogTitle || { en: "", ar: "" },
              ogDescription: data.seo?.ogDescription || { en: "", ar: "" }
            }
          };

          console.log("Parsed blog data:", blogData);
          console.log("Categories loaded:", blogData.categories);
          
          setFormData(blogData);
          setUploadedImage(data.image || "");
          updateWordCount(blogData.content[activeLanguage]);
        })
        .catch((err) => {
          console.error("Error fetching blog:", err);
          setError(err?.message || "Error fetching blog");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [id]);

  // Update word count
  const updateWordCount = (content) => {
    const textOnly = content?.replace(/<[^>]*>/g, '') || '';
    const words = textOnly.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  };

  // Handle input changes for different field types
  const handleInputChange = (field, value, lang = null) => {
    if (lang) {
      setFormData((prev) => ({
        ...prev,
        [field]: { ...prev[field], [lang]: value }
      }));
      if (field === 'content') {
        updateWordCount(value);
      }
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  // Handle SEO data changes
  const handleSEOChange = (field, value, lang = null) => {
    if (lang) {
      setFormData((prev) => ({
        ...prev,
        seo: {
          ...prev.seo,
          [field]: { ...prev.seo[field], [lang]: value }
        }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        seo: { ...prev.seo, [field]: value }
      }));
    }
  };

  // Handle image upload
  const [currentFile, setCurrentFile] = useState("");
  useEffect(() => {
    if (currentFile) widgetRef.current.open();
  }, [currentFile]);

  const handleImageUpload = (url) => {
    setUploadedImage(url);
    setFormData(prev => ({ ...prev, image: url }));
    setCurrentFile("");
  };

  // Handle category selection
  const handleCategoryChange = (categoryId) => {
    console.log("Category change triggered for ID:", categoryId);
    console.log("Current categories:", formData.categories);
    
    const updatedCategories = formData.categories.includes(categoryId)
      ? formData.categories.filter(id => id !== categoryId)
      : [...formData.categories, categoryId];

    console.log("Updated categories:", updatedCategories);
    
    setFormData(prev => ({ ...prev, categories: updatedCategories }));
  };

  // Handle tags input
  const handleTagsChange = (value) => {
    const tagsArray = value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({ ...prev, tags: tagsArray }));
  };

  // Generate slug from title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  // Handle adding new category
  const handleAddNewCategory = () => {
    if (!newCategory.en.trim() || !newCategory.ar.trim()) {
      toast.error("Please enter category names in both languages");
      return;
    }

    const categoryId = `cat_${Date.now()}`;
    const newCategoryObj = {
      id: categoryId,
      name: { ...newCategory }
    };

    setAvailableCategories(prev => [...prev, newCategoryObj]);
    setFormData(prev => ({
      ...prev,
      categories: [...prev.categories, categoryId]
    }));

    setNewCategory({ en: "", ar: "" });
    setShowAddCategory(false);
    toast.success("Category added successfully!");
  };

  // Auto-generate slug when title changes
  useEffect(() => {
    if (formData.title.en && !formData.seo.slug) {
      const slug = generateSlug(formData.title.en);
      handleSEOChange('slug', slug);
    }
  }, [formData.title.en]);

  // Toggle collapsible sections
  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Handle form submission
  const handleSubmit = async (status = 'draft') => {
    if (!formData.title.en || !formData.content.en) {
      toast.error("English title and content are required");
      return;
    }

    setIsLoading(true);

    const payload = {
      ...formData,
      image: uploadedImage,
      status,
      categories: formData.categories || [],
      tags: formData.tags || [],
      seo: {
        ...formData.seo,
        slug: formData.seo.slug || generateSlug(formData.title.en)
      }
    };

    // Debug: Log the payload to see what's being sent
    console.log("Sending payload:", payload);
    console.log("Categories being sent:", payload.categories);

    try {
      let response;
      if (isEdit) {
        response = await updateBlog(id, payload);
      } else {
        response = await createBlog(payload);
      }

      if (response.status === 200 || response.status === 201) {
        toast.success(isEdit ? "Blog updated successfully!" : "Blog created successfully!");
        navigate("/en/admin/blog");
      } else {
        toast.error(response.data?.error || "Error saving blog");
      }
    } catch (err) {
      console.error("Blog save error:", err);
      console.error("Error details:", err.response?.data);
      toast.error("Something went wrong while saving the blog!");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle preview
  const handlePreview = () => {
    setShowPreview(true);
  };

  if (loading) {
    return <div className="wordpress-loading">Loading...</div>;
  }

  if (error) {
    return <div className="wordpress-error">{error}</div>;
  }

  return (
    <div className="wordpress-blog-editor">
      {/* Top Bar */}
      <div className="wordpress-top-bar">
        <div className="top-bar-left">
          <h1 className="page-title">
            {isEdit ? "Edit Post" : "Add New Post"}
          </h1>
        </div>
        <div className="top-bar-right">
          <Button variant="outline-secondary" onClick={handlePreview} className="me-2">
            <FaEye /> Preview
          </Button>
          <Button variant="secondary" onClick={() => navigate("/en/admin/blog")}>
            Back to Posts
          </Button>
        </div>
      </div>

      <Row className="wordpress-main-content">
        {/* Main Content Area */}
        <Col lg={8} className="main-content">
          <Card className="wordpress-editor-card">
            <Card.Body>
              {/* Language Switcher */}
              <div className="language-switcher mb-3">
                <Button
                  variant={activeLanguage === 'en' ? 'primary' : 'outline-primary'}
                  size="sm"
                  onClick={() => setActiveLanguage('en')}
                  className="me-2"
                >
                  English
                </Button>
                <Button
                  variant={activeLanguage === 'ar' ? 'primary' : 'outline-primary'}
                  size="sm"
                  onClick={() => setActiveLanguage('ar')}
                >
                  العربية
                </Button>
              </div>

              {/* Title Input */}
              <div className="title-section mb-4">
                <Form.Control
                  type="text"
                  placeholder={activeLanguage === 'en' ? "Enter title here" : "أدخل العنوان هنا"}
                  value={formData.title[activeLanguage] || ""}
                  onChange={(e) => handleInputChange('title', e.target.value, activeLanguage)}
                  className="title-input"
                  dir={activeLanguage === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>

              {/* Permalink */}
              {formData.seo.slug && (
                <div className="permalink-section mb-3">
                  <small className="text-muted">
                    Permalink: <span className="text-primary">https://mahaballoons.com/blog/{formData.seo.slug}</span>
                  </small>
                </div>
              )}

              {/* Content Editor */}
              <div className="content-editor">
                {typeof ReactQuill !== 'undefined' ? (
                  <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    value={formData.content[activeLanguage] || ""}
                    onChange={(content) => handleInputChange('content', content, activeLanguage)}
                    placeholder={activeLanguage === 'en' ? "Start writing your post..." : "ابدأ في كتابة مقالك..."}
                    modules={quillModules}
                    formats={quillFormats}
                    className={`quill-editor ${activeLanguage === 'ar' ? 'rtl' : ''}`}
                    style={{
                      height: '400px',
                      marginBottom: '42px'
                    }}
                  />
                ) : (
                  <Form.Control
                    as="textarea"
                    rows={15}
                    value={formData.content[activeLanguage] || ""}
                    onChange={(e) => handleInputChange('content', e.target.value, activeLanguage)}
                    placeholder={activeLanguage === 'en' ? "Start writing your post..." : "ابدأ في كتابة مقالك..."}
                    className="content-textarea"
                    dir={activeLanguage === 'ar' ? 'rtl' : 'ltr'}
                  />
                )}
                <div className="editor-footer mt-4">
                  <small className="text-muted">
                    Word count: {wordCount}
                  </small>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Collapsible Sections */}
          <div className="wordpress-sections mt-3">
            {/* Excerpt Section */}
            <Card className="wordpress-section-card">
              <Card.Header 
                className="wordpress-section-header"
                onClick={() => toggleSection('excerpt')}
                style={{ cursor: 'pointer' }}
              >
                <span>Written By</span>
                {openSections.excerpt ? <FaChevronUp /> : <FaChevronDown />}
              </Card.Header>
              <Collapse in={openSections.excerpt}>
                <Card.Body>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={formData.written_by[activeLanguage] || ""}
                    onChange={(e) => handleInputChange('written_by', e.target.value, activeLanguage)}
                    placeholder={activeLanguage === 'en' ? "Write an Author (optional)" : "اكتب اسم المؤلف (اختياري)"}
                    dir={activeLanguage === 'ar' ? 'rtl' : 'ltr'}
                  />
                  <small className="text-muted">
                    Enter the name of the author who wrote this blog post.
                  </small>
                </Card.Body>
              </Collapse>
            </Card>

            {/* SEO Section */}
            <Card className="wordpress-section-card">
              <Card.Header
                className="wordpress-section-header"
                onClick={() => toggleSection('seo')}
                style={{ cursor: 'pointer' }}
              >
                <span>SEO Settings</span>
                {openSections.seo ? <FaChevronUp /> : <FaChevronDown />}
              </Card.Header>
              <Collapse in={openSections.seo}>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Meta Title ({activeLanguage === 'en' ? 'English' : 'Arabic'})</Form.Label>
                        <Form.Control
                          type="text"
                          value={formData.seo.metaTitle[activeLanguage] || ""}
                          onChange={(e) => handleSEOChange('metaTitle', e.target.value, activeLanguage)}
                          dir={activeLanguage === 'ar' ? 'rtl' : 'ltr'}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Focus Keywords</Form.Label>
                        <Form.Control
                          type="text"
                          value={formData.seo.focusKeywords || ""}
                          onChange={(e) => handleSEOChange('focusKeywords', e.target.value)}
                          placeholder="keyword1, keyword2, keyword3"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-3">
                    <Form.Label>Meta Description ({activeLanguage === 'en' ? 'English' : 'Arabic'})</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={formData.seo.metaDescription[activeLanguage] || ""}
                      onChange={(e) => handleSEOChange('metaDescription', e.target.value, activeLanguage)}
                      dir={activeLanguage === 'ar' ? 'rtl' : 'ltr'}
                    />
                  </Form.Group>
                </Card.Body>
              </Collapse>
            </Card>
          </div>
        </Col>

        {/* Sidebar */}
        <Col lg={4} className="wordpress-sidebar">
          {/* Publish Box */}
          <Card className="wordpress-publish-box mb-3">
            <Card.Header>
              <FaCog className="me-2" />
              Publish
            </Card.Header>
            <Card.Body>
              <div className="publish-actions mb-3">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => handleSubmit('draft')}
                  disabled={isLoading}
                  className="me-2"
                >
                  Save Draft
                </Button>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={handlePreview}
                >
                  Preview
                </Button>
              </div>

              <div className="publish-meta">
                <div className="meta-item">
                  <span>Status:</span>
                  <Form.Select
                    size="sm"
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="d-inline-block w-auto ms-2"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </Form.Select>
                </div>

                <div className="meta-item">
                  <FaGlobe className="me-1" />
                  <span>Visibility:</span>
                  <span className="ms-2">
                    {formData.status === 'published' ? 'Public' : 'Private'}
                  </span>
                </div>

                <div className="meta-item">
                  <FaCalendarAlt className="me-1" />
                  <span>Publish:</span>
                  <Form.Control
                    type="datetime-local"
                    size="sm"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="d-inline-block w-auto ms-2"
                  />
                </div>
              </div>

              <div className="publish-button-section mt-3 pt-3 border-top">
                <Button
                  variant="primary"
                  onClick={() => handleSubmit('published')}
                  disabled={isLoading}
                  className="w-100"
                >
                  {isLoading ? "Publishing..." : isEdit ? "Update" : "Publish"}
                </Button>
              </div>
            </Card.Body>
          </Card>

          {/* Format Box */}
          <Card className="wordpress-format-box mb-3">
            <Card.Header>Format</Card.Header>
            <Card.Body>
              {postFormats.map(format => (
                <Form.Check
                  key={format.id}
                  type="radio"
                  name="format"
                  id={`format-${format.id}`}
                  label={`${format.icon} ${format.name}`}
                  checked={formData.format === format.id}
                  onChange={() => handleInputChange('format', format.id)}
                  className="mb-2"
                />
              ))}
            </Card.Body>
          </Card>

          {/* Categories Box */}
          <Card className="wordpress-categories-box mb-3">
            <Card.Header>
              <FaFolder className="me-2" />
              Categories
              {loading && <small className="text-muted ms-2">(Loading...)</small>}
            </Card.Header>
            <Card.Body>
              <div className="categories-list">
                {availableCategories.map(category => (
                  <Form.Check
                    key={category.id}
                    type="checkbox"
                    id={`category-${category.id}`}
                    label={`${category.name.en} / ${category.name.ar}`}
                    checked={formData.categories.includes(category.id)}
                    onChange={() => handleCategoryChange(category.id)}
                    className="mb-2"
                  />
                ))}
              </div>

              {/* Selected Categories Display */}
              {formData.categories.length > 0 && (
                <div className="selected-categories mt-3 p-2 bg-light rounded">
                  <small className="text-muted d-block mb-2">Selected Categories:</small>
                  {formData.categories.map(categoryId => {
                    const category = availableCategories.find(cat => cat.id === categoryId);
                    return category ? (
                      <Badge key={categoryId} bg="primary" className="me-1 mb-1">
                        {category.name.en}
                      </Badge>
                    ) : (
                      <Badge key={categoryId} bg="secondary" className="me-1 mb-1">
                        {categoryId}
                      </Badge>
                    );
                  })}
                </div>
              )}

              {/* Debug Info */}
              {process.env.NODE_ENV === 'development' && (
                <div className="debug-info mt-2 p-2 bg-warning bg-opacity-10 rounded">
                  <small className="text-muted">
                    Debug: Categories count: {formData.categories.length} | 
                    Categories: {JSON.stringify(formData.categories)}
                  </small>
                </div>
              )}

              {showAddCategory ? (
                <div className="add-category-form mt-3 p-2 border rounded">
                  <Form.Group className="mb-2">
                    <Form.Label className="small">Category Name (English)</Form.Label>
                    <Form.Control
                      type="text"
                      size="sm"
                      value={newCategory.en}
                      onChange={(e) => setNewCategory(prev => ({ ...prev, en: e.target.value }))}
                      placeholder="Enter English name"
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label className="small">Category Name (Arabic)</Form.Label>
                    <Form.Control
                      type="text"
                      size="sm"
                      value={newCategory.ar}
                      onChange={(e) => setNewCategory(prev => ({ ...prev, ar: e.target.value }))}
                      placeholder="أدخل الاسم بالعربية"
                      dir="rtl"
                    />
                  </Form.Group>
                  <div className="d-flex gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleAddNewCategory}
                    >
                      Add
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setShowAddCategory(false);
                        setNewCategory({ en: "", ar: "" });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 mt-2"
                  onClick={() => setShowAddCategory(true)}
                >
                  + Add New Category
                </Button>
              )}
            </Card.Body>
          </Card>

          {/* Tags Box */}
          <Card className="wordpress-tags-box mb-3">
            <Card.Header>
              <FaTags className="me-2" />
              Tags
            </Card.Header>
            <Card.Body>
              <Form.Control
                type="text"
                value={formData.tags.join(', ')}
                onChange={(e) => handleTagsChange(e.target.value)}
                placeholder="Add tags separated by commas"
              />
              <small className="text-muted mt-1 d-block">
                Separate tags with commas
              </small>
              {formData.tags.length > 0 && (
                <div className="mt-2">
                  {formData.tags.map((tag, idx) => (
                    <Badge key={idx} bg="secondary" className="me-1 mb-1">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Featured Image Box */}
          <Card className="wordpress-image-box mb-3">
            <Card.Header>
              <FaImage className="me-2" />
              Featured Image
            </Card.Header>
            <Card.Body>
              {uploadedImage ? (
                <div className="featured-image-preview">
                  <img
                    src={uploadedImage}
                    alt="Featured"
                    className="img-fluid rounded mb-3"
                  />
                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => setCurrentFile("blog_image")}
                    >
                      Change Image
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => {
                        setUploadedImage("");
                        setFormData(prev => ({ ...prev, image: "" }));
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline-primary"
                  onClick={() => setCurrentFile("blog_image")}
                  className="w-100"
                >
                  <FaImage className="me-2" />
                  Set Featured Image
                </Button>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Preview Modal */}
      <Modal show={showPreview} onHide={() => setShowPreview(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Post Preview ({activeLanguage === 'en' ? 'English' : 'Arabic'})</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="blog-preview" dir={activeLanguage === 'ar' ? 'rtl' : 'ltr'}>
            <h1>{formData.title[activeLanguage] || "No Title"}</h1>
            <div className="blog-meta mb-3">
              <small className="text-muted">
                By {formData.written_by[activeLanguage] || "Unknown Author"} |
                {formData.date ? new Date(formData.date).toLocaleDateString() : "No Date"}
              </small>
            </div>
            
            {/* Categories in Preview */}
            {formData.categories.length > 0 && (
              <div className="mb-3">
                <strong>Categories: </strong>
                {formData.categories.map(categoryId => {
                  const category = availableCategories.find(cat => cat.id === categoryId);
                  return category ? (
                    <Badge key={categoryId} bg="info" className="me-1">
                      {category.name[activeLanguage] || category.name.en}
                    </Badge>
                  ) : (
                    <Badge key={categoryId} bg="secondary" className="me-1">
                      {categoryId}
                    </Badge>
                  );
                })}
              </div>
            )}
            
            {uploadedImage && (
              <img
                src={uploadedImage}
                alt="Featured"
                className="img-fluid mb-3 rounded"
              />
            )}
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: formData.content[activeLanguage] || "No content" }}
            />
          </div>
        </Modal.Body>
      </Modal>

      {/* Upload Component */}
      <Upload widgetRef={widgetRef} setUploadedUrls={handleImageUpload} />
    </div>
  );
}

export default EnhancedBlogForm;

// Additional custom styles for ReactQuill and category form
const styles = `
  .quill-editor .ql-container {
    font-size: 14px;
    border-bottom-left-radius: 0.375rem;
    border-bottom-right-radius: 0.375rem;
  }
  
  .quill-editor .ql-toolbar {
    border-top-left-radius: 0.375rem;
    border-top-right-radius: 0.375rem;
    border-color: #ced4da;
  }
  
  .quill-editor .ql-editor {
    min-height: 350px;
    padding: 15px;
  }
  
  .quill-editor.rtl .ql-editor {
    direction: rtl;
    text-align: right;
  }
  
  .add-category-form {
    background-color: #f8f9fa;
    border: 1px solid #dee2e6 !important;
  }
  
  .add-category-form .form-label {
    font-weight: 500;
    color: #495057;
  }
  
  .wordpress-categories-box .categories-list {
    max-height: 200px;
    overflow-y: auto;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}
