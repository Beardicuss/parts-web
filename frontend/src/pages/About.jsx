import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LangContext.jsx';

const strengths = ['experience', 'support', 'reach'];
const markets = ['georgia', 'caucasus', 'russia', 'uae', 'usa'];

export default function About() {
  const { t } = useLang();

  return (
    <>
      <section className="about-hero">
        <div className="container about-hero-grid">
          <div className="about-hero-copy">
            <span className="hero-eyebrow">{t('about.eyebrow')}</span>
            <h1>{t('about.title')}</h1>
            <p>{t('about.intro')}</p>
          </div>

          <aside className="about-reach-card" aria-label={t('about.reachTitle')}>
            <span className="about-reach-label">{t('about.reachLabel')}</span>
            <h2>{t('about.reachTitle')}</h2>
            <div className="about-market-list">
              {markets.map((market) => (
                <span key={market}>{t(`about.market.${market}`)}</span>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="about-story-section">
        <div className="container">
          <div className="about-story-grid">
            <div>
              <span className="section-eyebrow">{t('about.storyEyebrow')}</span>
              <h2>{t('about.storyTitle')}</h2>
            </div>
            <div className="about-story-copy">
              <p>{t('about.storyParagraphOne')}</p>
              <p>{t('about.storyParagraphTwo')}</p>
            </div>
          </div>

          <div className="about-strength-grid">
            {strengths.map((strength, index) => (
              <article className="about-strength-card" key={strength}>
                <span className="about-strength-number">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3>{t(`about.${strength}.title`)}</h3>
                <p>{t(`about.${strength}.description`)}</p>
              </article>
            ))}
          </div>

          <div className="about-cta">
            <div>
              <h2>{t('about.ctaTitle')}</h2>
              <p>{t('about.ctaDescription')}</p>
            </div>
            <div className="about-cta-actions">
              <Link className="btn btn-primary" to="/catalog">
                {t('nav.viewCatalog')}
              </Link>
              <Link className="btn btn-outline" to="/services">
                {t('nav.services')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
