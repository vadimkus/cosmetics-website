'use client'

import { useAuth } from '@/components/AuthProvider'
import { useProfileState } from '@/hooks/useProfileState'
import { useOrderHistory } from '@/hooks/useOrderHistory'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ProfileHeader from '@/components/profile/ProfileHeader'
import ProfileTabs from '@/components/profile/ProfileTabs'
import PersonalInfoSection from '@/components/profile/PersonalInfoSection'
import OrderHistorySection from '@/components/profile/OrderHistorySection'
import ProductRecommendations from '@/components/profile/ProductRecommendations'
import { formatCurrency, getProductImage, getStatusColor, getStatusIcon } from '@/utils/profileUtils'

export default function ProfilePageRefactoredV2() {
  const { user, logout, forceRefreshUser } = useAuth()
  const router = useRouter()
  const { state, actions } = useProfileState(user)
  const { orders, loadingOrders, cancelOrder } = useOrderHistory(user)
  const [isLoading, setIsLoading] = useState(true)

  // Generate customer number
  useEffect(() => {
    if (user?.id) {
      const customerNumber = parseInt(user.id.slice(-6), 16) || Math.floor(Math.random() * 1000000)
      actions.setCustomerNumber(customerNumber)
    }
  }, [user?.id, actions])

  // Set loading to false when user loads
  useEffect(() => {
    if (user) {
      setIsLoading(false)
    }
  }, [user])

  const handleSave = async () => {
    try {
      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: state.editData.name,
          phone: state.editData.phone,
          address: state.editData.address,
          birthday: state.editData.birthday,
        }),
      })

      if (response.ok) {
        actions.setIsEditing(false)
        await forceRefreshUser()
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const handleCancel = () => {
    actions.setEditData({
      name: user?.name || '',
      phone: user?.phone || '',
      address: user?.address || '',
      birthday: user?.birthday || ''
    })
    actions.setIsEditing(false)
  }

  const handleDelete = async () => {
    try {
      const response = await fetch('/api/profile/delete', {
        method: 'POST',
      })

      if (response.ok) {
        logout()
        router.push('/')
      }
    } catch (error) {
      console.error('Error deleting account:', error)
    }
  }

  const handleRefresh = async () => {
    if (state.isRefreshing) return
    
    actions.setIsRefreshing(true)
    try {
      await forceRefreshUser()
    } catch (error) {
      console.error('Error refreshing user data:', error)
    } finally {
      setTimeout(() => {
        actions.setIsRefreshing(false)
      }, 1000)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    router.push('/login')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProfileHeader
          user={user}
          state={state}
          actions={actions}
          onSave={handleSave}
          onCancel={handleCancel}
          onDelete={handleDelete}
          onRefresh={handleRefresh}
          onProfilePictureChange={(file: File) => {
            const reader = new FileReader()
            reader.onload = (e) => {
              actions.setPreviewImage(e.target?.result as string)
            }
            reader.readAsDataURL(file)
          }}
          onRemoveProfilePicture={() => {
            actions.setPreviewImage(null)
          }}
        />

        <ProfileTabs
          activeTab={state.activeTab}
          setActiveTab={actions.setActiveTab}
        />

        <div className="mt-8">
          {state.activeTab === 'profile' && (
            <PersonalInfoSection
              user={user}
              isEditing={state.isEditing}
              editData={state.editData}
              setEditData={actions.setEditData}
            />
          )}

          {state.activeTab === 'orders' && (
            <OrderHistorySection
              orders={orders}
              loadingOrders={loadingOrders}
              onCancel={cancelOrder}
              formatCurrency={formatCurrency}
              getProductImage={getProductImage}
              getStatusColor={getStatusColor}
              getStatusIcon={getStatusIcon}
            />
          )}

          {state.activeTab === 'recommendations' && (
            <ProductRecommendations />
          )}
        </div>
      </div>
    </div>
  )
}
