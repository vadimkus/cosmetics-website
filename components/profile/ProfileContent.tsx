'use client'

import { Phone, Calendar, MapPin } from 'lucide-react'
import { Order, OrderItem } from '@prisma/client'
import { User as UserType } from '@/types/user'

type OrderWithItems = Order & {
  items: OrderItem[]
}

interface ProfileContentProps {
  user: UserType | null
  activeTab: 'profile' | 'orders' | 'settings' | 'downloads' | 'privacy'
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

  const renderPrivacyTab = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Privacy Policy</h2>
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">Your Privacy Rights</h3>
          <p className="text-blue-700 text-sm">
            As a registered user, you have the right to access, update, or delete your personal information. 
            This section outlines how we handle your data and your rights under our privacy policy.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">1. Personal Information We Collect</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                <li><strong>Account Information:</strong> Name, email, phone number, address</li>
                <li><strong>Profile Data:</strong> Birthday, profile picture, customer preferences</li>
                <li><strong>Order Information:</strong> Purchase history, shipping addresses, payment details</li>
                <li><strong>Usage Data:</strong> Website interactions, page views, session data</li>
              </ul>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-2">2. How We Use Your Information</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                <li>Process and fulfill your orders</li>
                <li>Provide customer support and respond to inquiries</li>
                <li>Send order updates and promotional communications (with your consent)</li>
                <li>Improve our website and services</li>
                <li>Comply with legal obligations</li>
              </ul>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-2">3. Data Retention</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                We retain your personal information for as long as your account is active or as needed to provide services. 
                Order information is retained for accounting and legal compliance purposes. You can request deletion of your 
                account and associated data at any time.
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-2">4. Your Rights</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                <li><strong>Access:</strong> View all personal information we have about you</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
              </ul>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-2">5. Data Security</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                We implement appropriate technical and organizational measures to protect your personal information 
                against unauthorized access, alteration, disclosure, or destruction. This includes encryption, 
                secure servers, and regular security assessments.
              </p>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2">Contact Us</h4>
            <p className="text-green-700 text-sm">
              For any privacy-related questions or to exercise your rights, please contact us at{' '}
              <a href="mailto:sales@genosys.ae" className="text-green-600 hover:text-green-700 underline">
                sales@genosys.ae
              </a>
            </p>
          </div>
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
      case 'privacy':
        return renderPrivacyTab()
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