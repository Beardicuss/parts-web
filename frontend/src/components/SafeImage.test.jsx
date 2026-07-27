import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LangProvider } from '../i18n/LangContext.jsx';
import SafeImage from './SafeImage.jsx';

describe('SafeImage', () => {
  it('replaces a failed image with localized readable text', () => {
    render(
      <LangProvider>
        <SafeImage src="/missing.webp" alt="Part photo" />
      </LangProvider>
    );
    fireEvent.error(screen.getByRole('img', { name: 'Part photo' }));
    expect(screen.getByText('Image unavailable')).toBeVisible();
  });
});
