import { NextRequest, NextResponse } from 'next/server'
import { errorLog } from '@/lib/logger'

/**
 * POST /api/admin/ping-search-engines
 * 
 * Notifies search engines about sitemap updates when new content is published.
 * This triggers a re-crawl of your sitemap, helping Google, Bing, and Yandex
 * discover new products, blog posts, and pages faster.
 * 
 * Usage: Call this after publishing new products, blog posts, or major page changes.
 * 
 * Example:
 *   POST /api/admin/ping-search-engines
 *   Body: { "reason": "New product added" }
 */
export async function POST(request: NextRequest) {
  try {
    // Simple admin check (enhance with proper auth in production)
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const reason = (body as { reason?: string }).reason || 'Content update'

    const sitemapUrl = 'https://genosys.ae/sitemap.xml'
    const results: { engine: string; status: string; statusCode?: number }[] = []

    // Ping Google
    try {
      const googleResponse = await fetch(
        `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
        { method: 'GET', signal: AbortSignal.timeout(10000) }
      )
      results.push({
        engine: 'Google',
        status: googleResponse.ok ? 'success' : 'failed',
        statusCode: googleResponse.status,
      })
    } catch (error) {
      errorLog('Failed to ping Google:', error)
      results.push({ engine: 'Google', status: 'error' })
    }

    // Ping Bing (also covers Yahoo via IndexNow)
    try {
      const bingResponse = await fetch(
        `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
        { method: 'GET', signal: AbortSignal.timeout(10000) }
      )
      results.push({
        engine: 'Bing',
        status: bingResponse.ok ? 'success' : 'failed',
        statusCode: bingResponse.status,
      })
    } catch (error) {
      errorLog('Failed to ping Bing:', error)
      results.push({ engine: 'Bing', status: 'error' })
    }

    // Ping Yandex (important for Russian-speaking audience)
    try {
      const yandexResponse = await fetch(
        `https://webmaster.yandex.ru/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
        { method: 'GET', signal: AbortSignal.timeout(10000) }
      )
      results.push({
        engine: 'Yandex',
        status: yandexResponse.ok ? 'success' : 'failed',
        statusCode: yandexResponse.status,
      })
    } catch (error) {
      errorLog('Failed to ping Yandex:', error)
      results.push({ engine: 'Yandex', status: 'error' })
    }

    return NextResponse.json({
      success: true,
      reason,
      timestamp: new Date().toISOString(),
      results,
    })
  } catch (error) {
    errorLog('Error pinging search engines:', error)
    return NextResponse.json(
      { error: 'Failed to ping search engines' },
      { status: 500 }
    )
  }
}
