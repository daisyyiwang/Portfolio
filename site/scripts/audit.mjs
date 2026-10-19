// Screenshots + axe (WCAG 2.1 AA) for every direction × theme × page.
// Usage: npm run build && npm run preview  (in another shell), then
//        node scripts/audit.mjs [--shots] [--base=http://localhost:4321]
import puppeteer from 'puppeteer-core';
import { readFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const args = Object.fromEntries(process.argv.slice(2).map((a) => a.replace(/^--/, '').split('=')));
const base = args.base || 'http://localhost:4321';
const shots = 'shots' in args;
const styles = (args.styles || 'refine').split(',');
const themes = (args.themes || 'light,dark').split(',');
const pages = (args.pages || '/,/about/,/work/edit-image-in-acrobat/,/work/protecting-pdf/,/work/sign-for-teams/,/work/buy-online-ship-to-store/,/work/self-checkout/,/work/associate-experience/,/work/store-inventory/,/work/rewards/,/work/zzzzoo/,/unlock/,/404.html').split(',');
const widths = (args.widths || '1440,390').split(',').map(Number);
const out = new URL('./out/', import.meta.url).pathname;
mkdirSync(out, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
});
let failures = 0;
for (const style of styles) {
  for (const theme of themes) {
    const page = await browser.newPage();
    await page.evaluateOnNewDocument((s, t) => {
      localStorage.setItem('portfolio_unlocked', 'true');
      localStorage.setItem('portfolio_style', s);
      localStorage.setItem('portfolio_theme', t);
    }, style, theme);
    for (const path of pages) {
      for (const width of widths) {
        await page.setViewport({ width, height: 900 });
        await page.goto(base + path, { waitUntil: 'networkidle0' });
        await page.evaluate(() => document.fonts.ready);
        // Trigger lazy images before measuring / capturing.
        await page.evaluate(async () => {
          for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
          window.scrollTo(0, 0);
          await Promise.all([...document.images].map((i) => i.complete || new Promise((r) => { i.onload = i.onerror = r; })));
        });
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        if (overflow > 0) { failures++; console.log(`OVERFLOW ${style}/${theme} ${path} @${width}: +${overflow}px`); }
        if (width === widths[0]) {
          await page.addScriptTag({ content: axeSource });
          const res = await page.evaluate(() =>
            axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] }),
          );
          for (const v of res.violations) {
            failures++;
            console.log(`AXE ${style}/${theme} ${path}: ${v.id} (${v.impact}) ×${v.nodes.length}`);
            for (const n of v.nodes.slice(0, 4)) console.log('   ', n.target.join(' '), '|', (n.failureSummary || '').split('\n')[1]?.trim());
          }
          const incomplete = res.incomplete.filter((i) => i.id === 'color-contrast').reduce((a, i) => a + i.nodes.length, 0);
          if (incomplete) console.log(`  (needs-review contrast nodes ${style}/${theme} ${path}: ${incomplete})`);
        }
        if (shots) {
          const name = `${style}-${theme}-${path.replace(/\W+/g, '_') || 'home'}-${width}.png`;
          await page.screenshot({ path: out + name, fullPage: true });
        }
      }
    }
    await page.close();
  }
}
await browser.close();
console.log(failures ? `\n${failures} issue(s)` : '\nNo issues found');
