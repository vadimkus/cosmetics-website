/**
 * Every place that creates a User must give it a member number.
 *
 * For a long time only the three mobile routes did. Website sign-ups, by email,
 * Google or Apple, were created without one and nothing assigned it later, so
 * 131 of 1,004 accounts had a blank where the app's membership card prints the
 * number. The fix put the defaulting inside `addUser` and spread
 * `newMemberFields` into the two raw `tx.user.create` calls; this keeps a new
 * creation site from quietly arriving without either.
 */
import { readFileSync } from 'fs'
import path from 'path'
import { execSync } from 'child_process'

// membership imports the Prisma client for its default db argument; nothing in
// this file touches a database.
jest.mock('@/lib/database', () => ({ prisma: {} }))
import { isMemberNumberCollision } from '@/lib/membership'

const ROOT = path.join(__dirname, '../..')

function creationSites(): string[] {
  // Files that call prisma/tx `.user.create(`, outside tests and node_modules.
  const out = execSync(
    // lib/generated holds a Prisma client another test emits mid-run; its
    // typings mention user.create and are not a creation site.
    `rg -l --glob '!node_modules' --glob '!__tests__' --glob '!docs' --glob '!lib/generated/**' --glob '!*.d.ts' 'user\\.create\\(' app lib`,
    { cwd: ROOT, encoding: 'utf8' }
  )
  return out.split('\n').filter(Boolean).sort()
}

describe('member number on every user creation', () => {
  it('each raw user.create sets memberNumber or spreads newMemberFields', () => {
    const files = creationSites()
    expect(files.length).toBeGreaterThan(0)

    const bare: string[] = []
    for (const file of files) {
      const src = readFileSync(path.join(ROOT, file), 'utf8')
      // addUser is the one allowed to build the fields itself; it does so via
      // newMemberFields, which this also checks.
      const ok = src.includes('newMemberFields(') || /memberNumber\s*[,:]/.test(src)
      if (!ok) bare.push(file)
    }
    expect(bare).toEqual([])
  })

  it('the defaulting lives in addUser, not only in the callers', () => {
    const src = readFileSync(path.join(ROOT, 'lib/userStorageDb.ts'), 'utf8')
    expect(src).toContain('newMemberFields(')
    expect(src).toContain('isMemberNumberCollision(')
  })

  it('no addUser call casts its input through `as any`', () => {
    // The membership fields are typed on UserData now. A cast on the input
    // means a caller is passing a name the type does not know, which is how
    // the fields drifted between routes in the first place.
    const files = execSync(`rg -l --glob '!node_modules' --glob '!__tests__' 'addUser\\(' app lib`, {
      cwd: ROOT,
      encoding: 'utf8',
    })
      .split('\n')
      .filter(Boolean)
    const casting: string[] = []
    for (const file of files) {
      const src = readFileSync(path.join(ROOT, file), 'utf8')
      if (/addUser\(\{[\s\S]*?\}\s*as\s+any\s*\)/.test(src)) casting.push(file)
    }
    expect(casting).toEqual([])
  })
})

describe('isMemberNumberCollision', () => {
  it('recognises a unique failure on memberNumber', () => {
    expect(isMemberNumberCollision({ code: 'P2002', meta: { target: ['memberNumber'] } })).toBe(true)
    expect(isMemberNumberCollision({ code: 'P2002', meta: { target: 'User_memberNumber_key' } })).toBe(true)
  })

  it('does not swallow a duplicate email as a collision', () => {
    expect(isMemberNumberCollision({ code: 'P2002', meta: { target: ['email'] } })).toBe(false)
    expect(isMemberNumberCollision({ code: 'P2025' })).toBe(false)
    expect(isMemberNumberCollision(new Error('x'))).toBe(false)
    expect(isMemberNumberCollision(null)).toBe(false)
  })
})
