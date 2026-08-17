/**
 * Regression test: the guided enquiry on chatbot.html must actually POST to the
 * form endpoint when submitted.
 *
 * History worth keeping in view. The homepage enquiry form was briefly a
 * hand-built form POSTing to https://formkeep.com/p/<id> - which is FormKeep's
 * hosted form *page*, not a submission endpoint - so submissions went nowhere
 * for a fortnight while the UI reported success. The homepage is now back on
 * the FormKeep embed, which is cross-origin and cannot be asserted on from
 * here; chatbot.html posts same-origin markup to the endpoint and can be.
 *
 * The endpoint is unreachable from CI and from the sandbox, so it is simulated
 * with request interception. This tests that we send, not that FormKeep
 * receives.
 *
 * Usage:
 *   python3 -m http.server 8901 &
 *   node tools/check-forms.mjs
 */
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

function loadPlaywright() {
  const candidates = [
    'playwright',
    process.env.PLAYWRIGHT_PATH,
    '/opt/node22/lib/node_modules/playwright',
    '/usr/lib/node_modules/playwright',
  ].filter(Boolean);
  for (const candidate of candidates) {
    try { return require(candidate); }
    catch (err) {
      if (err.code !== 'MODULE_NOT_FOUND' && err.code !== 'ERR_MODULE_NOT_FOUND') throw err;
    }
  }
  console.error('playwright not found. Install it, or set PLAYWRIGHT_PATH to its directory.');
  process.exit(2);
}

const { chromium } = loadPlaywright();
const BASE = process.env.BASE_URL || 'http://localhost:8901';

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
});
let failures = 0;

const ctx = await browser.newContext({ viewport: { width: 1280, height: 1000 } });
const page = await ctx.newPage();

const posts = [];
await page.route('**/formkeep.com/**', route => {
  const request = route.request();
  if (request.method() === 'POST') posts.push(request.url());
  route.fulfill({ status: 200, contentType: 'text/html', body: 'ok' });
});

await page.goto(`${BASE}/chatbot.html`, { waitUntil: 'networkidle' });
await page.selectOption('#productName', { index: 1 });
await page.fill('#plantLocation', 'Jamshedpur');
await page.fill('#currentIssue', 'Testing the submit path.');
await page.click('#submitAssistant');
await page.waitForTimeout(1500);

const status = await page.textContent('#submitStatus');
console.log(`guided enquiry status: "${(status || '').slice(0, 90)}"`);
console.log(`POSTs reaching endpoint: ${posts.length}`);

if (posts.length === 0) {
  console.error('  FAIL: submitting the guided enquiry sent nothing');
  failures++;
}

// Warning, not a failure. Posting to the /p/ hosted-page path is a *suspected*
// dead end - it is what broke the homepage form - but chatbot.html has posted
// there since before this project started and nobody has confirmed either way.
// Verify against the FormKeep dashboard before treating this as broken.
const pageUrlPosts = posts.filter(u => /formkeep\.com\/p\//.test(u));
if (pageUrlPosts.length) {
  console.warn(`  WARN: posts to FormKeep's hosted-page path (/p/). Unconfirmed whether`);
  console.warn(`        that path accepts submissions - check the dashboard: ${pageUrlPosts[0]}`);
}

await ctx.close();
await browser.close();

if (failures) {
  console.error(`\n${failures} failure(s)`);
  process.exit(1);
}
console.log('\nPASS: guided enquiry posts to the endpoint');
