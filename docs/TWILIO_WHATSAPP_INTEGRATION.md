# Twilio WhatsApp Integration Guide

This guide explains how to set up and configure WhatsApp Business messaging for GENOSYS using Twilio.

## Overview

The integration sends automated WhatsApp messages for:
- ✅ Order confirmations
- 🚚 Shipping notifications
- 🎉 Delivery confirmations
- ❌ Order cancellations
- 💳 Payment confirmations
- 👋 Welcome messages (optional)
- 🔔 Back in stock alerts (optional)
- 🛒 Abandoned cart reminders (optional)

## Prerequisites

1. **Twilio Account** - Create at https://www.twilio.com/try-twilio
2. **WhatsApp Business Profile** - Apply via Twilio Console
3. **Phone Number** - Get a Twilio phone number enabled for WhatsApp
4. **Message Templates** - Create and get approved templates for business messages

## Setup Steps

### Step 1: Create Twilio Account

1. Go to https://www.twilio.com/try-twilio
2. Create a new account
3. Verify your phone number and email
4. Note your **Account SID** and **Auth Token** from the Console Dashboard

### Step 2: Enable WhatsApp

1. In Twilio Console, go to **Messaging** → **Try it out** → **Send a WhatsApp message**
2. For production, go to **Messaging** → **Senders** → **WhatsApp senders**
3. Apply for a WhatsApp Business Profile
4. Once approved, you'll get a WhatsApp-enabled phone number

### Step 3: Create Message Templates

WhatsApp requires pre-approved templates for business-initiated messages. Go to **Messaging** → **Content Template Builder** and create templates:

#### Template: Order Confirmation
```
Name: order_confirmation
Category: UTILITY
Language: en

Body:
✅ *Order Confirmed!*

Thank you for your order, {{1}}!

🛒 Order: #{{2}}
💰 Total: {{3}} AED
📦 Items: {{4}}

We'll notify you when your order ships.

Track your order: {{5}}

_GENOSYS Middle East_
```

#### Template: Order Shipped
```
Name: order_shipped
Category: UTILITY
Language: en

Body:
🚚 *Your Order is On the Way!*

Great news, {{1}}!

Order #{{2}} has been shipped.

📍 Delivering to: {{3}}
⏱️ Estimated delivery: {{4}}

Track your order: {{5}}

_GENOSYS Middle East_
```

#### Template: Order Delivered
```
Name: order_delivered
Category: UTILITY
Language: en

Body:
🎉 *Order Delivered!*

Hi {{1}},

Your order #{{2}} has been delivered!

We hope you love your GENOSYS products! ✨

Questions? Reply to this message or contact us.

_GENOSYS Middle East_
```

### Step 4: Configure Environment Variables

Add these to your `.env.local` or Vercel environment variables:

```env
# Twilio Configuration
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_WHATSAPP_NUMBER=+971XXXXXXXXX

# Optional: Twilio Content Template SIDs (for approved templates)
# If not set, fallback text messages will be used (sandbox mode)
TWILIO_TEMPLATE_ORDER_CONFIRMATION=HXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_TEMPLATE_ORDER_SHIPPED=HXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_TEMPLATE_ORDER_DELIVERED=HXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_TEMPLATE_ORDER_CANCELLED=HXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_TEMPLATE_PAYMENT_RECEIVED=HXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_TEMPLATE_ABANDONED_CART=HXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_TEMPLATE_BACK_IN_STOCK=HXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_TEMPLATE_WELCOME=HXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Internal API key for server-to-server calls
INTERNAL_API_KEY=your-secure-random-string
```

## Testing

### Sandbox Mode

For development, use Twilio's WhatsApp Sandbox:

1. Go to **Messaging** → **Try it out** → **Send a WhatsApp message**
2. Follow the instructions to join your sandbox
3. Note the sandbox number (typically starts with +1)
4. Use this number as `TWILIO_WHATSAPP_NUMBER`

