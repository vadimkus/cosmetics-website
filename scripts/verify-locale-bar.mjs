/**
 * Screenshots the language control on the routes that were missing it, at phone
 * width and at desktop width. Desktop shots exist to prove the new bar stays
 * hidden there, where the site header already carries a switcher.
 *
 *   node scripts/verify-locale-bar.mjs [baseUrl]
 */
import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

const BASE = process.argv[2] || 'http://127.0.0.1:3000'
const OUT = '/tmp/locale-bar'
mkdirSync(OUT, { recursive: true })

const ROUTES = [
  ['bespoke-pdp-en', '/products/8'],
  ['bespoke-pdp-ru', '/ru/products/8'],
  ['bespoke-pdp-ar', '/ar/products/8'],
  ['blog-article-en', '/blog/power-solution-sws-arbutin-2-percent'],
  ['blog-article-ru', '/ru/blog/power-solution-sws-arbutin-2-percent'],
  ['blog-list', '/blog'],
]

const browser = await chromium.launch()

for (const [width, tag] of [[390, 'phone'], [1280, 'desktop']]) {
  const ctx = await browser.newContext({
    viewport: { width, height: 780 },
    userAgent:
      width === 390
        ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
        : undefined,
  })
  for (const [name, path] of ROUTES) {
    const page = await ctx.newPage()
    try {
      await page.goto(BASE + path, { waitUntil: 'domcontentloaded', timeout: 45000 })
      await page.waitForTimeout(2500)
      const control = await page.locator('[aria-label="Change language"]').count()
      console.log(`${tag.padEnd(7)} ${name.padEnd(17)} switcher=${control}`)
      await page.screenshot({ path: `${OUT}/${tag}-${name}.png` })
    } catch (e) {
      console.log(`${tag.padEnd(7)} ${name.padEnd(17)} ERROR ${e.message.split('\n')[0]}`)
    }
    await page.close()
  }
  await ctx.close()
}

await browser.close()
console.log(`\nScreenshots in ${OUT}`)
