import OrderTrackingClient from '@/app/track/[orderNumber]/OrderTrackingClient'
import type { Metadata } from 'next'

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
  
  return <OrderTrackingClient orderNumber={orderNumber} />
}
