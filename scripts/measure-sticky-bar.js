/**
 * The floating buy bar gained a quantity stepper, so it now has to hold a price,
 * a stepper, the Add to bag button and the favourite toggle on one row. This
 * measures the real rendered widths at phone sizes to prove the button still has
 * room for its label rather than trusting arithmetic on paper.
 *
 * The bar only renders its controls for a signed-in shopper, so rather than
 * driving a login this clones the bar's own classes into the live page and
 * measures that. Same stylesheet, same fonts, same box model.
 */
const { chromium } = require('playwright')

const WIDTHS = [320, 360, 390, 414, 430]

const ROW = `
<div id="probe" style="position:fixed;left:0;right:0;bottom:0;z-index:9999;background:#fff">
  <div class="mx-auto flex max-w-[1200px] flex-wrap items-center gap-x-3 gap-y-1.5 px-4 pt-3 sm:gap-x-4 sm:px-6 md:flex-nowrap">
    <div class="w-full min-w-0 md:w-auto md:flex-none" data-probe="price">
      <p class="text-[11px] leading-none text-[var(--cera-muted)]">6 &times; 300.00</p>
      <p class="cera-serif cera-numeral text-[20px] text-[var(--cera-ink)]">1800.00<span class="ms-1 text-[12px] text-[var(--cera-muted)]">AED</span></p>
    </div>
    <div data-probe="stepper" class="flex h-12 flex-none items-center rounded-full border border-[var(--cera-line)] bg-white">
      <button class="flex h-12 w-11 items-center justify-center rounded-s-full">-</button>
      <span class="w-7 text-center text-[15px] font-semibold tabular-nums">6</span>
      <button class="flex h-12 w-11 items-center justify-center rounded-e-full">+</button>
    </div>
    <button data-probe="cta" class="flex h-12 flex-1 items-center justify-center gap-2 rounded-full text-[15px] font-semibold bg-black text-white md:w-[240px] md:flex-none">
      <span data-probe="ctalabel">Add to bag</span>
    </button>
    <button data-probe="heart" class="flex h-12 w-12 flex-none items-center justify-center rounded-full border">&hearts;</button>
  </div>
</div>`

;(async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.goto('http://localhost:3000/products/65', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(1500)

  let worst = null
  for (const width of WIDTHS) {
    await page.setViewportSize({ width, height: 844 })
    await page.evaluate(html => {
      document.getElementById('probe')?.remove()
      document.body.insertAdjacentHTML('beforeend', html)
    }, ROW)
    await page.waitForTimeout(150)

    const m = await page.evaluate(() => {
      const q = s => document.querySelector(`#probe [data-probe="${s}"]`)
      const w = el => (el ? Math.round(el.getBoundingClientRect().width) : 0)
      const label = q('ctalabel')
      const cta = q('cta')
      return {
        price: w(q('price')),
        stepper: w(q('stepper')),
        cta: w(cta),
        label: w(label),
        heart: w(q('heart')),
        // the label's own line count — the tell for a wrapped button
        lines: label ? label.getClientRects().length : 0,
        row: Math.round(document.querySelector('#probe > div').getBoundingClientRect().width),
        scrollW: document.documentElement.scrollWidth,
        clientW: document.documentElement.clientWidth,
      }
    })

    const overflows = m.scrollW > m.clientW
    const wrapped = m.lines > 1
    // 8px of padding each side of the label is tight but legible; below that
    // the label starts to touch the pill edge.
    const cramped = m.cta < m.label + 16
    const bad = overflows || wrapped || cramped
    if (bad && !worst) worst = width
    console.log(
      `${String(width).padStart(4)}px  price ${String(m.price).padStart(3)}  ` +
      `stepper ${m.stepper}  cta ${String(m.cta).padStart(3)} (label ${m.label}, ${m.lines} line)  ` +
      `heart ${m.heart}  ${bad ? `<-- ${[overflows && 'page overflows', wrapped && 'label wraps', cramped && 'cta cramped'].filter(Boolean).join(', ')}` : 'ok'}`
    )
  }

  for (const w of [320, 390]) {
    await page.setViewportSize({ width: w, height: 844 })
    await page.waitForTimeout(120)
    await page.screenshot({ path: `/tmp/stickybar-${w}.png`, clip: { x: 0, y: 844 - 120, width: w, height: 120 } })
  }

  await browser.close()
  if (worst) {
    console.log(`\nFAIL: the row does not fit from ${worst}px down.`)
    process.exit(1)
  }
  console.log('\nrow fits at every tested width')
})()
