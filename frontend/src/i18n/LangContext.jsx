import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import en from './en.json';
import ka from './ka.json';

const dictionaries = { en, ka };
const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('catalog_lang');
    if (saved === 'en' || saved === 'ka') return saved;
    return navigator.language?.toLowerCase().startsWith('ka') ? 'ka' : 'en';
  });

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setAndPersist = (next) => {
    setLang(next);
    localStorage.setItem('catalog_lang', next);
  };

  const t = useMemo(() => {
    const dict = dictionaries[lang] || dictionaries.en;
    return (key) => dict[key] || key;
  }, [lang]);

  // Picks the field for the current language, e.g. field(part, 'title') -> title_en / title_ka.
  // Falls back to whichever language actually has content — an empty string counts as "missing",
  // so admins can fill in just one language and the site still shows something sensible.
  const field = (obj, base) => {
    if (!obj) return '';
    const primary = obj[`${base}_${lang}`];
    if (primary) return primary;
    const fallback = lang === 'en' ? obj[`${base}_ka`] : obj[`${base}_en`];
    return fallback || '';
  };

  return (
    <LangContext.Provider value={{ lang, setLang: setAndPersist, t, field }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LangProvider');
  return ctx;
}
