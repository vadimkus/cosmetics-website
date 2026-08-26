/**
 * The floating chat button and the floating buy bar both live at the bottom of a
 * product page. The bar just gained a stepper on its left, which is exactly
 * where the chat bubble sits, so this checks whether the two now overlap.
 */
const { chromium } = require('playwright')

;(async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
  await page.goto('http://localhost:3000/products/65', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(2500)

  // Scroll to the middle so the bar is showing (it hides near the hero CTA).
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.55))
  await page.waitForTimeout(1200)

  const boxes = await page.evaluate(() => {
    const out = {}
    const bar = document.querySelector('.mweb-float-bottom')
    if (bar) {
      const r = bar.getBoundingClientRect()
      out.bar = { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }
    }
    // the chat launcher: a fixed round button near the bottom
    const candidates = [...document.querySelectorAll('button, a')].filter(el => {
      const cs = getComputedStyle(el)
      if (cs.position !== 'fixed') return false
      const r = el.getBoundingClientRect()
      return r.width > 40 && r.width < 90 && Math.abs(r.width - r.height) < 12 && r.bottom > window.innerHeight - 220
    })
    out.chat = candidates.map(el => {
      const r = el.getBoundingClientRect()
      return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), label: (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 30) }
    })
    return out
  })

  console.log('bar :', boxes.bar || 'not rendered (hidden at this scroll position)')
  console.log('chat:', boxes.chat.length ? boxes.chat : 'none found')

  if (boxes.bar && boxes.chat.length) {
    for (const c of boxes.chat) {
      const overlap =
        c.x < boxes.bar.x + boxes.bar.w && c.x + c.w > boxes.bar.x &&
        c.y < boxes.bar.y + boxes.bar.h && c.y + c.h > boxes.bar.y
      console.log(`  ${c.label || 'chat'} -> ${overlap ? 'OVERLAPS the bar' : 'clear of the bar'}`)
    }
  }

  await page.screenshot({ path: '/tmp/sticky-real-390.png', clip: { x: 0, y: 844 - 200, width: 390, height: 200 } })
  await browser.close()
})()
