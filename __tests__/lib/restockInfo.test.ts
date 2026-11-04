import { daysUntil, restockNote, RESTOCK_NOTES } from '@/lib/restockInfo'

const at = (iso: string) => Date.parse(iso)

describe('restock countdown', () => {
  const date = '2026-12-09'

  it('counts Dubai calendar days, rolling over at Dubai midnight', () => {
    expect(daysUntil(date, at('2026-11-04T04:05:00Z'))).toBe(35)
    expect(daysUntil(date, at('2026-11-04T19:59:00Z'))).toBe(35) // 23:59 Dubai
    expect(daysUntil(date, at('2026-11-04T20:01:00Z'))).toBe(34) // 00:01 Dubai
  })

  it('pluralises in every locale and turns into "coming soon" on the day', () => {
    RESTOCK_NOTES.__test = { availableOn: date }
    const note = (iso: string, locale: string) => restockNote('__test', locale, at(iso))
    expect(note('2026-11-04T08:00:00Z', 'en')).toBe('Coming in 35 days')
    expect(note('2026-12-08T08:00:00Z', 'en')).toBe('Coming in 1 day')
    expect(note('2026-12-09T08:00:00Z', 'en')).toBe('Coming soon')
    expect(note('2026-11-04T08:00:00Z', 'ru')).toBe('Поступит через 35 дней')
    expect(note('2026-11-15T08:00:00Z', 'ru')).toBe('Поступит через 24 дня')
    expect(note('2026-12-08T08:00:00Z', 'ru')).toBe('Поступит через 1 день')
    expect(note('2026-12-07T08:00:00Z', 'ar')).toBe('متوفر خلال يومين')
    expect(note('2026-12-04T08:00:00Z', 'ar')).toBe('متوفر خلال 5 أيام')
    expect(note('2026-11-04T08:00:00Z', 'ar')).toBe('متوفر خلال 35 يومًا')
    delete RESTOCK_NOTES.__test
  })

  it('returns null for products without a note', () => {
    expect(restockNote('no-such-product', 'en')).toBeNull()
  })
})
