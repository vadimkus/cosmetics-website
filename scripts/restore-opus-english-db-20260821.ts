/**
 * Restore the pre-2026-08-21 protected English/neutral Product fields for
 * products 41-66 without touching localized, commercial, media or inventory
 * data.
 *
 * Historical product scripts are read from their committed Git objects and
 * replayed against an in-memory Prisma mock. They are never imported or run
 * against the real database.
 *
 * Dry run (default):
 *   npx tsx --env-file=.env.local scripts/restore-opus-english-db-20260821.ts
 *
 * Apply:
 *   npx tsx --env-file=.env.local scripts/restore-opus-english-db-20260821.ts --apply
 */
import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import * as nodeFs from 'node:fs'
import { createRequire } from 'node:module'
import * as nodePath from 'node:path'
import { dirname, join, normalize } from 'node:path'
import ts from 'typescript'
import { prisma } from '../lib/prisma'

const APPLY = process.argv.includes('--apply')
const ROOT = process.cwd()
const nativeRequire = createRequire(import.meta.url)
const DUMP_REF = '4141b166'
const DUMP_PATH = 'scripts/audit-products-dump.json'
const PRODUCT_NUMBERS = Array.from({ length: 26 }, (_, index) => String(index + 41))

const PROTECTED_FIELDS = [
  'name',
  'category',
  'inStock',
  'isHidden',
  'description',
  'productDetails',
  'keyFeatures',
  'benefits',
  'ingredients',
  'howToUse',
  'directions',
  'size',
  'skinType',
  'targetConcerns',
  'usage',
  'ageGroup',
] as const

type ProtectedField = (typeof PROTECTED_FIELDS)[number]
type AnyRow = Record<string, unknown>
type Baseline = Partial<Record<ProtectedField, unknown>>
type HistoricalSource = {
  ref: string
  path: string
  products: string[]
  args?: string[]
}

const PROTECTED = new Set<string>(PROTECTED_FIELDS)
type CoverageEntry = {
  kind: 'dump-seed' | 'creation-baseline' | 'backup-baseline' | 'historical-overlay'
  ref: string
  path: string
  status: 'represented'
}

/**
 * Ordered by logical execution date. The dump has no embedded creation or data
 * timestamp. Git only proves that it was committed on 2026-08-17T19:59:18+04:00;
 * it does not prove when its database rows were exported.
 */
