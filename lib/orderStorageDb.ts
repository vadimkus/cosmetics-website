import { debugLog, errorLog } from '@/lib/logger'
import { prisma } from './database'
import { Order } from '@prisma/client'

export interface OrderItemData {
  productId: string
  productName: string
  price: number
  quantity: number
  image: string
  color?: string // Product color variant (e.g., "beige", "ivory", "camel")
  size?: string // Product size variant (e.g., "50g", "100g")
}

export interface OrderData {
  id?: string
  orderNumber: string
  customerEmail: string
  customerName: string
  customerPhone: string
  customerEmirate: string
  customerAddress: string
  orderNotes?: string | null // Optional order notes from customer
  items: OrderItemData[]
  subtotal: number
  discountAmount?: number
  shipping?: number
  vat: number
  total: number
  status?: string
  locale?: string // User's preferred language (en or ar)
  sessionId?: string
  createdAt?: string
  
  // Payment-related fields
  paymentMethod?: string // cod, stripe, bank_transfer
  paymentStatus?: string // pending, processing, paid, failed, refunded, cancelled
  stripeSessionId?: string // Stripe checkout session ID
  stripePaymentIntentId?: string // Stripe payment intent ID
  stripeCustomerId?: string // Stripe customer ID for future payments
  paidAt?: Date // When payment was completed
  refundedAt?: Date // When refund was processed
  refundAmount?: number // Amount refunded (can be partial)
  paymentMetadata?: string // JSON metadata from payment provider
}

// Read all orders
export const readOrders = async (): Promise<Order[]> => {
  try {
    debugLog('🔍 readOrders: Starting query...')
    const orders = await prisma.order.findMany({
      select: {
        id: true,
        orderNumber: true,
        customerEmail: true,
        customerName: true,
        customerPhone: true,
        customerEmirate: true,
        customerAddress: true,
        orderNotes: true,
        subtotal: true,
        discountAmount: true,
        shipping: true,
        vat: true,
        total: true,
        status: true,
        locale: true,
        sessionId: true,
        paymentMethod: true,
        paymentStatus: true,
        stripeSessionId: true,
        stripePaymentIntentId: true,
        stripeCustomerId: true,
        paidAt: true,
        refundedAt: true,
        refundAmount: true,
        paymentMetadata: true,
        createdAt: true,
        updatedAt: true,
        items: {
          select: {
            id: true,
            productId: true,
            productName: true,
            price: true,
            quantity: true,
            image: true,
            color: true,
            size: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    debugLog(`✅ readOrders: Found ${orders.length} orders`)
    return orders
  } catch (error) {
    errorLog('❌ Error reading orders:', error)
    errorLog('❌ Error details:', error instanceof Error ? error.message : String(error))
    errorLog('❌ Error stack:', error instanceof Error ? error.stack : 'No stack')
    return []
  }
}


// Generate order ID
export const generateOrderId = async (): Promise<string> => {
  try {
    const orderCount = await prisma.order.count()
    const orderNumber = orderCount + 1
    const now = new Date()
    const year = now.getFullYear().toString().slice(-2)
    const month = (now.getMonth() + 1).toString().padStart(2, '0')
    const day = now.getDate().toString().padStart(2, '0')
    const sequence = orderNumber.toString().padStart(4, '0')
    return `GEN${year}${month}${day}${sequence}`
  } catch (error) {
    errorLog('Error generating order ID:', error)
    const now = new Date()
    const year = now.getFullYear().toString().slice(-2)
    const month = (now.getMonth() + 1).toString().padStart(2, '0')
    const day = now.getDate().toString().padStart(2, '0')
    const sequence = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    return `GEN${year}${month}${day}${sequence}`
  }
}

// Add order
export const addOrder = async (orderData: OrderData): Promise<Order> => {
  try {
    // Normalize email to lowercase and trim whitespace for consistent matching
    const normalizedEmail = orderData.customerEmail.trim().toLowerCase()
    
    // First, ensure the customer exists in the database
    // IMPORTANT: canSeePrices defaults to true for new customers (guest checkout)
    // This ensures they can see prices when they later create an account
    await prisma.user.upsert({
      where: { email: normalizedEmail },
      update: {
        name: orderData.customerName,
        phone: orderData.customerPhone,
        address: orderData.customerAddress,
      },
      create: {
        email: normalizedEmail,
        name: orderData.customerName,
        password: 'temp-password', // Temporary password for guest orders
        phone: orderData.customerPhone,
        address: orderData.customerAddress,
        isAdmin: false,
        canSeePrices: true, // Default to true - customers should see prices
      }
    })

    return await prisma.order.create({
      data: {
        orderNumber: orderData.orderNumber,
        customerEmail: normalizedEmail, // Use normalized email for consistency
        customerName: orderData.customerName,
        customerPhone: orderData.customerPhone,
        customerEmirate: orderData.customerEmirate,
        customerAddress: orderData.customerAddress,
        subtotal: orderData.subtotal,
        discountAmount: orderData.discountAmount || 0,
        shipping: orderData.shipping || 0,
        vat: orderData.vat,
        total: orderData.total,
        status: orderData.status || 'PENDING',
        locale: orderData.locale || 'en', // Default to English if not provided
        sessionId: orderData.sessionId || null,
        paymentMethod: orderData.paymentMethod || 'cod',
        paymentStatus: orderData.paymentStatus || 'pending',
        stripeSessionId: orderData.stripeSessionId || null,
        stripePaymentIntentId: orderData.stripePaymentIntentId || null,
        stripeCustomerId: orderData.stripeCustomerId || null,
        paidAt: orderData.paidAt || null,
        refundedAt: orderData.refundedAt || null,
        refundAmount: orderData.refundAmount || null,
        paymentMetadata: orderData.paymentMetadata || null,
        items: {
          create: orderData.items.map(item => ({
            productId: item.productId,
            productName: item.productName,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            color: item.color || null,
            size: item.size || null,
          }))
        }
      },
      include: {
        items: true,
        customer: true
      }
    })
  } catch (error) {
    errorLog('Error creating order:', error)
    throw error
  }
}

// Update order status
export const updateOrderStatus = async (orderId: string, status: string): Promise<boolean> => {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { 
        status,
        updatedAt: new Date()
      }
    })
    return true
  } catch (error) {
    errorLog('Error updating order status:', error)
    return false
  }
}

// Get order by ID
export const getOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    return await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
        customer: true
      }
    })
  } catch (error) {
    errorLog('Error finding order by ID:', error)
    return null
  }
}

