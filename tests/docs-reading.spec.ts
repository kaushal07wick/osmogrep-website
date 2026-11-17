import { expect, test } from '@playwright/test';
import { docs, docHref } from '../lib/docs';

for (const doc of docs) {
  test(`${doc.title} uses the shared readable mobile layout`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 844 });
    const response = await page.goto(docHref(doc.slug));
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(doc.title);
    await expect(page.getByRole('contentinfo')).toHaveCount(1);
    await expect(page.locator('.docs-mobile-nav > summary')).toBeVisible();
    await expect(page.locator('.docs-prose')).toHaveCSS('font-size', '16px');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
  });
}

test('desktop reading columns align and the section index follows the reader', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/docs/runtime');
  const tops = await Promise.all(['.docs-wordmark', '.docs-breadcrumb', '.docs-on-this-page nav > p'].map(selector => page.locator(selector).evaluate(el => el.getBoundingClientRect().top)));
  expect(Math.max(...tops) - Math.min(...tops)).toBeLessThan(4);
  const target = page.getByRole('navigation', { name: 'On this page', exact: true }).getByRole('link', { name: 'Test detection', exact: true });
  await target.click();
  await expect(target).toHaveAttribute('aria-current', 'location');
  const sidebarTop = await page.locator('.docs-sidebar').evaluate(el => el.getBoundingClientRect().top);
  expect(sidebarTop).toBeGreaterThanOrEqual(56);
  expect(sidebarTop).toBeLessThanOrEqual(100);
  await page.locator('.docs-desktop-nav').getByRole('link', { name: 'GitHub integration', exact: true }).click();
  await expect(page).toHaveURL(/\/docs\/github$/);
  expect(await page.locator('h1').evaluate(el => el.getBoundingClientRect().top)).toBeGreaterThan(90);
  await page.goto('/docs/architecture');
  await expect(page.locator('.docs-desktop-nav [aria-current="page"]')).toBeInViewport();
  await expect(page.locator('.docs-wordmark')).toBeInViewport();
  const map = page.getByRole('region', { name: 'Interactive Catcher architecture map' });
  expect(await map.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
});

test('mobile navigation switches guides and closes its disclosure', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 844 });
  await page.goto('/docs');
  await page.locator('.docs-mobile-nav > summary').click();
  await page.locator('.docs-mobile-links').getByRole('link', { name: 'Terminal CLI', exact: true }).click();
  await expect(page).toHaveURL(/\/docs\/cli$/);
  await expect(page.locator('.docs-mobile-nav')).not.toHaveAttribute('open', '');
});

test('docs search supports keyboard navigation, focus restoration and bounded results', async ({ page }) => {
  await page.goto('/docs');
  const trigger = page.getByRole('button', { name: /Search documentation/ });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Search documentation' });
  const input = dialog.getByRole('searchbox');
  await page.mouse.move(30, 800);
  await expect(dialog).toBeVisible();
  await expect(input).toBeFocused();
  for (let i = 0; i < 9; i++) await page.keyboard.press('Tab');
  expect(await page.evaluate(() => Boolean(document.activeElement?.closest('dialog')))).toBe(true);
  await input.fill('/key');
  await expect(dialog.getByRole('link', { name: /Terminal CLI/ })).toBeVisible();
  expect(await dialog.getByRole('link').count()).toBeLessThanOrEqual(8);
  await input.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('');
  await page.keyboard.press('Control+k');
  await input.fill('/key');
  await input.press('ArrowDown');
  await expect(dialog.getByRole('link', { name: /Terminal CLI/ })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/docs\/cli$/);
  await expect(dialog).not.toBeVisible();
});

test('mobile docs search handles empty results and highlights safely', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 844 });
  await page.goto('/docs');
  await page.getByRole('button', { name: /Search documentation/ }).click();
  const dialog = page.getByRole('dialog');
  const input = dialog.getByRole('searchbox');
  await input.fill('a');
  await expect(dialog.getByText('Top 8 matching guides')).toBeVisible();
  await input.fill('channel memory');
  await expect(dialog.getByRole('link', { name: /Channel memory/ })).toBeVisible();
  expect(await dialog.locator('mark').count()).toBeGreaterThan(0);
  await input.fill('<img src=x onerror=alert(1)>');
  await expect(dialog.getByText('No guides found')).toBeVisible();
  await expect(dialog.locator('img, script')).toHaveCount(0);
  expect(await dialog.evaluate(el => el.getBoundingClientRect().right)).toBeLessThanOrEqual(375);
});

test('page links copy the public guide and section without tracking parameters', async ({ page }) => {
  await page.goto('/docs/evidence?utm_source=fixture#compare-the-same-behavior');
  await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw Error('Clipboard denied'); } } }));
  await page.getByRole('button', { name: 'Copy link', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Try copying again', exact: true })).toBeVisible();
  await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async (text: string) => { (window as Window & { copiedGuide?: string }).copiedGuide = text; } } }));
  await page.getByRole('button', { name: 'Try copying again', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Link copied', exact: true })).toBeVisible();
  expect(await page.evaluate(() => (window as Window & { copiedGuide?: string }).copiedGuide)).toBe(`${new URL(page.url()).origin}/docs/evidence#compare-the-same-behavior`);
});

test('wide reference tables remain readable and keyboard-scrollable on phones', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 844 });
  await page.goto('/docs/runtime');
  const table = page.getByRole('region', { name: 'Reference table', exact: true }).first();
  await table.scrollIntoViewIfNeeded();
  await expect(table).toHaveAttribute('tabindex', '0');
  expect(await table.evaluate(el => el.scrollWidth)).toBeGreaterThan(600);
  await table.focus();
  await page.keyboard.press('ArrowRight');
  await expect.poll(() => table.evaluate(el => el.scrollLeft)).toBeGreaterThan(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
});
