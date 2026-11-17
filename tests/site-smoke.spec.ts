import { expect, test } from '@playwright/test';
for (const path of ['/docs/cli', '/docs/architecture', '/blog/from-pull-request-to-runtime-regression']) {
  test(`${path} remains readable with the shared footer on mobile`, async ({page}) => {
    await page.setViewportSize({width:390,height:844});
    const response=await page.goto(path);expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.getByRole('contentinfo')).toHaveCount(1);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    if(path==='/docs/cli') {
      const video=page.locator('video');await expect(video).toHaveAttribute('playsinline','');
      expect(await video.evaluate((element:HTMLVideoElement)=>element.muted)).toBe(true);
      expect(await video.evaluate((element:HTMLVideoElement)=>element.controls)).toBe(false);
    }
  });
}
test('compact search finds newer workflows and clears keyboard focus on close', async ({page})=>{
  await page.goto('/docs');
  await page.getByRole('button',{name:/Search the site/}).click();
  const search=page.getByRole('textbox',{name:'Search the site',exact:true});
  await search.fill('channel memory');
  await expect(page.locator('#nav-terminal').getByRole('link',{name:/Channel memory/})).toHaveAttribute('href','/docs/memory');
  await search.press('Escape');await expect(page.locator('#nav-terminal')).toHaveAttribute('inert','');await expect(search).toHaveAttribute('tabindex','-1');
});
test('retired form endpoints are absent',async({request})=>{
  for(const path of ['/api/contact','/api/waitlist'])expect((await request.post(path,{data:{email:123}})).status()).toBe(404);
});
