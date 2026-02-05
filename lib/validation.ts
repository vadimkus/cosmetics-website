/**
 * Server-side validation utilities
 * Provides validation functions for inputs, file uploads, and data integrity
 */

// Input length limits (to prevent DoS)
export const INPUT_LIMITS = {
  PRODUCT_NAME: 255,
  PRODUCT_DESCRIPTION: 10000,
  PRODUCT_CATEGORY: 100,
  PRODUCT_SIZE: 100,
  PRODUCT_NUMBER: 50,
  USER_NAME: 100,
  USER_EMAIL: 255,
  USER_PHONE: 20,
  USER_ADDRESS: 500,
  USER_EMIRATE: 50,
  USER_BIRTHDAY: 50,
} as const

// Price validation limits
export const PRICE_LIMITS = {
  MIN: 0.01,
  MAX: 1000000, // 1 million AED
} as const

// File upload limits
export const FILE_LIMITS = {
  PROFILE_PICTURE_MAX_SIZE: 5 * 1024 * 1024, // 5MB
  PROFILE_PICTURE_ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'] as string[],
  PROFILE_PICTURE_BASE64_MAX_LENGTH: 10 * 1024 * 1024, // 10MB base64 (roughly 7.5MB binary)
} as const

/**
 * Validates that a string value does not exceed a maximum length.
 * Used to prevent DoS attacks via oversized input.
 * 
 * @param value - The string to validate (null/undefined passes validation)
 * @param maxLength - Maximum allowed character length
 * @param fieldName - Name of the field for error messages
 * @returns Validation result with optional error message
 * 
 * @example
 * ```ts
 * const result = validateLength(name, INPUT_LIMITS.USER_NAME, 'Name')
 * if (!result.valid) throw new Error(result.error)
 * ```
 */
export function validateLength(value: string | undefined | null, maxLength: number, fieldName: string): {
  valid: boolean
  error?: string
} {
  if (value === undefined || value === null) {
    return { valid: true } // Null/undefined is handled by required checks
  }
  
  if (typeof value !== 'string') {
    return { valid: false, error: `${fieldName} must be a string` }
  }
  
  if (value.length > maxLength) {
    return { 
      valid: false, 
      error: `${fieldName} must be no more than ${maxLength} characters (received ${value.length})` 
    }
  }
  
  return { valid: true }
}

/**
 * Validates that a price is within acceptable range (0.01 - 1,000,000 AED).
 * Uses string-based decimal check to avoid JavaScript floating-point issues.
 * 
 * @param price - The price to validate
 * @returns Validation result with optional error message
 * 
 * @example
 * ```ts
 * const result = validatePrice(product.price)
 * if (!result.valid) return res.status(400).json({ error: result.error })
 * ```
 */
export function validatePrice(price: number | undefined | null): {
  valid: boolean
  error?: string
} {
  if (price === undefined || price === null) {
    return { valid: false, error: 'Price is required' }
  }
  
  if (typeof price !== 'number' || isNaN(price)) {
    return { valid: false, error: 'Price must be a valid number' }
  }
  
  if (price < PRICE_LIMITS.MIN) {
    return { valid: false, error: `Price must be at least ${PRICE_LIMITS.MIN} AED` }
  }
  
  if (price > PRICE_LIMITS.MAX) {
    return { valid: false, error: `Price must be no more than ${PRICE_LIMITS.MAX.toLocaleString()} AED` }
  }
  
  // Check for too many decimal places (max 2 for currency)
  // Note: Using string-based check to avoid floating-point precision issues
  // (e.g., 100 % 0.01 !== 0 in JavaScript due to IEEE 754 floating-point)
  const priceString = price.toString()
  const decimalPart = priceString.split('.')[1]
  if (decimalPart && decimalPart.length > 2) {
    return { valid: false, error: 'Price can have at most 2 decimal places' }
  }
  
  return { valid: true }
}

/**
 * Validate base64 image data URL
 */
export function validateBase64Image(
  dataUrl: string | undefined | null,
  maxSizeBytes: number = FILE_LIMITS.PROFILE_PICTURE_MAX_SIZE,
  allowedTypes: string[] = FILE_LIMITS.PROFILE_PICTURE_ALLOWED_TYPES
): {
  valid: boolean
  error?: string
} {
  if (!dataUrl) {
    return { valid: true } // Empty is allowed (optional field)
  }
  
  if (typeof dataUrl !== 'string') {
    return { valid: false, error: 'Profile picture must be a string' }
  }
  
  // If it's a regular URL (existing profile picture from DB), skip validation
  // Only validate if it's a new base64 upload
  if (dataUrl.startsWith('http://') || dataUrl.startsWith('https://') || dataUrl.startsWith('/')) {
    return { valid: true } // Existing URL, no validation needed
  }
  
  // Check base64 data URL format: data:image/<type>;base64,<data>
  const base64Regex = /^data:image\/(jpeg|jpg|png|gif|webp);base64,/
  if (!base64Regex.test(dataUrl)) {
    return { 
      valid: false, 
      error: 'Profile picture must be a valid base64 image (JPEG, PNG, GIF, or WebP)' 
    }
  }
  
  // Extract MIME type
  const match = dataUrl.match(/^data:image\/([^;]+);base64,/)
  if (match && match[1]) {
    const mimeType = `image/${match[1].toLowerCase()}`
    if (!allowedTypes.includes(mimeType)) {
      return { valid: false, error: `Image type ${mimeType} is not allowed` }
    }
  }
  
  // Check size (approximate: base64 is ~33% larger than binary)
  const base64Data = dataUrl.split(',')[1]
  if (!base64Data) {
    return { valid: false, error: 'Invalid base64 data format' }
  }
  
  // Calculate approximate binary size (base64 length * 3/4)
  const approximateSize = (base64Data.length * 3) / 4
  
  if (approximateSize > maxSizeBytes) {
    const maxSizeMB = (maxSizeBytes / (1024 * 1024)).toFixed(1)
    const actualSizeMB = (approximateSize / (1024 * 1024)).toFixed(1)
    return { 
      valid: false, 
      error: `Image size (${actualSizeMB}MB) exceeds maximum allowed size (${maxSizeMB}MB)` 
    }
  }
  
  // Check total data URL length (safety check)
  if (dataUrl.length > FILE_LIMITS.PROFILE_PICTURE_BASE64_MAX_LENGTH) {
    return { valid: false, error: 'Profile picture data URL is too long' }
  }
  
  return { valid: true }
}

