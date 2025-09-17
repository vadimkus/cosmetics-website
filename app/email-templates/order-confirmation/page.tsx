'use client'

import { useState } from 'react'

export default function OrderConfirmationEmailTemplate() {
  const [orderData, setOrderData] = useState({
    orderNumber: 'TEST123456',
    customerName: 'John Doe',
    customerEmail: 'john.doe@example.com',
    items: [
      {
        productName: 'Premium Serum',
        quantity: 2,
        price: 150.00,
        image: '/images/serum.jpg'
      },
      {
        productName: 'Hydrating Cream',
        quantity: 1,
        price: 89.99,
        image: '/images/cream.jpg'
      }
    ],
    subtotal: 389.99,
    shipping: 45.00,
    vat: 21.75,
    total: 456.74,
    address: '123 Main Street, Dubai Marina',
    emirate: 'Dubai'
  })

  // Template text content state
  const [templateContent, setTemplateContent] = useState({
    title: 'Order Confirmed! ✅',
    mainMessage: 'Thank you for your order, {customerName}!',
    orderMessage: 'Your order #{orderNumber} has been received and is being processed.',
    followUpMessage: 'Our team will be in touch with you for the next steps via phone/mail/whatsapp.',
    orderDetailsTitle: 'Order Details',
    deliveryTitle: 'Delivery Information',
    buttonText: 'Track Your Order',
    buttonUrl: 'https://genosys.ae/profile',
    supportMessage: 'Questions about your order? Contact us at sales@genosys.ae',
    footerMessage: 'Genosys Middle East FZ-LLC - Official Genosys distributor in the United Arab Emirates'
  })

  const generateOrderConfirmationEmail = (data: typeof orderData, content: typeof templateContent) => {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #dc2626; margin: 0;">Genosys Middle East FZ-LLC</h1>
          <p style="color: #666; margin: 5px 0;">Official Genosys distributor in the United Arab Emirates</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 30px; border-radius: 10px; margin-bottom: 20px;">
          <h2 style="color: #16a34a; margin: 0 0 15px 0;">${content.title}</h2>
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 10px 0;">
            ${content.mainMessage.replace('{customerName}', `<strong>${data.customerName}</strong>`)}
          </p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 10px 0;">
            ${content.orderMessage.replace('{orderNumber}', `<strong>${data.orderNumber}</strong>`)}
          </p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0;">
            ${content.followUpMessage}
          </p>
        </div>
        
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #dc2626; margin: 0 0 15px 0;">${content.orderDetailsTitle}</h3>
          <div style="margin-bottom: 20px;">
            ${data.items.map(item => `
              <div style="display: flex; align-items: center; padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                <div style="width: 60px; height: 60px; background: #f3f4f6; border-radius: 6px; margin-right: 15px; display: flex; align-items: center; justify-content: center; color: #6b7280; font-size: 12px;">
                  IMG
                </div>
                <div style="flex: 1;">
                  <h4 style="margin: 0 0 5px 0; color: #374151; font-size: 14px;">${item.productName}</h4>
                  <p style="margin: 0; color: #6b7280; font-size: 12px;">Qty: ${item.quantity}</p>
                </div>
                <div style="text-align: right;">
                  <p style="margin: 0; color: #dc2626; font-weight: bold;">AED ${item.price.toFixed(2)}</p>
                </div>
              </div>
            `).join('')}
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 15px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #374151;">Subtotal:</span>
              <span style="color: #374151;">AED ${data.subtotal.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #374151;">Shipping:</span>
              <span style="color: #374151;">AED ${data.shipping.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #374151;">VAT:</span>
              <span style="color: #374151;">AED ${data.vat.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 18px; color: #dc2626; border-top: 2px solid #dc2626; padding-top: 8px;">
              <span>Total:</span>
              <span>AED ${data.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #92400e; margin: 0 0 15px 0;">${content.deliveryTitle}</h3>
          <p style="color: #374151; margin: 0 0 10px 0;"><strong>Address:</strong> ${data.address}</p>
          <p style="color: #374151; margin: 0;"><strong>Emirate:</strong> ${data.emirate}</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${content.buttonUrl}" 
             style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); 
                    color: white; 
                    padding: 12px 30px; 
                    text-decoration: none; 
                    border-radius: 6px; 
                    font-weight: bold; 
                    display: inline-block;">
            ${content.buttonText}
          </a>
        </div>
        
        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
          <p style="color: #6b7280; font-size: 14px; margin: 0;">
            ${content.supportMessage.replace('sales@genosys.ae', '<a href="mailto:sales@genosys.ae" style="color: #dc2626;">sales@genosys.ae</a>')}
          </p>
          <p style="color: #6b7280; font-size: 12px; margin: 10px 0 0 0;">
            ${content.footerMessage}
          </p>
        </div>
      </div>
    `
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmation Email Template</h1>
          <p className="text-gray-600 mb-6">Preview and customize the order confirmation email sent to customers</p>
          
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
                    Subtotal (AED)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={orderData.subtotal}
                    onChange={(e) => setOrderData({...orderData, subtotal: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total (AED)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={orderData.total}
                    onChange={(e) => setOrderData({...orderData, total: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Address
                </label>
                <textarea
                  value={orderData.address}
                  onChange={(e) => setOrderData({...orderData, address: e.target.value})}
                  rows={3}
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
                      Confirmation Title
                    </label>
                    <input
                      type="text"
                      value={templateContent.title}
                      onChange={(e) => setTemplateContent({...templateContent, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Order confirmation title"
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
                      placeholder="Main message (use {customerName} for dynamic name)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Order Message
                    </label>
                    <textarea
                      value={templateContent.orderMessage}
                      onChange={(e) => setTemplateContent({...templateContent, orderMessage: e.target.value})}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Order processing message (use {orderNumber} for dynamic order number)"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Order Details Title
                      </label>
                      <input
                        type="text"
                        value={templateContent.orderDetailsTitle}
                        onChange={(e) => setTemplateContent({...templateContent, orderDetailsTitle: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Order details section title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Delivery Title
                      </label>
                      <input
                        type="text"
                        value={templateContent.deliveryTitle}
                        onChange={(e) => setTemplateContent({...templateContent, deliveryTitle: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Delivery section title"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Button Text
                      </label>
                      <input
                        type="text"
                        value={templateContent.buttonText}
                        onChange={(e) => setTemplateContent({...templateContent, buttonText: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Button text"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Button URL
                      </label>
                      <input
                        type="url"
                        value={templateContent.buttonUrl}
                        onChange={(e) => setTemplateContent({...templateContent, buttonUrl: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Button URL"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Support Message
                    </label>
                    <input
                      type="text"
                      value={templateContent.supportMessage}
                      onChange={(e) => setTemplateContent({...templateContent, supportMessage: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Support contact message"
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
                    <span className="text-sm text-gray-600 ml-2">Order Confirmation #{orderData.orderNumber}</span>
                  </div>
                </div>
                <div 
                  className="p-4 bg-white max-h-96 overflow-y-auto"
                  dangerouslySetInnerHTML={{ __html: generateOrderConfirmationEmail(orderData, templateContent) }}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* HTML Source */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">HTML Source Code</h3>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
            <code>{generateOrderConfirmationEmail(orderData, templateContent)}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}
