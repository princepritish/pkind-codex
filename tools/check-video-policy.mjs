/**
 * Regression test: no video may autoplay, and no video bytes may be fetched
 * before a visitor asks for them.
 *
 * This exists because the site once enforced click-to-play in the HTML while
 * js/modern-ui.js re-enabled autoplay at runtime and re-fetched the clips on
 * every scroll event. Reading the markup showed a correct page; the running
 * page shipped ~22 MB. Only a test that inspects the DOM *after* scripts run
 * and scrolling happens can tell the difference.
 *
 * It deliberately checks attributes and network requests rather than playback,
 * because the Chromium bundled with Playwright has no H.264 decoder - videos
 * never play here even when autoplay is fully enabled. A playback-based test
 * would pass against broken code.
 *
 * Usage:
 *   python3 -m http.server 8901 &
 *   node tools/check-video-policy.mjs
 *
 * Needs playwright. A global install works: ESM will not resolve one on its
 * own, so PLAYWRIGHT_PATH (or the common global location) is tried as well.
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
    try {
      return require(candidate);
    } catch (err) {
      if (err.code !== 'MODULE_NOT_FOUND' && err.code !== 'ERR_MODULE_NOT_FOUND') throw err;
    }
  }
  console.error('playwright not found. Install it, or set PLAYWRIGHT_PATH to its directory.');
  process.exit(2);
}

const { chromium } = loadPlaywright();

const BASE = process.env.BASE_URL || 'http://localhost:8901';
const PAGES = [
  'steel-plant-consumables-manufacturer-jharkhand-india.html',
  'casting-powder.html',
  'nozzle-filling-compound.html',
];

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
});

let failures = 0;

for (const page of PAGES) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();

  const mp4Requests = [];
  p.on('request', r => {
    if (r.url().endsWith('.mp4')) mp4Requests.push(r.url().split('/').pop());
  });

  await p.goto(`${BASE}/${page}`, { waitUntil: 'networkidle' });

  // The original bug only triggered on scroll and on a user gesture, so both
  // have to happen before the assertions mean anything.
  await p.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 60));
    }
  });
  await p.mouse.wheel(0, 200);
  await p.waitForTimeout(1500);

  const videos = await p.evaluate(() =>
    [...document.querySelectorAll('video')].map(v => ({
      file: (v.currentSrc || (v.querySelector('source') || {}).src || '').split('/').pop(),
      autoplay: v.autoplay || v.hasAttribute('autoplay'),
      preload: v.preload,
    })));

  console.log(`\n${page}`);
  for (const v of videos) {
    const bad = v.autoplay || v.preload !== 'none';
    if (bad) failures++;
    console.log(`  ${bad ? 'FAIL' : 'ok  '}  ${v.file.padEnd(30)} autoplay=${v.autoplay} preload=${v.preload}`);
  }
  if (mp4Requests.length) {
    failures++;
    console.log(`  FAIL  video bytes fetched without interaction: ${mp4Requests.join(', ')}`);
  } else {
    console.log('  ok    no video bytes fetched');
  }

  await ctx.close();
}

await browser.close();

if (failures) {
  console.error(`\n${failures} failure(s): video policy violated`);
  process.exit(1);
}
console.log('\nPASS: nothing autoplays, no video bytes fetched before interaction');
