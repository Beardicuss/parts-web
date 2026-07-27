import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { LangProvider, useLang } from './LangContext.jsx';
import en from './en.json';
import ka from './ka.json';

function LanguageProbe() {
  const { lang, setLang, t, field } = useLang();
  const part = { title_en: 'Control Unit', title_ka: 'მართვის ბლოკი' };

  return (
    <div>
      <span data-testid="lang">{lang}</span>
      <span data-testid="translation">{t('nav.catalog')}</span>
      <span data-testid="field">{field(part, 'title')}</span>
      <button type="button" onClick={() => setLang('ka')}>
        Georgian
      </button>
    </div>
  );
}

describe('LangContext', () => {
  it('keeps the English and Georgian dictionaries in sync', () => {
    expect(Object.keys(ka).sort()).toEqual(Object.keys(en).sort());
  });

  it('switches translated labels and localized data fields', async () => {
    const user = userEvent.setup();
    render(
      <LangProvider>
        <LanguageProbe />
      </LangProvider>
    );

    expect(screen.getByTestId('lang')).toHaveTextContent('en');
    expect(screen.getByTestId('translation')).toHaveTextContent('Catalog');
    expect(screen.getByTestId('field')).toHaveTextContent('Control Unit');

    await user.click(screen.getByRole('button', { name: 'Georgian' }));

    expect(screen.getByTestId('lang')).toHaveTextContent('ka');
    expect(screen.getByTestId('translation')).toHaveTextContent('კატალოგი');
    expect(screen.getByTestId('field')).toHaveTextContent('მართვის ბლოკი');
    expect(localStorage.getItem('catalog_lang')).toBe('ka');
    expect(document.documentElement).toHaveAttribute('lang', 'ka');
  });
});
