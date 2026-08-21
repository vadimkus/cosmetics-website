/**
 * Restores protected English customer copy while preserving the RU/AR
 * localization work completed on 2026-08-21.
 *
 * Baselines:
 * - Products 1-33: parent of the first localization commit (09e05719^)
 * - Products 34-66: current HEAD (before their uncommitted localization work)
 *
 * Run without --apply for a dry run:
 *   npx tsx scripts/restore-opus-english-code-20260821.ts
 *   npx tsx scripts/restore-opus-english-code-20260821.ts --apply
 */
import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import ts from 'typescript'

const EARLY_BASELINE = '09e05719^'
const EARLY_TIP = '9fce6d4a'
const LATE_BASELINE = 'HEAD'
const apply = process.argv.includes('--apply')

type Replacement = {
  start: number
  end: number
  text: string
}

function git(args: string[]): string {
  return execFileSync('git', args, { encoding: 'utf8' })
}

function at(ref: string, path: string): string | null {
  try {
    return execFileSync('git', ['show', `${ref}:${path}`], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    })
  } catch {
    return null
  }
}

function changedFiles(range: string): string[] {
  return git(['diff', '--name-only', range])
    .trim()
    .split('\n')
    .filter(Boolean)
}

function source(text: string): ts.SourceFile {
  return ts.createSourceFile('restore.ts', text, ts.ScriptTarget.Latest, true)
}

function applyReplacements(text: string, replacements: Replacement[]): string {
  return [...replacements]
    .sort((a, b) => b.start - a.start)
    .reduce(
      (result, replacement) =>
        result.slice(0, replacement.start) + replacement.text + result.slice(replacement.end),
      text,
    )
}

function writeIfChanged(path: string, before: string, after: string): boolean {
  if (before === after) return false
  if (apply) writeFileSync(path, after)
  return true
}

function namedEnglishInitializers(text: string): Map<string, string> {
  const file = source(text)
  const values = new Map<string, string>()
  const counts = new Map<string, number>()

  function add(key: string, initializer: ts.Expression) {
    const count = counts.get(key) ?? 0
    counts.set(key, count + 1)
    values.set(`${key}:${count}`, initializer.getText(file))
  }

  function visit(node: ts.Node) {
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.initializer &&
      (node.name.text === 'EN' ||
        node.name.text.startsWith('EN_') ||
        node.name.text.endsWith('_EN') ||
        node.name.text.includes('EN_COPY') ||
        node.name.text === 'DESCRIPTION_EN')
    ) {
      add(`variable:${node.name.text}`, node.initializer)
    }

    if (
      ts.isPropertyAssignment(node) &&
      ((ts.isIdentifier(node.name) && node.name.text === 'en') ||
        (ts.isStringLiteral(node.name) && node.name.text === 'en'))
    ) {
      add('property:en', node.initializer)
    }

    ts.forEachChild(node, visit)
  }

  visit(file)
  return values
}

function restoreNamedEnglish(current: string, baseline: string): string {
  const currentFile = source(current)
  const baselineValues = namedEnglishInitializers(baseline)
  const counts = new Map<string, number>()
  const replacements: Replacement[] = []

  function restore(key: string, initializer: ts.Expression) {
    const count = counts.get(key) ?? 0
    counts.set(key, count + 1)
    const value = baselineValues.get(`${key}:${count}`)
    if (value === undefined || initializer.getText(currentFile) === value) return
    replacements.push({
      start: initializer.getStart(currentFile),
      end: initializer.getEnd(),
      text: value,
    })
  }

  function visit(node: ts.Node) {
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.initializer &&
      (node.name.text === 'EN' ||
        node.name.text.startsWith('EN_') ||
        node.name.text.endsWith('_EN') ||
        node.name.text.includes('EN_COPY') ||
        node.name.text === 'DESCRIPTION_EN')
    ) {
      restore(`variable:${node.name.text}`, node.initializer)
    }

    if (
      ts.isPropertyAssignment(node) &&
      ((ts.isIdentifier(node.name) && node.name.text === 'en') ||
        (ts.isStringLiteral(node.name) && node.name.text === 'en'))
    ) {
      restore('property:en', node.initializer)
    }

    ts.forEachChild(node, visit)
  }

  visit(currentFile)
  return applyReplacements(current, replacements)
}

