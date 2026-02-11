/**
 * Zod Validation Schemas
 * 
 * Centralized runtime validation for API requests, environment variables,
 * and data models. Replaces manual validation with type-safe schemas.
 * 
 * Usage:
 *   import { loginSchema } from '@/lib/validation/schemas'
 *   const result = loginSchema.safeParse(body)
 *   if (!result.success) return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 })
 */

import { z } from 'zod'

// ============= Environment Variable Schemas =============

export const envSchema = z.object({
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required').optional(),
  MOBILE_APP_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  OPENAI_API_KEY: z.string().optional(),
  GMAIL_USER: z.string().email().optional(),
  GMAIL_APP_PASSWORD: z.string().optional(),
})

// ============= Auth Schemas =============

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address').trim().toLowerCase(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long').trim(),
  email: z.string().email('Please enter a valid email address').trim().toLowerCase(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password is too long'),
  phone: z.string().optional(),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address').trim().toLowerCase(),
})

export const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password is too long'),
})

// ============= Address Schemas =============

export const addressSchema = z.object({
  type: z.enum(['home', 'work', 'other']).default('home'),
  label: z.string().max(50).optional().nullable(),
  name: z.string().min(1, 'Name is required').max(100),
  phone: z.string().min(1, 'Phone is required').max(20),
  addressLine1: z.string().min(1, 'Address is required').max(200),
  addressLine2: z.string().max(200).optional().default(''),
  city: z.string().min(1, 'City is required').max(100),
  emirate: z.string().min(1, 'Emirate is required'),
  country: z.string().default('United Arab Emirates'),
  isDefault: z.boolean().default(false),
})

// ============= Order Schemas =============

export const orderItemSchema = z.object({
  productId: z.string().min(1),
  productName: z.string().min(1),
  quantity: z.number().int().positive(),
  price: z.number().nonnegative(),
  variant: z.string().optional(),
  size: z.string().optional(),
  color: z.string().optional(),
})

export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1, 'Order must have at least one item'),
  shippingAddress: addressSchema,
  paymentMethod: z.enum(['cod', 'stripe', 'apple_pay']),
  notes: z.string().max(500).optional(),
  promoCode: z.string().optional(),
})

// ============= Product Review Schema =============

export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(10, 'Review must be at least 10 characters').max(1000),
})

// ============= Contact / Support Schema =============

export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(1, 'Subject is required').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
})

// ============= Mobile API Schemas =============

export const mobileAuthSchema = z.object({
  'x-api-key': z.string().min(1, 'API key is required'),
})

// ============= Helper Functions =============

/**
 * Validate request body against a Zod schema
 * Returns a standardized error response if validation fails
 */
export function validateBody<T extends z.ZodType>(
  schema: T,
  data: unknown
): { success: true; data: z.infer<T> } | { success: false; error: string; issues: z.ZodIssue[] } {
  const result = schema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return {
    success: false,
    error: result.error.issues[0]?.message || 'Validation failed',
    issues: result.error.issues,
  }
}

// Export types
export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type AddressInput = z.infer<typeof addressSchema>
export type CreateOrderInput = z.infer<typeof createOrderSchema>
export type ReviewInput = z.infer<typeof reviewSchema>
export type ContactInput = z.infer<typeof contactSchema>
