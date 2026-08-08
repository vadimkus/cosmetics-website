import { getMoySkladDeliveryServiceId } from '@/lib/moysklad'

const SHARJAH_DELIVERY_ID = '52864050-59a7-11eb-0a80-022e00579624'

describe('getMoySkladDeliveryServiceId', () => {
  it.each(['Ajman', 'Umm Al Quwain', 'UAQ'])(
    'maps %s to the shared AED 70 delivery service',
    (emirate) => {
      expect(getMoySkladDeliveryServiceId(emirate)).toBe(SHARJAH_DELIVERY_ID)
    }
  )

  it('returns null for an unsupported emirate instead of silently dropping shipping', () => {
    expect(getMoySkladDeliveryServiceId('Unknown Emirate')).toBeNull()
  })
})
