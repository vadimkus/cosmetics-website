import fs from 'fs'
import path from 'path'

// Use environment-specific data directory
const getDataPath = () => {
  const env = process.env.NODE_ENV || 'development'
  const basePath = process.cwd()
  
  // In production (Vercel), use /tmp for data storage
  if (env === 'production') {
    return path.join('/tmp', 'genosys-data')
  }
  
  // In development, use local data directory
  return path.join(basePath, 'data')
}

const ORDERS_FILE = path.join(getDataPath(), 'orders.json')
const ORDERS_TEMPLATE = path.join(process.cwd(), 'data', 'templates', 'orders.template.json')

export interface OrderItem {
  productId: string
  productName: string
  price: number
  quantity: number
  image: string
}

export interface Order {
  id: string
  customerEmail: string
  customerName: string
  customerPhone: string
  customerEmirate: string
  customerAddress: string
  items: OrderItem[]
  subtotal: number
  discountAmount: number
  shipping: number
  vat: number
  total: number
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
  sessionId?: string
}

// Ensure data directory exists
const ensureDataDirectory = () => {
  const dataDir = path.dirname(ORDERS_FILE)
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

export function readOrders(): Order[] {
  try {
    ensureDataDirectory()
    if (!fs.existsSync(ORDERS_FILE)) {
      // Initialize from template if it exists
      if (fs.existsSync(ORDERS_TEMPLATE)) {
        const templateData = fs.readFileSync(ORDERS_TEMPLATE, 'utf8')
        const templateOrders = JSON.parse(templateData)
        writeOrders(templateOrders)
        return templateOrders
      }
      
      // Fallback: Create empty orders array
      const initialOrders: Order[] = []
      writeOrders(initialOrders)
      return initialOrders
    }
    
    const data = fs.readFileSync(ORDERS_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading orders:', error)
    return []
  }
}

export function writeOrders(orders: Order[]): void {
  try {
    ensureDataDirectory()
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2))
  } catch (error) {
    console.error('Error writing orders:', error)
  }
}

export function generateOrderId(): string {
  const orders = readOrders()
  const orderNumber = orders.length + 1
  return `Genosys Order #${orderNumber}`
}

export function addOrder(order: Order): void {
  const orders = readOrders()
  orders.push(order)
  writeOrders(orders)
}

export function updateOrderStatus(orderId: string, status: Order['status']): void {
  const orders = readOrders()
  const orderIndex = orders.findIndex(order => order.id === orderId)
  
  if (orderIndex !== -1) {
    orders[orderIndex].status = status
    writeOrders(orders)
  }
}

export function getOrderById(orderId: string): Order | null {
  const orders = readOrders()
  return orders.find(order => order.id === orderId) || null
}

export function getOrdersByEmail(email: string): Order[] {
  const orders = readOrders()
  return orders.filter(order => order.customerEmail === email)
}

export function deleteOrder(orderId: string): boolean {
  const orders = readOrders()
  const orderIndex = orders.findIndex(order => order.id === orderId)
  
  if (orderIndex !== -1) {
    orders.splice(orderIndex, 1)
    writeOrders(orders)
    return true
  }
  return false
}
