import { useLang } from '../i18n/LangContext.jsx';

const FEATURES = [
  { icon: '🔍', titleKey: 'feature.search.title', descKey: 'feature.search.desc' },
  { icon: '🧩', titleKey: 'feature.range.title', descKey: 'feature.range.desc' },
  { icon: '🔄', titleKey: 'feature.updated.title', descKey: 'feature.updated.desc' },
  { icon: '🌐', titleKey: 'feature.bilingual.title', descKey: 'feature.bilingual.desc' }
];

export default function FeatureStrip() {
  const { t } = useLang();

  return (
    <div className="feature-strip">
      <div className="container feature-grid">
        {FEATURES.map((f) => (
          <div className="feature-item" key={f.titleKey}>
            <span className="feature-icon">{f.icon}</span>
            <div>
              <div className="feature-title">{t(f.titleKey)}</div>
              <div className="feature-desc">{t(f.descKey)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
