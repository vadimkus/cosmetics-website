import fs from 'node:fs'
import path from 'node:path'

const ORDER_CREATION_ROUTES = [
  'app/api/orders/cod-confirmation/route.ts',
  'app/api/mobile/orders/route.ts',
  'app/api/mobile/checkout/stripe/route.ts',
  'app/api/mobile/payments/applepay/intent/route.ts',
  'app/api/partners/order/route.ts',
  'app/api/mobile/partner/order/route.ts',
]

describe('order image canonicalization', () => {
  it.each(ORDER_CREATION_ROUTES)(
    '%s uses server catalog images instead of client cart snapshots',
    (relativePath) => {
      const source = fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8')

      expect(source).toContain('canonicalOrderItemImage')
      expect(source).not.toMatch(
        /image:\s*(?:item|g\.item)\.image\s*\|\|\s*(?:product|g\.product)\.image/,
      )
    },
  )
})
