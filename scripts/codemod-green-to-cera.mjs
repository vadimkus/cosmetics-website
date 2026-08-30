#!/usr/bin/env node
/**
 * Moves the greens that were only ever decoration onto the cera palette.
 *
 * What is deliberately left alone, and why:
 *
 *   Every `-500` shade. That one number is where the three greens we must not
 *   touch all happen to live: WhatsApp's brand mark, the presence dot on an
 *   avatar, and the middle stop of the password-strength scale. Excluding the
 *   shade is a blunt rule, but it is one that cannot be got wrong by accident,
 *   and the handful of `-500`s that should move are done by hand.
 *
 *   Teal. It is almost entirely the second series in the skin-analysis
 *   readouts, where two metrics sit side by side and the hue is what tells
 *   them apart.
 *
 *   The files in SKIP. Each either carries a green that means something no
 *   text on screen repeats, or mixes one of those with greens that should
 *   move, which is not a judgement a regex can make.
 *
 * Usage: node scripts/codemod-green-to-cera.mjs [--apply] [glob...]
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'

/** Colour carries meaning here that the words on screen do not repeat. */
const SKIP = new Set([
  // Several order states in one list; the hue is what separates them.
  'lib/utils.ts',
  'app/orders/page.tsx',
  'app/track/[orderNumber]/OrderTrackingClient.tsx',
  'app/partner-portal/page.tsx',
  // Two bars of one component on screen at once: earned, and still to earn.
  'components/FreeMaskPromotion.tsx',
  // A three-stop scale where the colour is the reading.
  'app/reset-password/[token]/page.tsx',
  'components/StorageQuotaMonitor.tsx',
  'components/NetworkStatus.tsx',
  // WhatsApp's own green, which is not ours to retune.
  'components/ShareButton.tsx',
  'app/locations/[city]/LocationPageClient.tsx',
  'app/ar/locations/[city]/page.tsx',
  'app/ru/locations/[city]/page.tsx',
  'app/certificates/page.tsx',
  'components/profile/PrivacySettings.tsx',
  'components/ChatWidget.tsx',
  'components/profile/SettingsPanel.tsx',
  // Simultaneous data series distinguished by hue.
  'app/skin-recommendation/SkinRecommendationClient.tsx',
  'components/SkinAnalysisCamera.tsx',
  'components/ar/ARSkinAnalysisCamera.tsx',
  // Ledgers and dashboards where green and red are a plus/minus pair.
  'components/AdvancedReportingDashboard.tsx',
  'components/CustomerProfile.tsx',
  'components/profile/ProfileHeader.tsx',
  'components/BlogManagement.tsx',
])

const SKIP_DIR = [
  'scripts/', 'app/admin/', 'components/admin/', '__tests__/', 'e2e/', 'docs/',
  'node_modules/', '.next/',
]

/**
 * Filled surfaces go to ink rather than to a cera rose. A button flipping from
 * --cera-cta to a neighbouring rose would be two tones of one hue and would
 * barely read as a change; against ink it plainly has.
 */
const INK = 'var(--cera-ink)'
const OK = 'var(--cera-ok)'
const OK_BG = 'var(--cera-ok-bg)'
const OK_LINE = 'var(--cera-ok-line)'

/** prefix -> shade -> replacement. Shade 500 is absent on purpose. */
const MAP = {
  bg: { 50: OK_BG, 100: OK_BG, 200: OK_LINE, 600: INK, 700: INK, 800: INK },
  text: { 300: OK, 400: OK, 600: OK, 700: OK, 800: OK, 900: OK },
  border: { 100: OK_LINE, 200: OK_LINE, 300: OK_LINE, 400: OK_LINE, 600: INK, 700: INK },
  ring: { 100: OK_LINE, 200: OK_LINE, 300: OK_LINE },
  divide: { 100: OK_LINE, 200: OK_LINE },
  fill: { 400: OK, 600: OK, 700: OK },
  stroke: { 400: OK, 600: OK, 700: OK },
  // Gradients keep their two stops rather than both collapsing onto ink, or a
  // button that had depth would come out flat and its hover would not move.
  from: { 50: OK_BG, 100: OK_BG, 200: OK_LINE, 400: OK, 600: 'var(--cera-cta)', 700: 'var(--cera-rose-ink)' },
  to: { 50: OK_BG, 100: OK_BG, 200: OK_LINE, 600: 'var(--cera-rose-ink)', 700: 'var(--cera-rose-ink)', 800: INK, 950: INK },
  via: { 400: OK, 600: OK },
}

/** Walk the tree directly rather than shelling out, so the file list is ours. */
function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = dir === '.' ? entry.name : `${dir}/${entry.name}`
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === '.git') continue
      walk(path, out)
    } else if (/\.tsx?$/.test(entry.name)) {
      out.push(path)
    }
  }
  return out
}

const CLASS_RE =
  /\b((?:[a-z-]+:)*)(bg|text|border|ring|divide|fill|stroke|from|to|via)-(green|emerald)-(\d+)(\/\d+)?\b/g

const files = walk('.')
  .filter((f) => !SKIP.has(f) && !SKIP_DIR.some((d) => f.startsWith(d)))

const apply = process.argv.includes('--apply')
const only = process.argv.slice(2).filter((a) => !a.startsWith('--'))

let touched = 0
let swaps = 0
const perClass = new Map()

for (const file of files) {
  if (only.length && !only.some((p) => file.startsWith(p))) continue
  const before = readFileSync(file, 'utf8')

  // Anchored on the utility prefix, so nothing in prose or a comment can match:
  // "deep green sachets" has no `bg-` in front of it.
  const after = before.replace(
    CLASS_RE,
    (whole, variant, prefix, _hue, shade, alpha) => {
      // The one shade WhatsApp, the presence dot and the strength scale share.
      if (shade === '500') return whole
      // An alpha suffix means the colour is a wash over something else; the
      // cera tones are already pale and would vanish.
      if (alpha) return whole
      const to = MAP[prefix]?.[shade]
      if (!to) return whole
      swaps++
      perClass.set(whole, (perClass.get(whole) || 0) + 1)
      return `${variant}${prefix}-[${to}]`
    }
  )

  if (after !== before) {
    touched++
    if (apply) writeFileSync(file, after)
  }
}

console.log(`${apply ? 'rewrote' : 'would rewrite'} ${swaps} classes in ${touched} files`)
if (!apply) {
  const top = [...perClass.entries()].sort((a, b) => b[1] - a[1]).slice(0, 15)
  for (const [cls, n] of top) console.log(`  ${String(n).padStart(4)}  ${cls}`)
}
