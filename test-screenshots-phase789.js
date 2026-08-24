const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  const shot = async (path) => {
    await page.waitForTimeout(500);
    await page.screenshot({ path, fullPage: true });
    console.log('saved', path);
  };

  // 10-billing.png — /settings/billing (server-rendered, no auth required for now)
  await page.goto('http://localhost:3030/settings/billing');
  await shot('/tmp/sponsordesk-mvp/10-billing.png');

  // 10b-billing-IN.png — same page with region=IN to verify INR branch
  await page.goto('http://localhost:3030/settings/billing?region=IN');
  await shot('/tmp/sponsordesk-mvp/10b-billing-IN.png');

  // 11-onboarding.png — /onboarding step 1
  // First we have to make sure the localStorage flag isn't set from a prior
  // run; if we run this twice in a row we'd auto-skip on the second pass.
  await page.goto('http://localhost:3030/onboarding');
  await page.evaluate(() => localStorage.removeItem('sponsordesk:onboarding:skipped'));
  await page.goto('http://localhost:3030/onboarding');
  await shot('/tmp/sponsordesk-mvp/11-onboarding.png');

  // 12-admin.png — /admin (demo user is in allowlist)
  await page.goto('http://localhost:3030/admin');
  await shot('/tmp/sponsordesk-mvp/12-admin.png');

  await browser.close();
  console.log('All Phase 7-9 screenshots complete');
})();
