/**
 * Append a Full INCI card to a product from an Intertek document.
 * Does NOT invent key actives — only copies the INCI list from the source file.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/add-full-inci-from-intertek.ts <productId>
 *   npx tsx --env-file=.env.local scripts/add-full-inci-from-intertek.ts <productId> --apply
 */
import { execFileSync } from 'node:child_process'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { createRequire } from 'node:module'
import { prisma } from '../lib/prisma'

const require = createRequire(import.meta.url)
const INTERTEK = '/Users/vadimkus/Desktop/Drive/Genosys/Registration/Intertek'

type SourceMode = 'formula-pdf' | 'artwork-pdf' | 'xlsx' | 'certificate-pdf'
type SourceCfg = { file: string; mode: SourceMode; cardName?: string }

/** Verified source map — only products with confirmed extractors. */
const SOURCES: Record<string, SourceCfg | SourceCfg[]> = {
  '4': { file: join(INTERTEK, 'Registration DOC/Formula/Formula-GENOSYS POWER SOLUTION HES.pdf'), mode: 'formula-pdf' },
  '5': { file: join(INTERTEK, 'Registration DOC/Formula_up/Formula-GENOSYS POWER SOLUTION CVS .pdf'), mode: 'formula-pdf' },
  '6': { file: join(INTERTEK, 'Registration DOC/Formula_up/Formula-GENOSYS POWER SOLUTION CTS.pdf'), mode: 'formula-pdf' },
  '7': { file: join(INTERTEK, 'Registration DOC/Formula_up/Formula-GENOSYS POWER SOLUTION PCS.pdf'), mode: 'formula-pdf' },
  '8': { file: join(INTERTEK, 'Registration DOC/Formula_up/Formula-GENOSYS POWER SOLUTION SWS.pdf'), mode: 'formula-pdf' },
  '9': { file: join(INTERTEK, 'Registration DOC/Formula_up/Formula-GENOSYS POWER SOLUTION AWS.pdf'), mode: 'formula-pdf' },
  '10': { file: join(INTERTEK, 'Registration DOC/Formula_up/Formula-GENOSYS SNOW O2.pdf'), mode: 'formula-pdf' },
  '11': { file: join(INTERTEK, 'GENOSYS SKIN DEFENDER LIP & EYE MAKEUP REMOVER/Formula-GENOSYS SKIN DEFENDER LIP & EYE MAKEUP REMOVER.pdf'), mode: 'formula-pdf' },
  '12': { file: join(INTERTEK, 'Registration DOC/Formula_up/Formula-GENOSYS EPI TURNOVER BOOSTING PEELING GEL.pdf'), mode: 'formula-pdf' },
  '13': { file: join(INTERTEK, 'Registration DOC/Artwork/[GENOSYS]SKIN RENEWAL PEELIGN SYSTEM(SRS).pdf'), mode: 'artwork-pdf' },
  '14': { file: join(INTERTEK, 'Genosys Microbiome Energy Infusing Mist/Formula-GENOSYS MICROBIOME ENERGY INFUSING MIST.xlsx'), mode: 'xlsx' },
  '15': { file: join(INTERTEK, 'Genosys Intensive Problem Control Toner/Formula-GENOSYS INTENSIVE PROBLEM CONTROL TONER.pdf'), mode: 'formula-pdf' },
  '16': { file: join(INTERTEK, 'Registration DOC/Formula_up/Formula-GENOSYS SNOW BOOSTER.pdf'), mode: 'formula-pdf' },
  '17': { file: join(INTERTEK, 'Registration DOC/Formula_up/Formula-GENOSYS EyeCell EYE CONTOUR SERUM.pdf'), mode: 'formula-pdf' },
  '18': {
    file: join(
      INTERTEK,
      'MOISTURE REPLENISHING HYALURON SERUMCREAM/MOISTURE REPLENISHING HYALURON SERUM/Formula_updated22062024.pdf',
    ),
    mode: 'formula-pdf',
  },
  '19': { file: join(INTERTEK, 'Registration DOC/Formula_up/Formula-GENOSYS ALL FOR SENSITIVE SERUM.pdf'), mode: 'formula-pdf' },
  '20': { file: join(INTERTEK, 'Registration DOC/Formula_up/Formula-GENOSYS PROBLEM CONTROL SERUM.pdf'), mode: 'formula-pdf' },
  '21': { file: join(INTERTEK, 'Multi Vita Radiance Serum/Formula-GENOSYS MULTI VITA RADIANCE SERUM.pdf'), mode: 'formula-pdf' },
  '22': { file: join(INTERTEK, 'Registration DOC/Formula_up/Formula-GENOSYS MULTI FUNCTIONAL ANTI-WRINKLE SERUM.pdf'), mode: 'formula-pdf' },
  '23': { file: join(INTERTEK, 'Registration DOC/Formula_up/Formula-GENOSYS ND Cell ANTI-WRINKLE CREAM.pdf'), mode: 'formula-pdf' },
  '24': { file: join(INTERTEK, 'Registration DOC/Formula_up/Formula-GENOSYS EyeCell EYE CONTOUR CREAM.pdf'), mode: 'formula-pdf' },
  '25': { file: join(INTERTEK, 'Registration DOC/Formula_up/Formula-GENOSYS SOOTHING REPAIR POSTCREAM.pdf'), mode: 'formula-pdf' },
  '27': { file: join(INTERTEK, 'Registration DOC/Formula_up/Formula-GENOSYS SKIN BARRIER PROTECTING CREAM.pdf'), mode: 'formula-pdf' },
  '28': { file: join(INTERTEK, 'Registration DOC/Formula_up/Formula-GENOSYS INTENSIVE HYDRO SOOTHING CREAM .pdf'), mode: 'formula-pdf' },
  '29': {
    file: join(
      INTERTEK,
      'MOISTURE REPLENISHING HYALURON SERUMCREAM/MOISTURE REPLENISHING HYALURON CREAM/Formula_updated_22062025.pdf',
    ),
    mode: 'formula-pdf',
  },
  '30': { file: join(INTERTEK, 'Registration DOC/Formula_up/Formula-GENOSYS INTENSIVE PROBLEM CONTROL CREAM.pdf'), mode: 'formula-pdf' },
  '31': { file: join(INTERTEK, 'Registration DOC/Formula_up/Formula-GENOSYS MULTI VITA RADIANCE CREAM .pdf'), mode: 'formula-pdf' },
  '32': { file: join(INTERTEK, 'Registration DOC/Formula_up/Formula-GENOSYS MULTI FUNCTIONAL ANTI-WRINKLE CREAM.pdf'), mode: 'formula-pdf' },
  '33': { file: join(INTERTEK, 'Registration DOC/Formula_up/Formula-GENOSYS EyeCell EYE PEPTIDE GEL PATCH .pdf'), mode: 'formula-pdf' },
  '34': {
    file: join(INTERTEK, 'GENOSYS SKIN RESCUE OVERNIGHT CREAM MASK/Ingredients-GENOSYS SKIN RESCUE OVERNIGHT CREAM MASK.pdf'),
    mode: 'formula-pdf',
  },
  '35': { file: join(INTERTEK, 'Registration DOC/Formula_up/Formula-GENOSYS HYDRO COOL MODELING MASK.pdf'), mode: 'formula-pdf' },
  '36': { file: join(INTERTEK, 'Registration DOC/Formula_up/Formula-GENOSYS SOOTHING BOMB SEA ALGAE MASK.pdf'), mode: 'formula-pdf' },
  '37': { file: join(INTERTEK, 'Registration DOC/Formula_up/Formula-GENOSYS PEPTIDE GEL MASK.pdf'), mode: 'formula-pdf' },
  // Kit: gel + mask — two Full INCI cards from Formula_up
  '38': [
    {
      file: join(INTERTEK, 'Registration DOC/Formula_up/Formula-GENOSYS EZ CO2 GEL.pdf'),
      mode: 'formula-pdf',
      cardName: 'Full INCI (Gel)',
    },
    {
      file: join(INTERTEK, 'Registration DOC/Formula_up/Formula-GENOSYS EZ CO2 MASK.pdf'),
      mode: 'formula-pdf',
      cardName: 'Full INCI (Mask)',
    },
  ],
  '39': { file: join(INTERTEK, 'Ultra Shield Sun Cream/Formula-GENOSYS ULTRA SHIELD SUN CREAM.pdf'), mode: 'formula-pdf' },
  '40': { file: join(INTERTEK, 'Registration DOC/Formula_up/Formula-GENOSYS MULTI SUN CREAM.pdf'), mode: 'formula-pdf' },
  // Shade formulas share the same base INCI; Camel #03 formula used (Iron Oxides CI naming)
  '41': {
    file: join(
      INTERTEK,
      'SKIN CARING BLEMISH BALM CUSHION/CARING BLEMISH BALM CUSHION #3_Camel/Formula-GENOSYS SKIN CARING BLEMISH BALM CUSHION #03.pdf',
    ),
    mode: 'formula-pdf',
  },
  '42': { file: join(INTERTEK, 'Registration DOC/Formula_up/Formula-GENOSYS INTENSIVE BLEMISH BALM CREAM.pdf'), mode: 'formula-pdf' },
  '43': { file: join(INTERTEK, 'Ingredient lists_old/HR3 MATRIX HAIR TONIC.pdf'), mode: 'certificate-pdf' },
  '45': { file: join(INTERTEK, 'Registration DOC/Formula_up/Formula-GENOSYS HR3 MATRIX HAIR SOLUTION α.pdf'), mode: 'formula-pdf' },
  '46': { file: join(INTERTEK, 'Scalp_Peeling/Formula-GENOSYS HR3 MATRIX SCALP PEELING α.pdf'), mode: 'formula-pdf' },
  '51': { file: join(INTERTEK, 'BIOFERMENT_MASK/Formula-GENOSYS BIO-FERMENT AGE DEFYING POWDER MASK.pdf'), mode: 'formula-pdf' },
  '52': { file: join(INTERTEK, 'SKIN REBOOT PDRN MASK PACK /Formula-GENOSYS SKIN REBOOT PDRN MASK PACK.pdf'), mode: 'formula-pdf' },
  '53': { file: join(INTERTEK, 'Registration DOC/Formula_up/Formula-GENOSYS INTENSIVE REPAIR COLLAGEN MASK.pdf'), mode: 'formula-pdf' },
  '60': {
    file: join(
      INTERTEK,
      'Bio-Meso PDRN &amp_gt_&amp_gt_documents for registration Dubai/Formula-GENOSYS BIO-MESO PDRN EXPERT AMPOULE 60000.pdf',
    ),
    mode: 'formula-pdf',
  },
  '63': {
    file: join(INTERTEK, 'GENOSYS REVITA GLOW BB CREAM/Bright_01/Formula-GENOSYS REVITA GLOW BB CREAM #01.pdf'),
    mode: 'formula-pdf',
  },
  '66': { file: join(INTERTEK, 'Cerrabar/600ml/Formula-GENOSYS CERABARRIER BIOME GEL CLEANSER.pdf'), mode: 'formula-pdf' },
}

