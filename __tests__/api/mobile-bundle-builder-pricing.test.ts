import { GET } from '@/app/api/mobile/bundle-builder/route'
import { prisma } from '@/lib/prisma'

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((body, init) => ({
      status: init?.status || 200,
      json: async () => body,
    })),
  },
}))

jest.mock('@/lib/prisma', () => ({
  prisma: {
    product: {
      findMany: jest.fn(),
    },
  },
}))

jest.mock('@/lib/logger', () => ({
  debugLog: jest.fn(),
  errorLog: jest.fn(),
}))

function createRequest(): Parameters<typeof GET>[0] {
  return {
    headers: {
      get: jest.fn((key: string) => {
        if (key === 'x-api-key') return 'mobile-key'
        if (key === 'x-locale') return 'en'
        return null
      }),
    },
  } as unknown as Parameters<typeof GET>[0]
}

describe('mobile bundle builder pricing contract', () => {
  const originalMobileKey = process.env.MOBILE_APP_KEY

  beforeEach(() => {
    jest.clearAllMocks()
    process.env.MOBILE_APP_KEY = 'mobile-key'
  })

  afterAll(() => {
    process.env.MOBILE_APP_KEY = originalMobileKey
  })

  it('returns server pricing contracts while preserving retail bundle pricing fields', async () => {
    ;(prisma.product.findMany as jest.Mock).mockResolvedValue([
      {
        id: 'cleanser-1',
        productNumber: '10',
        name: 'Daily Cleanser',
        nameRu: null,
        nameAr: null,
        price: 100,
        description: 'Cleanser',
        descriptionRu: null,
        descriptionAr: null,
        image: '/cleanser.jpg',
        images: null,
        category: 'Cleanser',
        size: '50ml',
        noDiscount: false,
        rating: 5,
        variants: [
          {
            id: 'variant-50',
            size: '50ml',
            color: null,
            price: 150,
            available: true,
            isDefault: true,
          },
          {
            id: 'variant-100',
            size: '100ml',
            color: null,
            price: 250,
            available: true,
            isDefault: false,
          },
        ],
      },
    ])

    const response = await GET(createRequest())
    const body = await response.json()
    const cleanserStep = body.steps.find((step: { id: string }) => step.id === 'cleanser')
    const product = cleanserStep.products[0]

    expect(response.status).toBe(200)
    expect(product.price).toBe(100)
    expect(product.displayPrice).toBe(100)
    expect(product.pricing).toMatchObject({
      source: 'server',
      basePrice: 150,
      unitPrice: 150,
      displayPrice: 150,
      canSeePrice: false,
      selectedVariant: {
        id: 'variant-50',
        size: '50ml',
        price: 150,
      },
    })
    expect(product.variants).toEqual([
      expect.objectContaining({ id: 'variant-50', size: '50ml', color: null, price: 150 }),
      expect.objectContaining({ id: 'variant-100', size: '100ml', color: null, price: 250 }),
    ])
  })
})
