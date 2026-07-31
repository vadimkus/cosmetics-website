import {
  validateLength,
  validatePrice,
  validateBase64Image,
  validateProductInput,
  validateUserProfileInput,
  validateBirthday,
  getTodayYmd,
  INPUT_LIMITS,
  PRICE_LIMITS,
  FILE_LIMITS
} from '@/lib/validation'

describe('validation', () => {
  describe('INPUT_LIMITS', () => {
    it('exports expected limits', () => {
      expect(INPUT_LIMITS.PRODUCT_NAME).toBe(255)
      expect(INPUT_LIMITS.PRODUCT_DESCRIPTION).toBe(10000)
      expect(INPUT_LIMITS.USER_EMAIL).toBe(255)
      expect(INPUT_LIMITS.USER_PHONE).toBe(20)
    })
  })

  describe('PRICE_LIMITS', () => {
    it('exports expected price limits', () => {
      expect(PRICE_LIMITS.MIN).toBe(0.01)
      expect(PRICE_LIMITS.MAX).toBe(1000000)
    })
  })

  describe('FILE_LIMITS', () => {
    it('exports expected file limits', () => {
      expect(FILE_LIMITS.PROFILE_PICTURE_MAX_SIZE).toBe(5 * 1024 * 1024)
      expect(FILE_LIMITS.PROFILE_PICTURE_ALLOWED_TYPES).toContain('image/jpeg')
      expect(FILE_LIMITS.PROFILE_PICTURE_ALLOWED_TYPES).toContain('image/png')
    })
  })

  describe('validateLength', () => {
    it('returns valid for null or undefined values', () => {
      expect(validateLength(null, 100, 'Field').valid).toBe(true)
      expect(validateLength(undefined, 100, 'Field').valid).toBe(true)
    })

    it('returns valid for strings within limit', () => {
      expect(validateLength('hello', 10, 'Field').valid).toBe(true)
      expect(validateLength('', 10, 'Field').valid).toBe(true)
      expect(validateLength('a'.repeat(100), 100, 'Field').valid).toBe(true)
    })

    it('returns invalid for strings exceeding limit', () => {
      const result = validateLength('a'.repeat(11), 10, 'Field')
      expect(result.valid).toBe(false)
      expect(result.error).toContain('no more than 10 characters')
      expect(result.error).toContain('received 11')
    })

    it('returns invalid for non-string values', () => {
      const result = validateLength(123 as unknown as string, 10, 'Field')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Field must be a string')
    })

    it('includes field name in error message', () => {
      const result = validateLength('a'.repeat(300), 255, 'Product name')
      expect(result.error).toContain('Product name')
    })
  })

  describe('validatePrice', () => {
    it('returns invalid when price is null or undefined', () => {
      expect(validatePrice(null).valid).toBe(false)
      expect(validatePrice(null).error).toBe('Price is required')
      expect(validatePrice(undefined).valid).toBe(false)
    })

    it('returns invalid for non-number values', () => {
      expect(validatePrice('100' as unknown as number).valid).toBe(false)
      expect(validatePrice(NaN).valid).toBe(false)
    })

    it('returns invalid for prices below minimum', () => {
      const result = validatePrice(0)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('at least 0.01')
    })

    it('returns invalid for prices above maximum', () => {
      const result = validatePrice(1000001)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('no more than')
    })

    it('returns valid for prices within range', () => {
      expect(validatePrice(0.01).valid).toBe(true)
      expect(validatePrice(1).valid).toBe(true)
      expect(validatePrice(50).valid).toBe(true)
      expect(validatePrice(100).valid).toBe(true)
      expect(validatePrice(999999.99).valid).toBe(true)
      expect(validatePrice(1000000).valid).toBe(true)
    })

    it('returns invalid for prices with more than 2 decimal places', () => {
      const result = validatePrice(99.999)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('at most 2 decimal places')
    })

    it('returns valid for prices with exactly 2 decimal places', () => {
      expect(validatePrice(99.99).valid).toBe(true)
      expect(validatePrice(0.01).valid).toBe(true)
      expect(validatePrice(123.45).valid).toBe(true)
    })

    it('returns valid for prices with 1 decimal place', () => {
      expect(validatePrice(99.9).valid).toBe(true)
      expect(validatePrice(0.1).valid).toBe(true)
    })
  })

  describe('validateBase64Image', () => {
    const validBase64Prefix = 'data:image/jpeg;base64,'
    const validBase64Data = 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' // 1x1 transparent GIF

    it('returns valid for null or undefined (optional field)', () => {
      expect(validateBase64Image(null).valid).toBe(true)
      expect(validateBase64Image(undefined).valid).toBe(true)
      expect(validateBase64Image('').valid).toBe(true)
    })

    it('returns valid for existing URLs (http, https, /)', () => {
      expect(validateBase64Image('https://example.com/image.jpg').valid).toBe(true)
      expect(validateBase64Image('http://example.com/image.jpg').valid).toBe(true)
      expect(validateBase64Image('/images/profile.jpg').valid).toBe(true)
    })

    it('returns invalid for non-string values', () => {
      const result = validateBase64Image(123 as unknown as string)
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Profile picture must be a string')
    })

    it('returns invalid for invalid base64 format', () => {
      const result = validateBase64Image('not-a-valid-data-url')
      expect(result.valid).toBe(false)
      expect(result.error).toContain('valid base64 image')
    })

    it('returns valid for proper base64 jpeg', () => {
      const validImage = `${validBase64Prefix}${validBase64Data}`
      expect(validateBase64Image(validImage).valid).toBe(true)
    })

    it('returns valid for supported image types', () => {
      expect(validateBase64Image(`data:image/png;base64,${validBase64Data}`).valid).toBe(true)
      expect(validateBase64Image(`data:image/gif;base64,${validBase64Data}`).valid).toBe(true)
      expect(validateBase64Image(`data:image/webp;base64,${validBase64Data}`).valid).toBe(true)
    })

    it('returns invalid for unsupported image types', () => {
      const result = validateBase64Image(`data:image/bmp;base64,${validBase64Data}`)
      expect(result.valid).toBe(false)
    })

    it('returns invalid when base64 data exceeds size limit', () => {
      // Create a base64 string that exceeds 5MB binary equivalent
      const largeBase64 = 'A'.repeat(7 * 1024 * 1024) // ~5.25MB binary
      const largeImage = `data:image/jpeg;base64,${largeBase64}`
      
      const result = validateBase64Image(largeImage)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('exceeds maximum allowed size')
    })

    it('returns invalid when total data URL exceeds length limit', () => {
      // Create a data URL that exceeds the max length
      const veryLargeBase64 = 'A'.repeat(FILE_LIMITS.PROFILE_PICTURE_BASE64_MAX_LENGTH + 1)
      const result = validateBase64Image(`data:image/jpeg;base64,${veryLargeBase64}`)
      expect(result.valid).toBe(false)
    })

    it('allows custom size limits', () => {
      const base64Data = 'A'.repeat(1000) // ~750 bytes
      const image = `data:image/jpeg;base64,${base64Data}`
      
      // Should pass with high limit
      expect(validateBase64Image(image, 10000).valid).toBe(true)
      
      // Should fail with low limit
      const result = validateBase64Image(image, 100)
      expect(result.valid).toBe(false)
    })
  })

  describe('validateProductInput', () => {
    it('returns valid for empty input', () => {
      expect(validateProductInput({}).valid).toBe(true)
    })

    it('returns valid for valid product data', () => {
      const result = validateProductInput({
        name: 'Test Product',
        description: 'A test description',
        price: 99.99,
        category: 'Skincare',
        size: '50ml',
        productNumber: 'PROD-001'
      })
      expect(result.valid).toBe(true)
    })

    it('returns invalid when name exceeds limit', () => {
      const result = validateProductInput({
        name: 'A'.repeat(256)
      })
      expect(result.valid).toBe(false)
      expect(result.errors).toContainEqual(expect.stringContaining('Product name'))
    })

    it('returns invalid when description exceeds limit', () => {
      const result = validateProductInput({
        description: 'A'.repeat(10001)
      })
      expect(result.valid).toBe(false)
      expect(result.errors).toContainEqual(expect.stringContaining('Description'))
    })

    it('returns invalid for invalid price', () => {
      const result = validateProductInput({
        price: -10
      })
      expect(result.valid).toBe(false)
      expect(result.errors).toContainEqual(expect.stringContaining('Price'))
    })

    it('collects multiple errors', () => {
      const result = validateProductInput({
        name: 'A'.repeat(300),
        description: 'B'.repeat(15000),
        price: -5
      })
      expect(result.valid).toBe(false)
      expect(result.errors?.length).toBeGreaterThanOrEqual(3)
    })

    it('allows null for optional fields', () => {
      const result = validateProductInput({
        name: 'Test',
        size: null,
        productNumber: null
      })
      expect(result.valid).toBe(true)
    })
  })

  describe('validateUserProfileInput', () => {
    it('returns valid for empty input', () => {
      expect(validateUserProfileInput({}).valid).toBe(true)
    })

    it('returns valid for valid user profile data', () => {
      const result = validateUserProfileInput({
        name: 'John Doe',
        email: 'john@example.com',
        contactEmail: 'contact@example.com',
        phone: '+971501234567',
        address: '123 Main St, Dubai',
        birthday: '1990-01-01'
      })
      expect(result.valid).toBe(true)
    })

    it('returns invalid when name exceeds limit', () => {
      const result = validateUserProfileInput({
        name: 'A'.repeat(101)
      })
      expect(result.valid).toBe(false)
      expect(result.errors).toContainEqual(expect.stringContaining('Name'))
    })

    it('returns invalid when email exceeds limit', () => {
      const result = validateUserProfileInput({
        email: 'a'.repeat(250) + '@test.com'
      })
      expect(result.valid).toBe(false)
    })

    it('returns invalid for invalid contact email format', () => {
      const result = validateUserProfileInput({
        contactEmail: 'not-an-email'
      })
      expect(result.valid).toBe(false)
      expect(result.errors).toContainEqual(expect.stringContaining('valid email address'))
    })

    it('returns valid for empty contact email', () => {
      const result = validateUserProfileInput({
        contactEmail: ''
      })
      expect(result.valid).toBe(true)
    })

    it('returns invalid when phone exceeds limit', () => {
      const result = validateUserProfileInput({
        phone: '1'.repeat(21)
      })
      expect(result.valid).toBe(false)
      expect(result.errors).toContainEqual(expect.stringContaining('Phone'))
    })

    it('returns invalid when address exceeds limit', () => {
      const result = validateUserProfileInput({
        address: 'A'.repeat(501)
      })
      expect(result.valid).toBe(false)
      expect(result.errors).toContainEqual(expect.stringContaining('Address'))
    })

    it('validates profile picture as base64 image', () => {
      const result = validateUserProfileInput({
        profilePicture: 'invalid-base64-data'
      })
      expect(result.valid).toBe(false)
      expect(result.errors).toContainEqual(expect.stringContaining('base64'))
    })

    it('allows existing URL for profile picture', () => {
      const result = validateUserProfileInput({
        profilePicture: 'https://example.com/photo.jpg'
      })
      expect(result.valid).toBe(true)
    })

    it('allows null for optional fields', () => {
      const result = validateUserProfileInput({
        name: 'John',
        contactEmail: null,
        phone: null,
        address: null,
        birthday: null,
        profilePicture: null
      })
      expect(result.valid).toBe(true)
    })

    it('collects multiple errors', () => {
      const result = validateUserProfileInput({
        name: 'A'.repeat(200),
        phone: '1'.repeat(50),
        contactEmail: 'invalid-email'
      })
      expect(result.valid).toBe(false)
      expect(result.errors?.length).toBeGreaterThanOrEqual(3)
    })

    it('rejects a future birthday', () => {
      const result = validateUserProfileInput({ birthday: '2099-01-01' })
      expect(result.valid).toBe(false)
      expect(result.errors?.some((e) => e.includes('future'))).toBe(true)
    })
  })

  describe('validateBirthday', () => {
    it('allows empty birthday', () => {
      expect(validateBirthday('').valid).toBe(true)
      expect(validateBirthday(null).valid).toBe(true)
      expect(validateBirthday(undefined).valid).toBe(true)
    })

    it('rejects invalid format and calendar dates', () => {
      expect(validateBirthday('02-08-1990').valid).toBe(false)
      expect(validateBirthday('2026-02-31').valid).toBe(false)
    })

    it('rejects future dates vs Asia/Dubai today', () => {
      const [y, m, d] = getTodayYmd('Asia/Dubai').split('-').map(Number) as [number, number, number]
      const next = new Date(Date.UTC(y, m - 1, d + 1))
      const tomorrow = [
        next.getUTCFullYear(),
        String(next.getUTCMonth() + 1).padStart(2, '0'),
        String(next.getUTCDate()).padStart(2, '0'),
      ].join('-')
      const result = validateBirthday(tomorrow)
      expect(result.valid).toBe(false)
      expect(result.error).toMatch(/future/i)
    })

    it('accepts a past birthday', () => {
      const result = validateBirthday('1990-08-02')
      expect(result.valid).toBe(true)
      expect(result.value).toBe('1990-08-02')
    })
  })
})
