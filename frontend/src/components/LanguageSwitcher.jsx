import { useLang } from '../i18n/LangContext.jsx';

export default function LanguageSwitcher() {
  const { lang, setLang } = useLang();

  return (
    <div className="lang-switch">
      <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>
        EN
      </button>
      <button className={lang === 'ka' ? 'active' : ''} onClick={() => setLang('ka')}>
        KA
      </button>
    </div>
  );
}
