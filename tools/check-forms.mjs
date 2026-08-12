/**
 * Regression test: both enquiry forms must confirm on success and warn on
 * failure - and must never claim success when delivery is unknown.
 *
 * The chat assistant previously reported "Enquiry submitted" from an iframe
 * load event, which fires for error pages too and is cross-origin, so it
 * could not distinguish success from failure at all.
 *
 * The FormKeep endpoint is unreachable from CI and from the dev sandbox, so
 * the endpoint is simulated with request interception: fulfil 200 for the
 * success path, abort for the failure path (which is what a CORS rejection
 * looks like to fetch). This tests our handling, not FormKeep's uptime.
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

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
let fails = 0;

let ctxPosts = [];
async function run(label, page, mode, fill, readStatus) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 1000 } });
  const p = await ctx.newPage();
  // Simulate the endpoint without reaching it
  const posts = [];
  await p.route('**/formkeep.com/**', route => {
    const req = route.request();
    if (req.method() === 'POST') posts.push(req.resourceType());
    if (mode === 'ok') route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true}' });
    else if (req.resourceType() === 'fetch' || req.resourceType() === 'xhr') route.abort('failed');
    else route.fulfill({ status: 200, contentType: 'text/html', body: 'ok' });  // native form POST is not CORS-bound
  });
  ctxPosts = posts;
  await p.goto(`${BASE}/${page}`, { waitUntil: 'networkidle' });
  await fill(p);
  await p.waitForTimeout(1800);
  const status = await readStatus(p);
  console.log(`  ${label} [${mode}] -> ${status ? '"' + status.slice(0, 88) + '"' : '(no status shown)'}`);
  console.log(`      POST attempts reaching endpoint: ${ctxPosts.length} (${ctxPosts.join(', ') || 'none'})`);
  if (ctxPosts.length === 0) { console.log('      FAIL: enquiry never left the browser'); fails++; }
  await ctx.close();
  return status || '';
}

console.log('index.html inquiry form');
const fillInquiry = async p => {
  await p.fill('#inq-name', 'Test'); await p.fill('#inq-company', 'Test Co');
  await p.fill('#inq-email', 't@example.com'); await p.fill('#inq-message', 'Testing the submit path.');
  await p.click('#inquiryForm button[type="submit"]');
};
const inqStatus = p => p.textContent('#formStatus');
const a = await run('inquiry', 'index.html', 'ok', fillInquiry, inqStatus);
const b = await run('inquiry', 'index.html', 'fail', fillInquiry, inqStatus);
if (!/received your enquiry/i.test(a)) { console.log('    FAIL: success path did not confirm'); fails++; }
if (!/could not send|whatsapp/i.test(b)) { console.log('    FAIL: failure path did not warn'); fails++; }

console.log('\nchatbot.html assistant form');
const fillAssistant = async p => {
  await p.selectOption('#productName', { index: 1 });
  await p.fill('#plantLocation', 'Jamshedpur');
  await p.fill('#currentIssue', 'Testing the submit path.');
  await p.click('#submitAssistant');
};
const asstStatus = p => p.textContent('#submitStatus');
const c = await run('assistant', 'chatbot.html', 'ok', fillAssistant, asstStatus);
const d = await run('assistant', 'chatbot.html', 'fail', fillAssistant, asstStatus);
if (!/submitted/i.test(c)) { console.log('    FAIL: success path did not confirm'); fails++; }
if (/^Enquiry submitted\./i.test(d)) { console.log('    FAIL: claims success on failure'); fails++; }
if (!/could not be confirmed|whatsapp|could not send/i.test(d)) { console.log('    FAIL: failure path not hedged'); fails++; }

await browser.close();
if (fails) {
  console.error(`\n${fails} failure(s): form feedback is wrong`);
  process.exit(1);
}
console.log('\nPASS: both forms confirm on success and warn on failure');