const HISTORICAL_SOURCES: HistoricalSource[] = [
  {
    ref: '4141b166',
    path: 'scripts/rename-product-64-20260615.ts',
    products: ['64'],
  },
  {
    ref: '17dd453c',
    path: 'scripts/fix-intertek-audit-batch1-serums.ts',
    products: ['60', '65'],
  },
  {
    ref: '4141b166',
    path: 'scripts/add-full-inci-from-intertek.ts',
    products: ['41'],
    args: ['41', '--apply'],
  },
  {
    ref: '4141b166',
    path: 'scripts/add-full-inci-from-intertek.ts',
    products: ['60'],
    args: ['60', '--apply'],
  },
  {
    ref: '4141b166',
    path: 'scripts/add-full-inci-from-intertek.ts',
    products: ['63'],
    args: ['63', '--apply'],
  },
  {
    ref: 'f2e89769',
    path: 'scripts/restore-manufacturer-ingredient-names-20260813.ts',
    products: ['54', '55', '56', '57', '58', '62'],
    args: ['--commit'],
  },
  {
    ref: '51326d55',
    path: 'scripts/fix-charming-look-box-57-claims-20260813.ts',
    products: ['57'],
  },
  {
    ref: 'c61ced2a',
    path: 'scripts/fix-anti-aging-box-58-claims-20260813.ts',
    products: ['58'],
  },
  {
    ref: '4141b166',
    path: 'scripts/fix-product-59-deep-moisturizing-box-claims-20260813.ts',
    products: ['59'],
  },
  {
    ref: '4141b166',
    path: 'scripts/fix-product-60-inci-20260813.ts',
    products: ['60'],
  },
  {
    ref: '4141b166',
    path: 'scripts/fix-product-61-scalp-brush-claims-20260813.ts',
    products: ['61'],
  },
  {
    ref: '4141b166',
    path: 'scripts/fix-product-63-verified-data.ts',
    products: ['63'],
  },
  {
    ref: 'cdcfb9a7',
    path: 'scripts/fix-problem-skin-box-55-claims-20260814.ts',
    products: ['55'],
  },
  {
    ref: 'df8d9759',
    path: 'scripts/fix-skin-brightening-box-56-claims-20260814.ts',
    products: ['56'],
  },
  {
    ref: 'b58815d0',
    path: 'scripts/fix-selling-tone-20260814.ts',
    products: ['59', '60'],
  },
  {
    ref: '91487a8b',
    path: 'scripts/fix-pdrn-mask-52-claims-20260814.ts',
    products: ['52'],
  },
  {
    ref: '4ea94f70',
    path: 'scripts/fix-collagen-mask-53-claims-20260814.ts',
    products: ['53'],
  },
  {
    ref: '4ea94f70',
    path: 'scripts/fix-collagen-mask-53-consistency-20260814.ts',
    products: ['53'],
  },
  {
    ref: '6d41099a',
    path: 'scripts/fix-collagen-mask-53-directions-20260814.ts',
    products: ['53'],
  },
  {
    ref: '43791c0d',
    path: 'scripts/update-product-51-bio-ferment-selling-copy-20260815.ts',
    products: ['51'],
  },
  {
    ref: '11d95bab',
    path: 'scripts/update-product-50-eye-zone-care-kit-selling-copy-20260816.ts',
    products: ['50'],
  },
  {
    ref: '339a96f6',
    path: 'scripts/update-product-41-bb-cushion-selling-copy-20260816.ts',
    products: ['41'],
  },
  {
    ref: '13046699',
    path: 'scripts/update-product-42-blemish-balm-record-20260817.ts',
    products: ['42'],
  },
  {
    ref: '78ed5f92',
    path: 'scripts/update-product-43-hair-tonic-record-20260817.ts',
    products: ['43'],
  },
  {
    ref: '4141b166',
    path: 'scripts/update-product-44-medi-shampoo-record-20260817.ts',
    products: ['44'],
  },
  {
    ref: '100d7c17',
    path: 'scripts/update-product-45-hair-solution-record-20260817.ts',
    products: ['45'],
  },
  {
    ref: '4121b790',
    path: 'scripts/update-product-46-scalp-peeling-record-20260817.ts',
    products: ['46'],
  },
  {
    ref: '040a8e21',
    path: 'scripts/update-product-49-geno-led-record-20260817.ts',
    products: ['49'],
  },
  {
    ref: '201e012e',
    path: 'scripts/update-product-62-sensitive-box-20260817.ts',
    products: ['62'],
  },
  {
    ref: '743f17d6',
    path: 'scripts/update-product-47-mesopecia-kit-record-20260818.ts',
    products: ['47'],
  },
  {
    ref: '3bdcf53f',
    path: 'scripts/fix-product-48-gentron-record-20260818.ts',
    products: ['48'],
  },
  {
    ref: '4141b166',
    path: 'scripts/update-product-64-images-and-specs.ts',
    products: ['64'],
  },
  {
    ref: '3bdcf53f',
    path: 'scripts/fix-hairgen-consumable-claims-20260818.ts',
    products: ['64'],
  },
]

const CREATION_BASELINES: Array<
  HistoricalSource & { fields: ProtectedField[] }
