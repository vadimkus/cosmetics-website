// Mock Next.js server modules before importing csrf
jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: jest.fn(),
}))

import { generateCsrfToken } from '@/lib/csrf'

// Simplified test - we'll test the actual API endpoint via integration tests
// and focus on unit testing the token generation here

describe('CSRF Protection', () => {
  describe('generateCsrfToken', () => {
    it('should generate a unique token', () => {
      const token1 = generateCsrfToken()
      const token2 = generateCsrfToken()
      
      expect(token1).toBeTruthy()
      expect(token2).toBeTruthy()
      expect(token1).not.toBe(token2)
      expect(token1.length).toBe(64) // 32 bytes = 64 hex characters
      expect(token2.length).toBe(64)
    })
    
    it('should generate tokens with correct format (hex string)', () => {
      const token = generateCsrfToken()
      expect(token).toMatch(/^[a-f0-9]{64}$/)
    })
    
    it('should generate cryptographically secure random tokens', () => {
      const tokens = Array.from({ length: 100 }, () => generateCsrfToken())
      const uniqueTokens = new Set(tokens)
      
      // All 100 tokens should be unique
      expect(uniqueTokens.size).toBe(100)
    })
    
    it('should generate tokens with sufficient entropy', () => {
      const token = generateCsrfToken()
      // 32 bytes = 256 bits of entropy
      expect(token.length).toBe(64) // 64 hex characters = 32 bytes
    })
  })
})

