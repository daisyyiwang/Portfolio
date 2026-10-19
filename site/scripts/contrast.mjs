// Checks semantic token pairs per direction × theme against WCAG AA (4.5:1 text, 3:1 focus/UI).
import puppeteer from 'puppeteer-core';
const base = process.argv[2] || 'http://localhost:4321';
const pairs = [
  ['--color-text', '--color-bg', 4.5], ['--color-text', '--color-surface', 4.5],
  ['--color-text-muted', '--color-bg', 4.5], ['--color-text-muted', '--color-surface', 4.5],
  ['--color-text-muted', '--color-surface-alt', 4.5],
  ['--color-accent-text', '--color-bg', 4.5], ['--color-accent-text', '--color-surface', 4.5],
  ['--eyebrow-color', '--color-bg', 4.5], ['--color-on-accent', '--color-accent', 4.5],
  ['--btn-primary-fg', '--btn-primary-bg', 4.5], ['--tag-fg', '--tag-bg', 4.5],
  ['--color-focus', '--color-bg', 3], ['--color-error', '--color-bg', 4.5],
];
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const page = await browser.newPage();
await page.evaluateOnNewDocument(() => localStorage.setItem('portfolio_unlocked', 'true'));
await page.goto(base + '/');
let fails = 0;
for (const style of (process.argv[3] || 'refine').split(',')) for (const theme of ['light', 'dark']) {
  const res = await page.evaluate((style, theme, pairs) => {
    const d = document.documentElement; d.dataset.style = style; d.dataset.theme = theme;
    const probe = document.createElement('div'); document.body.append(probe);
    const rgb = (v) => { probe.style.color = ''; probe.style.color = v; const m = getComputedStyle(probe).color.match(/[\d.]+/g); return m && !(m.length === 4 && +m[3] === 0) ? m.slice(0, 3).map(Number) : null; }; // transparent -> skip
    const lum = ([r, g, b]) => { const f = (c) => ((c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4); return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
    const cs = getComputedStyle(d);
    const out = pairs.map(([fg, bg, min]) => {
      const a = cs.getPropertyValue(fg).trim(), b = cs.getPropertyValue(bg).trim();
      if (!a || !b) return { fg, bg, skip: true };
      const A = rgb(a), B = rgb(b); if (!A || !B) return { fg, bg, skip: true };
      const [l1, l2] = [lum(A), lum(B)].sort((x, y) => y - x);
      return { fg, bg, min, ratio: +((l1 + 0.05) / (l2 + 0.05)).toFixed(2) };
    });
    probe.remove(); return out;
  }, style, theme, pairs);
  for (const r of res) if (!r.skip && r.ratio < r.min) { fails++; console.log(`FAIL ${style}/${theme} ${r.fg} on ${r.bg}: ${r.ratio} < ${r.min}`); }
  console.log(`${style}/${theme}: min ratio ${Math.min(...res.filter((r) => !r.skip).map((r) => r.ratio))}`);
}
await browser.close();
console.log(fails ? `${fails} failing pair(s)` : 'All token pairs pass');
