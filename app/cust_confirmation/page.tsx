'use client'

import { useState, useEffect } from 'react'
import { RefreshCw } from 'lucide-react'

interface OrderItem {
  name: string
  quantity: number
  price: number
  total?: number
  color?: string
  size?: string
}

interface TemplateData {
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  emirate: string
  items: OrderItem[]
  subtotal: number
  shippingCost: number
  vatAmount: number
  total: number
}

export default function CustomerConfirmationPage() {
  const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.origin
    }
    return 'https://genosys.ae'
  }

  const [templateData, setTemplateData] = useState<TemplateData>(() => {
    return {
      orderNumber: 'SUP2511302701',
      customerName: 'John Doe',
      customerEmail: 'customer@example.com',
      customerPhone: '+971 50 123 4567',
      customerAddress: '123 Business Bay, Dubai Marina',
      emirate: 'Dubai',
      items: [
        {
          name: 'GENOSYS SKIN CARING BLEMISH BALM CUSHION [SPF 50+ PA++++]',
          quantity: 2,
          price: 150.00,
          total: 300.00,
          color: 'Beige',
          size: 'Medium'
        },
        {
          name: 'GENOSYS MOISTURE REPLENISHING HYALURON SERUM',
          quantity: 1,
          price: 156.75,
          total: 156.75
        }
      ],
      subtotal: 456.75,
      shippingCost: 45.00,
      vatAmount: 23.89,
      total: 525.64
    }
  })

  const generateEmailHTML = () => {
    const baseUrl = getBaseUrl()
    const productsUrl = `${baseUrl}/products`
    const contactUrl = `${baseUrl}/contact`
    const footerLogoUrl = `${baseUrl}/_next/image?url=%2FLogo%2FFull.png&w=640&q=75`

    const itemsHTML = templateData.items.map((item) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: left;">${item.name || 'Product'}${item.size ? ` (Size: ${item.size})` : ''}${item.color ? ` (Color: ${item.color})` : ''}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity || 0}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">AED ${(item.price || 0).toFixed(2)}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">AED ${(item.total || ((item.price || 0) * (item.quantity || 0))).toFixed(2)}</td>
                </tr>
    `).join('')

    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: white; font-size: 14px; direction: ltr;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #dc2626; margin: 0; font-size: 14px;">Genosys Middle East FZ-LLC</h1>
          <p style="color: #666; margin: 5px 0; font-size: 14px;">United Arab Emirates ❤️</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 10px; margin-bottom: 20px; border: 1px solid #e5e5e5;">
          <p style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0 0 10px 0; text-align: left;">
            Dear <strong>${(templateData.customerName || 'Customer').split(' ')[0]}</strong>,
          </p>
          <p style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0 0 10px 0; text-align: left;">
            Your order request has been submitted. Our support team will share a secure payment link shortly.
          </p>
          <p style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0; text-align: left;">
            Order Request <span style="color: #dc2626;">#${templateData.orderNumber || 'N/A'}</span>
          </p>
          </div>
          
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e5e5e5;">
          <h3 style="color: #dc2626; margin: 0 0 15px 0; font-size: 14px; text-align: left;">Customer Information</h3>
          <p style="margin: 0 0 8px 0; color: #374151; font-size: 14px; text-align: left;"><strong>Name:</strong> ${templateData.customerName || 'N/A'}</p>
          <p style="margin: 0 0 8px 0; color: #374151; font-size: 14px; text-align: left;"><strong>Email:</strong> ${templateData.customerEmail || 'N/A'}</p>
          <p style="margin: 0 0 8px 0; color: #374151; font-size: 14px; text-align: left;"><strong>Phone:</strong> ${templateData.customerPhone || 'N/A'}</p>
          <p style="margin: 0 0 8px 0; color: #374151; font-size: 14px; text-align: left;"><strong>Address:</strong> ${templateData.customerAddress || 'N/A'}</p>
          <p style="margin: 0; color: #374151; font-size: 14px; text-align: left;"><strong>Emirate:</strong> ${templateData.emirate || 'N/A'}</p>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e5e5e5;">
          <h3 style="color: #dc2626; margin: 0 0 15px 0; font-size: 14px; text-align: left;">Order Items</h3>
          <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
            <thead>
              <tr style="background: #dc2626; color: white;">
                <th style="padding: 10px; text-align: left; font-size: 14px;">Product</th>
                <th style="padding: 10px; text-align: center; font-size: 14px;">Qty</th>
                <th style="padding: 10px; text-align: right; font-size: 14px;">Price</th>
                <th style="padding: 10px; text-align: right; font-size: 14px;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
            </table>
        </div>

        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e5e5e5;">
          <h3 style="color: #dc2626; margin: 0 0 15px 0; font-size: 14px; text-align: left;">Order Summary</h3>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px; flex-direction: row;">
            <span style="color: #374151; font-size: 14px;">Subtotal:</span>
            <span style="color: #374151; font-size: 14px;">AED ${(templateData.subtotal || 0).toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px; flex-direction: row;">
            <span style="color: #374151; font-size: 14px;">Shipping to ${templateData.emirate || 'N/A'}:</span>
            <span style="color: #374151; font-size: 14px;">${(templateData.shippingCost || 0) === 0 ? 'FREE' : `AED ${(templateData.shippingCost || 0).toFixed(2)}`}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px; flex-direction: row;">
            <span style="color: #374151; font-size: 14px;">VAT (5%):</span>
            <span style="color: #374151; font-size: 14px;">AED ${(templateData.vatAmount || 0).toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 14px; color: #dc2626; border-top: 2px solid #dc2626; padding-top: 8px; flex-direction: row;">
            <span>Total:</span>
            <span>AED ${(templateData.total || 0).toFixed(2)}</span>
          </div>
          </div>
          
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${productsUrl}" 
             style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); 
                    color: white; 
                    padding: 12px 30px; 
                    text-decoration: none; 
                    border-radius: 6px; 
                    font-weight: bold; 
                    display: inline-block; 
                    margin-right: 10px;">
            Continue Shopping
          </a>
          <a href="${contactUrl}" 
             style="background: transparent; 
                    color: #16a34a; 
                    padding: 12px 30px; 
                    text-decoration: none; 
                    border: 2px solid #16a34a; 
                    border-radius: 6px; 
                    font-weight: bold; 
                    display: inline-block;">
            Contact Support via WhatsApp
          </a>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e5e5; color: #000000; font-size: 14px;">
          <div style="text-align: center; margin-bottom: 15px;">
            <img src="${footerLogoUrl}" alt="GENOSYS Logo" style="max-width: 200px; height: auto; display: block; margin: 0 auto;" />
          </div>
          <p style="color: #000000; margin: 0;">Official Distributor in the UAE</p>
          <p style="color: #000000; margin: 0;">© 2026 Genosys Middle East FZ-LLC. All rights reserved.</p>
        </div>
      </div>
    `
  }

  const [emailHTML, setEmailHTML] = useState('')

  useEffect(() => {
    setEmailHTML(generateEmailHTML())
  }, [templateData])

  const updateItem = (index: number, field: keyof OrderItem, value: string | number) => {
    const newItems = [...templateData.items]
    const currentItem = newItems[index]
    if (currentItem) {
      newItems[index] = { 
        ...currentItem, 
        [field]: value 
      }
    setTemplateData({ ...templateData, items: newItems })
    }
  }

  const addItem = () => {
    setTemplateData({
      ...templateData,
      items: [...templateData.items, { name: '', quantity: 1, price: 0 }]
    })
  }

  const removeItem = (index: number) => {
    setTemplateData({
      ...templateData,
      items: templateData.items.filter((_, i) => i !== index)
    })
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Order Confirmation Email Template (Support Link)</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor Panel */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Edit Template Data</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Order Number</label>
                <input
                  type="text"
                  value={templateData.orderNumber}
                  onChange={(e) => setTemplateData({ ...templateData, orderNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Customer Name</label>
                <input
                  type="text"
                  value={templateData.customerName}
                  onChange={(e) => setTemplateData({ ...templateData, customerName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Customer Email</label>
                <input
                  type="email"
                  value={templateData.customerEmail}
                  onChange={(e) => setTemplateData({ ...templateData, customerEmail: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Customer Phone</label>
                <input
                  type="text"
                  value={templateData.customerPhone}
                  onChange={(e) => setTemplateData({ ...templateData, customerPhone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <input
                  type="text"
                  value={templateData.customerAddress}
                  onChange={(e) => setTemplateData({ ...templateData, customerAddress: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Emirate</label>
                <input
                  type="text"
                  value={templateData.emirate}
                  onChange={(e) => setTemplateData({ ...templateData, emirate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Subtotal (AED)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={templateData.subtotal}
                    onChange={(e) => setTemplateData({ ...templateData, subtotal: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Shipping Cost (AED)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={templateData.shippingCost}
                    onChange={(e) => setTemplateData({ ...templateData, shippingCost: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">VAT Amount (AED)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={templateData.vatAmount}
                    onChange={(e) => setTemplateData({ ...templateData, vatAmount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Total (AED)</label>
                <input
                  type="number"
                  step="0.01"
                  value={templateData.total}
                  onChange={(e) => setTemplateData({ ...templateData, total: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium">Order Items</label>
                  <button
                    onClick={addItem}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    Add Item
                  </button>
                </div>
                <div className="space-y-3">
                  {templateData.items.map((item, index) => (
                    <div key={index} className="border border-gray-200 rounded p-3">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Item {index + 1}</span>
                        <button
                          onClick={() => removeItem(index)}
                          className="text-red-600 text-sm hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Product Name"
                          value={item.name}
                          onChange={(e) => updateItem(index, 'name', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="number"
                            placeholder="Quantity"
                            value={item.quantity}
                            onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                          <input
                            type="number"
                            step="0.01"
                            placeholder="Price"
                            value={item.price}
                            onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Size (optional)"
                            value={item.size || ''}
                            onChange={(e) => updateItem(index, 'size', e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Color (optional)"
                            value={item.color || ''}
                            onChange={(e) => updateItem(index, 'color', e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Email Preview</h2>
              <button
                onClick={() => setEmailHTML(generateEmailHTML())}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                title="Refresh Preview"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </button>
            </div>
            <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50 overflow-auto max-h-[800px]">
              <div dangerouslySetInnerHTML={{ __html: emailHTML }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
