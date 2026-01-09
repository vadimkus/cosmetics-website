import { Metadata } from 'next'
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
      index: false, // Don't index individual tracking pages
      follow: false
    }
  }
}

export default async function OrderTrackingPage({ params }: PageProps) {
  const { orderNumber } = await params
  
  return <OrderTrackingClient orderNumber={orderNumber} />
}
