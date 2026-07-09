/**
 * Post-delivery review request — "How was your order?"
 *
 * Sent ~5 days after DELIVERED by /api/cron/review-requests. Lists the
 * products from the order that the customer hasn't reviewed yet, each with
 * a direct "Rate this product" link, and pitches the +50 GENOSYS Rewards
 * points per review. Apple-clean styling to match the email suite.
 */
import { SITE_URL } from '@/lib/siteConfig'
import { LOGO_URL, renderEmailFooter } from './utils'
import { sendEmail } from './transporter'

const FONT_TEXT = `-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif`
const FONT_DISPLAY = `-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif`

export interface ReviewRequestProduct {
  /** Canonical PDP slug (productNumber when set, else the product id). */
  slug: string
  name: string
  image?: string | null
}

export interface ReviewRequestEmailData {
  customerName: string
  customerEmail: string
  orderNumber: string
  products: ReviewRequestProduct[]
}

function productRow(p: ReviewRequestProduct): string {
  const url = `${SITE_URL}/products/${p.slug}#reviews`
  const img = p.image
    ? `<img src="${p.image.startsWith('http') ? p.image : `${SITE_URL}${p.image}`}" alt="" width="56" height="56" style="display: block; width: 56px; height: 56px; object-fit: cover; border-radius: 12px; background-color: #f5f5f7;" />`
    : `<div style="width: 56px; height: 56px; border-radius: 12px; background-color: #f5f5f7;"></div>`
  return `
    <tr>
      <td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f2;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
          <tr>
            <td width="56" style="vertical-align: middle;">${img}</td>
            <td style="vertical-align: middle; padding: 0 14px;">
              <span style="font-family: ${FONT_TEXT}; font-size: 14px; font-weight: 600; color: #1d1d1f; line-height: 1.35;">${p.name}</span>
            </td>
            <td width="130" style="vertical-align: middle; text-align: right;">
              <a href="${url}" style="display: inline-block; background-color: #1d1d1f; color: #ffffff; font-family: ${FONT_TEXT}; font-size: 12px; font-weight: 600; text-decoration: none; padding: 9px 14px; border-radius: 980px; white-space: nowrap;">
                Rate · +50 pts
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `
}

export const sendReviewRequestEmail = async (data: ReviewRequestEmailData) => {
  const firstName = data.customerName.split(' ')[0] || data.customerName
  const rows = data.products.map(productRow).join('')
  const totalPoints = data.products.length * 50

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>How was your order?</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #ffffff; -webkit-font-smoothing: antialiased;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #ffffff;">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 580px;">
              <tr>
                <td style="text-align: center; padding-bottom: 48px;">
                  <img src="${LOGO_URL}" alt="GENOSYS" style="height: 32px; width: auto;" />
                </td>
              </tr>
              <tr>
                <td style="text-align: center; padding-bottom: 12px;">
                  <h1 style="margin: 0; font-family: ${FONT_DISPLAY}; font-size: 28px; font-weight: 600; color: #1d1d1f; letter-spacing: -0.02em;">
                    How was your order?
                  </h1>
                </td>
              </tr>
              <tr>
                <td style="font-family: ${FONT_TEXT}; font-size: 17px; line-height: 1.5; color: #1d1d1f; text-align: center; padding-bottom: 8px;">
                  Hi ${firstName}, we hope you're enjoying your GENOSYS products from order ${data.orderNumber}.
                </td>
              </tr>
              <tr>
                <td style="font-family: ${FONT_TEXT}; font-size: 15px; line-height: 1.5; color: #86868b; text-align: center; padding-bottom: 28px;">
                  Share a quick review and earn <strong style="color: #1d1d1f;">50 GENOSYS Rewards points per product</strong> — that's up to ${totalPoints} points (AED ${(totalPoints * 0.05).toFixed(0)} off your next order).
                </td>
              </tr>
              <tr>
                <td style="padding-bottom: 28px;">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #fbfbfd; border-radius: 16px; overflow: hidden;">
                    ${rows}
                  </table>
                </td>
              </tr>
              <tr>
                <td style="font-family: ${FONT_TEXT}; font-size: 13px; line-height: 1.6; color: #86868b; text-align: center; padding-bottom: 32px;">
                  Points are credited instantly after your review is published. One review bonus per product.
                </td>
              </tr>
              ${renderEmailFooter('en')}
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `

  return sendEmail(
    data.customerEmail,
    `How was your order? Earn ${totalPoints} GENOSYS Rewards points`,
    html
  )
}
