/**
 * One-off email to Viktoria Ezugbaia (vika.ezu@alcenza.ae):
 * welcome + order delivered to door + GENOSYS Rewards points.
 *
 * Order: GENCardM2607291561 · +630 pts · balance 630
 *
 * Run: npx tsx --env-file=.env.local scripts/send-viktoria-ezugbaia-welcome-delivered-20260729.ts
 */
import { prisma } from '../lib/prisma'
import { sendEmail } from '../lib/email/transporter'
import { LOGO_URL, renderEmailFooter } from '../lib/email/utils'
import { SITE_URL } from '../lib/siteConfig'

const EMAIL = 'vika.ezu@alcenza.ae'
const ORDER_NUMBER = 'GENCardM2607291561'
const POINTS = 630

const FONT_TEXT = `-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif`
const FONT_DISPLAY = `-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif`

async function main() {
  const order = await prisma.order.findUnique({
    where: { orderNumber: ORDER_NUMBER },
    include: { items: true },
  })
  if (!order) throw new Error(`Order not found: ${ORDER_NUMBER}`)
  if (order.customerEmail.toLowerCase() !== EMAIL) {
    throw new Error(`Order email mismatch: ${order.customerEmail}`)
  }

  const user = await prisma.user.findUnique({
    where: { email: EMAIL },
    select: { name: true, email: true, loyaltyPoints: true, memberTier: true },
  })
  if (!user) throw new Error(`User not found: ${EMAIL}`)

  const firstName = (user.name || order.customerName).trim().split(/\s+/)[0] || 'Viktoria'
  const balance = user.loyaltyPoints
  if (balance < POINTS) {
    throw new Error(`Expected balance >= ${POINTS}, got ${balance}`)
  }

  const productLines = order.items
    .filter((i) => !/delivery|shipping/i.test(i.productName))
    .map(
      (i) =>
        `<tr>
          <td style="font-family: ${FONT_TEXT}; font-size: 15px; color: #1d1d1f; padding: 10px 16px; border-bottom: 1px solid #f0f0f2;">
            ${i.productName}${i.quantity > 1 ? ` × ${i.quantity}` : ''}
          </td>
        </tr>`,
    )
    .join('')

  const subject = `Welcome to GENOSYS — your order ${ORDER_NUMBER} is delivered`
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
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
                    Welcome to GENOSYS
                  </h1>
                </td>
              </tr>
              <tr>
                <td style="font-family: ${FONT_TEXT}; font-size: 17px; line-height: 1.55; color: #1d1d1f; text-align: center; padding-bottom: 28px;">
                  Hi ${firstName}, thank you for joining us and for your first order.
                  Good news — it has been <strong>delivered to your door</strong>.
                </td>
              </tr>
              <tr>
                <td style="padding-bottom: 24px;">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #fbfbfd; border-radius: 16px; overflow: hidden;">
                    <tr>
                      <td style="padding: 20px 16px 8px; font-family: ${FONT_TEXT}; font-size: 13px; color: #86868b; text-align: center;">
                        Order #${ORDER_NUMBER} · Paid · Delivered
                      </td>
                    </tr>
                    ${productLines}
                    <tr>
                      <td style="padding: 14px 16px 20px; font-family: ${FONT_TEXT}; font-size: 15px; color: #1d1d1f; text-align: center;">
                        Total AED ${order.total.toFixed(2)}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding-bottom: 32px;">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #fbfbfd; border-radius: 16px;">
                    <tr>
                      <td style="text-align: center; padding: 24px 16px;">
                        <div style="font-family: ${FONT_TEXT}; font-size: 14px; color: #86868b;">GENOSYS Rewards</div>
                        <div style="font-family: ${FONT_DISPLAY}; font-size: 32px; font-weight: 600; color: #1d1d1f; margin-top: 4px;">
                          +${POINTS.toLocaleString('en-US')} points
                        </div>
                        <div style="font-family: ${FONT_TEXT}; font-size: 14px; color: #86868b; margin-top: 8px;">
                          Balance: ${balance.toLocaleString('en-US')} pts · Member
                        </div>
                        <div style="font-family: ${FONT_TEXT}; font-size: 13px; color: #86868b; margin-top: 6px;">
                          Earned on your products (Camel cushion + serum). Delivery does not earn points.
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="font-family: ${FONT_TEXT}; font-size: 15px; line-height: 1.55; color: #1d1d1f; text-align: center; padding-bottom: 28px;">
                  Your account is ready at <a href="${SITE_URL}" style="color: #0071e3; text-decoration: none;">genosys.ae</a>
                  — same login as the app: <strong>${EMAIL}</strong>.
                  We hope you enjoy your GENOSYS products.
                </td>
              </tr>
              <tr>
                <td style="text-align: center; padding-bottom: 48px;">
                  <a href="${SITE_URL}/profile" style="display: inline-block; background-color: #0071e3; color: #ffffff; font-family: ${FONT_TEXT}; font-size: 17px; font-weight: 500; text-decoration: none; padding: 12px 24px; border-radius: 980px;">
                    View My Rewards
                  </a>
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

  console.log('Sending one-off email to', EMAIL, '…')
  const result = await sendEmail(EMAIL, subject, html)
  console.log(JSON.stringify(result, null, 2))
  if (!result.success) process.exit(1)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
