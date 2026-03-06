import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { errorLog } from '@/lib/logger'
import OrderTrackingClient from './OrderTrackingClient'

interface PageProps {
  params: Promise<{ orderNumber: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { orderNumber } = await params
  
  return {
    title: `Track Order ${orderNumber} | Genosys UAE`,
    description: `Track your Genosys order ${orderNumber}. View real-time status updates and estimated delivery time.`,
    robots: {
      index: false,
      follow: false
    }
  }
}

export default async function OrderTrackingPage({ params }: PageProps) {
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
