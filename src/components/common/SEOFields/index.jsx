import React from 'react';
import { Form, Row, Col, Card } from 'react-bootstrap';
import './styles.scss';

const SEOFields = ({ 
  seoData, 
  onSEOChange, 
  language = 'en',
  showPreview = true,
  titleMaxLength = 60,
  descriptionMaxLength = 160
}) => {
  const handleChange = (field, value, lang = null) => {
    if (lang) {
      onSEOChange({
        ...seoData,
        [field]: {
          ...seoData[field],
          [lang]: value
        }
      });
    } else {
      onSEOChange({
        ...seoData,
        [field]: value
      });
    }
  };

  const getTitleLength = (lang) => {
    return seoData.metaTitle?.[lang]?.length || 0;
  };

  const getDescriptionLength = (lang) => {
    return seoData.metaDescription?.[lang]?.length || 0;
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (value, lang) => {
    handleChange('metaTitle', value, lang);
    
    // Auto-generate slug from English title if slug is empty
    if (lang === 'en' && !seoData.slug) {
      const slug = generateSlug(value);
      handleChange('slug', slug);
    }
  };

  return (
    <Card className="seo-fields-card">
      <Card.Header>
        <h5 className="mb-0">SEO & Meta Information</h5>
      </Card.Header>
      <Card.Body>
        <Row>
          {/* Meta Title */}
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                Meta Title (English) 
                <span className={`char-count ${getTitleLength('en') > titleMaxLength ? 'over-limit' : ''}`}>
                  {getTitleLength('en')}/{titleMaxLength}
                </span>
              </Form.Label>
              <Form.Control
                type="text"
                value={seoData.metaTitle?.en || ''}
                onChange={(e) => handleTitleChange(e.target.value, 'en')}
                placeholder="Enter meta title for search engines"
                maxLength={titleMaxLength + 20} // Allow slight overflow
              />
              <Form.Text className="text-muted">
                Recommended length: 50-60 characters
              </Form.Text>
            </Form.Group>
          </Col>
          
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                Meta Title (Arabic)
                <span className={`char-count ${getTitleLength('ar') > titleMaxLength ? 'over-limit' : ''}`}>
                  {getTitleLength('ar')}/{titleMaxLength}
                </span>
              </Form.Label>
              <Form.Control
                type="text"
                value={seoData.metaTitle?.ar || ''}
                onChange={(e) => handleTitleChange(e.target.value, 'ar')}
                placeholder="أدخل عنوان التعريف لمحركات البحث"
                maxLength={titleMaxLength + 20}
                dir="rtl"
              />
              <Form.Text className="text-muted">
                الطول الموصى به: 50-60 حرف
              </Form.Text>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          {/* Meta Description */}
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                Meta Description (English)
                <span className={`char-count ${getDescriptionLength('en') > descriptionMaxLength ? 'over-limit' : ''}`}>
                  {getDescriptionLength('en')}/{descriptionMaxLength}
                </span>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={seoData.metaDescription?.en || ''}
                onChange={(e) => handleChange('metaDescription', e.target.value, 'en')}
                placeholder="Enter meta description for search engines"
                maxLength={descriptionMaxLength + 30}
              />
              <Form.Text className="text-muted">
                Recommended length: 150-160 characters
              </Form.Text>
            </Form.Group>
          </Col>
          
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                Meta Description (Arabic)
                <span className={`char-count ${getDescriptionLength('ar') > descriptionMaxLength ? 'over-limit' : ''}`}>
                  {getDescriptionLength('ar')}/{descriptionMaxLength}
                </span>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={seoData.metaDescription?.ar || ''}
                onChange={(e) => handleChange('metaDescription', e.target.value, 'ar')}
                placeholder="أدخل وصف التعريف لمحركات البحث"
                maxLength={descriptionMaxLength + 30}
                dir="rtl"
              />
              <Form.Text className="text-muted">
                الطول الموصى به: 150-160 حرف
              </Form.Text>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          {/* URL Slug */}
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>URL Slug</Form.Label>
              <div className="input-group">
                <span className="input-group-text">/blog/</span>
                <Form.Control
                  type="text"
                  value={seoData.slug || ''}
                  onChange={(e) => handleChange('slug', e.target.value)}
                  placeholder="url-friendly-slug"
                />
              </div>
              <Form.Text className="text-muted">
                URL-friendly version of the title (auto-generated from English title)
              </Form.Text>
            </Form.Group>
          </Col>

          {/* Featured Image Alt Text */}
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Featured Image Alt Text (English)</Form.Label>
              <Form.Control
                type="text"
                value={seoData.imageAlt?.en || ''}
                onChange={(e) => handleChange('imageAlt', e.target.value, 'en')}
                placeholder="Describe the featured image for accessibility"
              />
              <Form.Text className="text-muted">
                Important for accessibility and SEO
              </Form.Text>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Featured Image Alt Text (Arabic)</Form.Label>
              <Form.Control
                type="text"
                value={seoData.imageAlt?.ar || ''}
                onChange={(e) => handleChange('imageAlt', e.target.value, 'ar')}
                placeholder="اوصف الصورة المميزة لسهولة الوصول"
                dir="rtl"
              />
            </Form.Group>
          </Col>

          {/* Focus Keywords */}
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Focus Keywords</Form.Label>
              <Form.Control
                type="text"
                value={seoData.focusKeywords || ''}
                onChange={(e) => handleChange('focusKeywords', e.target.value)}
                placeholder="keyword1, keyword2, keyword3"
              />
              <Form.Text className="text-muted">
                Comma-separated keywords for SEO optimization
              </Form.Text>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          {/* Open Graph Settings */}
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Open Graph Title (English)</Form.Label>
              <Form.Control
                type="text"
                value={seoData.ogTitle?.en || seoData.metaTitle?.en || ''}
                onChange={(e) => handleChange('ogTitle', e.target.value, 'en')}
                placeholder="Title for social media sharing"
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Open Graph Title (Arabic)</Form.Label>
              <Form.Control
                type="text"
                value={seoData.ogTitle?.ar || seoData.metaTitle?.ar || ''}
                onChange={(e) => handleChange('ogTitle', e.target.value, 'ar')}
                placeholder="العنوان لمشاركة وسائل التواصل الاجتماعي"
                dir="rtl"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <Form.Group className="mb-3">
              <Form.Label>Open Graph Description (English)</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={seoData.ogDescription?.en || seoData.metaDescription?.en || ''}
                onChange={(e) => handleChange('ogDescription', e.target.value, 'en')}
                placeholder="Description for social media sharing"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <Form.Group className="mb-3">
              <Form.Label>Open Graph Description (Arabic)</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={seoData.ogDescription?.ar || seoData.metaDescription?.ar || ''}
                onChange={(e) => handleChange('ogDescription', e.target.value, 'ar')}
                placeholder="الوصف لمشاركة وسائل التواصل الاجتماعي"
                dir="rtl"
              />
            </Form.Group>
          </Col>
        </Row>

        {/* SEO Preview */}
        {showPreview && (
          <div className="seo-preview">
            <h6>Search Engine Preview (English)</h6>
            <div className="preview-box">
              <div className="preview-title">
                {seoData.metaTitle?.en || 'Your Blog Title Here'}
              </div>
              <div className="preview-url">
                https://mahaballoons.com/blog/{seoData.slug || 'your-blog-slug'}
              </div>
              <div className="preview-description">
                {seoData.metaDescription?.en || 'Your meta description will appear here...'}
              </div>
            </div>

            <h6 className="mt-3">Search Engine Preview (Arabic)</h6>
            <div className="preview-box" dir="rtl">
              <div className="preview-title">
                {seoData.metaTitle?.ar || 'عنوان المقال الخاص بك هنا'}
              </div>
              <div className="preview-url">
                https://mahaballoons.com/blog/{seoData.slug || 'your-blog-slug'}
              </div>
              <div className="preview-description">
                {seoData.metaDescription?.ar || 'وصف التعريف الخاص بك سيظهر هنا...'}
              </div>
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default SEOFields; 