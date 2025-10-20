'use client'

import { useAuth } from '@/components/AuthProvider'
import { useProfileState } from '@/hooks/useProfileState'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ProfileHeader from '@/components/profile/ProfileHeader'
import ProfileTabs from '@/components/profile/ProfileTabs'
import ProfileContent from '@/components/profile/ProfileContent'
// import { OrderWithItems } from '@/types/profile' // Unused for now

export default function ProfilePageRefactored() {
  const { user, logout, forceRefreshUser } = useAuth()
  const router = useRouter()
  const { state, actions } = useProfileState(user)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch orders when component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return
      
      actions.setLoadingOrders(true)
      try {
        const response = await fetch('/api/orders')
        if (response.ok) {
          const orders = await response.json()
          actions.setOrders(orders)
        }
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        actions.setLoadingOrders(false)
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [user, actions])

  // Generate customer number
  useEffect(() => {
    if (user?.id) {
      const customerNumber = parseInt(user.id.slice(-6), 16) || Math.floor(Math.random() * 1000000)
      actions.setCustomerNumber(customerNumber)
    }
  }, [user?.id, actions])

  const handleSave = async () => {
    if (!user) return

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state.editData)
      })

      if (response.ok) {
        await forceRefreshUser()
        actions.setIsEditing(false)
      } else {
        console.error('Failed to update profile')
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
    actions.setPreviewImage(null)
  }

  const handleDelete = async () => {
    if (!user) return

    actions.setIsDeleting(true)
    try {
      const response = await fetch('/api/profile', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      })

      if (response.ok) {
        localStorage.removeItem('genosys_user')
        localStorage.removeItem(`customer_number_${user.id}`)
        
        logout()
        router.push('/')
        
        alert('Your account has been successfully deleted.')
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to delete account. Please try again.')
      }
    } catch (error) {
      console.error('Error deleting account:', error)
      alert('Error deleting account. Please try again.')
    } finally {
      actions.setIsDeleting(false)
      actions.setShowDeleteConfirm(false)
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">Please log in to view your profile.</p>
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
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

        <ProfileContent
          user={user}
          activeTab={state.activeTab}
          isEditing={state.isEditing}
          editData={state.editData}
          setEditData={actions.setEditData}
          orders={state.orders}
          loadingOrders={state.loadingOrders}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
}

