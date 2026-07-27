import { expect, test } from '@playwright/test';

test('homepage category opens a filtered catalog and Reset restores all parts', async ({
  page
}) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Lighting — View category' }).click();

  await expect(page).toHaveURL(/\/catalog\?system=lighting$/);
  await expect(page.getByRole('heading', { name: 'Catalog' })).toBeVisible();
  await expect(
    page.getByRole('link', { name: /LED Headlight Control Unit/ }).first()
  ).toBeVisible();
  await expect(page.getByRole('link', { name: /Distronic Radar Distance Sensor/ })).toHaveCount(0);

  await page.getByRole('button', { name: 'Reset' }).click();

  await expect(page).toHaveURL(/\/catalog$/);
  await expect(
    page.getByRole('link', { name: /Distronic Radar Distance Sensor/ }).first()
  ).toBeVisible();
});

test('catalog URL state survives product detail navigation and contact includes the code', async ({
  page
}) => {
  await page.goto('/catalog?system=lighting');
  await page.getByLabel('Search by code or name').fill('A1669003309');

  await expect(page).toHaveURL(/q=A1669003309.*system=lighting/);
  await page.getByRole('link', { name: /LED Headlight Control Unit/ }).click();

  const contact = page.getByRole('link', { name: 'Contact Us' });
  await expect(contact).toHaveAttribute('href', /A1669003309/);
  await page.getByRole('link', { name: 'Back to catalog' }).click();

  await expect(page).toHaveURL(/\/catalog\?q=A1669003309.*system=lighting/);
  await expect(page.getByLabel('Search by code or name')).toHaveValue('A1669003309');
});

test('unknown routes render the localized not-found page', async ({ page }) => {
  await page.goto('/this-route-does-not-exist');
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Return to main page' })).toBeVisible();
});

test('a failed product image shows a readable fallback', async ({ page }) => {
  await page.route('**/parts/1669003309.webp', (route) => route.abort());
  await page.goto('/parts/13');
  await expect(page.getByText('Image unavailable')).toBeVisible();
});
