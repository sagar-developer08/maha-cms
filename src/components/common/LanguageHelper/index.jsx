import React, { useState, useEffect } from 'react';

const LanguageHelper = {
  // Detect browser language
  getBrowserLanguage: () => {
    const lang = navigator.language || navigator.userLanguage;
    return lang.startsWith('ar') ? 'ar' : 'en';
  },

  // Get current language from localStorage with fallback
  getCurrentLanguage: () => {
    const stored = localStorage.getItem('cms_language');
    return stored || LanguageHelper.getBrowserLanguage();
  },

  // Set language and store in localStorage
  setLanguage: (lang) => {
    localStorage.setItem('cms_language', lang);
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  },

  // Force input direction based on content
  getInputDirection: (value, language) => {
    // If user specified language, respect it
    if (language) {
      return language === 'ar' ? 'rtl' : 'ltr';
    }
    
    // Auto-detect based on content
    if (!value) return 'ltr';
    
    // Check if content contains Arabic characters
    const arabicRegex = /[\u0600-\u06FF\u0750-\u077F]/;
    return arabicRegex.test(value) ? 'rtl' : 'ltr';
  },

  // Smart input props to prevent language forcing
  getSmartInputProps: (value, language, onChange) => {
    const direction = LanguageHelper.getInputDirection(value, language);
    
    return {
      dir: direction,
      value: value || '',
      onChange: (e) => {
        // Prevent automatic language switching by browser
        e.target.style.textAlign = direction === 'rtl' ? 'right' : 'left';
        onChange(e);
      },
      style: {
        textAlign: direction === 'rtl' ? 'right' : 'left',
        fontFamily: direction === 'rtl' ? 
          'Arial, "Helvetica Neue", sans-serif' : 
          '"Segoe UI", Roboto, sans-serif'
      }
    };
  },

  // Sanitize and validate input based on expected language
  sanitizeInput: (value, expectedLanguage) => {
    if (!value) return '';
    
    // Remove any unwanted direction markers
    let sanitized = value
      .replace(/[\u200E\u200F\u202A-\u202E]/g, '') // Remove direction markers
      .trim();
    
    // If expected language is English, warn about Arabic characters
    if (expectedLanguage === 'en') {
      const arabicRegex = /[\u0600-\u06FF\u0750-\u077F]/;
      if (arabicRegex.test(sanitized)) {
        console.warn('Arabic characters detected in English field');
      }
    }
    
    return sanitized;
  }
};

// React hook for language management
export const useLanguage = () => {
  const [currentLanguage, setCurrentLanguage] = useState(
    LanguageHelper.getCurrentLanguage()
  );

  useEffect(() => {
    LanguageHelper.setLanguage(currentLanguage);
  }, [currentLanguage]);

  const switchLanguage = (lang) => {
    setCurrentLanguage(lang);
    LanguageHelper.setLanguage(lang);
  };

  return {
    currentLanguage,
    switchLanguage,
    isRTL: currentLanguage === 'ar'
  };
};

// Enhanced Input Component that prevents language forcing
export const SmartInput = ({ 
  value, 
  onChange, 
  language, 
  placeholder, 
  className = '',
  type = 'text',
  as = 'input',
  rows,
  ...props 
}) => {
  const inputProps = LanguageHelper.getSmartInputProps(value, language, onChange);
  const Component = as === 'textarea' ? 'textarea' : 'input';
  
  return (
    <Component
      type={as === 'textarea' ? undefined : type}
      rows={as === 'textarea' ? rows : undefined}
      className={`form-control ${className}`}
      placeholder={placeholder}
      {...inputProps}
      {...props}
    />
  );
};

export default LanguageHelper; 