import fs from 'fs'
import path from 'path'

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

const DATA_DIR = path.join(process.cwd(), 'data')
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json')

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

// Initialize orders file if it doesn't exist
if (!fs.existsSync(ORDERS_FILE)) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2))
}

export function readOrders(): Order[] {
  try {
    const data = fs.readFileSync(ORDERS_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading orders:', error)
    return []
  }
}

export function writeOrders(orders: Order[]): void {
  try {
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
