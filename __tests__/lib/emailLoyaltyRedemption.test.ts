import { emailTemplates } from '@/lib/email/templates'

const base = {
  orderNumber: 'GENCardM2607176967',
  customerName: 'Alesya Sokolenko',
  customerEmail: 'customer@example.com',
  items: [
    {
      productName: 'GENOSYS Product',
      quantity: 1,
      price: 560,
      image: '/images/product.jpg',
    },
  ],
  subtotal: 560,
  shipping: 45,
  vat: 25.48,
  total: 535,
  loyaltyPointsRedeemed: 1400,
  loyaltyDiscountAmount: 70,
}

describe('loyalty redemption in order emails', () => {
  it('shows points and AED discount in the customer confirmation', () => {
    const template = emailTemplates.orderConfirmation({
      ...base,
      address: 'Dubai',
      emirate: 'Dubai',
      locale: 'en',
    })

    expect(template.html).toContain('GENOSYS Rewards (1,400 pts)')
    expect(template.html).toContain('-AED 70.00')
    expect(template.html).toContain('You saved: AED 70.00')
  })

  it('shows points and AED discount in the admin notification', () => {
    const template = emailTemplates.adminNewOrder({
      ...base,
      itemCount: 1,
      paymentStatus: 'PAID',
      paymentMethod: 'Stripe',
    })

    expect(template.html).toContain('GENOSYS Rewards (1,400 pts)')
    expect(template.html).toContain('-AED 70.00')
  })

  it.each([
    ['ar', (1400).toLocaleString('ar-AE'), 'نقطة'],
    ['ru', (1400).toLocaleString('ru-RU'), 'балл.'],
  ])('localizes the points unit and number for %s customer emails', (locale, points, unit) => {
    const template = emailTemplates.orderConfirmation({
      ...base,
      address: 'Dubai',
      emirate: 'Dubai',
      locale,
    })

    expect(template.html).toContain(`GENOSYS Rewards (${points} ${unit})`)
    expect(template.html).toContain('-AED 70.00')
  })

  it('does not show a rewards row when no points were redeemed', () => {
    const template = emailTemplates.orderConfirmation({
      ...base,
      loyaltyPointsRedeemed: 0,
      loyaltyDiscountAmount: 0,
      address: 'Dubai',
      emirate: 'Dubai',
      locale: 'en',
    })

    expect(template.html).not.toContain('GENOSYS Rewards (')
  })
})
