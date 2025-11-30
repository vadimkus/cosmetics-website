'use client'

import { useState, useEffect } from 'react'
import { RefreshCw } from 'lucide-react'

interface OrderItem {
  productName: string
  quantity: number
  price: number
  image?: string
  color?: string
  size?: string
}

interface TemplateData {
  orderNumber: string
  customerName: string
  status: string
  items: OrderItem[]
  total: number
}

interface StatusMessage {
  [key: string]: string
}

export default function CustomerConfirmationPage() {
  const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.origin
    }
    return 'https://genosys.ae'
  }

  const [templateData, setTemplateData] = useState<TemplateData>(() => {
    const initialBaseUrl = getBaseUrl()
    return {
      orderNumber: 'ORD-2024-001',
      customerName: 'John Doe',
      status: 'DELIVERED',
      items: [
        {
          productName: 'GENOSYS SKIN CARING BLEMISH BALM CUSHION [SPF 50+ PA++++]',
          quantity: 2,
          price: 150.00,
          image: `${initialBaseUrl}/images/CUSHC.png`,
          color: 'Beige',
          size: 'Medium'
        },
        {
          productName: 'GENOSYS MOISTURE REPLENISHING HYALURON SERUM',
          quantity: 1,
          price: 156.75,
          image: `${initialBaseUrl}/images/HRS.jpg`
        }
      ],
      total: 456.75
    }
  })

  const [statusMessages, setStatusMessages] = useState<StatusMessage>({
    'PROCESSING': 'Your order is being processed and prepared for shipment.',
    'CONFIRMED': 'Your order has been confirmed and is being prepared.',
    'PAID': 'Your order payment has been confirmed.',
    'SHIPPED': 'Great news! Your order has been shipped and is on its way to you.',
    'DELIVERED': 'We appreciate your placing the order with us! ❤️<br>Order {orderNumber} has been delivered successfully!',
    'CANCELLED': 'Your order has been cancelled as requested.'
  })

  const fixImageUrl = (imageUrl: string | undefined): string => {
    const currentBaseUrl = getBaseUrl()
    
    if (!imageUrl || !imageUrl.trim()) {
      return `${currentBaseUrl}/images/genosys-logo.png`
    }
    
    const trimmedUrl = imageUrl.trim()
    
    // If it's a Next.js optimized image URL, extract the original path
    if (trimmedUrl.includes('_next/image')) {
      const urlMatch = trimmedUrl.match(/url=([^&]+)/)
      if (urlMatch && urlMatch[1]) {
        try {
          const decodedPath = decodeURIComponent(urlMatch[1])
          const parts = decodedPath.split('?')
          const cleanPath = (parts[0] || '').split('&')[0] || ''
          const normalizedPath = cleanPath.startsWith('/') ? cleanPath : '/' + cleanPath
          return `${currentBaseUrl}${normalizedPath}`
        } catch (e) {
          console.error('Failed to decode Next.js image URL:', trimmedUrl, e)
          return `${currentBaseUrl}/images/genosys-logo.png`
        }
      }
      return `${currentBaseUrl}/images/genosys-logo.png`
    }
    
    // If it's already an absolute URL (http/https), use it directly (same as logo pattern)
    if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
      // Remove query parameters for clean URL
      const parts = trimmedUrl.split('?')
      const cleanUrl = (parts[0] || '').split('&')[0] || trimmedUrl
      // Keep localhost as http, but convert other http to https
      if (cleanUrl.startsWith('http://') && !cleanUrl.includes('localhost')) {
        return cleanUrl.replace('http://', 'https://')
      }
      return cleanUrl
    }
    
    // If it's a local/relative path, make it absolute (same as logo: /Logo/upLOGO.png -> /images/CUSHC.png)
    const parts = trimmedUrl.split('?')
    const cleanPath = (parts[0] || '').split('&')[0] || trimmedUrl
    const normalizedPath = cleanPath.startsWith('/') ? cleanPath : '/' + cleanPath
    return `${currentBaseUrl}${normalizedPath}`
  }

  const generateEmailHTML = () => {
    const orderId = templateData.orderNumber
    
    // Get status message and replace {orderNumber} placeholder if present
    let statusMessage = statusMessages[templateData.status.toUpperCase()] || 'Your order status has been updated.'
    statusMessage = statusMessage.replace(/{orderNumber}/g, orderId)

    // Generate items HTML
    let itemsHTML = ''
    if (templateData.items && templateData.items.length > 0) {
      const itemsList = templateData.items.map(item => {
        const imageUrl = fixImageUrl(item.image)
        const fallbackUrl = `${getBaseUrl()}/images/genosys-logo.png`
        const itemTotal = (item.price * item.quantity).toFixed(2)
        const variantInfo = [item.size, item.color].filter(Boolean).join(' • ')
        
        // Debug logging
        console.log('Product image processing:', {
          original: item.image,
          fixed: imageUrl,
          productName: item.productName
        })

        return `
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td width="80" style="padding-right: 12px; vertical-align: top;">
                    <img src="${imageUrl}" alt="${item.productName.replace(/"/g, '&quot;')}" width="80" height="80" style="width: 80px; height: 80px; object-fit: cover; border-radius: 6px; display: block; border: 1px solid #e5e7eb; max-width: 80px;" onerror="console.error('Image failed to load:', '${imageUrl}'); this.onerror=null; this.src='${fallbackUrl}';" />
                  </td>
                  <td style="vertical-align: top;">
                    <p style="color: #374151; font-size: 12px; font-weight: 500; margin: 0 0 4px 0; line-height: 1.4;">${item.productName}</p>
                    ${variantInfo ? `<p style="color: #6b7280; font-size: 12px; margin: 0 0 4px 0;">${variantInfo}</p>` : ''}
                    <p style="color: #6b7280; font-size: 12px; margin: 0;">Qty: ${item.quantity} × AED ${item.price.toFixed(2)}</p>
                  </td>
                  <td style="text-align: right; vertical-align: top; padding-left: 12px;">
                    <p style="color: #374151; font-size: 12px; font-weight: 600; margin: 0; white-space: nowrap;">${itemTotal} AED</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        `
      }).join('')

      // Calculate subtotal from all items
      const subtotal = templateData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      // Calculate VAT (5% of VAT-inclusive amount: VAT = amount * (5/105))
      const vat = subtotal * (5 / 105)
      
      itemsHTML = `
        <div style="margin: 25px 0;">
          <h3 style="color: #374151; font-size: 16px; font-weight: 600; margin: 0 0 15px 0;">Order Items</h3>
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #f9fafb; border-radius: 8px; padding: 15px;">
            ${itemsList}
            ${templateData.total ? `
              <tr>
                <td style="padding-top: 15px; border-top: 2px solid #e5e7eb;">
                  <table cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                      <td style="text-align: right;">
                        <p style="color: #374151; font-size: 12px; margin: 0 0 6px 0;">Subtotal: AED ${subtotal.toFixed(2)}</p>
                        <p style="color: #374151; font-size: 12px; margin: 0 0 6px 0;">VAT (5%): AED ${vat.toFixed(2)}</p>
                        <p style="color: #374151; font-size: 14px; font-weight: 600; margin: 0;">Total: AED ${templateData.total.toFixed(2)}</p>
                        <p style="color: #6b7280; font-size: 11px; margin: 4px 0 0 0; font-style: italic;">*All prices are VAT inclusive (5%)</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            ` : ''}
          </table>
        </div>
      `
    }

    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 4px solid #dc2626; background: #ffffff; box-shadow: 0 0 0 2px #ffffff, 0 0 0 6px #dc2626;">
        <div style="text-align: center; margin-bottom: 15px; position: relative;">
          <h1 style="color: #dc2626; margin: 0;">Genosys Middle East FZ-LLC</h1>
          <p style="color: #666; margin: 5px 0 0 0; font-size: 12px; padding-left: 3.2em;">United Arab Emirates ❤️</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 10px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
          <p style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0 0 12px 0;">
            Dear ${templateData.customerName},
          </p>
          
          <p style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
            Hope you are doing well. Today is the special day!
          </p>
          
          <p style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
            ${statusMessage}
          </p>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 12px 0;">
            <p style="color: #374151; margin: 0 0 10px 0; font-size: 13px;"><strong>Order Number:</strong> ${orderId}</p>
            <p style="color: #374151; margin: 0 0 10px 0; font-size: 13px;"><strong>Status:</strong> <span style="color: #dc2626; font-weight: bold;">${templateData.status.toUpperCase()}</span></p>
            <p style="color: #374151; margin: 0; font-size: 13px;"><strong>Date:</strong> ${new Date().toLocaleString('en-AE', { timeZone: 'Asia/Dubai' })}</p>
          </div>
          
          ${itemsHTML}
          
          <div style="margin: 25px 0 0 0; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #374151; font-size: 13px; line-height: 1.6; margin: 0 0 12px 0;">
              If you have any questions about your order, please contact us now via <a href="https://wa.me/971585487665" style="color: #dc2626; text-decoration: none;">+971 58 548 76 65</a> (WhatsApp).
            </p>
            
            <p style="color: #374151; font-size: 13px; line-height: 1.6; margin: 0;">
              You can view your order status on our website: <a href="https://www.genosys.ae/profile" style="color: #dc2626; text-decoration: none;">www.genosys.ae/profile</a>
            </p>
          </div>
        </div>
        
        <!-- Footer Section -->
        <div style="border-top: 1px solid #e5e7eb; padding-top: 30px; margin-top: 30px;">
          <!-- Social Media Icons -->
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="border-top: 1px solid #e5e7eb; margin-bottom: 20px;"></div>
            <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 0 auto;">
              <tr>
                <td style="padding: 0 12px; text-align: center;">
                  <a href="https://www.instagram.com/genosys.uae/" style="text-decoration: none; display: inline-block;">
                    <img src="${getBaseUrl()}/Logo/insta.png" alt="Instagram" width="34" height="34" style="max-width: 34px; height: auto; display: block; margin: 0 auto;" border="0" />
                    <p style="color: #374151; font-size: 11px; margin: 6px 0 0 0; text-align: center;">Insta</p>
                  </a>
                </td>
                <td style="padding: 0 12px; text-align: center;">
                  <a href="https://wa.me/971585487665?text=${encodeURIComponent(`Hi! I need help with my order ${orderId}. Can you assist me?`)}" style="text-decoration: none; display: inline-block;">
                    <img src="${getBaseUrl()}/Logo/wa.png" alt="WhatsApp" width="34" height="34" style="max-width: 34px; height: auto; display: block; margin: 0 auto;" border="0" />
                    <p style="color: #374151; font-size: 11px; margin: 6px 0 0 0; text-align: center;">WA</p>
                  </a>
                </td>
                <td style="padding: 0 12px; text-align: center;">
                  <a href="https://www.facebook.com/genosys.ae" style="text-decoration: none; display: inline-block;">
                    <img src="${getBaseUrl()}/Logo/fb.png" alt="Facebook" width="34" height="34" style="max-width: 34px; height: auto; display: block; margin: 0 auto;" border="0" />
                    <p style="color: #374151; font-size: 9px; margin: 4px 0 0 0; text-align: center;">FB</p>
                  </a>
                </td>
              </tr>
            </table>
            <div style="border-top: 1px solid #e5e7eb; margin-top: 20px;"></div>
          </div>
          
          <!-- Company Overview -->
          <div style="text-align: center; margin-bottom: 20px;">
            <p style="color: #374151; font-size: 13px; line-height: 1.6; margin: 0;">
              Genosys Middle East FZ-LLC is the official distributor of GENOSYS professional Korean dermacosmetics in the United Arab Emirates.
            </p>
          </div>
          
          <!-- Two Column Footer -->
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto;">
            <tr>
              <!-- Left Column: Customer Service -->
              <td width="50%" style="padding-right: 20px; vertical-align: top;">
                <p style="color: #374151; font-size: 13px; font-weight: 600; margin: 0 0 8px 0;">Customer Service</p>
                <p style="color: #374151; font-size: 12px; line-height: 1.6; margin: 0 0 4px 0;">
                  Call us: <a href="tel:+971585487665" style="color: #374151; text-decoration: none;">+971 58 548 76 65</a>
                </p>
                <p style="color: #374151; font-size: 12px; line-height: 1.6; margin: 0 0 4px 0;">
                  Email us: <a href="mailto:sales@genosys.ae" style="color: #374151; text-decoration: none;">sales@genosys.ae</a>
                </p>
                <p style="color: #374151; font-size: 12px; line-height: 1.6; margin: 0;">
                  Monday to Sunday 9:00 - 21:00
                </p>
              </td>
              
              <!-- Right Column: Business Location -->
              <td width="50%" style="padding-left: 20px; vertical-align: top;">
                <p style="color: #374151; font-size: 13px; font-weight: 600; margin: 0 0 8px 0;">Business Location</p>
                <p style="color: #374151; font-size: 12px; line-height: 1.6; margin: 0 0 4px 0;">
                  Cordoba Residence Villa E02
                </p>
                <p style="color: #374151; font-size: 12px; line-height: 1.6; margin: 0 0 4px 0;">
                  Dubai, United Arab Emirates
                </p>
                <p style="color: #374151; font-size: 12px; line-height: 1.6; margin: 0;">
                  <a href="https://maps.app.goo.gl/ZBxVoXdTNvECFwNw5" style="color: #374151; text-decoration: underline;">Location Map</a>
                </p>
              </td>
            </tr>
          </table>
          
          <!-- Company Copyright -->
          <div style="text-align: center; margin-top: 25px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <div style="margin-bottom: 15px;">
              <img src="${getBaseUrl()}/Logo/upLOGO.png" alt="GENOSYS Logo" width="180" height="54" style="max-width: 180px; height: auto; display: block; margin: 0 auto;" border="0" />
            </div>
            <p style="color: #6b7280; font-size: 11px; line-height: 1.5; margin: 0;">
              © 2026 Genosys Middle East FZ-LLC. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    `
  }

  const [emailHTML, setEmailHTML] = useState('')

  useEffect(() => {
    setEmailHTML(generateEmailHTML())
  }, [templateData, statusMessages])

  const updateItem = (index: number, field: keyof OrderItem, value: string | number) => {
    const newItems = [...templateData.items]
    const currentItem = newItems[index]
    newItems[index] = { 
      ...currentItem,
      [field]: value 
    } as OrderItem
    setTemplateData({ ...templateData, items: newItems })
  }

  const addItem = () => {
    setTemplateData({
      ...templateData,
      items: [...templateData.items, { productName: '', quantity: 1, price: 0 }]
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
        <h1 className="text-3xl font-bold mb-6">Customer Email Template Editor</h1>
        
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
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={templateData.status}
                  onChange={(e) => setTemplateData({ ...templateData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="PAID">PAID</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
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
                          value={item.productName}
                          onChange={(e) => updateItem(index, 'productName', e.target.value)}
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
                        <input
                          type="text"
                          placeholder="Image URL (must be absolute HTTPS URL, e.g., https://genosys.ae/images/product.jpg)"
                          value={item.image || ''}
                          onChange={(e) => updateItem(index, 'image', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Note: For Gmail compatibility, images must be publicly accessible HTTPS URLs. Next.js optimized URLs will be automatically converted.
                        </p>
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

              <div>
                <label className="block text-sm font-medium mb-2">Status Messages</label>
                <div className="space-y-2">
                  {Object.entries(statusMessages).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-xs text-gray-600 mb-1">{key}</label>
                      <textarea
                        value={value}
                        onChange={(e) => setStatusMessages({ ...statusMessages, [key]: e.target.value })}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        rows={2}
                      />
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

