import { useLang } from '../i18n/LangContext.jsx';

export default function LanguageSwitcher() {
  const { lang, setLang } = useLang();

  return (
    <div className="toggle-container" title="Switch Language">
      <input 
        type="checkbox" 
        className="toggle-input" 
        checked={lang === 'ka'}
        onChange={(e) => setLang(e.target.checked ? 'ka' : 'en')}
      />
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 292 142" className="toggle">
        <path d="M71 142C31.7878 142 0 110.212 0 71C0 31.7878 31.7878 0 71 0C110.212 0 119 30 146 30C173 30 182 0 221 0C260 0 292 31.7878 292 71C292 110.212 260.212 142 221 142C181.788 142 173 112 146 112C119 112 110.212 142 71 142Z" className="toggle-background"></path>
        <g filter="url('#goo')">
          <rect rx="29" height="58" width="116" y="42" x="13" className="toggle-circle-center"></rect>
          <rect rx="58" height="114" width="114" y="14" x="14" className="toggle-circle left"></rect>
          <rect rx="58" height="114" width="114" y="14" x="164" className="toggle-circle right"></rect>
        </g>
        <filter id="goo">
          <feGaussianBlur stdDeviation="10" result="blur" in="SourceGraphic"></feGaussianBlur>
          <feColorMatrix result="goo" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" mode="matrix" in="blur"></feColorMatrix>
        </filter>
        <text x="71" y="93" textAnchor="middle" fontSize="56" fontWeight="bold" fontFamily="var(--font-display)" className="toggle-text en">EN</text>
        <text x="221" y="93" textAnchor="middle" fontSize="56" fontWeight="bold" fontFamily="var(--font-display)" className="toggle-text ka">KA</text>
      </svg>
    </div>
  );
}
