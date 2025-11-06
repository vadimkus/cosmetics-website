import { debugLog, errorLog } from '@/lib/logger'
import { PrismaClient } from '@prisma/client'
import { readUsers } from '../lib/userStorage'
import { readOrders } from '../lib/orderStorage'

const prisma = new PrismaClient()

async function migrateUsers() {
  debugLog('🔄 Migrating users...')
  
  const users = readUsers()
  debugLog(`Found ${users.length} users to migrate`)
  
  for (const user of users) {
    try {
      await prisma.user.upsert({
        where: { email: user.email },
        update: {
          name: user.name,
          password: user.password,
          phone: user.phone || null,
          address: user.address || null,
          profilePicture: user.profilePicture || null,
          isAdmin: user.isAdmin || false,
          canSeePrices: user.canSeePrices || false,
          discountType: user.discountType || null,
          discountPercentage: user.discountPercentage || null,
          birthday: user.birthday || null,
        },
        create: {
          id: user.id,
          email: user.email,
          name: user.name,
          password: user.password,
          phone: user.phone || null,
          address: user.address || null,
          profilePicture: user.profilePicture || null,
          isAdmin: user.isAdmin || false,
          canSeePrices: user.canSeePrices || false,
          discountType: user.discountType || null,
          discountPercentage: user.discountPercentage || null,
          birthday: user.birthday || null,
          createdAt: new Date(user.createdAt || new Date()),
        }
      })
      debugLog(`✅ Migrated user: ${user.email}`)
    } catch (error) {
      errorLog(`❌ Failed to migrate user ${user.email}:`, error)
    }
  }
}

async function migrateOrders() {
  debugLog('🔄 Migrating orders...')
  
  const orders = readOrders()
  debugLog(`Found ${orders.length} orders to migrate`)
  
  for (const order of orders) {
    try {
      // Create the order
      const createdOrder = await prisma.order.create({
        data: {
          orderNumber: order.id,
          customerEmail: order.customerEmail,
          customerName: order.customerName,
          customerPhone: order.customerPhone,
          customerEmirate: order.customerEmirate,
          customerAddress: order.customerAddress,
          subtotal: order.subtotal,
          discountAmount: order.discountAmount || 0,
          shipping: order.shipping || 0,
          vat: order.vat,
          total: order.total,
          status: order.status.toUpperCase() as any,
          sessionId: order.sessionId || null,
          createdAt: new Date(order.createdAt),
        }
      })

      // Create order items
      for (const item of order.items) {
        await prisma.orderItem.create({
          data: {
            orderId: createdOrder.id,
            productId: item.productId,
            productName: item.productName,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          }
        })
      }
      
      debugLog(`✅ Migrated order: ${order.id}`)
    } catch (error) {
      errorLog(`❌ Failed to migrate order ${order.id}:`, error)
    }
  }
}

async function main() {
  try {
    debugLog('🚀 Starting data migration...')
    
    await migrateUsers()
    await migrateOrders()
    
    debugLog('✅ Migration completed successfully!')
    
    // Verify migration
    const userCount = await prisma.user.count()
    const orderCount = await prisma.order.count()
    
    debugLog(`📊 Migration results:`)
    debugLog(`   Users: ${userCount}`)
    debugLog(`   Orders: ${orderCount}`)
    
  } catch (error) {
    errorLog('❌ Migration failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
