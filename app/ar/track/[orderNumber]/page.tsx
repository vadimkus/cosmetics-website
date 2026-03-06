import OrderTrackingClient from '@/app/track/[orderNumber]/OrderTrackingClient'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { errorLog } from '@/lib/logger'

interface PageProps {
  params: Promise<{ orderNumber: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { orderNumber } = await params
  
  return {
    title: `تتبع الطلب ${orderNumber} | Genosys الإمارات`,
    description: `تتبع طلبك من Genosys ${orderNumber}. عرض تحديثات الحالة في الوقت الفعلي ووقت التسليم المقدر.`,
    robots: {
      index: false,
      follow: false
    }
  }
}

export default async function ArabicOrderTrackingPage({ params }: PageProps) {
  const { orderNumber } = await params

  try {
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      select: { id: true }
    })
    if (!order) notFound()
  } catch (error) {
    errorLog('[ORDER_TRACK_PAGE] DB check failed, falling back to client:', error)
  }
  
  return <OrderTrackingClient orderNumber={orderNumber} />
}