// Get orders by email with pagination
export const getOrdersByEmail = async (email: string, limit: number = 50, offset: number = 0): Promise<Order[]> => {
  try {
    // Normalize email to lowercase and trim whitespace for consistent matching
    const normalizedEmail = email.trim().toLowerCase()
    
    debugLog(`🔍 Searching for orders with email: "${normalizedEmail}" (original: "${email}")`)
    
    // Try exact match first with normalized email
    let orders = await prisma.order.findMany({
      where: { customerEmail: normalizedEmail },
      include: {
        items: true
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    })
    
    // If no orders found, try case-insensitive search using raw query
    if (orders.length === 0) {
      debugLog(`⚠️ No exact match found, trying case-insensitive search...`)
      try {
        // Use Prisma's column names (camelCase) - Prisma will map them to database columns
        const orderIds = await prisma.$queryRaw<Array<{ id: string }>>`
          SELECT id FROM orders 
          WHERE LOWER(TRIM("customerEmail")) = LOWER(TRIM(${normalizedEmail}))
          ORDER BY "createdAt" DESC
          LIMIT ${limit}
          OFFSET ${offset}
        `
        
        if (orderIds.length > 0) {
          const ids = orderIds.map(o => o.id)
          orders = await prisma.order.findMany({
            where: { id: { in: ids } },
            include: {
              items: true
            },
            orderBy: { createdAt: 'desc' }
          })
          debugLog(`✅ Found ${orders.length} orders using case-insensitive search`)
        }
      } catch (rawQueryError) {
        errorLog('⚠️ Case-insensitive raw query failed, using exact match only:', rawQueryError)
      }
    } else {
      debugLog(`✅ Found ${orders.length} orders with exact match`)
    }
    
    return orders
  } catch (error) {
    errorLog('Error finding orders by email:', error)
    return []
  }
}

// Get total count of orders by email
export const getOrdersCountByEmail = async (email: string): Promise<number> => {
  try {
    // Normalize email to lowercase and trim whitespace for consistent matching
    const normalizedEmail = email.trim().toLowerCase()
    
    // Try exact match first
    let count = await prisma.order.count({
      where: { customerEmail: normalizedEmail }
    })
    
    // If no orders found, try case-insensitive count
    if (count === 0) {
      try {
        const result = await prisma.$queryRaw<Array<{ count: bigint }>>`
          SELECT COUNT(*)::int as count FROM orders 
          WHERE LOWER(TRIM("customerEmail")) = LOWER(TRIM(${normalizedEmail}))
        `
        count = result[0]?.count ? Number(result[0].count) : 0
      } catch (rawQueryError) {
        errorLog('⚠️ Case-insensitive count query failed:', rawQueryError)
      }
    }
    
    return count
  } catch (error) {
    errorLog('Error counting orders by email:', error)
    return 0
  }
}

// Delete order
export const deleteOrder = async (orderId: string): Promise<boolean> => {
  try {
    await prisma.order.delete({
      where: { id: orderId }
    })
    return true
  } catch (error) {
    errorLog('Error deleting order:', error)
    return false
  }
}

// Get order by order number (for compatibility)
export const getOrderByOrderNumber = async (orderNumber: string): Promise<Order | null> => {
  try {
    return await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: true,
        customer: true
      }
    })
  } catch (error) {
    errorLog('Error finding order by order number:', error)
    return null
  }
}
