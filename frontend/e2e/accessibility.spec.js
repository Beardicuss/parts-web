import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const publicRoutes = ['/', '/catalog', '/parts/13', '/services', '/missing-page'];
const adminRoutes = ['/admin/login', '/admin/mfa', '/admin', '/admin/parts'];

for (const route of [...publicRoutes, ...adminRoutes]) {
  for (const theme of ['light', 'dark']) {
    test(`${route} has no serious accessibility violations in ${theme} theme`, async ({ page }) => {
      await page.addInitScript((selectedTheme) => {
        localStorage.setItem('app_theme', selectedTheme);
      }, theme);
      await page.goto(route);
      await page.waitForLoadState('networkidle');

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      const serious = results.violations.filter(({ impact }) =>
        ['serious', 'critical'].includes(impact)
      );

      expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
    });
  }
}

test('public controls and FAQ drawer support keyboard navigation', async ({ page }) => {
  await page.goto('/');

  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main-content')).toBeFocused();

  await page.getByRole('button', { name: 'FAQ' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog', { name: 'Frequently Asked Questions' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Close' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'FAQ' })).toBeFocused();
});

test('language selection updates visible text and document language', async ({ page }) => {
  await page.goto('/catalog');
  await page.getByRole('checkbox', { name: 'ქართული ენის გამოყენება' }).check();

  await expect(page.locator('html')).toHaveAttribute('lang', 'ka');
  await expect(page.getByRole('heading', { name: 'კატალოგი' })).toBeVisible();
  await expect(page).toHaveTitle(/ნაწილების კატალოგი/);
});
