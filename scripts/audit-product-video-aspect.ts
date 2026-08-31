/**
 * Which bespoke pages crop their product video?
 *
 * Most of the product clips are 9:16 phone exports, but nearly every bespoke
 * page renders them in `aspect-square sm:aspect-video` with `object-cover`,
 * so on desktop you see a horizontal band through the middle and lose the
 * rest of the height. Reports every page whose container ratio disagrees with
 * the orientation of the file it is playing.
 *
 * Read-only. Run: npx tsx --env-file=.env.local scripts/audit-product-video-aspect.ts
 */
import { execFileSync } from 'child_process'
import { existsSync, readFileSync } from 'fs'
import path from 'path'

import { prisma } from '@/lib/prisma'
import { getProductConfig } from '@/data/productConfig'

const ROOT = process.cwd()
const BESPOKE = path.join(ROOT, 'components/product/bespokePdp.tsx')

function pageComponentByProduct(): Map<string, string> {
  const src = readFileSync(BESPOKE, 'utf8')
  const map = new Map<string, string>()
  for (const m of src.matchAll(/^\s*'(\d+)':\s*(\w+ProductPage|\w+n)\b/gm)) {
    map.set(m[1], m[2])
  }

  const imports = new Map<string, string>()
  for (const m of src.matchAll(/^import\s+(\w+)\s+from\s+'@\/(components\/product\/[^']+)'/gm)) {
    imports.set(m[1], m[2])
  }

  const resolved = new Map<string, string>()
  for (const [num, comp] of map) {
    const rel = imports.get(comp)
    if (rel) resolved.set(num, rel)
  }
  return resolved
}

// The thin `Xn` wrappers re-export the real page; follow one hop to the file
// that actually holds the <video>.
function findPageFile(rel: string): string | null {
  const direct = path.join(ROOT, `${rel}.tsx`)
  if (!existsSync(direct)) return null
  const src = readFileSync(direct, 'utf8')
  if (src.includes('<video')) return direct

  const dir = path.dirname(direct)
  for (const m of src.matchAll(/from\s+'([^']*ProductPage)'/g)) {
    const target = path.resolve(dir, m[1].replace(/^@\//, `${ROOT}/`)) + '.tsx'
    if (existsSync(target)) return target
  }
  const guess = path.join(dir, `${path.basename(dir)}ProductPage.tsx`)
  return existsSync(guess) ? guess : null
}

function containerAspect(file: string): string | null {
  const src = readFileSync(file, 'utf8')
  const m = src.match(/className="[\w-]*video relative([^"]*)"/)
  if (!m) return null
  const cls = m[1]
  if (cls.includes('aspect-[9/16]')) return 'portrait'
  if (cls.includes('sm:aspect-video')) return 'square-then-16:9'
  if (cls.includes('aspect-video')) return '16:9'
  if (cls.includes('aspect-square')) return 'square'
  return cls.trim() || 'unknown'
}

function orientation(url: string): string | null {
  const file = path.join(ROOT, 'public', url.replace(/^\//, ''))
  if (!existsSync(file)) return null
  try {
    const out = execFileSync(
      'ffprobe',
      ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', file],
      { encoding: 'utf8' }
    ).trim()
    const [w, h] = out.split(',').map(Number)
    if (!w || !h) return null
    return `${h > w ? 'portrait' : w > h ? 'landscape' : 'square'} ${w}x${h}`
  } catch {
    return null
  }
}

async function main() {
  const pages = pageComponentByProduct()
  const products = await prisma.product.findMany({
    where: { isHidden: false },
    select: { productNumber: true, name: true, videoUrl: true },
    orderBy: { productNumber: 'asc' },
  })

  const cropped: string[] = []
  const fine: string[] = []
  const skipped: string[] = []

  for (const p of products) {
    const url = getProductConfig(p.productNumber)?.videoUrl || p.videoUrl
    if (!url) continue

    const rel = pages.get(p.productNumber)
    const file = rel ? findPageFile(rel) : null
    if (!file) {
      skipped.push(`  ${p.productNumber.padEnd(3)} ${p.name} — no bespoke page found`)
      continue
    }

    const aspect = containerAspect(file)
    const orient = orientation(url)
    if (!aspect || !orient) {
      skipped.push(`  ${p.productNumber.padEnd(3)} ${p.name} — aspect=${aspect} orientation=${orient}`)
      continue
    }

    const line = `  ${p.productNumber.padEnd(3)} ${p.name.slice(0, 42).padEnd(44)} ${orient.padEnd(20)} ${aspect}`
    const mismatch = orient.startsWith('portrait') && aspect !== 'portrait'
    ;(mismatch ? cropped : fine).push(line)
  }

  console.log(`\nCROPPED — portrait clip in a non-portrait box (${cropped.length})`)
  cropped.forEach((l) => console.log(l))
  console.log(`\nOK (${fine.length})`)
  fine.forEach((l) => console.log(l))
  if (skipped.length) {
    console.log(`\nCOULD NOT CHECK (${skipped.length})`)
    skipped.forEach((l) => console.log(l))
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