function productArrays(text: string): Map<string, ts.ArrayLiteralExpression> {
  const file = source(text)
  const arrays = new Map<string, ts.ArrayLiteralExpression>()

  function visit(node: ts.Node) {
    if (ts.isPropertyAssignment(node) && ts.isArrayLiteralExpression(node.initializer)) {
      const name =
        ts.isStringLiteral(node.name) || ts.isNumericLiteral(node.name)
          ? node.name.text
          : null
      if (name && /^\d+$/.test(name)) arrays.set(name, node.initializer)
    }
    ts.forEachChild(node, visit)
  }

  visit(file)
  return arrays
}

function englishQuickFacts(text: string): Map<string, string[][]> {
  const file = source(text)
  const result = new Map<string, string[][]>()
  for (const [productNumber, array] of productArrays(text)) {
    result.set(
      productNumber,
      array.elements
        .filter(ts.isCallExpression)
        .map(call => call.arguments.slice(0, 2).map(argument => argument.getText(file))),
    )
  }
  return result
}

function restoreQuickFacts(current: string, baseline: string, productNumbers: Set<string>): string {
  const currentFile = source(current)
  const baselineFacts = englishQuickFacts(baseline)
  const replacements: Replacement[] = []

  for (const [productNumber, array] of productArrays(current)) {
    if (!productNumbers.has(productNumber)) continue
    const baselineCalls = baselineFacts.get(productNumber)
    if (!baselineCalls) continue

    const calls = array.elements.filter(ts.isCallExpression)
    calls.forEach((call, index) => {
      const baselineArguments = baselineCalls[index]
      if (!baselineArguments) return
      for (let argumentIndex = 0; argumentIndex < 2; argumentIndex += 1) {
        const argument = call.arguments[argumentIndex]
        const value = baselineArguments[argumentIndex]
        if (!argument || value === undefined || argument.getText(currentFile) === value) continue
        replacements.push({
          start: argument.getStart(currentFile),
          end: argument.getEnd(),
          text: value,
        })
      }
    })
  }

  return applyReplacements(current, replacements)
}

function productObjects(text: string): Map<string, ts.ObjectLiteralExpression> {
  const file = source(text)
  const objects = new Map<string, ts.ObjectLiteralExpression>()

  function visit(node: ts.Node) {
    if (ts.isObjectLiteralExpression(node)) {
      const id = node.properties.find(
        (property): property is ts.PropertyAssignment =>
          ts.isPropertyAssignment(property) &&
          ((ts.isIdentifier(property.name) && property.name.text === 'id') ||
            (ts.isStringLiteral(property.name) && property.name.text === 'id')) &&
          ts.isStringLiteral(property.initializer) &&
          /^\d+$/.test(property.initializer.text),
      )
      if (id && ts.isStringLiteral(id.initializer)) objects.set(id.initializer.text, node)
    }
    ts.forEachChild(node, visit)
  }

  visit(file)
  return objects
}

function properties(
  text: string,
  object: ts.ObjectLiteralExpression,
): Map<string, ts.PropertyAssignment> {
  const result = new Map<string, ts.PropertyAssignment>()
  for (const property of object.properties) {
    if (!ts.isPropertyAssignment(property)) continue
    const name =
      ts.isIdentifier(property.name) || ts.isStringLiteral(property.name)
        ? property.name.text
        : null
    if (name) result.set(name, property)
  }
  return result
}

function restoreProductFields(
  current: string,
  baseline: string,
  productNumbers: Set<string>,
): string {
  const currentFile = source(current)
  const baselineFile = source(baseline)
  const currentObjects = productObjects(current)
  const baselineObjects = productObjects(baseline)
  const fields = new Set(['name', 'description', 'size', 'disclaimer'])
  const replacements: Replacement[] = []

  for (const productNumber of productNumbers) {
    const currentObject = currentObjects.get(productNumber)
    const baselineObject = baselineObjects.get(productNumber)
    if (!currentObject || !baselineObject) continue
    const currentProperties = properties(current, currentObject)
    const baselineProperties = properties(baseline, baselineObject)

    for (const field of fields) {
      const currentProperty = currentProperties.get(field)
      const baselineProperty = baselineProperties.get(field)
      if (!currentProperty || !baselineProperty) continue
      const value = baselineProperty.initializer.getText(baselineFile)
      if (currentProperty.initializer.getText(currentFile) === value) continue
      replacements.push({
        start: currentProperty.initializer.getStart(currentFile),
        end: currentProperty.initializer.getEnd(),
        text: value,
      })
    }
  }

  return applyReplacements(current, replacements)
}

