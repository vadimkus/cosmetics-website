'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Package, 
  // DollarSign, // Unused for now
  // TrendingUp, // Unused for now
  ShoppingBag,
  // Star, // Unused for now
  Building,
  Crown,
  Eye,
  EyeOff,
  Trash2,
  ArrowLeft,
  // Clock, // Unused for now
  // CheckCircle, // Unused for now
  // XCircle, // Unused for now
  // AlertCircle, // Unused for now
  Edit3,
  Save,
  X,
  RefreshCw
} from 'lucide-react'
import { User } from '@/types/user'
import { getCsrfHeaders } from '@/lib/csrfClient'

type Customer = User

interface Order {
  id: string
  orderNumber: string
  customerEmail: string
  customerName: string
  customerPhone?: string
  customerEmirate?: string
  customerAddress?: string
  subtotal: number
  discountAmount: number
  shipping: number
  vat: number
  total: number
  status: string
  createdAt: string
  updatedAt: string
  items: OrderItem[]
}

interface OrderItem {
  id: string
  productId: string
  productName: string
  price: number
  quantity: number
  image?: string
}

interface CustomerProfileProps {
  customer: Customer
  onBack: () => void
  onUpdateCustomer: (id: string, updates: Partial<Customer>) => Promise<void>
  onDeleteCustomer: (id: string, name: string) => Promise<void>
}

