/**
 * GENOSYS Rewards — loyalty program emails.
 *
 * - Launch announcement (retail track): personal balance, tier, member number
 * - Partner recognition (professional track): partner status confirmation
 * - Points earned (transactional, on order DELIVERED)
 * - Tier upgrade (transactional)
 *
 * Apple-clean styling to match the rest of the email suite.
 */
import { SITE_URL } from '@/lib/siteConfig'
import { LOGO_URL, renderEmailFooter } from './utils'
import { sendEmail } from './transporter'

type Tier = 'MEMBER' | 'SILVER' | 'GOLD' | 'PLATINUM'

const TIER_STYLE: Record<Tier, { label: string; bg: string; color: string }> = {
  MEMBER: { label: 'Member', bg: '#f5f5f7', color: '#1d1d1f' },
  SILVER: { label: 'Silver', bg: '#e8e8ed', color: '#3a3a3c' },
  GOLD: { label: 'Gold', bg: '#faf3e3', color: '#8a6d1d' },
  PLATINUM: { label: 'Platinum', bg: '#1d1d1f', color: '#f5f5f7' },
}

const FONT_TEXT = `-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif`
const FONT_DISPLAY = `-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif`

function emailShell(title: string, inner: string, locale = 'en'): string {
  return `
    <!DOCTYPE html>
    <html lang="${locale}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
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
              ${inner}
              ${renderEmailFooter(locale)}
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}

function tierBadge(tier: Tier): string {
  const s = TIER_STYLE[tier]
  return `<span style="display: inline-block; background-color: ${s.bg}; color: ${s.color}; font-family: ${FONT_TEXT}; font-size: 14px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; padding: 6px 16px; border-radius: 980px;">${s.label}</span>`
}

function benefitsTable(): string {
  const rows: Array<[string, string, string]> = [
    ['Member', 'From your first order', '1 point per AED'],
    ['Silver', 'AED 1,000 lifetime spend', '1.25 points per AED + early access'],
    ['Gold', 'AED 5,000 lifetime spend', '1.5 points per AED + free shipping + birthday gift'],
    ['Platinum', 'AED 15,000 lifetime spend', '2 points per AED + exclusive gifts + first access'],
  ]
  const body = rows
    .map(
      ([t, req, perk]) => `
      <tr>
        <td style="font-family: ${FONT_TEXT}; font-size: 13px; font-weight: 600; color: #1d1d1f; padding: 10px 12px; border-bottom: 1px solid #f0f0f2; white-space: nowrap;">${t}</td>
        <td style="font-family: ${FONT_TEXT}; font-size: 13px; color: #86868b; padding: 10px 12px; border-bottom: 1px solid #f0f0f2;">${req}</td>
        <td style="font-family: ${FONT_TEXT}; font-size: 13px; color: #1d1d1f; padding: 10px 12px; border-bottom: 1px solid #f0f0f2;">${perk}</td>
      </tr>`
    )
    .join('')
  return `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #fbfbfd; border-radius: 16px; overflow: hidden; margin-bottom: 32px;">
      ${body}
    </table>
  `
}

export interface LoyaltyLaunchEmailData {
  customerName: string
  customerEmail: string
  memberNumber: string | null
  tier: Tier
  points: number
  welcomeBonus: number
  locale?: string
}

export const sendLoyaltyLaunchEmail = async (data: LoyaltyLaunchEmailData) => {
  const firstName = data.customerName.split(' ')[0] || data.customerName
  const inner = `
    <tr>
      <td style="text-align: center; padding-bottom: 16px;">
        ${tierBadge(data.tier)}
      </td>
    </tr>
    <tr>
      <td style="text-align: center; padding-bottom: 12px;">
        <h1 style="margin: 0; font-family: ${FONT_DISPLAY}; font-size: 28px; font-weight: 600; color: #1d1d1f; letter-spacing: -0.02em;">
          Introducing GENOSYS Rewards
        </h1>
      </td>
    </tr>
    <tr>
      <td style="font-family: ${FONT_TEXT}; font-size: 17px; line-height: 1.5; color: #1d1d1f; text-align: center; padding-bottom: 28px;">
        Hi ${firstName}, thank you for being part of GENOSYS. From today, every order earns you points — and your history with us already counts.
      </td>
    </tr>
    <tr>
      <td style="padding-bottom: 32px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #fbfbfd; border-radius: 16px;">
          <tr>
            <td style="text-align: center; padding: 28px 16px;">
              <div style="font-family: ${FONT_TEXT}; font-size: 14px; color: #86868b;">Your points balance</div>
              <div style="font-family: ${FONT_DISPLAY}; font-size: 40px; font-weight: 600; color: #1d1d1f; margin-top: 4px;">${data.points.toLocaleString('en-US')}</div>
              <div style="font-family: ${FONT_TEXT}; font-size: 13px; color: #34c759; margin-top: 6px;">includes your ${data.welcomeBonus}-point welcome bonus</div>
              ${data.memberNumber ? `<div style="font-family: ${FONT_TEXT}; font-size: 12px; color: #86868b; margin-top: 12px; letter-spacing: 0.06em;">MEMBER № ${data.memberNumber}</div>` : ''}
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="font-family: ${FONT_TEXT}; font-size: 15px; line-height: 1.6; color: #1d1d1f; padding-bottom: 20px;">
        <strong>How it works</strong><br/>
        Earn 1 point for every 1 AED you spend. 100 points = AED 5 off — and you can redeem them at checkout right now, on the website and in the app.
      </td>
    </tr>
    <tr>
      <td style="padding-bottom: 8px;">
        ${benefitsTable()}
      </td>
    </tr>
    <tr>
      <td style="font-family: ${FONT_TEXT}; font-size: 13px; line-height: 1.6; color: #86868b; text-align: center; padding-bottom: 32px;">
        Bonus: double points on every order during your birthday month.
      </td>
    </tr>
    <tr>
      <td style="text-align: center; padding-bottom: 48px;">
        <a href="${SITE_URL}/profile" style="display: inline-block; background-color: #0071e3; color: #ffffff; font-family: ${FONT_TEXT}; font-size: 17px; font-weight: 500; text-decoration: none; padding: 12px 24px; border-radius: 980px;">
          View My Rewards
        </a>
      </td>
    </tr>
  `
  return sendEmail(
    data.customerEmail,
    `Welcome to GENOSYS Rewards — you have ${data.points.toLocaleString('en-US')} points`,
    emailShell('GENOSYS Rewards', inner, data.locale || 'en'),
  )
}

export interface LoyaltyPartnerEmailData {
  customerName: string
  customerEmail: string
  discountPercentage: number
  locale?: string
}

export const sendLoyaltyPartnerLaunchEmail = async (data: LoyaltyPartnerEmailData) => {
  const firstName = data.customerName.split(' ')[0] || data.customerName
  const inner = `
    <tr>
      <td style="text-align: center; padding-bottom: 16px;">
        <span style="display: inline-block; background-color: #1d1d1f; color: #f5f5f7; font-family: ${FONT_TEXT}; font-size: 14px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; padding: 6px 16px; border-radius: 980px;">Professional Partner</span>
      </td>
    </tr>
    <tr>
      <td style="text-align: center; padding-bottom: 12px;">
        <h1 style="margin: 0; font-family: ${FONT_DISPLAY}; font-size: 28px; font-weight: 600; color: #1d1d1f; letter-spacing: -0.02em;">
          Your Partner Status
        </h1>
      </td>
    </tr>
    <tr>
      <td style="font-family: ${FONT_TEXT}; font-size: 17px; line-height: 1.5; color: #1d1d1f; text-align: center; padding-bottom: 28px;">
        Hi ${firstName}, today we are launching GENOSYS Rewards for retail customers — and we want to recognize you as one of our Professional Partners.
      </td>
    </tr>
    <tr>
      <td style="padding-bottom: 32px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #fbfbfd; border-radius: 16px;">
          <tr>
            <td style="text-align: center; padding: 28px 16px;">
              <div style="font-family: ${FONT_TEXT}; font-size: 14px; color: #86868b;">Your professional pricing</div>
              <div style="font-family: ${FONT_DISPLAY}; font-size: 40px; font-weight: 600; color: #1d1d1f; margin-top: 4px;">${data.discountPercentage}% off</div>
              <div style="font-family: ${FONT_TEXT}; font-size: 13px; color: #86868b; margin-top: 6px;">applied automatically to every order</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="font-family: ${FONT_TEXT}; font-size: 15px; line-height: 1.6; color: #1d1d1f; text-align: center; padding-bottom: 32px;">
        Your partner pricing already goes beyond what the rewards program offers, so your account stays on the professional track — nothing changes for you. Thank you for building with GENOSYS.
      </td>
    </tr>
    <tr>
      <td style="text-align: center; padding-bottom: 48px;">
        <a href="${SITE_URL}/products" style="display: inline-block; background-color: #0071e3; color: #ffffff; font-family: ${FONT_TEXT}; font-size: 17px; font-weight: 500; text-decoration: none; padding: 12px 24px; border-radius: 980px;">
          Shop Professional
        </a>
      </td>
    </tr>
  `
  return sendEmail(
    data.customerEmail,
    'GENOSYS Professional Partner — your status',
    emailShell('GENOSYS Professional Partner', inner, data.locale || 'en'),
  )
}

export interface LoyaltyPointsEarnedEmailData {
  customerName: string
  customerEmail: string
  orderNumber: string
  points: number
  balance: number
  tier: Tier
  locale?: string
}

export const sendLoyaltyPointsEarnedEmail = async (data: LoyaltyPointsEarnedEmailData) => {
  const firstName = data.customerName.split(' ')[0] || data.customerName
  const aedValue = (data.balance * 0.05).toFixed(0)
  const inner = `
    <tr>
      <td style="text-align: center; padding-bottom: 24px;">
        <div style="display: inline-block; width: 64px; height: 64px; background-color: #0071e3; border-radius: 50%; line-height: 64px; font-size: 30px; color: #ffffff;">+</div>
      </td>
    </tr>
    <tr>
      <td style="text-align: center; padding-bottom: 12px;">
        <h1 style="margin: 0; font-family: ${FONT_DISPLAY}; font-size: 28px; font-weight: 600; color: #1d1d1f; letter-spacing: -0.02em;">
          You earned ${data.points.toLocaleString('en-US')} points
        </h1>
      </td>
    </tr>
    <tr>
      <td style="text-align: center; padding-bottom: 32px;">
        <span style="font-family: ${FONT_TEXT}; font-size: 17px; color: #86868b;">Order #${data.orderNumber}</span>
      </td>
    </tr>
    <tr>
      <td style="font-family: ${FONT_TEXT}; font-size: 17px; line-height: 1.5; color: #1d1d1f; text-align: center; padding-bottom: 28px;">
        Hi ${firstName}, your delivered order just added points to your GENOSYS Rewards balance.
      </td>
    </tr>
    <tr>
      <td style="padding-bottom: 32px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #fbfbfd; border-radius: 16px;">
          <tr>
            <td style="text-align: center; padding: 24px 16px;">
              <div style="font-family: ${FONT_TEXT}; font-size: 14px; color: #86868b;">New balance</div>
              <div style="font-family: ${FONT_DISPLAY}; font-size: 36px; font-weight: 600; color: #1d1d1f; margin-top: 4px;">${data.balance.toLocaleString('en-US')} pts</div>
              <div style="font-family: ${FONT_TEXT}; font-size: 13px; color: #86868b; margin-top: 6px;">worth AED ${aedValue} · ${TIER_STYLE[data.tier].label} tier</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="text-align: center; padding-bottom: 48px;">
        <a href="${SITE_URL}/profile" style="display: inline-block; background-color: #0071e3; color: #ffffff; font-family: ${FONT_TEXT}; font-size: 17px; font-weight: 500; text-decoration: none; padding: 12px 24px; border-radius: 980px;">
          View My Rewards
        </a>
      </td>
    </tr>
  `
  return sendEmail(
    data.customerEmail,
    `+${data.points.toLocaleString('en-US')} GENOSYS Rewards points`,
    emailShell('Points Earned', inner, data.locale || 'en'),
  )
}

export interface LoyaltyTierUpgradeEmailData {
  customerName: string
  customerEmail: string
  tier: Tier
  balance: number
  locale?: string
}

export const sendLoyaltyTierUpgradeEmail = async (data: LoyaltyTierUpgradeEmailData) => {
  const firstName = data.customerName.split(' ')[0] || data.customerName
  const s = TIER_STYLE[data.tier]
  const perks: Record<Tier, string> = {
    MEMBER: 'Earn 1 point per AED on every order.',
    SILVER: 'You now earn 1.25 points per AED and get early access to promotions.',
    GOLD: 'You now earn 1.5 points per AED, enjoy free shipping on every order, and receive a birthday gift.',
    PLATINUM: 'You now earn 2 points per AED, with exclusive gifts and first access to new launches.',
  }
  const inner = `
    <tr>
      <td style="text-align: center; padding-bottom: 16px;">
        ${tierBadge(data.tier)}
      </td>
    </tr>
    <tr>
      <td style="text-align: center; padding-bottom: 12px;">
        <h1 style="margin: 0; font-family: ${FONT_DISPLAY}; font-size: 28px; font-weight: 600; color: #1d1d1f; letter-spacing: -0.02em;">
          Welcome to ${s.label}
        </h1>
      </td>
    </tr>
    <tr>
      <td style="font-family: ${FONT_TEXT}; font-size: 17px; line-height: 1.5; color: #1d1d1f; text-align: center; padding-bottom: 28px;">
        Congratulations ${firstName} — your loyalty just moved you up to the ${s.label} tier. ${perks[data.tier]}
      </td>
    </tr>
    <tr>
      <td style="padding-bottom: 32px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #fbfbfd; border-radius: 16px;">
          <tr>
            <td style="text-align: center; padding: 24px 16px;">
              <div style="font-family: ${FONT_TEXT}; font-size: 14px; color: #86868b;">Current balance</div>
              <div style="font-family: ${FONT_DISPLAY}; font-size: 36px; font-weight: 600; color: #1d1d1f; margin-top: 4px;">${data.balance.toLocaleString('en-US')} pts</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="text-align: center; padding-bottom: 48px;">
        <a href="${SITE_URL}/profile" style="display: inline-block; background-color: #0071e3; color: #ffffff; font-family: ${FONT_TEXT}; font-size: 17px; font-weight: 500; text-decoration: none; padding: 12px 24px; border-radius: 980px;">
          View My Rewards
        </a>
      </td>
    </tr>
  `
  return sendEmail(
    data.customerEmail,
    `You've reached GENOSYS ${s.label}`,
    emailShell('Tier Upgrade', inner, data.locale || 'en'),
  )
}
