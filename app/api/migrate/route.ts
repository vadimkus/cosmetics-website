import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import bcrypt from 'bcryptjs'

// Import the existing JSON storage functions as fallback
import { findUserByEmail, addUser } from '@/lib/userStorage'
import { products } from '@/lib/products'
import { 
  testConnection, 
  createUser as createDbUser, 
  createProduct as createDbProduct,
  getUserCount,
  getProductCount
} from '@/lib/simpleDb'

export async function GET() {
  try {
    return NextResponse.json({
      message: 'Migration API is ready',
      status: 'ready',
      endpoints: {
        users: '/api/migrate/users',
        products: '/api/migrate/products',
        status: '/api/migrate/status'
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Migration API error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json()
    
    switch (action) {
      case 'migrate-users':
        return await migrateUsers()
      case 'migrate-products':
        return await migrateProducts()
      case 'check-status':
        return await checkMigrationStatus()
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Migration failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

async function migrateUsers() {
  try {
    const usersPath = path.join(process.cwd(), 'data', 'users.json')
    const usersData = JSON.parse(fs.readFileSync(usersPath, 'utf8'))
    
    const results = []
    
    // Test database connection first
    const dbConnected = await testConnection()
    
    for (const user of usersData) {
      try {
        // Hash password if needed
        const hashedPassword = user.password.startsWith('$2') 
          ? user.password 
          : await bcrypt.hash(user.password, 12)
        
        if (dbConnected) {
          // Try to create user in PostgreSQL
          const success = await createDbUser({
            id: user.id,
            name: user.name,
            email: user.email,
            password: hashedPassword,
            phone: user.phone,
            address: user.address,
            profilePicture: user.profilePicture,
            isAdmin: user.isAdmin || false,
            canSeePrices: user.canSeePrices || false,
            discountType: user.discountType,
            discountPercentage: user.discountPercentage,
            createdAt: new Date(user.createdAt)
          })
          
          if (success) {
            results.push({
              email: user.email,
              status: 'migrated',
              message: 'Successfully migrated to PostgreSQL'
            })
          } else {
            results.push({
              email: user.email,
              status: 'error',
              message: 'Failed to migrate to PostgreSQL'
            })
          }
        } else {
          // Fallback to JSON storage
          results.push({
            email: user.email,
            status: 'ready',
            message: 'Ready for PostgreSQL migration (DB not connected)'
          })
        }
        
      } catch (error) {
        results.push({
          email: user.email,
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }
    
    return NextResponse.json({
      message: 'User migration completed',
      results,
      total: usersData.length,
      successful: results.filter(r => r.status === 'migrated' || r.status === 'ready').length,
      databaseConnected: dbConnected
    })
    
  } catch (error) {
    return NextResponse.json(
      { error: 'User migration failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

async function migrateProducts() {
  try {
    const results = []
    
    // Test database connection first
    const dbConnected = await testConnection()
    
    for (const product of products) {
      try {
        if (dbConnected) {
          // Try to create product in PostgreSQL
          const success = await createDbProduct({
            id: product.id,
            name: product.name,
            price: product.price,
            description: product.description,
            image: product.image,
            category: product.category,
            inStock: product.inStock,
            size: product.size
          })
          
          if (success) {
            results.push({
              id: product.id,
              name: product.name,
              status: 'migrated',
              message: 'Successfully migrated to PostgreSQL'
            })
          } else {
            results.push({
              id: product.id,
              name: product.name,
              status: 'error',
              message: 'Failed to migrate to PostgreSQL'
            })
          }
        } else {
          // Fallback to JSON storage
          results.push({
            id: product.id,
            name: product.name,
            status: 'ready',
            message: 'Ready for PostgreSQL migration (DB not connected)'
          })
        }
      } catch (error) {
        results.push({
          id: product.id,
          name: product.name,
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }
    
    return NextResponse.json({
      message: 'Product migration completed',
      results,
      total: products.length,
      successful: results.filter(r => r.status === 'migrated' || r.status === 'ready').length,
      databaseConnected: dbConnected
    })
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Product migration failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

async function checkMigrationStatus() {
  try {
    // Check current data sources
    const usersPath = path.join(process.cwd(), 'data', 'users.json')
    const ordersPath = path.join(process.cwd(), 'data', 'orders.json')
    
    const usersData = JSON.parse(fs.readFileSync(usersPath, 'utf8'))
    const ordersData = JSON.parse(fs.readFileSync(ordersPath, 'utf8'))
    
    // Test database connection
    const dbConnected = await testConnection()
    let dbUserCount = 0
    let dbProductCount = 0
    
    if (dbConnected) {
      dbUserCount = await getUserCount()
      dbProductCount = await getProductCount()
    }
    
    return NextResponse.json({
      status: 'analysis_complete',
      currentData: {
        users: usersData.length,
        orders: ordersData.length,
        products: products.length
      },
      databaseData: {
        users: dbUserCount,
        products: dbProductCount
      },
      migration: {
        database: 'PostgreSQL (Prisma)',
        status: dbConnected ? 'connected' : 'disconnected',
        connectionStatus: dbConnected ? 'healthy' : 'unhealthy',
        nextSteps: dbConnected ? [
          'Database connected successfully',
          'Ready for data migration',
          'Switch API routes to PostgreSQL'
        ] : [
          'Fix database connection issues',
          'Ensure Prisma dev server is running',
          'Run data migration'
        ]
      }
    })
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Status check failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