/**
 * Validate product input
 */
export function validateProductInput(input: {
  name?: string
  description?: string
  price?: number
  category?: string
  size?: string | null
  productNumber?: string | null
}): {
  valid: boolean
  errors?: string[]
} {
  const errors: string[] = []
  
  // Validate name
  if (input.name !== undefined) {
    const nameValidation = validateLength(input.name, INPUT_LIMITS.PRODUCT_NAME, 'Product name')
    if (!nameValidation.valid) {
      errors.push(nameValidation.error!)
    }
  }
  
  // Validate description
  if (input.description !== undefined) {
    const descValidation = validateLength(input.description, INPUT_LIMITS.PRODUCT_DESCRIPTION, 'Description')
    if (!descValidation.valid) {
      errors.push(descValidation.error!)
    }
  }
  
  // Validate price
  if (input.price !== undefined) {
    const priceValidation = validatePrice(input.price)
    if (!priceValidation.valid) {
      errors.push(priceValidation.error!)
    }
  }
  
  // Validate category
  if (input.category !== undefined) {
    const catValidation = validateLength(input.category, INPUT_LIMITS.PRODUCT_CATEGORY, 'Category')
    if (!catValidation.valid) {
      errors.push(catValidation.error!)
    }
  }
  
  // Validate size
  if (input.size !== undefined && input.size !== null) {
    const sizeValidation = validateLength(input.size, INPUT_LIMITS.PRODUCT_SIZE, 'Size')
    if (!sizeValidation.valid) {
      errors.push(sizeValidation.error!)
    }
  }
  
  // Validate product number
  if (input.productNumber !== undefined && input.productNumber !== null) {
    const numValidation = validateLength(input.productNumber, INPUT_LIMITS.PRODUCT_NUMBER, 'Product number')
    if (!numValidation.valid) {
      errors.push(numValidation.error!)
    }
  }
  
  if (errors.length === 0) {
    return { valid: true }
  }
  return {
    valid: false,
    errors
  }
}

/**
 * Validate user profile input
 */
export function validateUserProfileInput(input: {
  name?: string
  email?: string
  contactEmail?: string | null
  phone?: string | null
  address?: string | null
  birthday?: string | null
  profilePicture?: string | null
}): {
  valid: boolean
  errors?: string[]
} {
  const errors: string[] = []
  
  // Validate name
  if (input.name !== undefined) {
    const nameValidation = validateLength(input.name, INPUT_LIMITS.USER_NAME, 'Name')
    if (!nameValidation.valid) {
      errors.push(nameValidation.error!)
    }
  }
  
  // Validate email
  if (input.email !== undefined) {
    const emailValidation = validateLength(input.email, INPUT_LIMITS.USER_EMAIL, 'Email')
    if (!emailValidation.valid) {
      errors.push(emailValidation.error!)
    }
  }
  
  // Validate contact email
  if (input.contactEmail !== undefined && input.contactEmail !== null && input.contactEmail.trim() !== '') {
    const contactEmailValidation = validateLength(input.contactEmail, INPUT_LIMITS.USER_EMAIL, 'Contact Email')
    if (!contactEmailValidation.valid) {
      errors.push(contactEmailValidation.error!)
    }
    // Basic email format check
    if (input.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.contactEmail)) {
      errors.push('Contact email must be a valid email address')
    }
  }
  
  // Validate phone
  if (input.phone !== undefined && input.phone !== null) {
    const phoneValidation = validateLength(input.phone, INPUT_LIMITS.USER_PHONE, 'Phone')
    if (!phoneValidation.valid) {
      errors.push(phoneValidation.error!)
    }
  }
  
  // Validate address
  if (input.address !== undefined && input.address !== null) {
    const addressValidation = validateLength(input.address, INPUT_LIMITS.USER_ADDRESS, 'Address')
    if (!addressValidation.valid) {
      errors.push(addressValidation.error!)
    }
  }
  
  // Validate birthday
  if (input.birthday !== undefined && input.birthday !== null) {
    const birthdayValidation = validateLength(input.birthday, INPUT_LIMITS.USER_BIRTHDAY, 'Birthday')
    if (!birthdayValidation.valid) {
      errors.push(birthdayValidation.error!)
    }
  }
  
  // Validate profile picture
  if (input.profilePicture !== undefined && input.profilePicture !== null) {
    const pictureValidation = validateBase64Image(input.profilePicture)
    if (!pictureValidation.valid) {
      errors.push(pictureValidation.error!)
    }
  }
  
  if (errors.length === 0) {
    return { valid: true }
  }
  return {
    valid: false,
    errors
  }
}

