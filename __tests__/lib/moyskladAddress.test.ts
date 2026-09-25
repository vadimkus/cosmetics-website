import { buildMoySkladAddressFull, streetForMoySklad } from '@/lib/moyskladAddress'

const countryMeta = {
  meta: {
    href: 'https://api.moysklad.ru/api/remap/1.2/entity/country/uae',
    type: 'country',
    mediaType: 'application/json',
  },
}

describe('streetForMoySklad', () => {
  it('strips City + UAE from website canonical address', () => {
    expect(streetForMoySklad('Binghatti Jasmine 218, Dubai, UAE', 'Dubai')).toBe(
      'Binghatti Jasmine 218',
    )
  })

  it('keeps district tokens that are not the emirate', () => {
    expect(streetForMoySklad('Oasis Villas 13, JVC, Dubai, UAE', 'Dubai')).toBe(
      'Oasis Villas 13, JVC',
    )
  })

  it('handles address without country suffix', () => {
    expect(streetForMoySklad('Marina Terrace, app 166, Dubai', 'Dubai')).toBe(
      'Marina Terrace, app 166',
    )
  })

  it('returns empty for blank input', () => {
    expect(streetForMoySklad('', 'Dubai')).toBe('')
    expect(streetForMoySklad(undefined, 'Dubai')).toBe('')
  })
})

describe('buildMoySkladAddressFull', () => {
  it('builds street-only + city + country without addInfo', () => {
    expect(
      buildMoySkladAddressFull(
        'Binghatti Jasmine 218, Dubai, UAE',
        'Dubai',
        countryMeta,
      ),
    ).toEqual({
      country: countryMeta,
      city: 'Dubai',
      street: 'Binghatti Jasmine 218',
      addInfo: '',
    })
  })

  it('explicitly clears stale MoySklad addInfo on updates', () => {
    expect(
      buildMoySkladAddressFull(
        'Casa Dora villa 233, Dubai, UAE',
        'Dubai',
        countryMeta,
      ),
    ).toMatchObject({
      city: 'Dubai',
      street: 'Casa Dora villa 233',
      addInfo: '',
    })
  })
})

describe('buildMoySkladAddressFull delivery note', () => {
  const uae = { meta: { href: 'x', type: 'country', mediaType: 'application/json' } }

  it('prints the customer note as addInfo so a building typed into notes reaches the invoice', () => {
    const full = buildMoySkladAddressFull('Dubai, Dubai, United Arab Emirates', 'Dubai', uae, 'Torino by oro 24, 2 block, 212')
    expect(full.addInfo).toBe('Torino by oro 24, 2 block, 212')
    expect(full.city).toBe('Dubai')
  })

  it('keeps addInfo empty without a note, and flattens and caps long notes', () => {
    expect(buildMoySkladAddressFull('Villa 3, Jumeirah', 'Dubai', uae).addInfo).toBe('')
    expect(buildMoySkladAddressFull('x', 'Dubai', uae, 'line one\nline two').addInfo).toBe('line one line two')
    expect(buildMoySkladAddressFull('x', 'Dubai', uae, 'a'.repeat(400)).addInfo).toHaveLength(255)
  })
})
