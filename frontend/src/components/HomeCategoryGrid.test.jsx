import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { LangProvider } from '../i18n/LangContext.jsx';
import HomeCategoryGrid from './HomeCategoryGrid.jsx';

describe('HomeCategoryGrid', () => {
  it('links each visual category to a stable catalog system filter', () => {
    render(
      <MemoryRouter>
        <LangProvider>
          <HomeCategoryGrid />
        </LangProvider>
      </MemoryRouter>
    );

    const expectedLinks = {
      'Control Unit — View category': '/catalog?system=control-unit',
      'Lighting — View category': '/catalog?system=lighting',
      'Steering Wheels — View category': '/catalog?system=steering-wheels',
      'Engine & Transmission — View category': '/catalog?system=engine-transmission',
      'Retrofit Adapter — View category': '/catalog?system=retrofit-adapter',
      'Axles & Suspension — View category': '/catalog?system=axles-suspension'
    };

    for (const [name, href] of Object.entries(expectedLinks)) {
      expect(screen.getByRole('link', { name })).toHaveAttribute('href', href);
    }
  });
});
