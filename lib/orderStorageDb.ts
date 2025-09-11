import { prisma } from './database'
import { Order, OrderItem, OrderStatus } from '@prisma/client'

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
  status?: OrderStatus
  sessionId?: string
  createdAt?: string
}

// Read all orders
export const readOrders = async (): Promise<Order[]> => {
  try {
    return await prisma.order.findMany({
      include: {
        items: true,
        customer: true
      },
      orderBy: { createdAt: 'desc' }
    })
  } catch (error) {
    console.error('Error reading orders:', error)
    return []
  }
}

// Write orders (not needed with database, but keeping for compatibility)
export const writeOrders = async (orders: OrderData[]): Promise<void> => {
  // This function is not needed with database storage
  // Keeping for compatibility with existing code
  console.warn('writeOrders is deprecated with database storage')
}

// Generate order ID
export const generateOrderId = async (): Promise<string> => {
  try {
    const orderCount = await prisma.order.count()
    const orderNumber = orderCount + 1
    return `Genosys Order ${orderNumber}`
  } catch (error) {
    console.error('Error generating order ID:', error)
    return `Genosys Order ${Date.now()}`
  }
}

// Add order
export const addOrder = async (orderData: OrderData): Promise<Order> => {
  try {
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
export const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<boolean> => {
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

// Get orders by email
export const getOrdersByEmail = async (email: string): Promise<Order[]> => {
  try {
    return await prisma.order.findMany({
      where: { customerEmail: email },
      include: {
        items: true,
        customer: true
      },
      orderBy: { createdAt: 'desc' }
    })
  } catch (error) {
    console.error('Error finding orders by email:', error)
    return []
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
