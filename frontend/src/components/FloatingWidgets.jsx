import { useCallback, useState } from 'react';
import { useLang } from '../i18n/LangContext.jsx';
import FaqDrawer from './FaqDrawer.jsx';

export default function FloatingWidgets() {
  const { t } = useLang();
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const closeFaq = useCallback(() => setIsFaqOpen(false), []);

  return (
    <>
      <div className="floating-widgets">
        <a
          href="tel:+995597969017"
          className="widget-btn call-btn"
          title={t('widget.call')}
          aria-label={t('widget.call')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
        </a>
        <button
          className="widget-btn faq-btn"
          onClick={() => setIsFaqOpen(true)}
          aria-label={t('widget.faq')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
            <path d="M80 160c0-35.3 28.7-64 64-64h32c35.3 0 64 28.7 64 64v3.6c0 21.8-11.1 42.1-29.4 53.8l-42.2 27.1c-25.2 16.2-40.4 44.1-40.4 74V320c0 17.7 14.3 32 32 32s32-14.3 32-32v-1.4c0-8.2 4.2-15.8 11-20.2l42.2-27.1c36.6-23.6 58.8-64.1 58.8-107.7V160c0-70.7-57.3-128-128-128H144C73.3 32 16 89.3 16 160c0 17.7 14.3 32 32 32s32-14.3 32-32zm80 320a40 40 0 1 0 0-80 40 40 0 1 0 0 80z"></path>
          </svg>
          <span className="faq-tooltip">{t('widget.faq')}</span>
        </button>
      </div>

      <FaqDrawer isOpen={isFaqOpen} onClose={closeFaq} />
    </>
  );
}
