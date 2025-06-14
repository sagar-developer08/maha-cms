import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';

const RichTextEditor = ({ 
  value, 
  onChange, 
  placeholder = "Write your content here...", 
  height = 300,
  dir = "ltr",
  language = "en"
}) => {
  const [ReactQuill, setReactQuill] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const loadQuill = async () => {
      try {
        // Dynamic import with error handling
        const quillModule = await import('react-quill');
        const ReactQuillComponent = quillModule.default;
        
        // Load CSS
        await import('react-quill/dist/quill.snow.css');
        
        setReactQuill(() => ReactQuillComponent);
        setIsLoading(false);
      } catch (error) {
        console.warn('Failed to load React Quill:', error);
        setLoadError(true);
        setIsLoading(false);
      }
    };

    loadQuill();
  }, []);

  // Fallback textarea if Quill fails to load
  const FallbackEditor = () => (
    <div>
      <div className="alert alert-info mb-2" style={{ fontSize: '12px', padding: '8px' }}>
        <small>📝 Rich text editor is loading... Using simple text editor as fallback.</small>
      </div>
      <Form.Control
        as="textarea"
        rows={12}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        dir={dir}
        style={{ 
          minHeight: `${height}px`,
          resize: 'vertical',
          fontFamily: 'monospace',
          fontSize: '14px'
        }}
      />
    </div>
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="text-center p-4">
        <div className="spinner-border spinner-border-sm" role="status">
          <span className="visually-hidden">Loading editor...</span>
        </div>
        <p className="mt-2 text-muted">Loading rich text editor...</p>
      </div>
    );
  }

  // Error state or fallback
  if (loadError || !ReactQuill) {
    return <FallbackEditor />;
  }

  // Quill configuration
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote'],
      ['link'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline',
    'list', 'bullet',
    'blockquote',
    'link'
  ];

  try {
    return (
      <div className="rich-text-editor-wrapper" dir={dir}>
        <ReactQuill
          theme="snow"
          value={value || ''}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          style={{ 
            height: `${height}px`,
            marginBottom: '42px'
          }}
          className={`quill-editor ${language === 'ar' ? 'rtl-editor' : 'ltr-editor'}`}
        />
      </div>
    );
  } catch (error) {
    console.warn('React Quill render failed:', error);
    return <FallbackEditor />;
  }
};

export default RichTextEditor; 