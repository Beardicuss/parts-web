# Phase 5 — Accessibility, localization, and visual system

## Language strategy

The initial language is selected in this order:

1. A valid saved preference (`catalog_lang`).
2. Georgian when the browser locale begins with `ka`.
3. English as the business fallback.

Changing language updates the saved preference, `<html lang>`, visible interface text,
route title, and description metadata. English and Georgian dictionaries are checked for
identical keys by an automated unit test.

## Keyboard and assistive-technology behavior

- A visible-on-focus skip link moves focus to the public page's main content.
- Every native form control has or inherits an accessible name.
- The photo upload target responds to Enter and Space as well as click, drag, and drop.
- Dialogs and the FAQ drawer trap focus, close with Escape, and restore focus to their
  trigger.
- FAQ questions expose expanded state and their controlled answer.
- Toasts use polite status announcements; errors use assertive alert announcements.
- Focus indicators are consistent across links, buttons, and form controls.
- Reduced-motion preferences collapse nonessential animation and transition durations.

## Design tokens

The shared CSS custom properties are the source of truth:

- Surfaces: `--bg`, `--surface`, `--surface-raised`
- Borders: `--border`, `--border-soft`
- Text: `--text`, `--text-muted`, `--text-faint`
- Actions: `--accent`, `--accent-hover`, `--accent-muted`, `--accent-ink`
- Status: `--danger`, `--success`
- Shape/type: `--radius`, `--font-body`, `--font-display`, `--font-mono`

Reusable states cover focus, hover, disabled, loading/skeleton, empty, error, destructive,
dialog, and image-fallback behavior. Light-theme action and muted-text colors were
strengthened for contrast.

## Automated acceptance

Playwright runs axe WCAG 2.0/2.1 A and AA checks against public routes, not-found handling,
and reachable admin routes in both light and dark themes. Serious and critical violations
fail the suite. Separate browser checks cover skip-link focus, FAQ keyboard operation,
focus restoration, Georgian switching, document language, and localized titles.

Automated checks do not replace the final authenticated keyboard pass. Admin CRUD and photo
upload should be exercised with a disposable Supabase admin account before release.