In sandbox mode, users must first send a message to your sandbox number to opt-in.

### Test API Endpoint

Check if WhatsApp is configured:
```bash
curl https://genosys.ae/api/whatsapp/send
```

Response when configured:
```json
{
  "configured": true,
  "message": "WhatsApp integration is configured"
}
```

Response when not configured:
```json
{
  "configured": false,
  "message": "WhatsApp integration not configured - add Twilio credentials to environment"
}
```

### Send Test Message

```bash
curl -X POST https://genosys.ae/api/whatsapp/send \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_INTERNAL_API_KEY" \
  -d '{
    "phone": "+971501234567",
    "messageType": "order_confirmation",
    "variables": {
      "customerName": "Test User",
      "orderNumber": "TEST123",
      "total": "299.00",
      "itemCount": "3",
      "trackingUrl": "https://genosys.ae/track/TEST123"
    }
  }'
```

## How It Works

### Order Flow Integration

1. **New Order (COD)** - `app/api/checkout/route.ts`
   - Sends order confirmation WhatsApp after email

2. **Order Status Update** - `app/api/admin/orders/[id]/route.ts`
   - Sends status-specific WhatsApp when admin updates order

3. **Mobile Orders** - `app/api/mobile/orders/route.ts`
   - Same integration as COD checkout

### Message Types

| Type | Trigger | Template Vars |
|------|---------|---------------|
| `order_confirmation` | New order | customerName, orderNumber, total, itemCount, trackingUrl |
| `order_shipped` | Status → SHIPPED | customerName, orderNumber, emirate, estimatedDelivery, trackingUrl |
| `order_delivered` | Status → DELIVERED | customerName, orderNumber |
| `order_cancelled` | Status → CANCELLED | customerName, orderNumber, reason |
| `payment_received` | Status → PAID | customerName, orderNumber, total |

## File Structure

```
lib/
  twilio.ts                 # Main Twilio service library
  
app/api/whatsapp/
  send/route.ts             # Generic send endpoint
  order-status/route.ts     # Order status notifications
```

## Cost Estimation

| Message Type | Cost per Message (UAE) |
|--------------|----------------------|
| Utility (order updates) | ~$0.02-0.05 |
| Marketing | ~$0.05-0.15 |
| Service (user-initiated) | ~$0.005-0.01 |

**Estimated monthly cost for 1,000 orders:**
- 3 messages/order × 1,000 orders × $0.03 = ~$90/month

## Troubleshooting

### Common Issues

1. **"WhatsApp not configured"**
   - Check `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_WHATSAPP_NUMBER` are set

2. **"Invalid phone number"**
   - Phone must be in international format: +971XXXXXXXXX
   - The system auto-formats UAE numbers

3. **Message not delivered**
   - In sandbox, user must opt-in first
   - Check Twilio Console logs for errors

4. **Template not found**
   - Template SID must match Twilio Content Template
   - Without template SID, fallback text message is used

### Debug Logging

Check server logs for:
- `[TWILIO]` - Twilio library logs
- `[WHATSAPP_API]` - API endpoint logs
- `[WHATSAPP_ORDER]` - Order status logs

## Production Checklist

- [ ] Twilio account verified and upgraded
- [ ] WhatsApp Business Profile approved
- [ ] Phone number enabled for WhatsApp
- [ ] Message templates created and approved
- [ ] Environment variables set in Vercel
- [ ] Internal API key secured
- [ ] Test messages sent successfully
- [ ] Error handling verified

## Future Enhancements

1. **User Preferences** - Let users opt-in/out of WhatsApp notifications
2. **Arabic Templates** - Create Arabic language templates
3. **Russian Templates** - Create Russian language templates
4. **Two-way Chat** - Handle incoming customer messages
5. **Rich Media** - Send product images in messages
6. **Quick Replies** - Add interactive buttons
