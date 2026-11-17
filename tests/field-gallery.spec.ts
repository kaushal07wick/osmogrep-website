import { expect, test } from '@playwright/test';

for (const width of [375, 768, 1440]) {
  test(`three illustrated patterns are readable together at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/#field-guide');
    const gallery = page.getByRole('region', { name: 'Tiny changes. Unexpected fallout.' });
    await expect(gallery.getByRole('article')).toHaveCount(3);
    await expect(gallery.getByRole('img')).toHaveCount(3);
    await expect(gallery.getByRole('button')).toHaveCount(0);
    for (const article of await gallery.getByRole('article').all()) {
      await expect(article).toBeVisible();
      await expect(article.getByRole('heading', { level: 3 })).toBeVisible();
      await expect(article).toHaveCSS('border-top-left-radius', '0px');
      expect(await article.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
    }
    const descriptions = await gallery.getByRole('img').evaluateAll(images => images.map(image => image.getAttribute('aria-label')));
    expect(new Set(descriptions).size).toBe(3);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await expect(gallery.getByRole('link', { name: /Inside the verification engine/ })).toHaveAttribute('href', '/docs/bug-catching');
  });
}

test('gallery motion pauses off-screen and respects reduced motion', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/#field-guide');
  const first = page.locator('.fg-card').first();
  await first.scrollIntoViewIfNeeded();
  await expect(first).toHaveClass(/is-visible/);
  await expect(first.locator('.fg-flow').first()).toHaveCSS('animation-play-state', 'running');
  await page.getByRole('contentinfo').scrollIntoViewIfNeeded();
  await expect(first).not.toHaveClass(/is-visible/);
  await expect(first.locator('.fg-flow').first()).toHaveCSS('animation-play-state', 'paused');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await first.scrollIntoViewIfNeeded();
  await expect(first.locator('.fg-flow').first()).toHaveCSS('animation-name', 'none');
});
