'use client'

import Link from 'next/link'
import { Mail, UserPlus, ShoppingCart, Bell, Settings } from 'lucide-react'

export default function EmailTemplatesPage() {
  const templates = [
    {
      id: 'welcome',
      title: 'Welcome Email',
      description: 'Sent to new users when they register',
      icon: UserPlus,
      color: 'bg-green-500',
      href: '/email-templates/welcome',
      messageId: '02639f89-4305-d405-32aa-af60cb847634@gmail.com'
    },
    {
      id: 'order-confirmation',
      title: 'Order Confirmation',
      description: 'Sent to customers when they place orders',
      icon: ShoppingCart,
      color: 'bg-blue-500',
      href: '/email-templates/order-confirmation',
      messageId: '0a6a2918-7e64-2e15-2ea0-66b8cdbba242@gmail.com'
    },
    {
      id: 'admin-user-notification',
      title: 'Admin User Notification',
      description: 'Sent to admin when new users register',
      icon: Bell,
      color: 'bg-yellow-500',
      href: '/email-templates/admin-user-notification',
      messageId: '609a61f2-65ea-50f0-551a-82640b3a70ed@gmail.com'
    },
    {
      id: 'admin-order-notification',
      title: 'Admin Order Notification',
      description: 'Sent to admin when new orders are placed',
      icon: Mail,
      color: 'bg-red-500',
      href: '/email-templates/admin-order-notification',
      messageId: 'db0e54e3-2e21-b964-e584-5cf5eb3d8d90@gmail.com'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Email Templates</h1>
          <p className="text-xl text-gray-600 mb-6">
            Customize and preview your email templates for Genosys Cosmetics
          </p>
          <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Email system is active and working
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {templates.map((template) => {
            const IconComponent = template.icon
            return (
              <Link
                key={template.id}
                href={template.href}
                className="group bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 hover:border-red-300"
              >
                <div className="flex items-start space-x-4">
                  <div className={`${template.color} p-3 rounded-lg group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                      {template.title}
                    </h3>
                    <p className="text-gray-600 mt-2 mb-4">
                      {template.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        Message ID: {template.messageId}
                      </span>
                      <span className="text-red-600 font-medium group-hover:text-red-700">
                        Edit Template →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Email System Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <Mail className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Gmail SMTP</h3>
              <p className="text-sm text-gray-600">Connected & Active</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <Settings className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Templates</h3>
              <p className="text-sm text-gray-600">4 Templates Ready</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <Bell className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              <p className="text-sm text-gray-600">Auto-sending Active</p>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">📝 Template Customization</h3>
          <p className="text-yellow-700 mb-4">
            Each template page allows you to:
          </p>
          <ul className="text-yellow-700 space-y-2">
            <li>• Preview the email with real-time variable changes</li>
            <li>• Modify template variables and content</li>
            <li>• View the HTML source code</li>
            <li>• Save customizations (functionality to be implemented)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
