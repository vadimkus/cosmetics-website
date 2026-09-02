/**
 * Every rate limiter must be namespaced.
 *
 * Counters are keyed by the identifier a route passes in, and that identifier
 * is almost always the caller's IP plus a slice of their user agent, which is
 * the same on every route that caller touches. Fourteen limiters, nearly all of
 * the auth family, were passing it bare, so they shared a single row: sign-in
 * attempts spent the sign-up allowance, each route compared that shared count
 * against its own max, and whichever route created the row imposed its window
 * on the rest. A user who mistyped their password a few times then tapped
 * "sign up" was told they had made too many registration attempts.
 *
 * The name now lives on the limiter and is required, so the compiler catches a
 * missing one. This test covers what the compiler cannot: a name that is
 * duplicated across two routes, which would put them back in one bucket.
 */
import { readdirSync, readFileSync, statSync } from 'fs'
import path from 'path'

const API = path.join(__dirname, '../../app/api')

function routeFiles(dir: string): string[] {
  const out: string[] = []
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry)
    if (statSync(full).isDirectory()) out.push(...routeFiles(full))
    else if (entry === 'route.ts') out.push(full)
  }
  return out
}

type Limiter = { name: string; file: string }

function limiters(): Limiter[] {
  const found: Limiter[] = []
  for (const file of routeFiles(API)) {
    const src = readFileSync(file, 'utf8')
    if (!src.includes('rateLimitSimple(')) continue
    // The name is written as the first option, on either the block or the
    // single-line form.
    for (const match of src.matchAll(/rateLimitSimple\(\{\s*name:\s*'([^']+)'/g)) {
      found.push({ name: match[1] as string, file: path.relative(API, file) })
    }
    const declared = [...src.matchAll(/rateLimitSimple\(\{/g)].length
    const named = [...src.matchAll(/rateLimitSimple\(\{\s*name:\s*'/g)].length
    expect({ file: path.relative(API, file), declared, named }).toEqual({
      file: path.relative(API, file),
      declared,
      named: declared,
    })
  }
  return found
}

describe('rate limiter namespacing', () => {
  const all = limiters()

  it('finds the limiters, so a rename cannot quietly empty this test', () => {
    expect(all.length).toBeGreaterThanOrEqual(25)
  })

  it('gives each limiter a name of its own', () => {
    const seen = new Map<string, string[]>()
    for (const { name, file } of all) {
      seen.set(name, [...(seen.get(name) ?? []), file])
    }
    const shared = [...seen.entries()]
      .filter(([, files]) => files.length > 1)
      .map(([name, files]) => `${name}: ${files.join(', ')}`)
    expect(shared).toEqual([])
  })

  it('keeps the auth routes apart, which is the case that broke', () => {
    const auth = all.filter((l) => l.file.includes('auth'))
    expect(auth.length).toBeGreaterThanOrEqual(14)
    expect(new Set(auth.map((l) => l.name)).size).toBe(auth.length)
  })

  it('no longer prefixes the identifier at the call site', () => {
    // A leftover prefix would double up with the name. Harmless, but it means
    // two ways of doing the same thing, and the next reader copies the wrong one.
    const offenders: string[] = []
    for (const file of routeFiles(API)) {
      const src = readFileSync(file, 'utf8')
      if (!src.includes('rateLimitSimple(')) continue
      for (const m of src.matchAll(/Limiter\(\s*`([a-z-]+):\$\{/g)) {
        offenders.push(`${path.relative(API, file)} -> ${m[1]}:`)
      }
    }
    expect(offenders).toEqual([])
  })
})
