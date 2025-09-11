import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { products } from '@/lib/products'

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Initializing database...')

    // Check if products already exist
    const existingProducts = await prisma.product.count()
    if (existingProducts > 0) {
      return NextResponse.json({
        success: true,
        message: `Database already initialized with ${existingProducts} products`
      })
    }

    // Create products from the static data
    console.log('📦 Creating products...')
    for (const product of products) {
      await prisma.product.create({
        data: {
          name: product.name,
          price: product.price,
          description: product.description,
          image: product.image,
          category: product.category,
          inStock: product.inStock,
          size: product.size || null
        }
      })
    }

    console.log(`✅ Created ${products.length} products`)

    return NextResponse.json({
      success: true,
      message: `Database initialized successfully with ${products.length} products`
    })
  } catch (error) {
    console.error('Error initializing database:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to initialize database',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const productCount = await prisma.product.count()
    const userCount = await prisma.user.count()
    const orderCount = await prisma.order.count()

    return NextResponse.json({
      success: true,
      database: {
        products: productCount,
        users: userCount,
        orders: orderCount
      }
    })
  } catch (error) {
    console.error('Error checking database status:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to check database status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
