import { test, expect } from '@playwright/test';

const slug = '/blog/tinygrad-jit-input-rebinding';
const title = 'Fixing stale input references in tinygrad’s JIT';

test('tinygrad article exposes attributed evidence and working before/after diagrams', async ({ page }) => {
  await page.goto('/blog');
  await page.getByRole('link', { name: new RegExp(title) }).click();
  await expect(page).toHaveURL(new RegExp(slug));
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(title);
  await expect(page.getByText('We fixed tinygrad’s JIT input-return bug and verified the repair through OsmoGrep’s production cloud runner.', { exact: true })).toBeVisible();
  await expect(page.getByRole('figure',{name:'Actual OsmoGrep production run'}).getByRole('img')).toBeVisible();
  await expect(page.getByRole('link',{name:'Enlarge the actual OsmoGrep dashboard screenshot'})).toHaveAttribute('href','/blog/tinygrad-osmogrep-with-repair.png');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /tinygrad-jit-hero-v2.png/);
  await expect(page.getByRole('img', { name: /Official tinygrad logo beside two illustrated buffer stacks/ })).toBeVisible();
  await expect(page.getByRole('img', { name: 'tinygrad official logo', exact: true })).toBeVisible();
  const diagram=page.getByRole('figure', { name: 'Interactive JIT buffer binding diagram' });
  await expect(diagram.getByRole('img')).toHaveAccessibleName('Returned Tensor retains the capture-time buffer');
  const repaired=diagram.getByRole('button', { name: 'After repair', exact: true });
  await repaired.focus(); await repaired.press('Enter');
  await expect(repaired).toHaveAttribute('aria-pressed','true');
  await expect(diagram.getByRole('img')).toHaveAccessibleName('Return template binds to this call’s buffer');
  await expect(diagram.getByRole('status')).toContainText('Earlier caller-owned tensors are not rebound');
  const results=page.getByRole('figure', { name: 'Recorded tinygrad test comparison' });
  await expect(results.getByRole('code')).toContainText('OK (skipped=10)');
  await results.getByRole('button', { name: 'Without repair', exact: true }).click();
  await expect(results.getByRole('code')).toContainText('FAILED (failures=1, skipped=10)');
  await expect(results.getByRole('link', { name: /Read the actual GitHub test report/ })).toHaveAttribute('href', /issuecomment-7005440502$/);
  await expect(page.getByRole('figure', { name: 'Tinygrad verification at a glance' })).toContainText('51.2s');
  await expect(results.getByLabel('Selected run timing')).toContainText('42.8s');
  await expect(results.getByLabel('Selected run timing')).toContainText('23.2s');
  const timings=page.getByRole('table');
  await expect(timings.getByRole('row')).toHaveCount(5);
  await expect(page.getByText('3 minutes 9.8 seconds of cumulative job time', {exact:true})).toBeVisible();
  await expect(page.locator('article')).not.toContainText(/model calls|reported tokens|credits|45,183|greptile|claude code/i);
  const evidenceLink=page.getByRole('link', { name: 'execution record', exact: true });
  const response=await page.request.get((await evidenceLink.getAttribute('href'))!);
  expect(response.ok()).toBe(true);
  const evidence=await response.json();
  expect(evidence.results.suite.withFix).toEqual({ passed: 84, failed: 0, skipped: 10 });
  expect(evidence.results.suite.identicalFileBlobs).toHaveLength(3);
  expect(evidence.runs).toHaveLength(10);
  expect(evidence.schemaVersion).toBe(2);
  expect(evidence).not.toHaveProperty('usage');
  expect(evidence.runs.every((run: Record<string, unknown>) => !('modelCalls' in run))).toBe(true);
  await expect(page.getByRole('link',{name:'repair attempt stopped before execution'})).toHaveAttribute('href',/issuecomment-7005470664$/);
  await expect(page.getByRole('link',{name:'_own_input_views()'})).toHaveAttribute('href',/217d01643c210c4d4f8f21993c58f60f3ee062cb.*#L48-L58$/);

});

test('tinygrad figures remain keyboard operable on a phone with reduced motion', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(slug);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.locator('.journal-contents summary').click();
  await page.getByRole('navigation', { name: 'Article contents' }).getByRole('link', { name: 'What remains open' }).click();
  await expect(page).toHaveURL(/#what-remains-open$/);
  await expect(page.getByRole('heading', { name: 'What remains open', exact: true })).toBeInViewport();
  const diagram=page.getByRole('region', { name: 'JIT return reference diagram' });
  await diagram.focus(); await expect(diagram).toBeFocused();
  expect(await diagram.evaluate(e=>e.scrollWidth<=e.clientWidth)).toBe(true);
  await expect(diagram.getByText('CAPTURED · A', {exact:true})).toBeVisible();
  await expect(diagram.getByText('CURRENT · B', {exact:true})).toBeVisible();
  expect(await diagram.locator('.tg-return-edge').evaluate(e=>getComputedStyle(e).animationName)).toBe('none');
  const resultSwitch=page.getByRole('group', { name: 'Test result revision' }).getByRole('button', { name: 'Without repair', exact: true });
  await resultSwitch.focus(); await resultSwitch.press('Space');
  await expect(resultSwitch).toHaveAttribute('aria-pressed','true');
});

test('existing runtime articles retain their interactive figures', async ({ page }) => {
  await page.goto('/blog/from-pull-request-to-runtime-regression');
  for (const name of ['Interactive resource lifecycle diagram', 'Differential execution evidence', 'Token usage chart']) {
    await expect(page.getByRole('figure', { name, exact: true })).toBeVisible();
  }
});
