'use client'

import { Phone, Calendar, MapPin } from 'lucide-react'
import { Order, OrderItem } from '@prisma/client'
import { User as UserType } from '@/types/user'

type OrderWithItems = Order & {
  items: OrderItem[]
}

interface ProfileContentProps {
  user: UserType | null
  activeTab: 'profile' | 'orders' | 'settings' | 'downloads'
  isEditing: boolean
  editData: {
    name: string
    phone: string
    address: string
    birthday: string
  }
  setEditData: (data: any) => void
  orders: OrderWithItems[]
  loadingOrders: boolean
  onSave: () => void
  onCancel: () => void
}

export default function ProfileContent({
  user,
  activeTab,
  isEditing,
  editData,
  setEditData,
  orders,
  loadingOrders,
  onSave,
  onCancel
}: ProfileContentProps) {

  if (!user) return null

  const renderProfileTab = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            {isEditing ? (
              <input
                type="tel"
                value={editData.phone}
                onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter phone number"
              />
            ) : (
              <div className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-gray-400" />
                <span className="text-gray-900">{user.phone || 'Not provided'}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Birthday</label>
            {isEditing ? (
              <input
                type="date"
                value={editData.birthday}
                onChange={(e) => setEditData({ ...editData, birthday: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            ) : (
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-gray-400" />
                <span className="text-gray-900">{user.birthday || 'Not provided'}</span>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
          {isEditing ? (
            <textarea
              value={editData.address}
              onChange={(e) => setEditData({ ...editData, address: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              rows={3}
              placeholder="Enter your address"
            />
          ) : (
            <div className="flex items-start space-x-2">
              <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
              <span className="text-gray-900">{user.address || 'Not provided'}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderOrdersTab = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Order History</h2>
      
      {loadingOrders ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No orders found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium text-gray-900">Order #{order.orderNumber}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  order.status === 'completed' ? 'bg-green-100 text-green-800' :
                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {order.status}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                <p>Total: {order.total.toFixed(2)} AED</p>
                <p>Items: {order.items.length}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderDownloadsTab = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Downloads</h2>
      <div className="text-center py-8">
        <p className="text-gray-500">No downloads available</p>
      </div>
    </div>
  )

  const renderSettingsTab = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Settings</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900">Email Notifications</h3>
            <p className="text-sm text-gray-500">Receive updates about your orders</p>
          </div>
          <input type="checkbox" className="rounded" defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900">SMS Notifications</h3>
            <p className="text-sm text-gray-500">Receive SMS updates about your orders</p>
          </div>
          <input type="checkbox" className="rounded" />
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab()
      case 'orders':
        return renderOrdersTab()
      case 'downloads':
        return renderDownloadsTab()
      case 'settings':
        return renderSettingsTab()
      default:
        return renderProfileTab()
    }
  }

  return (
    <div>
      {renderContent()}
      
      {isEditing && (
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  )
}