const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const takeScreenshot = async (path) => {
    await page.waitForTimeout(500);
    await page.screenshot({ path, fullPage: true });
  };

  console.log('Visiting marketing page...');
  await page.goto('http://localhost:3000');
  await takeScreenshot('/tmp/sponsordesk-mvp/01-marketing.png');
  console.log('Marketing page screenshot saved');

  console.log('Visiting sign-in page...');
  await page.goto('http://localhost:3000/app/sign-in');
  await takeScreenshot('/tmp/sponsordesk-mvp/02-sign-in.png');

  await page.fill('input[type="email"]', 'demo@sponsordesk.io');
  await page.fill('input[type="password"]', 'demo');
  await page.click('button[type="submit"]');

  await page.waitForURL('**/app/**', { timeout: 5000 });
  await takeScreenshot('/tmp/sponsordesk-mvp/03-after-signin.png');

  console.log('Visiting dashboard...');
  await page.goto('http://localhost:3000/app');
  await takeScreenshot('/tmp/sponsordesk-mvp/04-dashboard.png');
  console.log('Dashboard screenshot saved');

  console.log('Visiting pipeline...');
  await page.goto('http://localhost:3000/app/pipeline');
  await takeScreenshot('/tmp/sponsordesk-mvp/05-pipeline.png');
  console.log('Pipeline screenshot saved');

  await browser.close();
  console.log('All tests completed');
})();