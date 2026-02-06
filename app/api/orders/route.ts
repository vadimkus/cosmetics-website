import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getOrdersByEmail, getOrdersCountByEmail } from '@/lib/orderStorageDb'
import { findUserByEmail } from '@/lib/userStorageDb'
import { verifySessionToken } from '@/lib/jwt'
import { errorLog, debugLog } from '@/lib/logger'

/**
 * Get the authenticated user from the session cookie.
 * Returns null if no valid session exists.
 */
async function getUserFromSession(): Promise<{ email: string; userId: string; isAdmin: boolean } | null> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('genosys_session')
    
    if (!sessionCookie?.value) {
      return null
    }
    
    const sessionData = verifySessionToken(sessionCookie.value)
    
    if (!sessionData?.email) {
      return null
    }
    
    return {
      email: sessionData.email,
      userId: sessionData.id,
      isAdmin: sessionData.isAdmin || false,
    }
  } catch (error) {
    errorLog('[ORDERS] Session parse error:', error)
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    // ---- Authentication check ----
    const session = await getUserFromSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required. Please log in.' },
        { status: 401 }
      )
    }

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

    // ---- Authorization check ----
    // Non-admin users can only query their own orders.
    // We verify the requested email matches the session user's email or contactEmail.
    if (!session.isAdmin) {
      const sessionUser = await findUserByEmail(session.email)
      
      // Build the set of emails this user is allowed to query
      const allowedEmails = new Set<string>()
      allowedEmails.add(session.email.trim().toLowerCase())
      if (sessionUser?.contactEmail) {
        allowedEmails.add(sessionUser.contactEmail.trim().toLowerCase())
      }
      
      const requestedEmail = email.trim().toLowerCase()
      const requestedContactEmail = contactEmail?.trim().toLowerCase()
      
      // Check that the requested email is one of the user's own emails
      if (!allowedEmails.has(requestedEmail)) {
        debugLog(`[ORDERS] Unauthorized: session user ${session.email} tried to query orders for ${email}`)
        return NextResponse.json(
          { error: 'You can only view your own orders.' },
          { status: 403 }
        )
      }
      
      // If a contactEmail was provided, verify it too
      if (requestedContactEmail && requestedContactEmail !== requestedEmail && !allowedEmails.has(requestedContactEmail)) {
        debugLog(`[ORDERS] Unauthorized contact email: session user ${session.email} tried to query with contactEmail ${contactEmail}`)
        return NextResponse.json(
          { error: 'You can only view your own orders.' },
          { status: 403 }
        )
      }
    }

    // ---- Fetch orders ----
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
