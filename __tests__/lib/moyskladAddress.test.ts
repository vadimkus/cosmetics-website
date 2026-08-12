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
    })
  })
})
