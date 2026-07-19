import {
  computeClinicPoints,
  computeHomecareEligibleAmounts,
  isHomecareSelfReferral,
  selectWinningHomecareAttribution,
  type ValidHomecareAttribution,
} from '@/lib/homecare'

jest.mock('@/lib/prisma', () => ({ prisma: {} }))

const attribution = (addedAt: string): ValidHomecareAttribution => ({
  scriptId: 'script-1',
  versionId: 'version-1',
  scriptItemId: `item-${addedAt}`,
  clinicUserId: 'clinic-1',
  addedAt: new Date(addedAt),
})

describe('homecare calculations', () => {
  test('awards five percent and rounds to two decimals', () => {
    expect(computeClinicPoints(99)).toBe(4.95)
    expect(computeClinicPoints(10.11)).toBe(0.51)
    expect(computeClinicPoints(-1)).toBe(0)
    expect(computeClinicPoints(Number.NaN)).toBe(0)
  })

  test('allocates loyalty discount and removes VAT only from attributed lines', () => {
    expect(computeHomecareEligibleAmounts([
      { lineTotal: 105, attribution: attribution('2026-07-19T07:00:00Z') },
      { lineTotal: 105, attribution: null },
    ], 21)).toEqual([90, 0])
  })

  test('caps a loyalty discount at the order subtotal', () => {
    expect(computeHomecareEligibleAmounts([
      { lineTotal: 105, attribution: attribution('2026-07-19T07:00:00Z') },
    ], 500)).toEqual([0])
  })

  test('detects clinic self-referrals using normalized email or phone', () => {
    expect(isHomecareSelfReferral({
      customerEmail: ' CLINIC@EXAMPLE.COM ',
      clinicEmail: 'clinic@example.com',
    })).toBe(true)
    expect(isHomecareSelfReferral({
      customerPhone: '+971 50 123 4567',
      clinicPhone: '00971501234567',
    })).toBe(true)
    expect(isHomecareSelfReferral({
      customerEmail: 'patient@example.com',
      clinicEmail: 'clinic@example.com',
    })).toBe(false)
  })

  test('uses the most recently added valid script attribution', () => {
    const older = attribution('2026-07-18T07:00:00Z')
    const newer = attribution('2026-07-19T07:00:00Z')
    expect(selectWinningHomecareAttribution([older, null, newer])).toBe(newer)
    expect(selectWinningHomecareAttribution([null])).toBeNull()
  })
})
