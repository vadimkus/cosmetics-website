import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const invoiceData = await request.json()
    
    const {
      orderNumber,
      customerEmail,
      customerName,
      customerPhone,
      customerAddress,
      emirate,
      items,
      subtotal,
      shippingCost,
      vatAmount,
      total
    } = invoiceData

    // Generate HTML invoice
    const invoiceHtml = generateInvoiceHTML({
      orderNumber,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      emirate,
      items,
      subtotal,
      shippingCost,
      vatAmount,
      total
    })

    // Send email with invoice
    const result = await sendEmail(
      customerEmail,
      `Invoice ${orderNumber} - GENOSYS Professional`,
      invoiceHtml
    )

    if (!result.success) {
      throw new Error(result.error || 'Failed to send email')
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Invoice generated and sent successfully' 
    })

  } catch (error) {
    console.error('Error generating invoice:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to generate invoice' },
      { status: 500 }
    )
  }
}

function generateInvoiceHTML(data: any) {
  const {
    orderNumber,
    customerName,
    customerEmail,
    customerPhone,
    customerAddress,
    emirate,
    items,
    subtotal,
    shippingCost,
    vatAmount,
    total
  } = data

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice ${orderNumber}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .invoice-container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #e5e5e5; padding-bottom: 20px; }
        .logo { margin-bottom: 15px; }
        .logo img { max-width: 200px; height: auto; }
        .invoice-title { font-size: 28px; color: #1f2937; margin: 0; }
        .invoice-number { font-size: 16px; color: #6b7280; margin-top: 5px; }
        .customer-info, .order-details { margin-bottom: 30px; }
        .section-title { font-size: 18px; font-weight: bold; color: #1f2937; margin-bottom: 15px; border-bottom: 1px solid #e5e5e5; padding-bottom: 5px; }
        .info-row { display: flex; margin-bottom: 8px; }
        .info-label { font-weight: bold; width: 120px; color: #374151; }
        .info-value { color: #6b7280; }
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .items-table th, .items-table td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e5e5; }
        .items-table th { background-color: #f9fafb; font-weight: bold; color: #374151; }
        .items-table td { color: #6b7280; }
        .total-section { background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-top: 20px; }
        .total-row { display: flex; justify-content: space-between; margin-bottom: 12px; }
        .total-label { font-weight: bold; color: #374151; }
        .total-value { color: #6b7280; }
        .grand-total { font-size: 18px; font-weight: bold; color: #000000; border-top: 2px solid #e5e5e5; padding-top: 10px; margin-top: 10px; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e5e5; color: #000000; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="header">
          <div class="logo">
            <img src="https://genosys.ae/_next/image?url=%2Fimages%2Fgenosys-logo.png%3Fv%3D1758554698129&w=828&q=75" alt="GENOSYS Logo" />
          </div>
          <h1 class="invoice-title">TAX INVOICE #${orderNumber.replace('GEN', '')} dated: ${new Date().toLocaleDateString('en-AE', { timeZone: 'Asia/Dubai', year: 'numeric', month: '2-digit', day: '2-digit' })}</h1>
        </div>

        <div class="customer-info">
          <h2 class="section-title">Customer Information</h2>
          <div class="info-row">
            <span class="info-label">Name:</span>
            <span class="info-value">${customerName}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Email:</span>
            <span class="info-value">${customerEmail}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Phone:</span>
            <span class="info-value">${customerPhone || 'N/A'}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Address:</span>
            <span class="info-value">${customerAddress || 'N/A'}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Emirate:</span>
            <span class="info-value">${emirate}</span>
          </div>
        </div>

        <div class="order-details">
          <h2 class="section-title">Order Details</h2>
          <table class="items-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${items.map((item: any) => `
                <tr>
                  <td><a href="https://genosys.ae/products/${item.id || item.name.toLowerCase().replace(/\s+/g, '-')}" style="color: #2563eb; text-decoration: none;">${item.name}</a></td>
                  <td>AED ${item.price.toFixed(2)}</td>
                  <td>${item.quantity}</td>
                  <td>AED ${item.total.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="total-section">
          <div class="total-row">
            <span class="total-label">Subtotal:</span>
            <span class="total-value">AED ${subtotal.toFixed(2)}</span>
          </div>
          <div class="total-row">
            <span class="total-label">Shipping to ${emirate}:</span>
            <span class="total-value">${shippingCost === 0 ? 'FREE' : `AED ${shippingCost.toFixed(2)}`}</span>
          </div>
          <div class="total-row">
            <span class="total-label">VAT (5%):</span>
            <span class="total-value">AED ${vatAmount.toFixed(2)}</span>
          </div>
          <div class="total-row grand-total">
            <span class="total-label">Total:</span>
            <span class="total-value">AED ${total.toFixed(2)}</span>
          </div>
        </div>

        <div class="footer">
          <div style="text-align: center; margin-bottom: 15px; background-color: white; padding: 16px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <img src="https://genosys.ae/_next/image?url=%2Fimages%2FFull.avif%3Fv%3D${Date.now()}&w=640&q=75" alt="GENOSYS Logo" style="max-width: 200px; height: auto;" />
          </div>
          <p>Official Distributor in the UAE</p>
          <p>© 2025 Genosys Middle East FZ-LLC. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `
}