export default function CustomerProfile({ 
  customer, 
  onBack, 
  onUpdateCustomer, 
  onDeleteCustomer 
}: CustomerProfileProps) {
  console.log('CustomerProfile received customer:', customer)
  
  useEffect(() => {
    console.log('CustomerProfile mounted, fileInputRef:', fileInputRef.current)
  }, [])
  
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editData, setEditData] = useState({
    name: customer.name || '',
    email: customer.email || '',
    phone: customer.phone || '',
    address: customer.address || '',
    birthday: customer.birthday || '',
    profilePicture: customer.profilePicture || '',
    discountType: customer.discountType || '',
    discountPercentage: customer.discountPercentage || 0
  } as {
    name: string
    email: string
    phone: string
    address: string
    birthday: string
    profilePicture: string
    discountType: string | null
    discountPercentage: number | null
  })
  const [discountEditing, setDiscountEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [customerStats, setCustomerStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    averageOrderValue: 0,
    lastOrderDate: null as string | null,
    favoriteCategory: 'N/A'
  })

  // Helper to get admin email from session
  const getAdminEmail = (): string | null => {
    if (typeof window === 'undefined') return null
    try {
      const session = localStorage.getItem('admin_session')
      if (session) {
        const parsed = JSON.parse(session)
        return parsed.email || null
      }
    } catch (e) {
      return null
    }
    return null
  }

  // Helper to get admin headers with CSRF
  const getAdminHeaders = useCallback((): HeadersInit => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...getCsrfHeaders() as Record<string, string>
    }
    const email = getAdminEmail()
    if (email) {
      headers['X-Admin-Email'] = email
    }
    return headers as HeadersInit
  }, [])

  const fetchCustomerOrders = useCallback(async () => {
    try {
      setLoading(true)
      // URL encode the email to handle special characters
      const encodedEmail = encodeURIComponent(customer.email)
      const response = await fetch(`/api/admin/orders?customerEmail=${encodedEmail}`, {
        headers: getAdminHeaders()
      })
      
      if (!response.ok) {
        console.error('Failed to fetch orders:', response.status, response.statusText)
        const errorData = await response.json().catch(() => ({}))
        console.error('Error data:', errorData)
        return
      }
      
      const data = await response.json()
      console.log('📦 Orders API response:', { success: data.success, orderCount: data.orders?.length || 0 })
      
      if (data.success) {
        const ordersList = data.orders || []
        console.log('📦 Setting orders:', ordersList.length, 'orders')
        setOrders(ordersList)
        calculateCustomerStats(ordersList)
      } else {
        console.error('API returned success: false', data)
        setOrders([])
      }
    } catch (error) {
      console.error('Error fetching customer orders:', error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }, [customer.email, getAdminHeaders])

  useEffect(() => {
    fetchCustomerOrders()
  }, [customer.id, fetchCustomerOrders])

  const handleEdit = () => {
    setEditing(true)
    setEditData({
      name: customer.name || '',
      email: customer.email || '',
      phone: customer.phone || '',
      address: customer.address || '',
      birthday: customer.birthday || '',
      profilePicture: customer.profilePicture || '',
      discountType: customer.discountType || null,
      discountPercentage: customer.discountPercentage || null
    })
  }

  const handleDiscountSave = async () => {
    try {
      setSaving(true)
      await onUpdateCustomer(customer.id, {
        discountType: editData.discountType === '' ? null : editData.discountType,
        discountPercentage: editData.discountPercentage === 0 ? null : editData.discountPercentage
      })
      setDiscountEditing(false)
      alert('Discount updated successfully!')
    } catch (error) {
      console.error('Error updating discount:', error)
      alert('Failed to update discount')
    } finally {
      setSaving(false)
    }
  }

  const handleSave = async () => {
    try {
      console.log('Saving customer updates:', {
        name: editData.name || undefined,
        email: editData.email || undefined,
        phone: editData.phone || undefined,
        address: editData.address || undefined,
        birthday: editData.birthday || undefined,
        profilePicture: editData.profilePicture || undefined
      })
      await onUpdateCustomer(customer.id, {
        name: editData.name || '',
        email: editData.email || '',
        phone: editData.phone || '',
        address: editData.address || '',
        birthday: editData.birthday || '',
        profilePicture: editData.profilePicture || ''
      })
      console.log('Customer update completed')
      setEditing(false)
    } catch (error) {
      console.error('Error updating customer:', error)
    }
  }

  const handleCancel = () => {
    setEditing(false)
    setEditData({
      name: customer.name || '',
      email: customer.email || '',
      phone: customer.phone || '',
      address: customer.address || '',
      birthday: customer.birthday || '',
      profilePicture: customer.profilePicture || '',
      discountType: customer.discountType || null,
      discountPercentage: customer.discountPercentage || null
    })
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('handleImageUpload called', event.target.files)
    const file = event.target.files?.[0]
    if (!file) {
      console.log('No file selected')
      return
    }
    console.log('File selected:', file.name, file.size, file.type)

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB')
      return
    }

    try {
      setUploading(true)
      
      // If not in edit mode, enter edit mode first
      if (!editing) {
        setEditing(true)
        setEditData({
          name: customer.name || '',
          email: customer.email || '',
          phone: customer.phone || '',
          address: customer.address || '',
          birthday: customer.birthday || '',
          profilePicture: customer.profilePicture || '',
          discountType: customer.discountType || null,
          discountPercentage: customer.discountPercentage || null
        })
      }
      
      // Convert to base64 for now (in production, you'd upload to a cloud service)
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setEditData(prev => ({ ...prev, profilePicture: result }))
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Error uploading image')
    } finally {
      setUploading(false)
    }
  }

  const removeProfilePicture = () => {
    setEditData({ ...editData, profilePicture: '' })
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await fetchCustomerOrders()
    } catch (error) {
      console.error('Error refreshing customer data:', error)
    } finally {
      setRefreshing(false)
    }
  }

  const calculateCustomerStats = (orders: Order[]) => {
    const totalOrders = orders.length
    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0)
    const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0
    const lastOrderDate = orders.length > 0 
      ? orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]?.createdAt || null
      : null

    // Calculate favorite category (simplified - would need product data)
    const favoriteCategory = 'Skincare' // This would be calculated from order items

    setCustomerStats({
      totalOrders,
      totalSpent,
      averageOrderValue,
      lastOrderDate,
      favoriteCategory
    })
  }

  // const getStatusIcon = (status: string) => {
  //   switch (status) {
  //     case 'COMPLETED':
  //       return <CheckCircle className="h-4 w-4 text-green-600" />
  //     case 'PENDING':
  //       return <Clock className="h-4 w-4 text-yellow-600" />
  //     case 'CANCELLED':
  //       return <XCircle className="h-4 w-4 text-red-600" />
  //     default:
  //       return <AlertCircle className="h-4 w-4 text-gray-600" />
  //   }
  // } // Unused for now

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Users
          </button>
          <h2 className="text-2xl font-bold text-gray-800">Customer Profile</h2>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Information */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="text-center mb-6">
              <div 
                className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-200 border-4 border-gray-300 flex items-center justify-center mx-auto mb-4 group cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation()
                  console.log('Avatar clicked - triggering file input')
                  if (fileInputRef.current) {
                    console.log('File input ref found, clicking...')
                    fileInputRef.current.click()
                  } else {
                    console.log('File input ref not found, trying alternative approach')
                    // Alternative approach: find the file input by querying the DOM
                    const fileInput = document.querySelector('input[type="file"][accept="image/*"]') as HTMLInputElement
                    if (fileInput) {
                      console.log('Found file input via DOM query, clicking...')
                      fileInput.click()
                    } else {
                      console.log('No file input found in DOM')
                    }
                  }
                }}
              >
                {editing ? (
                  editData.profilePicture ? (
                    <Image
                      src={editData.profilePicture}
                      alt={customer.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  ) : customer.isAdmin ? (
                    <Image
                      src="/favicon/genosys-logo.png"
                      alt="Admin"
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image
                      src="/images/avatar/avatar.png"
                      alt={customer.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  )
                ) : (
                  customer.profilePicture ? (
                    <Image
                      src={customer.profilePicture}
                      alt={customer.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  ) : customer.isAdmin ? (
                    <Image
                      src="/favicon/genosys-logo.png"
                      alt="Admin"
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image
                      src="/images/avatar/avatar.png"
                      alt={customer.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  )
                )}
                
                {/* Always show hover overlay for profile picture upload */}
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex flex-col gap-1">
                    <label 
                      className="cursor-pointer p-1 bg-white rounded-full hover:bg-gray-100 transition-colors" 
                      htmlFor="profile-picture-upload"
                    >
                      <input
                        ref={fileInputRef}
                        id="profile-picture-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                      <Edit3 className="h-4 w-4 text-gray-600" />
                    </label>
                    {(editing ? editData.profilePicture : customer.profilePicture) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (editing) {
                            removeProfilePicture()
                          } else {
                            // If not in edit mode, enter edit mode and remove picture
                            handleEdit()
                            setTimeout(() => removeProfilePicture(), 100)
                          }
                        }}
                        className="p-1 bg-white rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <X className="h-4 w-4 text-red-600" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              {editing && (
                <div className="mb-4">
                  <label 
                    className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                    htmlFor="change-picture-upload"
                  >
                    <input
                      id="change-picture-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Edit3 className="h-4 w-4" />
                        {editData.profilePicture ? 'Change Picture' : 'Add Picture'}
                      </>
                    )}
                  </label>
                </div>
              )}
              
              {editing ? (
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  placeholder="Customer name"
                  className="text-xl font-bold text-gray-800 bg-transparent border-b-2 border-blue-500 focus:outline-none focus:border-blue-600 px-1 py-1 w-full"
                />
              ) : (
                <h3 className="text-xl font-bold text-gray-800">{customer.name}</h3>
              )}
              <p className="text-gray-600">{customer.email}</p>
              {customer.isAdmin && (
                <span className="inline-block mt-2 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                  Admin
                </span>
              )}
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-700">Contact Information</h4>
                {!editing ? (
                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    <Edit3 className="h-3 w-3" />
                    Edit
                  </button>
                ) : (
                  <div className="flex gap-1">
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-1 px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                    >
                      <Save className="h-3 w-3" />
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                    >
                      <X className="h-3 w-3" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  {editing ? (
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      placeholder="Email address"
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-600">
                      {customer.email}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  {editing ? (
                    <input
                      type="tel"
                      value={editData.phone}
                      onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                      placeholder="Phone number"
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-600">
                      {customer.phone || 'Not provided'}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  {editing ? (
                    <input
                      type="text"
                      value={editData.address}
                      onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                      placeholder="Address"
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-600">
                      {customer.address || 'Not provided'}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Member since {formatDate(customer.createdAt)}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  {editing ? (
                    <input
                      type="date"
                      value={editData.birthday}
                      onChange={(e) => setEditData({ ...editData, birthday: e.target.value })}
                      className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-600">
                      Birthday: {customer.birthday ? formatDate(customer.birthday) : 'Not provided'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Price Access & Discount */}
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Price Access</span>
                <div className="flex items-center gap-2">
                  {customer.canSeePrices ? (
                    <Eye className="h-4 w-4 text-green-600" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-red-600" />
                  )}
                  <button
                    onClick={() => onUpdateCustomer(customer.id, { canSeePrices: !customer.canSeePrices })}
                    className={`px-3 py-1 rounded text-xs ${
                      customer.canSeePrices 
                        ? 'bg-red-500 text-white hover:bg-red-600' 
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    {customer.canSeePrices ? 'Remove Access' : 'Grant Access'}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Discount</span>
                <div className="flex items-center gap-2">
                  {!discountEditing ? (
                    <div className="flex items-center gap-2">
                      {customer.discountType ? (
                        <div className="flex items-center gap-1">
                          {customer.discountType === 'CLINIC' ? (
                            <Building className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Crown className="h-4 w-4 text-purple-600" />
                          )}
                          <span className={`px-2 py-1 rounded text-xs ${
                            customer.discountType === 'CLINIC' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                          }`}>
                            {customer.discountType} {customer.discountPercentage}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-500 text-sm">No discount</span>
                      )}
                      <button
                        onClick={() => {
                          setDiscountEditing(true)
                          setEditData(prev => ({
                            ...prev,
                            discountType: customer.discountType || null,
                            discountPercentage: customer.discountPercentage || null
                          }))
                        }}
                        className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 flex items-center gap-1"
                      >
                        <Edit3 className="h-3 w-3" />
                        Edit
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <select
                        value={editData.discountType || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, discountType: e.target.value || null }))}
                        className="px-2 py-1 border border-gray-300 rounded text-xs"
                      >
                        <option value="">No Discount</option>
                        <option value="CLINIC">CLINIC</option>
                        <option value="VIP">VIP</option>
                      </select>
                      {editData.discountType && (
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={editData.discountPercentage || ''}
                          onChange={(e) => setEditData(prev => ({ ...prev, discountPercentage: Number(e.target.value) || null }))}
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-xs"
                          placeholder="%"
                        />
                      )}
                      <button
                        onClick={handleDiscountSave}
                        disabled={saving}
                        className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 flex items-center gap-1 disabled:opacity-50"
                      >
                        <Save className="h-3 w-3" />
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={() => {
                          setDiscountEditing(false)
                          setEditData(prev => ({
                            ...prev,
                            discountType: customer.discountType || null,
                            discountPercentage: customer.discountPercentage || null
                          }))
                        }}
                        className="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600 flex items-center gap-1"
                      >
                        <X className="h-3 w-3" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Delete Customer */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => onDeleteCustomer(customer.id, customer.name)}
                className="flex items-center justify-center gap-1.5 px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
              >
                <Trash2 className="h-3 w-3" />
                Delete Customer
              </button>
            </div>
          </div>
        </div>

        {/* Customer Statistics & Order History */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Statistics */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{customerStats.totalOrders}</div>
                <div className="text-sm text-gray-600">Total Orders</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{formatCurrency(customerStats.totalSpent)}</div>
                <div className="text-sm text-gray-600">Total Spent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{formatCurrency(customerStats.averageOrderValue)}</div>
                <div className="text-sm text-gray-600">Avg Order Value</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{customerStats.favoriteCategory}</div>
                <div className="text-sm text-gray-600">Favorite Category</div>
              </div>
            </div>
          </div>

          {/* Order History */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Order History</h3>
              <span className="text-sm text-gray-500">{orders.length} orders</span>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No orders found for this customer</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Package className="h-5 w-5 text-gray-400" />
                        <div>
                          <h4 className="font-medium text-gray-800">Order #{order.orderNumber}</h4>
                          <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                        <span className="font-semibold text-gray-800">{formatCurrency(order.total)}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Items:</span>
                        <span className="ml-1 font-medium">{order.items.length}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Subtotal:</span>
                        <span className="ml-1 font-medium">{formatCurrency(order.subtotal)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Discount:</span>
                        <span className="ml-1 font-medium">{formatCurrency(order.discountAmount)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Shipping:</span>
                        <span className="ml-1 font-medium">{formatCurrency(order.shipping)}</span>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>Items:</span>
                        <div className="flex gap-1">
                          {order.items.slice(0, 3).map((item, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 rounded text-xs">
                              {item.productName} (×{item.quantity})
                            </span>
                          ))}
                          {order.items.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                              +{order.items.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