> = [
  {
    ref: '4141b166',
    path: 'scripts/create-revita-glow-bb-cream.ts',
    products: ['62', '63'],
    fields: [...PROTECTED_FIELDS],
  },
  {
    ref: '4141b166',
    path: 'scripts/create-bio-meso-homecare-5000.ts',
    products: ['65'],
    fields: [...PROTECTED_FIELDS],
  },
  {
    ref: '24c7addc',
    path: 'scripts/create-cerabarrier-product.ts',
    products: ['66'],
    fields: [...PROTECTED_FIELDS],
  },
  {
    ref: '4141b166',
    path: 'scripts/create-bio-meso-product.ts',
    products: ['60'],
    fields: ['productDetails', 'ageGroup'],
  },
]

function gitShow(ref: string, path: string): string {
  return execFileSync('git', ['show', `${ref}:${path}`], {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  })
}

function comparable(value: unknown): string {
  if (value instanceof Date) return value.toISOString()
  return JSON.stringify(value)
}

function same(a: unknown, b: unknown): boolean {
  return comparable(a) === comparable(b)
}

function select<T extends AnyRow>(row: T, selection?: AnyRow): AnyRow {
  if (!selection) return row
  return Object.fromEntries(
    Object.entries(selection)
      .filter(([, enabled]) => enabled)
      .map(([key]) => [key, row[key]]),
  )
}

function matches(row: AnyRow, where?: AnyRow): boolean {
  if (!where) return true
  if (Array.isArray(where.OR)) {
    return (where.OR as AnyRow[]).some(condition => matches(row, condition))
  }
  return Object.entries(where).every(([key, expected]) => {
    if (key === 'OR') return true
    if (expected && typeof expected === 'object' && !Array.isArray(expected)) {
      const condition = expected as AnyRow
      if ('contains' in condition) {
        const actual = String(row[key] ?? '')
        const needle = String(condition.contains)
        return condition.mode === 'insensitive'
          ? actual.toLowerCase().includes(needle.toLowerCase())
          : actual.includes(needle)
      }
      if ('in' in condition && Array.isArray(condition.in)) {
        return condition.in.some(value => same(row[key], value))
      }
    }
    return same(row[key], expected)
  })
}

function createHistoricalPrisma(rows: AnyRow[]) {
  const find = (where?: AnyRow) => rows.find(row => matches(row, where))
  const shape = (row: AnyRow, args: AnyRow) =>
    args.include && (args.include as AnyRow).variants
      ? { ...row, variants: [] }
      : select(row, args.select as AnyRow | undefined)
  const product = {
    findMany: async (args: AnyRow = {}) => {
      const found = rows.filter(row => matches(row, args.where as AnyRow | undefined))
      return found.map(row => select(row, args.select as AnyRow | undefined))
    },
    findFirst: async (args: AnyRow = {}) => {
      const row = find(args.where as AnyRow | undefined)
      return row ? shape(row, args) : null
    },
    findUnique: async (args: AnyRow = {}) => {
      const row = find(args.where as AnyRow | undefined)
      return row ? shape(row, args) : null
    },
    update: async (args: AnyRow) => {
      const row = find(args.where as AnyRow | undefined)
      if (!row) throw new Error(`historical mock update target not found: ${JSON.stringify(args.where)}`)
      Object.assign(row, args.data as AnyRow)
      return select(row, args.select as AnyRow | undefined)
    },
    updateMany: async (args: AnyRow) => {
      const found = rows.filter(row => matches(row, args.where as AnyRow | undefined))
      found.forEach(row => Object.assign(row, args.data as AnyRow))
      return { count: found.length }
    },
    create: async (args: AnyRow) => {
      const data = { ...(args.data as AnyRow) }
      if (!data.id) data.id = `historical-${data.productNumber ?? rows.length + 1}`
      rows.push(data)
      return select(data, args.select as AnyRow | undefined)
    },
  }
  return {
    product,
    productVariant: {
      deleteMany: async () => ({ count: 0 }),
      create: async (args: AnyRow) => args.data,
    },
    $disconnect: async () => undefined,
  }
}

