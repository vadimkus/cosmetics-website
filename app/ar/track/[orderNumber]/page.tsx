import OrderTrackingClient from '@/app/track/[orderNumber]/OrderTrackingClient'
import type { Metadata } from 'next'

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
  
  return <OrderTrackingClient orderNumber={orderNumber} />
}