function pdfText(path: string): string {
  return execFileSync('pdftotext', ['-layout', path, '-'], { encoding: 'utf8', maxBuffer: 10_000_000 })
}

function extractFormulaPdf(path: string): string[] {
  const txt = pdfText(path)
  const ings: string[] = []
  for (const raw of txt.split(/\r?\n/)) {
    const line = raw.trimEnd()
    // left-aligned: Name   12.34
    let m = line.match(/^([A-Za-z*][A-Za-z0-9\-\(\)\/,\s\+\.\'\*]+?)\s{2,}(\d+\.\d+|To 100|q\.s\.)/i)
    // centered-ish: spaces Name spaces percent
    if (!m) m = line.match(/^\s{0,20}([A-Za-z*][A-Za-z0-9\-\(\)\/,\s\+\.\'\*]{2,80}?)\s+(\d+\.\d{2,}|To 100)\b/)
    if (!m) continue
    const name = m[1].replace(/\s+/g, ' ').replace(/^\*+|\*+$/g, '').trim()
    const low = name.toLowerCase()
    if (!name || low.includes('inci name') || low.includes('ingredients (') || low === 'total' || low.includes('product name') || low.includes('cas no') || low === 'function' || low === 'reference') continue
    if (/^\d/.test(name)) continue
    if (!ings.includes(name)) ings.push(name)
  }
  return ings
}

function extractArtworkPdf(path: string): string[] {
  const txt = pdfText(path)
  const m = txt.match(/Ingredients\s+(Aqua[\s\S]+?)(?:\n\s*Precaution|\n\s*KR |\n\s*전성분|Application Apply|Net WT)/i)
  if (!m) return []
  let block = m[1].replace(/\s+/g, ' ').trim()
  block = block.replace(/\s*Precaution[\s\S]*$/i, '').trim(' .,;')
  return block.split(',').map((s) => s.trim()).filter(Boolean)
}

function extractCertificatePdf(path: string): string[] {
  const txt = pdfText(path)
  const ings: string[] = []
  for (const line of txt.split(/\r?\n/)) {
    // Name ... Cas  wt%
    const m = line.match(/^([A-Za-z][A-Za-z0-9\-\(\)\/,\s\+\.]+?)\s{2,}(?:Solvent|Humectant|Surfactant|Skin-|Hair-|Flavoring|Chelating|pH |Fragrance|Preservative|Masking)/)
    if (!m) {
      // fallback: starts with Aqua / Alcohol etc and ends with ICID
      const m2 = line.match(/^([A-Za-z][A-Za-z0-9\-\(\)\/,\s\+\.]{2,70}?)\s{2,}\S+/)
      if (m2 && /\bICID\b/.test(line)) {
        const name = m2[1].replace(/\s+/g, ' ').trim()
        if (!ings.includes(name) && !/ingredient|product name|function/i.test(name)) ings.push(name)
      }
      continue
    }
    const name = m[1].replace(/\s+/g, ' ').trim()
    if (!ings.includes(name)) ings.push(name)
  }
  return ings
}

function extractXlsx(path: string): string[] {
  // Prefer openpyxl via python for reliability
  const py = `
import zipfile, re
from xml.etree import ElementTree as ET
path = ${JSON.stringify(path)}
with zipfile.ZipFile(path) as z:
    names=[]
    if 'xl/sharedStrings.xml' in z.namelist():
        root=ET.fromstring(z.read('xl/sharedStrings.xml'))
        ns={'m':'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
        for si in root.findall('m:si', ns):
            texts=[t.text or '' for t in si.findall('.//m:t', ns)]
            names.append(''.join(texts))
    sheet=None
    for n in z.namelist():
        if n.startswith('xl/worksheets/sheet') and n.endswith('.xml'):
            sheet=n; break
    root=ET.fromstring(z.read(sheet))
    ns={'m':'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
    rows={}
    for c in root.findall('.//m:c', ns):
        ref=c.get('r');
        if not ref: continue
        col=''.join(ch for ch in ref if ch.isalpha())
        row=int(''.join(ch for ch in ref if ch.isdigit()))
        v=c.find('m:v', ns)
        if v is None or v.text is None: continue
        val=names[int(v.text)] if c.get('t')=='s' else v.text
        rows.setdefault(row,{})[col]=val
    ings=[]
    start_row=None; col=None
    for r in sorted(rows):
        for c,val in rows[r].items():
            s=str(val).strip().replace('  ',' ')
            if s.lower().startswith('aqua'):
                start_row=r; col=c; break
        if start_row: break
    if not start_row: 
        print('')
        raise SystemExit
    for r2 in sorted(rows):
        if r2 < start_row: continue
        if col not in rows[r2]: continue
        name=str(rows[r2][col]).strip()
        name=re.sub(r'\\s+',' ', name)
        if not name or name.lower() in {'ingredients (inci name)','inci name','total','ingredients'}: continue
        if re.match(r'^\\d', name): continue
        if name.lower() in {'signed by','narae han','r&d manager','dts mg co., ltd.'}: break
        if any(ch.isalpha() for ch in name) and name not in ings:
            ings.append(name)
    print('|||'.join(ings))
`
  const out = execFileSync('python3', ['-c', py], { encoding: 'utf8' }).trim()
  return out ? out.split('|||') : []
}

function extractOne(cfg: SourceCfg): string[] {
  if (!existsSync(cfg.file)) throw new Error(`Source missing: ${cfg.file}`)
  let ings: string[] = []
  if (cfg.mode === 'formula-pdf') ings = extractFormulaPdf(cfg.file)
  else if (cfg.mode === 'artwork-pdf') ings = extractArtworkPdf(cfg.file)
  else if (cfg.mode === 'certificate-pdf') ings = extractCertificatePdf(cfg.file)
  else if (cfg.mode === 'xlsx') ings = extractXlsx(cfg.file)
  return ings.map((s) => s.replace(/\s+/g, ' ').trim()).filter(Boolean)
}

function extract(productId: string): Array<{ ings: string[]; source: string; mode: string; cardName: string }> {
  const cfg = SOURCES[productId]
  if (!cfg) throw new Error(`No verified source mapped for product ${productId}`)
  const list = Array.isArray(cfg) ? cfg : [cfg]
  return list.map((c) => ({
    ings: extractOne(c),
    source: c.file,
    mode: c.mode,
    cardName: c.cardName || 'Full INCI',
  }))
}

function validate(ings: string[], productId: string) {
  if (ings.length < 5) throw new Error(`Too few ingredients (${ings.length})`)
  const first = ings[0].toLowerCase()
  const powderOk = ['35', '51'].includes(productId)
  if (!powderOk && !first.startsWith('aqua') && !first.startsWith('water')) {
    throw new Error(`First ingredient is not Aqua: ${ings[0]}`)
  }
  if (ings.some((n) => n.length > 140)) throw new Error('Suspiciously long ingredient name')
}

async function main() {
  const productId = process.argv[2]
  if (!productId) {
    console.log('Usage: add-full-inci-from-intertek.ts <productId> [--apply]')
    console.log('Mapped IDs:', Object.keys(SOURCES).sort((a, b) => Number(a) - Number(b)).join(', '))
    return
  }
  const apply = process.argv.includes('--apply')
  const extracts = extract(productId)
  for (const e of extracts) validate(e.ings, productId)

  const product = await prisma.product.findFirst({
    where: { OR: [{ id: productId }, { productNumber: productId }] },
    select: { id: true, productNumber: true, name: true, ingredients: true },
  })
  if (!product) throw new Error(`Product ${productId} not found`)

  let cards: Array<{ name?: string; description?: string; subList?: string[] }> = []
  if (product.ingredients) {
    try {
      const parsed = JSON.parse(product.ingredients)
      if (Array.isArray(parsed)) cards = parsed
    } catch {
      throw new Error('Existing ingredients JSON is invalid — aborting')
    }
  }
  const already = cards.some((c) => String(c.name || '').toLowerCase().includes('inci'))
  console.log('Product:', product.name, `(id=${product.id})`)
  for (const e of extracts) {
    const fullInci = e.ings.join(', ') + '.'
    console.log('---', e.cardName)
    console.log('Source:', e.source)
    console.log('Mode:', e.mode)
    console.log('INCI count:', e.ings.length)
    console.log('First 5:', e.ings.slice(0, 5))
    console.log('Last 3:', e.ings.slice(-3))
    console.log('Full INCI preview:', fullInci.slice(0, 180) + '…')
  }
  console.log('Existing cards:', cards.length, already ? '(already has INCI — will replace Full INCI card(s) only)' : '')

  if (!apply) {
    console.log('DRY RUN — pass --apply to write')
    return
  }

  const next = cards.filter((c) => !String(c.name || '').toLowerCase().includes('inci'))
  for (const e of extracts) {
    next.push({ name: e.cardName, description: e.ings.join(', ') + '.' })
  }
  const updated = await prisma.product.update({
    where: { id: product.id },
    data: { ingredients: JSON.stringify(next) },
    select: { id: true, name: true, ingredients: true },
  })
  const after = JSON.parse(updated.ingredients || '[]') as Array<{ name: string }>
  console.log('AFTER names:', after.map((c) => c.name))
}

main()
  .catch((e) => {
    console.error(e)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
