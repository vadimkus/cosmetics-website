/**
 * Edge Runtime Guide for GENOSYS API Routes
 * 
 * WHEN TO USE EDGE RUNTIME:
 * - Read-only endpoints that don't hit the database
 * - Simple request validation/transformation
 * - Proxy endpoints
 * - Health checks
 * 
 * WHEN NOT TO USE:
 * - Routes using Prisma (@prisma/client)
 * - Routes using fs, crypto with heavy operations
 * - Routes using Nodemailer
 * - Routes using Twilio or other Node.js-specific SDKs
 * 
 * HOW TO ADD:
 * Add this export to the route file:
 *   export const runtime = 'edge'
 * 
 * EXAMPLE EDGE-COMPATIBLE ROUTE:
 */

// Example: Health check endpoint (could be at /api/health/route.ts)
/*
export const runtime = 'edge'

export async function GET() {
  return Response.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    region: process.env.VERCEL_REGION || 'unknown',
  })
}
*/

/**
 * CANDIDATES FOR EDGE RUNTIME (verify before migrating):
 * 
 * 1. /api/revalidate - Cache revalidation (if it only uses revalidateTag)
 * 2. Future: /api/health - Health check endpoint
 * 3. Future: /api/config - Public app config
 * 
 * DO NOT MIGRATE:
 * - /api/auth/* (uses crypto for JWT)
 * - /api/orders/* (uses Prisma)
 * - /api/products/* (uses Prisma)
 * - /api/checkout/* (uses Stripe SDK)
 * - /api/mobile/* (uses Prisma + JWT)
 * - /api/webhooks/* (uses crypto for signature verification)
 * - /api/chat (uses OpenAI SDK)
 * - /api/push/* (uses web-push)
 */

export {} // Make this a module
