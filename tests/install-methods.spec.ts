import { expect, test } from '@playwright/test';

test('homepage install methods copy the selected command and show success or retry', async ({ page }) => {
  await page.goto('/');
  const install = page.locator('.copy-install');
  await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async (value: string) => { (window as Window & { installedCommand?: string }).installedCommand = value; } } }));
  const copy = install.getByRole('button', { name: 'Copy to clipboard' });
  await expect(copy).toContainText('npm install -g osmogrep');
  await copy.click(); await expect(copy).toContainText('Copied');
  expect(await page.evaluate(() => (window as Window & { installedCommand?: string }).installedCommand)).toBe('npm install -g osmogrep');
  const pnpm = install.getByRole('button', { name: 'pnpm', exact: true });
  await pnpm.focus(); await pnpm.press('Enter');
  await expect(pnpm).toHaveAttribute('aria-pressed', 'true');
  await expect(copy).toContainText('pnpm add -g osmogrep'); await expect(copy).not.toContainText('Copied');
  await copy.click();
  expect(await page.evaluate(() => (window as Window & { installedCommand?: string }).installedCommand)).toBe('pnpm add -g osmogrep');
  await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw Error('Clipboard denied'); } } }));
  await copy.click(); await expect(copy).toContainText('Retry copy');
  await install.getByRole('button', { name: 'cargo', exact: true }).click();
  await expect(copy).toContainText('cargo install --git https://github.com/kaushal07wick/OsmoGrep --locked');
});

test('installer fits a phone and respects reduced motion', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 844 }); await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const install = page.locator('.copy-install');
  for (const name of ['npm', 'pnpm', 'curl', 'cargo', 'source']) {
    await install.getByRole('button', { name, exact: true }).click();
    expect(await install.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});
