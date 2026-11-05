import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
const [file, out, width='1440'] = process.argv.slice(2);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: +width, height: 900 } });
const url = /^https?:/.test(file) ? file : pathToFileURL(resolve(file)).href;
await p.goto(url, { waitUntil: 'load' }); await p.waitForTimeout(1500);
await p.screenshot({ path: out, fullPage: true }); await b.close();
