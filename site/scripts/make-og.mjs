// Renders the social share image (public/og.png, 1200×630) in the Refine style.
// Usage: node scripts/make-og.mjs (needs network for Google Fonts)
import puppeteer from 'puppeteer-core';
import { readFileSync } from 'node:fs';

const logo = 'data:image/png;base64,' + readFileSync(new URL('../public/images/logo2023.png', import.meta.url)).toString('base64');
let seed = 11;
const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const digits = Array.from({ length: 8 * 9 }, () => {
  const big = rand() < 0.07;
  return `<span${big ? ' class="big"' : ''}>${Math.floor(rand() * 10)}</span>`;
}).join('');

const html = `<!doctype html><html><head>
<link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600&family=JetBrains+Mono:wght@400;500&family=VT323&display=block" rel="stylesheet">
<style>
  * { margin: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; overflow: hidden; background: #03161a; color: #c9f5ef;
    font-family: "Inter Tight", sans-serif; display: grid; grid-template-columns: 1fr 470px; gap: 56px;
    padding: 64px 72px; position: relative; }
  body::after { content: ""; position: absolute; inset: 0; pointer-events: none;
    background: radial-gradient(ellipse 120% 90% at 40% 30%, transparent 55%, rgb(0 0 0 / .5)),
      repeating-linear-gradient(to bottom, rgb(127 243 230 / .045) 0 1px, transparent 1px 3px); }
  .text { display: flex; flex-direction: column; justify-content: space-between; }
  .logo { width: 34px; height: 42px; background: #7ff3e6; -webkit-mask: url(${logo}) center / contain no-repeat; }
  .kicker { font-family: "JetBrains Mono", monospace; font-size: 18px; letter-spacing: .14em; text-transform: uppercase; color: #82b8b1; margin-top: 40px; }
  h1 { font-size: 76px; font-weight: 600; letter-spacing: -.03em; line-height: 1; margin-top: 18px; text-shadow: 0 0 22px rgb(127 243 230 / .35); }
  p.lead { font-size: 30px; line-height: 1.3; color: #c9f5ef; margin-top: 22px; max-width: 16em; }
  p.lead em { font-style: normal; color: #7ff3e6; }
  .foot { font-family: "JetBrains Mono", monospace; font-size: 18px; color: #82b8b1; letter-spacing: .06em; }
  .crt { align-self: center; border-radius: 30px / 26px; padding: 22px 22px 18px;
    background: radial-gradient(ellipse at 50% 45%, #0a3a42, #031417 78%); color: #8ff5ea; font-family: VT323, monospace;
    box-shadow: inset 0 0 70px rgb(0 0 0 / .85), 0 0 0 16px #a9a597, 0 0 0 18px #7d796c, 0 30px 60px rgb(0 0 0 / .5); }
  .head { display: flex; justify-content: space-between; font-size: 22px; border-bottom: 1px solid rgb(143 245 234 / .45); padding-bottom: 6px; }
  .grid { display: grid; grid-template-columns: repeat(9, 1fr); padding: 8px 0; }
  .grid span { text-align: center; font-size: 34px; line-height: 1.32; text-shadow: 0 0 8px rgb(143 245 234 / .7); }
  .grid span.big { transform: scale(1.8); }
  .bins { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; border-top: 1px solid rgb(143 245 234 / .45); padding-top: 10px; font-size: 18px; }
  .bins div { border: 1px solid rgb(143 245 234 / .5); padding: 4px 6px; display: grid; gap: 3px; }
  .bins b { height: 6px; background: linear-gradient(90deg, #8ff5ea var(--p), rgb(143 245 234 / .15) var(--p)); }
</style></head><body>
  <div class="text">
    <div>
      <div class="logo"></div>
      <p class="kicker">Product designer · San Jose, CA</p>
      <h1>Daisy, Yi Wang</h1>
      <p class="lead">Leading <em>AI-powered, data-driven</em> products at scale. 9+ years.</p>
    </div>
    <p class="foot">daisywang.design</p>
  </div>
  <div class="crt">
    <div class="head"><span>DAISY_W.portfolio</span><span>87% complete</span></div>
    <div class="grid">${digits}</div>
    <div class="bins">${[['AI', 72], ['B2B', 91], ['B2C', 38], ['A11Y', 64], ['DATA', 100]]
      .map(([l, p]) => `<div style="--p:${p}%"><span>${l}</span><b></b></div>`).join('')}</div>
  </div>
</body></html>`;

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
});
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630 });
await page.setContent(html, { waitUntil: 'networkidle0' });
await page.evaluate(() => document.fonts.ready);
const out = new URL('../public/og.png', import.meta.url).pathname;
await page.screenshot({ path: out });
await browser.close();
console.log('Wrote', out);
