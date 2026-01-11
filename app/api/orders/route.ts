import { NextRequest, NextResponse } from 'next/server'
import { getOrdersByEmail, getOrdersCountByEmail } from '@/lib/orderStorageDb'
import { errorLog, debugLog } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const contactEmail = searchParams.get('contactEmail') // Additional email for Apple users
    const limitParam = parseInt(searchParams.get('limit') || '50')
    const offsetParam = parseInt(searchParams.get('offset') || '0')
    const limit = Number.isNaN(limitParam) ? 50 : limitParam
    const offset = Number.isNaN(offsetParam) ? 0 : offsetParam

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      )
    }

    // Collect all emails to search (auth email + contact email if different)
    const emailsToSearch: string[] = [email]
    if (contactEmail && contactEmail.trim() && contactEmail.trim().toLowerCase() !== email.trim().toLowerCase()) {
      emailsToSearch.push(contactEmail.trim())
    }
    
    debugLog('🔍 Searching orders for emails:', emailsToSearch)

    // Get orders for all emails and merge results
    const ordersByEmail = await Promise.all(
      emailsToSearch.map(e => getOrdersByEmail(e, limit * 2, 0)) // Get more to handle overlap
    )
    
    // Merge and deduplicate orders by ID
    const orderMap = new Map()
    for (const orders of ordersByEmail) {
      for (const order of orders) {
        if (!orderMap.has(order.id)) {
          orderMap.set(order.id, order)
        }
      }
    }
    
    // Convert to array and filter out cancelled/deleted
    const allOrders = Array.from(orderMap.values())
    const orders = allOrders
      .filter(order => {
        const status = String(order.status || '').toUpperCase()
        return status !== 'CANCELLED' && status !== 'DELETED'
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(offset, offset + limit)
    
    // Get total count across all emails
    const counts = await Promise.all(emailsToSearch.map(e => getOrdersCountByEmail(e)))
    const totalCount = counts.reduce((sum, count) => sum + count, 0)
    
    return NextResponse.json({ 
      orders, 
      totalCount,
      hasMore: offset + limit < totalCount
    })
  } catch (error) {
    errorLog('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
