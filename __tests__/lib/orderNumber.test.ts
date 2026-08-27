import { generateUniqueOrderNumber } from '@/lib/orderNumber'

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    order: {
      findUnique: jest.fn()
    }
  }
}))

import { prisma } from '@/lib/prisma'

const mockFindUnique = prisma.order.findUnique as jest.MockedFunction<typeof prisma.order.findUnique>

describe('orderNumber', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Default: no existing orders (no collisions)
    mockFindUnique.mockResolvedValue(null)
  })

  describe('generateUniqueOrderNumber', () => {
    describe('format for COD orders', () => {
      it('generates correct format for mobile COD orders', async () => {
        const orderNumber = await generateUniqueOrderNumber({
          channel: 'M',
          payment: 'COD',
          date: new Date('2025-12-16')
        })
        
        // Format: CODMYYMMDD####
        expect(orderNumber).toMatch(/^CODM251216\d{4}$/)
      })

      it('generates correct format for website COD orders', async () => {
        const orderNumber = await generateUniqueOrderNumber({
          channel: 'W',
          payment: 'COD',
          date: new Date('2025-12-16')
        })
        
        // Format: CODWYYMMDD####
        expect(orderNumber).toMatch(/^CODW251216\d{4}$/)
      })
    })

    describe('format for Card orders', () => {
      it('generates correct format for mobile Card orders', async () => {
        const orderNumber = await generateUniqueOrderNumber({
          channel: 'M',
          payment: 'CARD',
          date: new Date('2025-12-16')
        })
        
        // Format: GENCardMYYMMDD####
        expect(orderNumber).toMatch(/^GENCardM251216\d{4}$/)
      })

      it('generates correct format for website Card orders', async () => {
        const orderNumber = await generateUniqueOrderNumber({
          channel: 'W',
          payment: 'CARD',
          date: new Date('2025-12-16')
        })
        
        // Format: GENCardWYYMMDD####
        expect(orderNumber).toMatch(/^GENCardW251216\d{4}$/)
      })
    })

    describe('date handling', () => {
      it('uses provided date for date part', async () => {
        const orderNumber = await generateUniqueOrderNumber({
          channel: 'M',
          payment: 'COD',
          date: new Date('2026-01-28')
        })
        
        expect(orderNumber).toMatch(/^CODM260128\d{4}$/)
      })

      it('uses current date when date not provided', async () => {
        const now = new Date()
        const yy = String(now.getFullYear()).slice(-2)
        const mm = String(now.getMonth() + 1).padStart(2, '0')
        const dd = String(now.getDate()).padStart(2, '0')
        const expectedDatePart = `${yy}${mm}${dd}`
        
        const orderNumber = await generateUniqueOrderNumber({
          channel: 'M',
          payment: 'COD'
        })
        
        expect(orderNumber).toContain(expectedDatePart)
      })

      it('pads single-digit months and days with zeros', async () => {
        const orderNumber = await generateUniqueOrderNumber({
          channel: 'M',
          payment: 'COD',
          date: new Date('2025-01-05')
        })
        
        expect(orderNumber).toMatch(/^CODM250105\d{4}$/)
      })
    })

    describe('uniqueness', () => {
      it('generates unique order numbers on subsequent calls', async () => {
        // This test used to fail about one run in fifty. The suffix is four digits, so twenty
        // draws from 10,000 values collide 1.88% of the time by the birthday problem - and the
        // default mock returns null for every lookup, which switches off the retry loop that
        // actually guarantees uniqueness. The assertion was left to the dice.
        //
        // Standing in a fake unique index instead means a repeat is reported the way Postgres
        // would report it, the generator retries, and twenty calls yield twenty distinct
        // numbers. That also makes this exercise the real mechanism rather than the RNG.
        const issued = new Set<string>()
        mockFindUnique.mockImplementation((async (args: { where: { orderNumber: string } }) =>
          issued.has(args.where.orderNumber) ? { id: 'existing-order' } : null
        ) as never)

        const numbers = new Set<string>()

        for (let i = 0; i < 20; i++) {
          const orderNumber = await generateUniqueOrderNumber({
            channel: 'M',
            payment: 'COD',
            date: new Date('2025-12-16')
          })
          issued.add(orderNumber)
          numbers.add(orderNumber)
        }

        expect(numbers.size).toBe(20)
      })

      it('retries when collision detected', async () => {
        // First call returns existing order (collision), second returns null (no collision)
        // Using 'as never' because we're mocking a Prisma client with select: { id: true }
        mockFindUnique
          .mockResolvedValueOnce({ id: 'existing-order' } as never)
          .mockResolvedValue(null)
        
        const orderNumber = await generateUniqueOrderNumber({
          channel: 'M',
          payment: 'COD',
          date: new Date('2025-12-16')
        })
        
        // Should have tried at least twice
        expect(mockFindUnique).toHaveBeenCalledTimes(2)
        expect(orderNumber).toMatch(/^CODM251216\d{4}$/)
      })

      it('adds extra suffix after max retries', async () => {
        // Simulate 10 collisions (max retries)
        mockFindUnique.mockResolvedValue({ id: 'existing-order' } as never)
        
        const orderNumber = await generateUniqueOrderNumber({
          channel: 'M',
          payment: 'COD',
          date: new Date('2025-12-16')
        })
        
        // Should have the base format plus an extra digit
        expect(orderNumber).toMatch(/^CODM251216\d{5}$/)
        expect(mockFindUnique).toHaveBeenCalledTimes(10)
      })
    })

    describe('random suffix', () => {
      it('generates 4-digit random suffix', async () => {
        const orderNumber = await generateUniqueOrderNumber({
          channel: 'M',
          payment: 'COD',
          date: new Date('2025-12-16')
        })
        
        // Extract the last 4 characters (should be 4 digits)
        const suffix = orderNumber.slice(-4)
        expect(suffix).toMatch(/^\d{4}$/)
      })

      it('pads random suffix with leading zeros', async () => {
        // Run multiple times to increase chance of getting a low number
        const allValid = []
        for (let i = 0; i < 50; i++) {
          const orderNumber = await generateUniqueOrderNumber({
            channel: 'M',
            payment: 'COD',
            date: new Date('2025-12-16')
          })
          const suffix = orderNumber.slice(-4)
          allValid.push(suffix.length === 4)
        }
        
        // All suffixes should be exactly 4 characters
        expect(allValid.every(Boolean)).toBe(true)
      })
    })

    describe('database interaction', () => {
      it('checks database for existing order number', async () => {
        await generateUniqueOrderNumber({
          channel: 'M',
          payment: 'COD',
          date: new Date('2025-12-16')
        })
        
        expect(mockFindUnique).toHaveBeenCalledWith({
          where: { orderNumber: expect.any(String) },
          select: { id: true }
        })
      })
    })
  })
})
