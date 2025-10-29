'use client'

import Link from 'next/link'
import { ArrowLeft, User, Package, Settings, Download, Shield, Trash2 } from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Order, OrderItem } from '@prisma/client'

// Import refactored components
import ProfileHeader from '@/components/profile/ProfileHeader'
import ProfileForm from '@/components/profile/ProfileForm'
import OrderHistory from '@/components/profile/OrderHistory'
import SettingsPanel from '@/components/profile/SettingsPanel'
import DownloadsSection from '@/components/profile/DownloadsSection'
import PrivacySettings from '@/components/profile/PrivacySettings'

// Custom type that includes the items relation
type OrderWithItems = Order & {
  items: OrderItem[]
}

export default function ProfilePageRefactored() {
  const { user, logout, forceRefreshUser } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    birthday: user?.birthday || ''
  })
  const [profilePicture, setProfilePicture] = useState<string | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [customerNumber, setCustomerNumber] = useState<number>(0)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'settings' | 'downloads' | 'privacy'>('profile')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle refresh with loading state
  const handleRefresh = async () => {
    if (isRefreshing) return // Prevent multiple simultaneous refreshes
    
    setIsRefreshing(true)
    try {
      await forceRefreshUser()
    } catch (error) {
      console.error('Error refreshing user data:', error)
    } finally {
      // Add a small delay to show the animation
      setTimeout(() => {
        setIsRefreshing(false)
      }, 1000)
    }
  }

  // Redirect to login page if user is not logged in
  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  // Initialize profile picture and customer number when user loads
  useEffect(() => {
    if (user) {
      setProfilePicture(user.profilePicture || null)
      setPreviewImage(user.profilePicture || null)
      
      setEditData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        birthday: user.birthday || ''
      })
      
      const savedCustomerNumber = localStorage.getItem(`customer_number_${user.id}`)
      if (savedCustomerNumber) {
        setCustomerNumber(parseInt(savedCustomerNumber))
      } else {
        const lastCustomerNumber = parseInt(localStorage.getItem('last_customer_number') || '0')
        const newCustomerNumber = lastCustomerNumber + 1
        
        localStorage.setItem(`customer_number_${user.id}`, newCustomerNumber.toString())
        localStorage.setItem('last_customer_number', newCustomerNumber.toString())
        
        setCustomerNumber(newCustomerNumber)
      }
    }
  }, [user])

  // Fetch user orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.email) return
      
      setLoadingOrders(true)
      try {
        const response = await fetch(`/api/orders?email=${encodeURIComponent(user.email)}`)
        if (response.ok) {
          const data = await response.json()
          setOrders(data.orders || [])
        } else {
          console.error('Failed to fetch orders:', response.statusText)
        }
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        setLoadingOrders(false)
      }
    }

    fetchOrders()
  }, [user?.email])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setPreviewImage(result)
        setProfilePicture(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setProfilePicture(null)
    setPreviewImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSave = async () => {
    try {
      if (!user?.id) {
        alert('User ID not found. Please try logging out and back in.')
        return
      }

      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          updates: {
            ...editData,
            profilePicture
          }
        }),
      })

      const responseData = await response.json()

      if (response.ok) {
        const updatedUser = { ...user, ...editData, profilePicture }
        localStorage.setItem('genosys_user', JSON.stringify(updatedUser))
        setIsEditing(false)
        alert('Profile updated successfully!')
        window.location.reload()
      } else {
        console.error('Failed to update profile:', responseData)
        alert(`Failed to update profile: ${responseData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert(`Error updating profile: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleCancel = () => {
    if (!user) return
    
    setEditData({
      name: user.name,
      phone: user.phone || '',
      address: user.address || '',
      birthday: user.birthday || ''
    })
    setProfilePicture(user?.profilePicture || null)
    setPreviewImage(user?.profilePicture || null)
    setIsEditing(false)
    
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDeleteAccount = async () => {
    if (!user) return
    
    setIsDeleting(true)
    try {
      const response = await fetch('/api/profile/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      })

      if (response.ok) {
        localStorage.removeItem('genosys_user')
        localStorage.removeItem(`customer_number_${user.id}`)
        
        // Immediately logout and redirect
        logout()
        router.push('/')
        
        // Show success message after redirect
        setTimeout(() => {
          alert('Your account has been successfully deleted.')
        }, 100)
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to delete account. Please try again.')
      }
    } catch (error) {
      console.error('Error deleting account:', error)
      alert('Error deleting account. Please try again.')
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  const cancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order? The order will be permanently removed from your history. This action cannot be undone.')) {
      return
    }

    try {
      const encodedOrderId = encodeURIComponent(orderId)
      const response = await fetch(`/api/orders/${encodedOrderId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      
      if (response.ok) {
        setOrders(orders.filter(order => order.id !== orderId))
        alert('Order cancelled and removed successfully')
      } else {
        const errorData = await response.json()
        alert(`Failed to cancel order: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error cancelling order:', error)
      alert('Failed to cancel order')
    }
  }

  // Show loading or nothing while redirecting
  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="bg-gray-50/80 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm" aria-label="Breadcrumb">
            <Link 
              href="/" 
              className="text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1"
            >
              <span>Home</span>
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">Profile</span>
            {activeTab !== 'profile' && (
              <>
                <span className="text-gray-400">/</span>
                <span className="text-gray-900 font-medium capitalize">{activeTab}</span>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Back to Home Button */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to Home</span>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-6xl mx-auto">
          
          {/* Profile Header Card */}
          <ProfileHeader
            user={user}
            isEditing={isEditing}
            previewImage={previewImage}
            customerNumber={customerNumber}
            isRefreshing={isRefreshing}
            onEditToggle={() => setIsEditing(!isEditing)}
            onImageUpload={handleImageUpload}
            onRemoveImage={handleRemoveImage}
            onRefresh={handleRefresh}
            fileInputRef={fileInputRef}
          />

          {/* Navigation Tabs */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-2 mb-8">
            {/* Mobile: Horizontal scroll with scroll indicators */}
            <div className="relative">
              {/* Scroll indicators for mobile */}
              <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-white/70 to-transparent z-10 pointer-events-none sm:hidden"></div>
              <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-white/70 to-transparent z-10 pointer-events-none sm:hidden"></div>
              
              {/* Navigation container with horizontal scroll on mobile */}
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 sm:overflow-x-visible sm:pb-0">
                {/* Primary Navigation Tabs */}
                {[
                  { id: 'profile', label: 'Profile', icon: User, shortLabel: 'Profile' },
                  { id: 'orders', label: 'Orders', icon: Package, shortLabel: 'Orders' },
                  { id: 'settings', label: 'Settings', icon: Settings, shortLabel: 'Settings' },
                  { id: 'downloads', label: 'Downloads', icon: Download, shortLabel: 'Downloads' },
                  { id: 'privacy', label: 'Privacy', icon: Shield, shortLabel: 'Privacy' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-1 sm:gap-2 px-2 xs:px-3 sm:px-6 py-3 rounded-xl font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                    }`}
                    title={tab.label}
                  >
                    <tab.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="text-sm sm:text-base hidden xs:inline">{tab.shortLabel}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'profile' && (
            <ProfileForm
              user={user}
              isEditing={isEditing}
              editData={editData}
              onEditDataChange={setEditData}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          )}

          {activeTab === 'orders' && (
            <OrderHistory
              orders={orders}
              loadingOrders={loadingOrders}
              onCancelOrder={cancelOrder}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsPanel
              isRefreshing={isRefreshing}
              onLogout={logout}
              onDeleteAccount={() => setShowDeleteConfirm(true)}
              onRefresh={handleRefresh}
            />
          )}

          {activeTab === 'downloads' && (
            <DownloadsSection />
          )}

          {activeTab === 'privacy' && (
            <PrivacySettings />
          )}

        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-red-100 rounded-xl">
                <Trash2 className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Delete Account</h3>
            </div>
            
            <div className="mb-8">
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete your account? This action cannot be undone.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-800 font-medium mb-2">This will permanently delete:</p>
                <ul className="text-red-700 text-sm space-y-1">
                  <li>• Your profile and personal information</li>
                  <li>• All order history</li>
                  <li>• Your customer number (#{customerNumber})</li>
                  <li>• All saved preferences and data</li>
                </ul>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="flex-1 bg-red-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? 'Deleting...' : 'Delete Account'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
