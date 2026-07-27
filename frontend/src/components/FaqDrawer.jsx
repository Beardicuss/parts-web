import { useState } from 'react';
import { useLang } from '../i18n/LangContext.jsx';

export default function FaqDrawer({ isOpen, onClose }) {
  const { t } = useLang();
  const [openIndex, setOpenIndex] = useState(null);

  if (!isOpen) return null;

  const faqs = [
    { q: 'faq.q1', a: 'faq.a1' },
    { q: 'faq.q2', a: 'faq.a2' },
    { q: 'faq.q3', a: 'faq.a3' },
    { q: 'faq.q4', a: 'faq.a4' },
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <div className="faq-drawer-overlay" onClick={onClose} />
      <div className={`faq-drawer ${isOpen ? 'open' : ''}`}>
        <div className="faq-drawer-header">
          <h3>{t('faq.title')}</h3>
          <button className="faq-close-btn" onClick={onClose} aria-label={t('faq.close')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="faq-drawer-content">
          <div className="faq-accordion">
            {faqs.map((faq, index) => (
              <div key={index} className={`faq-item ${openIndex === index ? 'open' : ''}`}>
                <button className="faq-question" onClick={() => toggleAccordion(index)}>
                  <span>{t(faq.q)}</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="faq-chevron"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                <div className="faq-answer">
                  <p>{t(faq.a)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
