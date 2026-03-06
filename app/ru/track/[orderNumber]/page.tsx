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
    title: `Отслеживание заказа ${orderNumber} | Genosys ОАЭ`,
    description: `Отслеживайте ваш заказ Genosys ${orderNumber}. Просматривайте обновления статуса и ориентировочное время доставки.`,
    robots: {
      index: false,
      follow: false
    }
  }
}

export default async function RussianOrderTrackingPage({ params }: PageProps) {
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
