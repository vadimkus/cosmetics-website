import { NextRequest, NextResponse } from 'next/server'
import { getAnalyticsData, getRealTimeVisitors, getUserActivityTimeline } from '@/lib/analytics'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')
    const type = searchParams.get('type') || 'overview'

    switch (type) {
      case 'overview':
        const analyticsData = await getAnalyticsData(days)
        return NextResponse.json(analyticsData)
      
      case 'realtime':
        const realTimeVisitors = await getRealTimeVisitors()
        return NextResponse.json({ visitors: realTimeVisitors })
      
      case 'timeline':
        const timeline = await getUserActivityTimeline(days)
        return NextResponse.json(timeline)
      
      default:
        return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}
