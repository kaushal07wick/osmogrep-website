import { expect, test, type Locator, type Page } from '@playwright/test';

async function tabTo(page: Page, target: Locator, max = 160) {
  for (let i = 0; i < max; i++) {
    if (await target.evaluate(element => element === document.activeElement)) return;
    await page.keyboard.press('Tab');
  }
  throw new Error('The requested control could not be reached with Tab.');
}

test('every main page starts with a keyboard skip link', async ({ page }) => {
  for (const path of ['/', '/pricing', '/blog', '/changelog', '/get-started', '/docs/cli']) {
    await page.goto(path); await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Skip to content', exact: true })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator(path.startsWith('/docs') ? '#docs-content' : '#site-content')).toBeFocused();
  }
});

test('features open with arrows, receive focus and close with Escape', async ({ page }) => {
  await page.goto('/');
  const trigger = page.getByRole('button', { name: /features/i });
  await tabTo(page, trigger); await page.keyboard.press('ArrowDown');
  const first = page.locator('#nav-features a').first();
  await expect(first).toBeFocused(); await expect(first).toBeInViewport();
  await page.keyboard.press('Escape'); await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
});

test('site and docs search work without a mouse and restore focus', async ({ page }) => {
  await page.goto('/');
  await tabTo(page, page.getByRole('button', { name: /Search the site/ }));
  await page.keyboard.press('/');
  const input = page.getByRole('textbox', { name: 'Search the site', exact: true });
  await expect(input).toBeFocused();
  expect(await input.evaluate(element => getComputedStyle(element).outlineStyle)).not.toBe('none');
  await page.keyboard.type('channel memory');
  await expect(page.locator('#nav-terminal a[href="/docs/memory"]')).toBeVisible();
  await tabTo(page, page.locator('#nav-terminal a[href="/docs/memory"]'));
  await page.keyboard.press('Enter'); await expect(page).toHaveURL(/\/docs\/memory$/);
  await expect(page.locator('.docs-article h1')).toHaveText('Channel memory');
  await page.keyboard.press('Control+k');
  const dialog = page.getByRole('dialog', { name: 'Search documentation' });
  await expect(dialog.getByRole('searchbox')).toBeFocused();
  for (let i = 0; i < 14; i++) await page.keyboard.press('Tab');
  expect(await page.evaluate(() => Boolean(document.activeElement?.closest('dialog')))).toBe(true);
  await page.keyboard.press('Escape'); await expect(dialog).not.toBeVisible();
  await expect(page.getByRole('button', { name: /Search documentation/ })).toBeFocused();
});

test('Tab can leave site search without an overlay obscuring the page', async ({ page }) => {
  await page.goto('/'); await page.keyboard.press('Control+k');
  const last = page.locator('#nav-terminal a').last();
  await tabTo(page, last); await page.keyboard.press('Tab');
  await expect(page.locator('#nav-terminal')).toHaveAttribute('inert', '');
  expect(await page.evaluate(() => Boolean(document.activeElement?.closest('#site-content')))).toBe(true);
});

test('mobile docs navigation opens, navigates and closes with keys', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 }); await page.goto('/docs');
  await page.keyboard.press('Tab');
  const summary = page.locator('.docs-mobile-nav > summary');
  await tabTo(page, summary); await page.keyboard.press('Enter');
  const guide = page.locator('.docs-mobile-links a[href="/docs/cli"]');
  await tabTo(page, guide); await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/docs\/cli$/); await expect(page.locator('.docs-mobile-nav')).not.toHaveAttribute('open', '');
});

test('pricing help and footer navigation are reachable using Tab', async ({ page }) => {
  await page.goto('/pricing');
  const help = page.getByRole('button', { name: /^About / }).first();
  await tabTo(page, help);
  const tooltip = page.locator('#' + await help.getAttribute('aria-describedby'));
  await expect(tooltip).toBeVisible(); await page.keyboard.press('Escape'); await expect(tooltip).not.toBeVisible(); await expect(help).toBeFocused();
  const changelog = page.getByRole('contentinfo').locator('a[href="/changelog"]').first();
  await tabTo(page, changelog); await page.keyboard.press('Enter'); await expect(page).toHaveURL(/\/changelog$/);
});

test('coding-agent tabs support arrows, Home and End', async ({ page }) => {
  await page.goto('/');
  const tabs = page.getByRole('tablist', { name: 'Choose coding agent' }).getByRole('tab');
  await tabTo(page, tabs.first()); await page.keyboard.press('End');
  await expect(tabs.last()).toBeFocused(); await expect(tabs.last()).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('Home'); await expect(tabs.first()).toBeFocused();
  await page.keyboard.press('ArrowRight'); await expect(tabs.nth(1)).toBeFocused(); await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
});

test('architecture components can be selected from the map with keys', async ({ page }) => {
  await page.goto('/docs/architecture');
  const map = page.getByRole('region', { name: 'Interactive Catcher architecture map' });
  const component = map.getByRole('button').nth(2), title = await component.getAttribute('aria-label');
  await tabTo(page, component); await page.keyboard.press('Enter');
  await expect(component).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('heading', { level: 3, name: title!, exact: true })).toBeVisible();
});

test('interactive article evidence and source disclosures work with keys', async ({ page }) => {
  await page.goto('/blog/from-pull-request-to-runtime-regression');
  const repair = page.locator('.runtime-switch').getByRole('button', { name: 'Repair', exact: true });
  await tabTo(page, repair); await page.keyboard.press('Space'); await expect(repair).toHaveAttribute('aria-pressed', 'true');
  const source = page.locator('.runtime-source > summary');
  await tabTo(page, source); await page.keyboard.press('Enter');
  await expect(page.locator('.runtime-source pre')).toBeVisible();
});

test('the missing-page game can be played, paused and exited with keys', async ({ page }) => {
  await page.goto('/keyboard-audit-missing-page');
  const canvas = page.getByRole('application', { name: /^Bug Run/ });
  await tabTo(page, canvas); await page.keyboard.press('Space');
  await expect(page.locator('.bug-runner-status')).toHaveText('Run started.');
  await page.keyboard.press('Escape'); await expect(page.locator('.bug-runner-status')).toHaveText('Run paused.');
  const home = page.getByRole('link', { name: 'Back to home', exact: true });
  await tabTo(page, home); await page.keyboard.press('Enter'); await expect(page).toHaveURL(/\/$/);
});