function stripHistoricalScript(sourceText: string): string {
  const file = ts.createSourceFile(
    'historical-source.ts',
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  )
  const removals: Array<{ start: number; end: number }> = []

  for (const statement of file.statements) {
    if (
      ts.isVariableStatement(statement) &&
      statement.declarationList.declarations.some(
        declaration =>
          ts.isIdentifier(declaration.name) &&
          declaration.name.text === 'require' &&
          declaration.initializer &&
          ts.isCallExpression(declaration.initializer),
      )
    ) {
      removals.push({ start: statement.getFullStart(), end: statement.getEnd() })
      continue
    }
    if (ts.isExpressionStatement(statement)) {
      const text = statement.getText(file)
      if (/\bmain\(\)/.test(text)) {
        removals.push({ start: statement.getFullStart(), end: statement.getEnd() })
      }
    }
  }

  const stripped = removals
    .sort((a, b) => b.start - a.start)
    .reduce(
      (text, removal) => text.slice(0, removal.start) + text.slice(removal.end),
      sourceText,
    )

  return `${stripped}\nmodule.exports.__historicalMain = main\n`
}

function createGitModuleLoader(ref: string, fakePrisma: ReturnType<typeof createHistoricalPrisma>) {
  const cache = new Map<string, AnyRow>()
  const quietFs = {
    ...nodeFs,
    writeFileSync: () => undefined,
    mkdirSync: () => undefined,
  }

  function resolveGitModule(fromPath: string, request: string): string {
    const base = normalize(join(dirname(fromPath), request)).replaceAll('\\', '/')
    const candidates = /\.[cm]?[jt]sx?$/.test(base)
      ? [base]
      : [`${base}.ts`, `${base}.tsx`, `${base}.js`, join(base, 'index.ts')]
    for (const candidate of candidates) {
      try {
        gitShow(ref, candidate)
        return candidate
      } catch {
        // Try the next conventional TypeScript module path.
      }
    }
    throw new Error(`${ref}:${fromPath} cannot resolve ${request}`)
  }

  function load(path: string): AnyRow {
    const cached = cache.get(path)
    if (cached) return cached
    const module = { exports: {} as AnyRow }
    cache.set(path, module.exports)
    const source = gitShow(ref, path)
    const javascript = ts.transpileModule(source, {
      compilerOptions: {
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.CommonJS,
        esModuleInterop: true,
      },
    }).outputText
    const localRequire = (request: string): unknown => requireFrom(path, request)
    const execute = new Function(
      'require',
      'module',
      'exports',
      '__filename',
      '__dirname',
      javascript,
    )
    execute(localRequire, module, module.exports, path, dirname(path))
    cache.set(path, module.exports)
    return module.exports
  }

  function requireFrom(fromPath: string, request: string): unknown {
    if (request === '../lib/prisma' || request.endsWith('/lib/prisma')) {
      return { prisma: fakePrisma }
    }
    if (request === '@prisma/client') {
      return {
        PrismaClient: class {
          constructor() {
            return fakePrisma
          }
        },
      }
    }
    if (request === 'fs' || request === 'node:fs') return quietFs
    if (request === 'path' || request === 'node:path') return nodePath
    if (request.startsWith('.')) return load(resolveGitModule(fromPath, request))
    return nativeRequire(request)
  }

  return { requireFrom }
}

