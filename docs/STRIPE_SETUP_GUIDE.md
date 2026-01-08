# 🚀 Stripe Integration Setup Guide

## 📋 **Step-by-Step Setup Instructions**

### 1️⃣ **Stripe Account Setup**

1. **Create/Access Stripe Account:**
   - Go to [https://dashboard.stripe.com](https://dashboard.stripe.com)
   - Sign up or log into your existing account
   - Complete business verification (required for live payments)

2. **Get API Keys:**
   - Navigate to **Developers** → **API keys**
   - Copy your keys:
     - **Publishable key** (starts with `pk_test_` or `pk_live_`)
     - **Secret key** (starts with `sk_test_` or `sk_live_`)

3. **Enable Payment Methods:**
   - Go to **Settings** → **Payment methods**
   - Enable **Cards** (Visa, Mastercard, American Express)
   - Consider enabling local payment methods for UAE

### 2️⃣ **Environment Variables Setup**

Add these variables to your `.env.local` file:

```bash
# Stripe Configuration (Required for payments)
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here

# Stripe Webhook Secret (Required for webhook verification)
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Base URL for success/cancel redirects
NEXT_PUBLIC_BASE_URL=https://genosys.ae
# For development: NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3️⃣ **Vercel Environment Variables**

If deploying on Vercel, add these in your Vercel dashboard:

1. Go to **Project Settings** → **Environment Variables**
2. Add each variable:
   - `STRIPE_SECRET_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` 
   - `STRIPE_WEBHOOK_SECRET`
   - `NEXT_PUBLIC_BASE_URL`

### 4️⃣ **Webhook Setup (After Deployment)**

1. **Get Webhook Endpoint:**
   - Your webhook URL will be: `https://genosys.ae/api/webhooks/stripe`

2. **Create Webhook in Stripe:**
   - Go to **Developers** → **Webhooks**
   - Click **Add endpoint**
   - Enter your webhook URL
   - Select events to listen for:
     - `checkout.session.completed`
     - `payment_intent.succeeded` 
     - `payment_intent.payment_failed`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`

3. **Copy Webhook Secret:**
   - After creating, click on the webhook
   - Click **Reveal** under "Signing secret"
   - Copy the `whsec_` key to `STRIPE_WEBHOOK_SECRET`

### 5️⃣ **Testing Setup**

For development and testing:

```bash
# Test Mode Keys (Safe for development)
STRIPE_SECRET_KEY=sk_test_51...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Test Cards:**
- **Success:** `4242 4242 4242 4242`
- **Declined:** `4000 0000 0000 0002`
- **3D Secure:** `4000 0025 0000 3155`

### 6️⃣ **UAE-Specific Configuration**

Your integration includes:
- ✅ **Currency:** UAE Dirham (AED)
- ✅ **VAT:** 5% included in prices
- ✅ **Shipping:** Dubai (45 AED), Other Emirates (70 AED)
- ✅ **Free Shipping:** Orders above 1000 AED
- ✅ **Address Collection:** UAE addresses only
- ✅ **Multi-language:** Arabic and English support

---

## 🔧 **Configuration Features**

### **Automatic Features:**
- ✅ VAT calculation (5% included)
- ✅ Shipping cost calculation by Emirate
- ✅ Free shipping threshold (1000+ AED)
- ✅ Multi-language checkout (AR/EN)
- ✅ Order confirmation emails
- ✅ Admin notifications
- ✅ Webhook signature verification
- ✅ Payment status tracking

### **Payment Flow:**
1. Customer selects "Card Payment" option
2. Stripe Checkout opens with pre-filled details
3. Customer completes payment securely
4. Webhook confirms payment success
5. Order status updated to "PAID"
6. Confirmation emails sent automatically

---

## 🚨 **Important Security Notes**

### **Environment Variables:**
- ❌ **Never commit** `.env.local` to git
- ✅ **Use test keys** in development
- ✅ **Use live keys** only in production
- ✅ **Rotate keys** regularly for security

### **Webhook Security:**
- ✅ **Always verify** webhook signatures
- ✅ **Use HTTPS** for webhook endpoints
- ✅ **Handle duplicate** webhook events (idempotency)

### **Development vs Production:**
```bash
# Development (.env.local)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Production (Vercel Environment Variables)
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

---

## 🧪 **Testing Checklist**

Before going live, test:
- [ ] Successful payment flow
- [ ] Failed payment handling
- [ ] Webhook event processing
- [ ] Email notifications
- [ ] Order status updates
- [ ] Refund processing
- [ ] Arabic/English localization
- [ ] Mobile payment experience
- [ ] Different emirates shipping costs

---

## 📞 **Support & Troubleshooting**

### **Common Issues:**
1. **"Invalid API Key"** → Check environment variables
2. **"Webhook signature failed"** → Verify webhook secret
3. **"Payment not processing"** → Check Stripe logs
4. **"Orders not updating"** → Verify webhook endpoint

### **Stripe Resources:**
- [Stripe Dashboard](https://dashboard.stripe.com)
- [Stripe Documentation](https://stripe.com/docs)
- [Webhook Testing](https://stripe.com/docs/webhooks/test)
- [API Reference](https://stripe.com/docs/api)

---

## ✅ **Next Steps**

After environment setup:
1. ✅ Database schema will be updated automatically
2. ✅ Payment API routes will be created
3. ✅ Frontend will be updated to enable Stripe
4. ✅ Webhook handling will be implemented
5. ✅ Testing will be conducted

**Ready to proceed with the next phase!** 🚀