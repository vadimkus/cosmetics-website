import {
  BEAUTY_BOX_PRODUCT_CUIDS,
  BEAUTY_BOX_PRODUCT_IDS,
  PRODUCT_QUICK_FACTS_CATALOG,
  getCatalogQuickFacts,
} from '@/lib/productQuickFactsCatalog'

const LOCALES = ['en', 'ru', 'ar'] as const
const EXPECTED_IDS = ['55', '56', '57', '58', '59', '62'] as const

const normalize = (value: string) =>
  value
    .normalize('NFKD')
    .toLocaleLowerCase()
    .replace(/[\p{P}\p{S}]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()

describe('Beauty Box Quick Facts catalog', () => {
  it('covers exactly the six live Beauty Box product numbers and CUIDs', () => {
    expect(BEAUTY_BOX_PRODUCT_IDS).toEqual(EXPECTED_IDS)
    expect(BEAUTY_BOX_PRODUCT_CUIDS).toEqual({
      '55': 'cmhowxw4x00008ofct2ivnq2j',
      '56': 'cmhoyg0r400008o7s4va63hsw',
      '57': 'cmhoyw7d500008o9tdprqkkhb',
      '58': 'cmhozfrep00008oxxizeqk8a0',
      '59': 'cmhp0jfrq00008odr033fg0ly',
      '62': 'cml3twwvk0000ua8o9qiqwkie',
    })
    for (const id of EXPECTED_IDS) {
      expect(PRODUCT_QUICK_FACTS_CATALOG[id]).toBeDefined()
    }
  })

  it.each(EXPECTED_IDS)('provides six complete localized facts for box %s', (id) => {
    for (const locale of LOCALES) {
      const facts = getCatalogQuickFacts(id, locale)
      expect(facts).toHaveLength(6)

      for (const fact of facts) {
        expect(fact.title.trim()).not.toBe('')
        expect(fact.text.trim()).not.toBe('')
        expect(fact.title.length).toBeLessThanOrEqual(42)
        expect(fact.text.length).toBeLessThanOrEqual(180)
      }
    }
  })

  it.each(EXPECTED_IDS)('has no duplicate title or text in any locale for box %s', (id) => {
    for (const locale of LOCALES) {
      const facts = getCatalogQuickFacts(id, locale)
      expect(new Set(facts.map(fact => normalize(fact.title))).size).toBe(facts.length)
      expect(new Set(facts.map(fact => normalize(fact.text))).size).toBe(facts.length)
    }
  })

  it('never emits option-derived, raw-key, popularity or unsupported medical copy', () => {
    const optionLeak = /selected shade|выбранный оттенок|الدرجة المختارة|^format$|^формат$|^الحجم$|^beige$|^50g$/i
    const rawKey = /\b(?:product|quickFacts|beautyBox)\.[a-z]/i
    const popularity = /popular|units sold|bestseller|продано|популяр|الأكثر مبيعاً/i
    const unsupportedMedical = /\b(?:cure|cures|heal|heals|medical outcome)\b|лечит|исцел|يشفي|يعالج مرض/i

    for (const id of EXPECTED_IDS) {
      for (const locale of LOCALES) {
        for (const fact of getCatalogQuickFacts(id, locale)) {
          for (const value of [fact.title, fact.text]) {
            expect(value).not.toMatch(optionLeak)
            expect(value).not.toMatch(rawKey)
            expect(value).not.toMatch(popularity)
            expect(value).not.toMatch(unsupportedMedical)
          }
        }
      }
    }
  })

  it('locks verified piece counts and savings to the box source data', () => {
    const expected = {
      '55': ['7 pieces inside', 'Save AED 197.70'],
      '56': ['6 products inside', 'Save AED 224.40'],
      '57': ['5 full-size products', 'Save AED 228'],
      '58': ['9 pieces inside', 'Save AED 208.50'],
      '59': ['7 pieces inside', 'Save AED 197.70'],
      '62': ['6 products inside', 'Save AED 254'],
    } as const

    for (const id of EXPECTED_IDS) {
      const titles = getCatalogQuickFacts(id, 'en').map(fact => fact.title)
      expect(titles).toEqual(expect.arrayContaining([...expected[id]]))
    }
  })

  it('audits product 58 as the anti-aging box, not a Beige 50g item', () => {
    const facts = getCatalogQuickFacts('58', 'en')
    expect(facts.map(fact => fact.title)).toEqual([
      'Firmness + line care',
      '9 pieces inside',
      'Matched treatment duo',
      'Five mask sessions',
      'Clear routine order',
      'Save AED 208.50',
    ])
    expect(JSON.stringify(facts)).not.toMatch(/Beige|Selected shade|Format["']?\s*[:,]\s*["']?50g/i)
  })
})
