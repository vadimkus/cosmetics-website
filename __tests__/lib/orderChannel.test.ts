import { orderChannelLabel, resolveOrderChannel } from '@/lib/orderChannel'

describe('resolveOrderChannel', () => {
  it.each([
    ['GENCardM2610120001', 'app'],
    ['CODM2610120001', 'app'],
    ['GENCardW2610120001', 'website'],
    ['CODW2610120001', 'website'],
    ['GENCardA2610120001', 'ai'],
    ['GEN2510010001', 'website'],
  ])('%s is %s', (orderNumber, channel) => {
    expect(resolveOrderChannel({ orderNumber })).toBe(channel)
  })

  it('labels AI orders for the admin email', () => {
    expect(orderChannelLabel('ai')).toMatch(/AI assistant/)
  })
})
