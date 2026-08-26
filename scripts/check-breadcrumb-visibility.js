/**
 * The breadcrumb trail is now dropped below md on product pages, because the
 * floating back bar already offers the only destination it had. This checks the
 * three things that has to be true at once: gone on a phone, present on desktop,
 * and the BreadcrumbList structured data untouched on both — that last one is
 * what Google actually reads, and the whole argument for hiding the visual trail
 * rests on it surviving.
 */
const { chromium } = require('playwright')

// A bespoke page and a generic one.
const PAGES = ['/products/28', '/products/65']

;(async () => {
  const browser = await chromium.launch()
  let failures = 0

  for (const route of PAGES) {
    for (const [label, width] of [['phone', 390], ['desktop', 1280]]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } })
      await page.goto(`http://localhost:3000${route}`, { waitUntil: 'domcontentloaded' })
      await page.waitForTimeout(2000)

      const result = await page.evaluate(() => {
        const nav = document.querySelector('nav[aria-label="Breadcrumb"]')
        const visible = nav ? nav.getBoundingClientRect().height > 0 : false
        const schema = [...document.querySelectorAll('script[type="application/ld+json"]')]
          .map(s => { try { return JSON.parse(s.textContent) } catch { return null } })
          .filter(d => d && d['@type'] === 'BreadcrumbList')
        return {
          inDom: Boolean(nav),
          visible,
          crumbs: schema.length ? schema[0].itemListElement.map(i => i.name) : null,
        }
      })

      const wantVisible = width >= 768
      const ok = result.visible === wantVisible && Array.isArray(result.crumbs)
      if (!ok) failures++
      console.log(
        `${route} @ ${label} (${width}px): trail ${result.visible ? 'shown' : 'hidden'} ` +
        `(wanted ${wantVisible ? 'shown' : 'hidden'}), schema ${result.crumbs ? result.crumbs.join(' > ') : 'MISSING'} ` +
        `${ok ? '' : '  <-- FAIL'}`
      )
      await page.close()
    }
  }

  await browser.close()
  if (failures) { console.log(`\n${failures} check(s) failed`); process.exit(1) }
  console.log('\nhidden on phones, shown on desktop, structured data intact throughout')
})()
