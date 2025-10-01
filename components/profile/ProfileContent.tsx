'use client'

import { useAuth } from '@/components/AuthProvider'
import { ProfileTab, ProfileState, OrderWithItems } from '@/types/profile'
import ProfileInfo from './ProfileInfo'
import OrderHistory from './OrderHistory'
import ProfileSettings from './ProfileSettings'
import DownloadsSection from './DownloadsSection'

interface ProfileContentProps {
  activeTab: ProfileTab
  state: ProfileState
  orders: OrderWithItems[]
  onOrderCancel: (orderId: string) => Promise<void>
}

export default function ProfileContent({ 
  activeTab, 
  state, 
  orders, 
  onOrderCancel 
}: ProfileContentProps) {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Please log in to view your profile.</p>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileInfo user={user} />
      
      case 'orders':
        return (
          <OrderHistory 
            orders={orders}
            loading={state.loadingOrders}
            onOrderCancel={onOrderCancel}
          />
        )
      
      case 'settings':
        return <ProfileSettings user={user} />
      
      case 'downloads':
        return <DownloadsSection />
      
      default:
        return <ProfileInfo user={user} />
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {renderContent()}
    </div>
  )
}