function restoreSeoDescriptions(
  current: string,
  baseline: string,
  productNumbers: Set<string>,
): string {
  const currentFile = source(current)
  const baselineFile = source(baseline)
  const baselineByHref = new Map<string, string>()

  function collectBaseline(node: ts.Node) {
    if (ts.isObjectLiteralExpression(node)) {
      const values = properties(baseline, node)
      const href = values.get('href')
      const description = values.get('description')
      if (
        href &&
        description &&
        ts.isStringLiteral(href.initializer) &&
        /^\/products\/\d+$/.test(href.initializer.text)
      ) {
        baselineByHref.set(
          href.initializer.text,
          description.initializer.getText(baselineFile),
        )
      }
    }
    ts.forEachChild(node, collectBaseline)
  }
  collectBaseline(baselineFile)

  const replacements: Replacement[] = []
  function visitCurrent(node: ts.Node) {
    if (ts.isObjectLiteralExpression(node)) {
      const values = properties(current, node)
      const href = values.get('href')
      const description = values.get('description')
      if (
        href &&
        description &&
        ts.isStringLiteral(href.initializer) &&
        /^\/products\/\d+$/.test(href.initializer.text)
      ) {
        const productNumber = href.initializer.text.split('/').pop()!
        const value = baselineByHref.get(href.initializer.text)
        if (
          productNumbers.has(productNumber) &&
          value !== undefined &&
          description.initializer.getText(currentFile) !== value
        ) {
          replacements.push({
            start: description.initializer.getStart(currentFile),
            end: description.initializer.getEnd(),
            text: value,
          })
        }
      }
    }
    ts.forEachChild(node, visitCurrent)
  }
  visitCurrent(currentFile)

  return applyReplacements(current, replacements)
}

const earlyProducts = new Set(Array.from({ length: 33 }, (_, index) => String(index + 1)))
const lateProducts = new Set(Array.from({ length: 33 }, (_, index) => String(index + 34)))
const changed: string[] = []

/**
 * The Beauty Box modules hold their English in the same `const EN` shape as the
 * `*Copy.ts` files, but their names end in the box name rather than "Copy".
 */
const isEnglishCopyModule = (path: string) =>
  /Copy\.ts$/.test(path) || path.startsWith('components/product/beautybox/copy/')

const earlyCopyFiles = new Set(
  changedFiles(`${EARLY_BASELINE}..${EARLY_TIP}`).filter(isEnglishCopyModule),
)

function restoreFileWithNamedEnglish(path: string, baselineRef: string) {
  const baseline = at(baselineRef, path)
  if (baseline === null) return
  const before = readFileSync(path, 'utf8')
  const after = restoreNamedEnglish(before, baseline)
  if (writeIfChanged(path, before, after)) changed.push(path)
}

for (const path of changedFiles(LATE_BASELINE).filter(
  path => isEnglishCopyModule(path) && !earlyCopyFiles.has(path),
)) {
  restoreFileWithNamedEnglish(path, LATE_BASELINE)
}
for (const path of earlyCopyFiles) {
  restoreFileWithNamedEnglish(path, EARLY_BASELINE)
}

{
  const path = 'lib/productQuickFactsCatalog.ts'
  const before = readFileSync(path, 'utf8')
  let after = before
  const late = at(LATE_BASELINE, path)
  const early = at(EARLY_BASELINE, path)
  if (late) after = restoreQuickFacts(after, late, lateProducts)
  if (early) after = restoreQuickFacts(after, early, earlyProducts)
  if (writeIfChanged(path, before, after)) changed.push(path)
}

{
  const path = 'lib/products.ts'
  const before = readFileSync(path, 'utf8')
  let after = before
  const late = at(LATE_BASELINE, path)
  const early = at(EARLY_BASELINE, path)
  if (late) after = restoreProductFields(after, late, lateProducts)
  if (early) after = restoreProductFields(after, early, earlyProducts)
  if (writeIfChanged(path, before, after)) changed.push(path)
}

{
  const path = 'lib/seoLandingPages.ts'
  const before = readFileSync(path, 'utf8')
  let after = before
  const late = at(LATE_BASELINE, path)
  const early = at(EARLY_BASELINE, path)
  if (late) after = restoreSeoDescriptions(after, late, lateProducts)
  if (early) after = restoreSeoDescriptions(after, early, earlyProducts)
  if (writeIfChanged(path, before, after)) changed.push(path)
}

{
  const path = 'lib/concernsData.ts'
  const baseline = at(LATE_BASELINE, path)
  if (baseline) {
    const before = readFileSync(path, 'utf8')
    const after = restoreNamedEnglish(before, baseline)
    if (writeIfChanged(path, before, after)) changed.push(path)
  }
}

console.log(JSON.stringify({ mode: apply ? 'apply' : 'dry-run', changed }, null, 2))
