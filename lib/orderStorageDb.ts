import { prisma } from './database'
import { Order } from '@prisma/client'

export interface OrderItemData {
  productId: string
  productName: string
  price: number
  quantity: number
  image: string
}

export interface OrderData {
  id?: string
  orderNumber: string
  customerEmail: string
  customerName: string
  customerPhone: string
  customerEmirate: string
  customerAddress: string
  items: OrderItemData[]
  subtotal: number
  discountAmount?: number
  shipping?: number
  vat: number
  total: number
  status?: string
  sessionId?: string
  createdAt?: string
}

// Read all orders
export const readOrders = async (): Promise<Order[]> => {
  try {
    return await prisma.order.findMany({
      select: {
        id: true,
        orderNumber: true,
        customerEmail: true,
        customerName: true,
        customerPhone: true,
        customerEmirate: true,
        customerAddress: true,
        subtotal: true,
        discountAmount: true,
        shipping: true,
        vat: true,
        total: true,
        status: true,
        sessionId: true,
        createdAt: true,
        updatedAt: true,
        items: {
          select: {
            id: true,
            productId: true,
            productName: true,
            price: true,
            quantity: true,
            image: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  } catch (error) {
    console.error('Error reading orders:', error)
    return []
  }
}

// Write orders (not needed with database, but keeping for compatibility)
export const writeOrders = async (_orders: OrderData[]): Promise<void> => {
  // This function is not needed with database storage
  // Keeping for compatibility with existing code
  console.warn('writeOrders is deprecated with database storage')
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
    console.error('Error generating order ID:', error)
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
    // First, ensure the customer exists in the database
    await prisma.user.upsert({
      where: { email: orderData.customerEmail },
      update: {
        name: orderData.customerName,
        phone: orderData.customerPhone,
        address: orderData.customerAddress,
      },
      create: {
        email: orderData.customerEmail,
        name: orderData.customerName,
        password: 'temp-password', // Temporary password for guest orders
        phone: orderData.customerPhone,
        address: orderData.customerAddress,
        isAdmin: false,
        canSeePrices: false,
      }
    })

    return await prisma.order.create({
      data: {
        orderNumber: orderData.orderNumber,
        customerEmail: orderData.customerEmail,
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
        sessionId: orderData.sessionId || null,
        items: {
          create: orderData.items.map(item => ({
            productId: item.productId,
            productName: item.productName,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          }))
        }
      },
      include: {
        items: true,
        customer: true
      }
    })
  } catch (error) {
    console.error('Error creating order:', error)
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
    console.error('Error updating order status:', error)
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
    console.error('Error finding order by ID:', error)
    return null
  }
}

// Get orders by email with pagination
export const getOrdersByEmail = async (email: string, limit: number = 50, offset: number = 0): Promise<Order[]> => {
  try {
    return await prisma.order.findMany({
      where: { customerEmail: email },
      include: {
        items: true
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    })
  } catch (error) {
    console.error('Error finding orders by email:', error)
    return []
  }
}

// Get total count of orders by email
export const getOrdersCountByEmail = async (email: string): Promise<number> => {
  try {
    return await prisma.order.count({
      where: { customerEmail: email }
    })
  } catch (error) {
    console.error('Error counting orders by email:', error)
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
    console.error('Error deleting order:', error)
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
    console.error('Error finding order by order number:', error)
    return null
  }
}
