'use client'

import { useState } from 'react'

export default function AdminOrderNotificationEmailTemplate() {
  const [orderData, setOrderData] = useState({
    orderNumber: 'TEST123456',
    customerName: 'John Doe',
    customerEmail: 'john.doe@example.com',
    total: 456.74,
    itemCount: 3,
    orderTime: new Date().toLocaleString()
  })

  // Template text content state
  const [templateContent, setTemplateContent] = useState({
    title: 'New Order Received! 💰',
    mainMessage: 'A new order has been placed on genosys.ae.',
    orderSummaryTitle: 'Order Summary',
    quickActionsTitle: 'Quick Actions',
    adminDashboardText: 'View Admin Dashboard',
    adminDashboardUrl: 'https://genosys.ae/admin',
    manageOrdersText: 'Manage Orders',
    manageOrdersUrl: 'https://genosys.ae/admin/orders',
    contactCustomerText: 'Contact Customer',
    businessImpactTitle: '📈 Business Impact',
    businessImpactMessage: 'This order contributes to your daily revenue target. Consider following up with the customer for potential repeat business or upselling opportunities.',
    actionRequiredTitle: '⚠️ Action Required',
    actionRequiredMessage: 'Please process this order within 24 hours to maintain customer satisfaction. Check inventory levels and prepare for shipping.',
    footerMessage: '',
    companyFooter: 'Genosys Middle East FZ-LLC - Official Genosys distributor in the United Arab Emirates'
  })

  const generateAdminOrderNotificationEmail = (data: typeof orderData, content: typeof templateContent) => {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #dc2626; margin: 0;">Genosys Middle East FZ-LLC</h1>
          <p style="color: #666; margin: 5px 0;">Admin Dashboard</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 30px; border-radius: 10px; margin-bottom: 20px;">
          <h2 style="color: #16a34a; margin: 0 0 15px 0;">${content.title}</h2>
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0;">
            ${content.mainMessage}
          </p>
        </div>
        
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #dc2626; margin: 0 0 15px 0;">${content.orderSummaryTitle}</h3>
          <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #dc2626;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
              <div>
                <strong style="color: #374151;">Order Number:</strong>
                <p style="color: #6b7280; margin: 5px 0 0 0; font-size: 18px; font-weight: bold;">#${data.orderNumber}</p>
              </div>
              <div>
                <strong style="color: #374151;">Total Amount:</strong>
                <p style="color: #16a34a; margin: 5px 0 0 0; font-size: 18px; font-weight: bold;">AED ${data.total.toFixed(2)}</p>
              </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
              <div>
                <strong style="color: #374151;">Customer:</strong>
                <p style="color: #6b7280; margin: 5px 0 0 0;">${data.customerName}</p>
              </div>
              <div>
                <strong style="color: #374151;">Items:</strong>
                <p style="color: #6b7280; margin: 5px 0 0 0;">${data.itemCount} products</p>
              </div>
            </div>
            <div>
              <strong style="color: #374151;">Email:</strong>
              <p style="color: #6b7280; margin: 5px 0 0 0;">${data.customerEmail}</p>
            </div>
            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
              <strong style="color: #374151;">Order Time:</strong>
              <p style="color: #6b7280; margin: 5px 0 0 0;">${data.orderTime}</p>
            </div>
          </div>
        </div>
        
        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #0369a1; margin: 0 0 15px 0;">${content.quickActionsTitle}</h3>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <a href="${content.adminDashboardUrl}" 
               style="background: #dc2626; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px; font-size: 14px;">
              ${content.adminDashboardText}
            </a>
            <a href="${content.manageOrdersUrl}" 
               style="background: #059669; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px; font-size: 14px;">
              ${content.manageOrdersText}
            </a>
            <a href="mailto:${data.customerEmail}" 
               style="background: #7c3aed; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px; font-size: 14px;">
              ${content.contactCustomerText}
            </a>
          </div>
        </div>
        
        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #92400e; margin: 0 0 10px 0;">${content.businessImpactTitle}</h3>
          <p style="color: #374151; margin: 0; font-size: 14px;">
            ${content.businessImpactMessage}
          </p>
        </div>
        
        <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #dc2626; margin: 0 0 10px 0;">${content.actionRequiredTitle}</h3>
          <p style="color: #374151; margin: 0; font-size: 14px;">
            ${content.actionRequiredMessage}
          </p>
        </div>
        
        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
          <p style="color: #6b7280; font-size: 14px; margin: 0;">
            ${content.footerMessage}
          </p>
          <p style="color: #6b7280; font-size: 12px; margin: 10px 0 0 0;">
            ${content.companyFooter}
          </p>
        </div>
      </div>
    `
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Order Notification Email Template</h1>
          <p className="text-gray-600 mb-6">Preview and customize the admin notification email sent when new orders are placed</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Controls */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Template Variables</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Number
                  </label>
                  <input
                    type="text"
                    value={orderData.orderNumber}
                    onChange={(e) => setOrderData({...orderData, orderNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    value={orderData.customerName}
                    onChange={(e) => setOrderData({...orderData, customerName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Email
                </label>
                <input
                  type="email"
                  value={orderData.customerEmail}
                  onChange={(e) => setOrderData({...orderData, customerEmail: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Amount (AED)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={orderData.total}
                    onChange={(e) => setOrderData({...orderData, total: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item Count
                  </label>
                  <input
                    type="number"
                    value={orderData.itemCount}
                    onChange={(e) => setOrderData({...orderData, itemCount: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Time
                </label>
                <input
                  type="text"
                  value={orderData.orderTime}
                  onChange={(e) => setOrderData({...orderData, orderTime: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              
              <div className="pt-4">
                <button
                  onClick={() => {
                    alert('Template saved! (Functionality to be implemented)')
                  }}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
                >
                  Save Template
                </button>
              </div>
            </div>

            {/* Template Content Controls */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Template Content</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alert Title
                    </label>
                    <input
                      type="text"
                      value={templateContent.title}
                      onChange={(e) => setTemplateContent({...templateContent, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Order alert title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Main Message
                    </label>
                    <textarea
                      value={templateContent.mainMessage}
                      onChange={(e) => setTemplateContent({...templateContent, mainMessage: e.target.value})}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Main notification message"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Order Summary Title
                    </label>
                    <input
                      type="text"
                      value={templateContent.orderSummaryTitle}
                      onChange={(e) => setTemplateContent({...templateContent, orderSummaryTitle: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Order summary section title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quick Actions Title
                    </label>
                    <input
                      type="text"
                      value={templateContent.quickActionsTitle}
                      onChange={(e) => setTemplateContent({...templateContent, quickActionsTitle: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Quick actions section title"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Admin Dashboard Text
                      </label>
                      <input
                        type="text"
                        value={templateContent.adminDashboardText}
                        onChange={(e) => setTemplateContent({...templateContent, adminDashboardText: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Admin dashboard button text"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Admin Dashboard URL
                      </label>
                      <input
                        type="url"
                        value={templateContent.adminDashboardUrl}
                        onChange={(e) => setTemplateContent({...templateContent, adminDashboardUrl: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Admin dashboard URL"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Manage Orders Text
                      </label>
                      <input
                        type="text"
                        value={templateContent.manageOrdersText}
                        onChange={(e) => setTemplateContent({...templateContent, manageOrdersText: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Manage orders button text"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Manage Orders URL
                      </label>
                      <input
                        type="url"
                        value={templateContent.manageOrdersUrl}
                        onChange={(e) => setTemplateContent({...templateContent, manageOrdersUrl: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Manage orders URL"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Customer Text
                    </label>
                    <input
                      type="text"
                      value={templateContent.contactCustomerText}
                      onChange={(e) => setTemplateContent({...templateContent, contactCustomerText: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Contact customer button text"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Impact Title
                    </label>
                    <input
                      type="text"
                      value={templateContent.businessImpactTitle}
                      onChange={(e) => setTemplateContent({...templateContent, businessImpactTitle: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Business impact section title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Impact Message
                    </label>
                    <textarea
                      value={templateContent.businessImpactMessage}
                      onChange={(e) => setTemplateContent({...templateContent, businessImpactMessage: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Business impact message"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Action Required Title
                    </label>
                    <input
                      type="text"
                      value={templateContent.actionRequiredTitle}
                      onChange={(e) => setTemplateContent({...templateContent, actionRequiredTitle: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Action required section title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Action Required Message
                    </label>
                    <textarea
                      value={templateContent.actionRequiredMessage}
                      onChange={(e) => setTemplateContent({...templateContent, actionRequiredMessage: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Action required message"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Footer Message
                    </label>
                    <input
                      type="text"
                      value={templateContent.footerMessage}
                      onChange={(e) => setTemplateContent({...templateContent, footerMessage: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Footer message"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Footer
                    </label>
                    <input
                      type="text"
                      value={templateContent.companyFooter}
                      onChange={(e) => setTemplateContent({...templateContent, companyFooter: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Company footer"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Preview */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Preview</h3>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <div className="bg-gray-100 px-4 py-2 border-b border-gray-300">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600 ml-2">New Order #{orderData.orderNumber} - {orderData.customerName}</span>
                  </div>
                </div>
                <div 
                  className="p-4 bg-white max-h-96 overflow-y-auto"
                  dangerouslySetInnerHTML={{ __html: generateAdminOrderNotificationEmail(orderData, templateContent) }}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* HTML Source */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">HTML Source Code</h3>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
            <code>{generateAdminOrderNotificationEmail(orderData, templateContent)}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}
