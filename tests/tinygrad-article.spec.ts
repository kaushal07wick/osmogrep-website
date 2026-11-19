import { test, expect } from '@playwright/test';

const slug = '/blog/tinygrad-jit-input-rebinding';
test('tinygrad article is discoverable and exposes attributed, inspectable results', async ({ page }) => {
  await page.goto('/blog');
  const entry = page.getByRole('link', { name: /When a JIT returns yesterday’s input/ });
  await expect(entry).toBeVisible();
  await entry.click();
  await expect(page).toHaveURL(new RegExp(slug));
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('When a JIT returns yesterday’s input');
  await expect(page.getByText('Claude Code authored the repair. OsmoGrep executed the verification.', { exact: true })).toBeVisible();
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /tinygrad-jit-hero.png/);
  await expect(page.getByRole('img', { name: /A JIT return points to a captured input/ })).toBeVisible();
  await expect(page.getByRole('cell', { name: '84', exact: true })).toBeVisible();
  const evidenceLink=page.getByRole('link', { name: 'Download the execution record', exact: true });
  const response=await page.request.get((await evidenceLink.getAttribute('href'))!);
  expect(response.ok()).toBe(true);
  const evidence=await response.json();
  expect(evidence.results.suite.withFix).toEqual({ passed: 84, failed: 0, skipped: 10 });
  expect(evidence.results.suite.identicalFileBlobs).toHaveLength(3);
  expect(evidence.runs).toHaveLength(10);
  await expect(page.getByRole('link', { name: 'Model repair attempt and recorded blocker' })).toHaveAttribute('href', /issuecomment-7005470664$/);
});

test('tinygrad article remains navigable on a phone', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(slug);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.locator('.journal-contents summary').click();
  await page.getByRole('navigation', { name: 'Article contents' }).getByRole('link', { name: 'What remains open' }).click();
  await expect(page).toHaveURL(/#what-remains-open$/);
  await expect(page.getByRole('heading', { name: 'What remains open', exact: true })).toBeInViewport();
  const table=page.getByRole('region', { name: 'Article data table' }).first();
  await table.focus();
  await expect(table).toBeFocused();
});