async function replayHistoricalSource(source: HistoricalSource, rows: AnyRow[]): Promise<void> {
  const text = stripHistoricalScript(gitShow(source.ref, source.path))
  const javascript = ts.transpileModule(text, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.CommonJS,
      esModuleInterop: true,
    },
    reportDiagnostics: true,
  })
  const diagnostics = javascript.diagnostics?.filter(
    diagnostic => diagnostic.category === ts.DiagnosticCategory.Error,
  )
  if (diagnostics?.length) {
    throw new Error(
      `${source.ref}:${source.path}: ${diagnostics
        .map(diagnostic => ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'))
        .join('; ')}`,
    )
  }

  const quietConsole = {
    log: () => undefined,
    warn: () => undefined,
    error: () => undefined,
  }
  const historicalProcess = {
    argv: ['node', source.path, ...(source.args ?? ['--apply', '--commit'])],
    env: process.env,
    cwd: () => ROOT,
    exitCode: 0,
    exit: (code?: number) => {
      throw new Error(`historical source called process.exit(${code ?? 0})`)
    },
  }

  try {
    const fakePrisma = createHistoricalPrisma(rows)
    const loader = createGitModuleLoader(source.ref, fakePrisma)
    const module = { exports: {} as AnyRow }
    const execute = new Function(
      'require',
      'module',
      'exports',
      '__filename',
      '__dirname',
      'process',
      'console',
      javascript.outputText,
    )
    execute(
      (request: string) => loader.requireFrom(source.path, request),
      module,
      module.exports,
      source.path,
      dirname(source.path),
      historicalProcess,
      quietConsole,
    )
    const historicalMain = module.exports.__historicalMain
    if (typeof historicalMain !== 'function') {
      throw new Error('main function was not exported by the isolated replay')
    }
    await historicalMain()
  } catch (error) {
    throw new Error(
      `could not replay ${source.ref}:${source.path}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    )
  }
}

async function buildBaselines(): Promise<{
  baselines: Map<string, Baseline>
  coverage: Map<string, CoverageEntry[]>
}> {
  const rows = JSON.parse(gitShow(DUMP_REF, DUMP_PATH)) as AnyRow[]
  const coverage = new Map<string, CoverageEntry[]>()
  const addCoverage = (productNumber: string, entry: CoverageEntry) => {
    coverage.set(productNumber, [...(coverage.get(productNumber) ?? []), entry])
  }

  for (const productNumber of PRODUCT_NUMBERS) {
    addCoverage(productNumber, {
      kind: 'dump-seed',
      ref: DUMP_REF,
      path: DUMP_PATH,
      status: 'represented',
    })
  }

  for (const source of CREATION_BASELINES) {
    const createdRows: AnyRow[] = []
    await replayHistoricalSource(source, createdRows)
    for (const productNumber of source.products) {
      const created =
        createdRows.find(
          row => row.productNumber === productNumber || row.id === productNumber,
        ) ?? (source.products.length === 1 && createdRows.length === 1 ? createdRows[0] : undefined)
      if (!created) {
        throw new Error(
          `${source.ref}:${source.path} did not reconstruct product ${productNumber}`,
        )
      }
      const target = rows.find(
        row => row.productNumber === productNumber || row.id === productNumber,
      )
      if (!target) throw new Error(`dump target ${productNumber} missing`)
      for (const field of source.fields) {
        if (Object.prototype.hasOwnProperty.call(created, field)) target[field] = created[field]
      }
      addCoverage(productNumber, {
        kind: 'creation-baseline',
        ref: source.ref,
        path: source.path,
        status: 'represented',
      })
    }
  }

  const product61BackupPath = 'backup-product-61-2026-08-13.json'
  const backup = JSON.parse(readFileSync(join(ROOT, product61BackupPath), 'utf8')) as AnyRow
  if (backup.productNumber !== '61') {
    throw new Error(`${product61BackupPath} is not a product 61 backup`)
  }
  const product61 = rows.find(row => row.productNumber === '61' || row.id === '61')
  if (!product61) throw new Error('dump target 61 missing')
  for (const field of PROTECTED_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(backup, field)) product61[field] = backup[field]
  }
  addCoverage('61', {
    kind: 'backup-baseline',
    ref: 'working-tree-backup',
    path: product61BackupPath,
    status: 'represented',
  })

  for (const source of HISTORICAL_SOURCES) {
    await replayHistoricalSource(source, rows)
    for (const productNumber of source.products) {
      addCoverage(productNumber, {
        kind: 'historical-overlay',
        ref: source.ref,
        path: source.path,
        status: 'represented',
      })
    }
  }

  // The pre-localization records for product 53 and beauty boxes 54-59 had no
  // productDetails payload. The Aug 21 localization updaters created those
  // English objects, so restore the original null rather than leaving them as
  // unresolved localization residue.
  for (const productNumber of ['53', '54', '55', '56', '57', '58', '59']) {
    const row = rows.find(
      candidate => candidate.productNumber === productNumber || candidate.id === productNumber,
    )
    if (!row) throw new Error(`null productDetails baseline target ${productNumber} missing`)
    row.productDetails = null
  }

  const baselines = new Map<string, Baseline>()
  for (const productNumber of PRODUCT_NUMBERS) {
    const row = rows.find(
      candidate =>
        candidate.productNumber === productNumber ||
        (!candidate.productNumber && candidate.id === productNumber),
    )
    if (!row) throw new Error(`product ${productNumber} missing from ${DUMP_REF}:${DUMP_PATH}`)
    const baseline: Baseline = {}
    for (const field of PROTECTED_FIELDS) {
      if (Object.prototype.hasOwnProperty.call(row, field)) baseline[field] = row[field]
    }
    baselines.set(productNumber, baseline)
  }
  return { baselines, coverage }
}

function assertUpdateAllowlist(update: AnyRow, productNumber: string): void {
  const forbidden = Object.keys(update).filter(field => !PROTECTED.has(field))
  if (forbidden.length) {
    throw new Error(`product ${productNumber} update contains forbidden fields: ${forbidden.join(', ')}`)
  }
}

function assertExactProtectedParity(
  actual: AnyRow,
  expected: Baseline,
  productNumber: string,
): void {
  for (const [field, value] of Object.entries(expected)) {
    if (!same(actual[field], value)) {
      throw new Error(
        `product ${productNumber}.${field} parity failure: expected ${comparable(value)}, got ${comparable(actual[field])}`,
      )
    }
  }
}

function assertUnrelatedParity(before: AnyRow, after: AnyRow, productNumber: string): void {
  for (const key of Object.keys(before)) {
    if (PROTECTED.has(key) || key === 'updatedAt') continue
    if (!same(before[key], after[key])) {
      throw new Error(`product ${productNumber}.${key} changed outside the protected allowlist`)
    }
  }
}

async function main() {
  const { baselines, coverage } = await buildBaselines()
  const current = (await prisma.product.findMany({
    where: { productNumber: { in: PRODUCT_NUMBERS } },
    include: { variants: true },
    orderBy: { productNumber: 'asc' },
  })) as unknown as AnyRow[]

  const byNumber = new Map(current.map(row => [String(row.productNumber), row]))
  const missing = PRODUCT_NUMBERS.filter(productNumber => !byNumber.has(productNumber))
  if (missing.length) throw new Error(`production products missing: ${missing.join(', ')}`)
  if (current.length !== PRODUCT_NUMBERS.length) {
    throw new Error(`expected 26 production products, found ${current.length}`)
  }

  const updates = new Map<string, AnyRow>()
  const changed: Array<{ productNumber: string; fields: string[] }> = []
  const unresolved: Array<{ productNumber: string; fields: string[] }> = []

  for (const productNumber of PRODUCT_NUMBERS) {
    const row = byNumber.get(productNumber)!
    const baseline = baselines.get(productNumber)!
    const update: AnyRow = {}
    const unresolvedFields: string[] = []

    for (const field of PROTECTED_FIELDS) {
      if (!Object.prototype.hasOwnProperty.call(baseline, field)) {
        unresolvedFields.push(field)
      } else if (!same(row[field], baseline[field])) {
        update[field] = baseline[field]
      }
    }
    assertUpdateAllowlist(update, productNumber)
    if (Object.keys(update).length) {
      updates.set(productNumber, update)
      changed.push({ productNumber, fields: Object.keys(update).sort() })
    }
    if (unresolvedFields.length) {
      unresolved.push({ productNumber, fields: unresolvedFields.sort() })
    }
  }

  let backupPath: string | null = null
  if (APPLY) {
    const stamp = new Date().toISOString().replace(/[:.]/g, '-')
    backupPath = join(ROOT, 'backups', `opus-english-db-products-41-66-before-${stamp}.json`)
    mkdirSync(dirname(backupPath), { recursive: true })
    writeFileSync(
      backupPath,
      JSON.stringify(
        {
          createdAt: new Date().toISOString(),
          products: current,
        },
        null,
        2,
      ),
    )

    await prisma.$transaction(
      async tx => {
        for (const [productNumber, data] of updates) {
          await tx.product.update({
            where: { id: String(byNumber.get(productNumber)!.id) },
            data,
          })
        }

        const after = (await tx.product.findMany({
          where: { productNumber: { in: PRODUCT_NUMBERS } },
          include: { variants: true },
        })) as unknown as AnyRow[]
        const afterByNumber = new Map(after.map(row => [String(row.productNumber), row]))

        for (const productNumber of PRODUCT_NUMBERS) {
          const beforeRow = byNumber.get(productNumber)!
          const afterRow = afterByNumber.get(productNumber)
          if (!afterRow) throw new Error(`post-write product ${productNumber} missing`)
          assertUnrelatedParity(beforeRow, afterRow, productNumber)
          assertExactProtectedParity(afterRow, baselines.get(productNumber)!, productNumber)
        }
      },
      { timeout: 60_000 },
    )

    const persisted = (await prisma.product.findMany({
      where: { productNumber: { in: PRODUCT_NUMBERS } },
      include: { variants: true },
    })) as unknown as AnyRow[]
    const persistedByNumber = new Map(
      persisted.map(row => [String(row.productNumber), row]),
    )
    for (const productNumber of PRODUCT_NUMBERS) {
      const row = persistedByNumber.get(productNumber)
      if (!row) throw new Error(`post-commit product ${productNumber} missing`)
      assertExactProtectedParity(row, baselines.get(productNumber)!, productNumber)
      assertUnrelatedParity(byNumber.get(productNumber)!, row, productNumber)
    }
  }

  const unresolvedByProduct = new Map(
    unresolved.map(entry => [entry.productNumber, entry.fields]),
  )
  const coverageReport = PRODUCT_NUMBERS.map(productNumber => {
    const chain = coverage.get(productNumber) ?? []
    if (!chain.length) throw new Error(`product ${productNumber} has no represented source chain`)
    return {
      productNumber,
      chain,
      unresolvedFields: unresolvedByProduct.get(productNumber) ?? [],
    }
  })

  const report = {
    mode: APPLY ? 'apply' : 'dry-run',
    backup: backupPath,
    dump: {
      source: `${DUMP_REF}:${DUMP_PATH}`,
      gitCommitTimestamp: '2026-08-17T19:59:18+04:00',
      embeddedDataTimestamp: null,
      actualDataDate: 'unknown-no-provenance-timestamp-in-file',
    },
    productsInspected: PRODUCT_NUMBERS.length,
    productsChanged: changed.length,
    changed,
    unresolved,
    coverage: coverageReport,
    assertions: {
      allowlistOnly: true,
      localizedAndCommercialFieldsExcluded: true,
      unresolvedFieldsOmitted: true,
      transaction: APPLY ? 'committed-and-verified' : 'not-run',
      postWriteParity: APPLY ? 'verified' : 'not-run',
    },
  }
  console.log(JSON.stringify(report))
}

main()
  .catch(error => {
    console.error(
      JSON.stringify({
        mode: APPLY ? 'apply' : 'dry-run',
        error: error instanceof Error ? error.message : String(error),
      }),
    )
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
