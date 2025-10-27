'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import ProfileHeader from '@/components/profile/ProfileHeader'
import ProfileTabs from '@/components/profile/ProfileTabs'
import ProfileContent from '@/components/profile/ProfileContent'
import { Order, OrderItem } from '@prisma/client'
import { ProfileTab } from '@/types/profile'

type OrderWithItems = Order & {
  items: OrderItem[]
}

export default function ProfilePageOptimized() {
  const { user, forceRefreshUser } = useAuth()
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
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [activeTab, setActiveTab] = useState<ProfileTab>('profile')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState(false)

  // Generate customer number
  useEffect(() => {
    if (user?.id) {
      const customerNumber = parseInt(user.id.slice(-6), 16) || Math.floor(Math.random() * 1000000)
      setCustomerNumber(customerNumber)
    }
  }, [user?.id])

  // Fetch orders when component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return
      
      setLoadingOrders(true)
      try {
        const response = await fetch('/api/orders')
        if (response.ok) {
          const orders = await response.json()
          setOrders(orders)
        }
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        setLoadingOrders(false)
      }
    }

    fetchOrders()
  }, [user])

  const handleRefresh = async () => {
    if (isRefreshing) return
    
    setIsRefreshing(true)
    try {
      await forceRefreshUser()
    } catch (error) {
      console.error('Error refreshing user data:', error)
    } finally {
      setTimeout(() => {
        setIsRefreshing(false)
      }, 1000)
    }
  }

  const handleSave = async () => {
    try {
      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      })

      if (response.ok) {
        await forceRefreshUser()
        setIsEditing(false)
      } else {
        console.error('Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const handleCancel = () => {
    setEditData({
      name: user?.name || '',
      phone: user?.phone || '',
      address: user?.address || '',
      birthday: user?.birthday || ''
    })
    setIsEditing(false)
  }

  const handleProfilePictureChange = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveProfilePicture = () => {
    setPreviewImage(null)
  }

  if (!user) {
    router.push('/login')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <ProfileHeader
          user={user}
          state={{
            isEditing,
            editData,
            profilePicture,
            previewImage,
            customerNumber,
            isRefreshing,
            showMoreMenu
          }}
          actions={{
            setIsEditing: (editing: boolean) => setIsEditing(editing),
            setEditData,
            setProfilePicture: (picture: string | null) => setProfilePicture(picture),
            setPreviewImage: (image: string | null) => setPreviewImage(image),
            setCustomerNumber: (number: number) => setCustomerNumber(number),
            setShowMoreMenu
          }}
          onSave={handleSave}
          onCancel={handleCancel}
          onRefresh={handleRefresh}
          onProfilePictureChange={handleProfilePictureChange}
          onRemoveProfilePicture={handleRemoveProfilePicture}
        />

        <ProfileTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <ProfileContent
          user={user}
          activeTab={activeTab}
          isEditing={isEditing}
          editData={editData}
          setEditData={setEditData}
          orders={orders}
          loadingOrders={loadingOrders}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
}
