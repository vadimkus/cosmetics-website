# 🔗 Stripe Webhook Setup Guide

## 📋 **Important: Complete This Setup After Deployment**

Webhooks require your live application URL, so complete this setup **after** deploying your Stripe integration to production.

---

## 🚀 **Step 1: Deploy Your Application**

1. **Ensure Environment Variables are Set:**
   ```bash
   # In Vercel Dashboard > Settings > Environment Variables
   STRIPE_SECRET_KEY=sk_live_your_live_key_here
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_key_here
   NEXT_PUBLIC_BASE_URL=https://genosys.ae
   ```

2. **Deploy to Production:**
   ```bash
   # Your webhook endpoint will be:
   https://genosys.ae/api/webhooks/stripe
   ```

---

## 🎯 **Step 2: Create Webhook in Stripe Dashboard**

### **Navigate to Webhook Settings:**
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Click **Developers** → **Webhooks**
3. Click **Add endpoint**

### **Configure Webhook Endpoint:**

**Endpoint URL:**
```
https://genosys.ae/api/webhooks/stripe
```

**Events to Send:**
Select the following events (essential for order processing):

✅ **Payment Events:**
- `checkout.session.completed`
- `payment_intent.succeeded` 
- `payment_intent.payment_failed`

✅ **Optional Events (for future features):**
- `invoice.payment_succeeded`
- `invoice.payment_failed`
- `customer.created`
- `customer.updated`

**API Version:** Use latest (2024-12-18 or newer)

---

## 🔐 **Step 3: Get Webhook Secret**

After creating the webhook:

1. **Click on your webhook endpoint**
2. **Click "Reveal" under "Signing secret"**
3. **Copy the `whsec_` key**
4. **Add to environment variables:**

```bash
# Add this to Vercel Environment Variables
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

5. **Redeploy your application** after adding the webhook secret

---

## 🧪 **Step 4: Test Webhook**

### **Using Stripe CLI (Development):**
```bash
# Install Stripe CLI
# https://stripe.com/docs/stripe-cli

# Login to your Stripe account
stripe login

# Forward webhooks to local development
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# This will provide a test webhook secret like:
# whsec_test_your_test_secret
```

### **Using Stripe Dashboard (Production):**
1. **Go to your webhook endpoint**
2. **Click "Send test webhook"**
3. **Send `checkout.session.completed` event**
4. **Check your application logs for webhook processing**

---

## 📊 **Step 5: Verify Integration**

### **Complete Test Payment:**
1. **Use Stripe Test Cards:**
   - Success: `4242 4242 4242 4242`
   - Declined: `4000 0000 0000 0002`

2. **Verify Payment Flow:**
   - ✅ Order created in database with `paymentStatus: 'pending'`
   - ✅ Redirected to Stripe Checkout
   - ✅ Payment processed successfully
   - ✅ Webhook received and processed
   - ✅ Order status updated to `paymentStatus: 'paid'`
   - ✅ Confirmation emails sent
   - ✅ Success page displays correctly

### **Check Database Updates:**
```sql
-- Verify order was updated by webhook
SELECT 
  orderNumber,
  paymentMethod,
  paymentStatus,
  stripeSessionId,
  stripePaymentIntentId,
  paidAt,
  status
FROM orders 
WHERE paymentMethod = 'stripe'
ORDER BY createdAt DESC
LIMIT 5;
```

---

## 🛡️ **Security Verification**

### **Webhook Security Features:**
- ✅ **Signature Verification:** All webhooks verify Stripe signatures
- ✅ **Idempotency:** Duplicate webhooks are handled safely
- ✅ **Error Handling:** Failed webhooks are logged but don't break the system
- ✅ **HTTPS Only:** Webhooks only work over HTTPS in production

### **Log Monitoring:**
Check your application logs for these webhook events:
```
✅ Stripe webhook received: checkout.session.completed
✅ Order updated after checkout completion: GEN241211xxxx
✅ Customer confirmation email sent
✅ Admin notification sent
```

---

## 🔧 **Troubleshooting**

### **Common Issues:**

**1. "Webhook signature verification failed"**
```
❌ Issue: Wrong webhook secret
✅ Solution: Verify STRIPE_WEBHOOK_SECRET matches Stripe dashboard
✅ Action: Redeploy after updating environment variable
```

**2. "Order not found for session"**
```
❌ Issue: Order creation failed before redirect to Stripe
✅ Solution: Check order creation API logs
✅ Action: Verify database connection and order creation process
```

**3. "Emails not sending after payment"**
```
❌ Issue: Email service configuration
✅ Solution: Check email service logs in webhook processing
✅ Action: Verify email environment variables and service status
```

**4. "Orders stuck in 'pending' status"**
```
❌ Issue: Webhooks not being received
✅ Solution: Check webhook endpoint URL and events
✅ Action: Use Stripe CLI to test webhook delivery
```

### **Webhook Endpoint Testing:**
```bash
# Test webhook endpoint directly
curl -X POST https://genosys.ae/api/webhooks/stripe \
  -H "Content-Type: application/json" \
  -H "Stripe-Signature: test" \
  -d '{"test": true}'

# Should return 400 (invalid signature) - this means endpoint is working
```

---

## 📈 **Monitoring Webhooks**

### **Stripe Dashboard Monitoring:**
1. **Go to Developers → Webhooks**
2. **Click on your webhook endpoint**
3. **Monitor "Recent deliveries"**
4. **Check success/failure rates**

### **Expected Webhook Flow:**
```
1. Customer completes Stripe checkout
2. Stripe sends checkout.session.completed webhook
3. Your app processes webhook and updates order
4. Stripe sends payment_intent.succeeded webhook
5. Your app confirms payment and sends emails
6. Customer sees success page with order confirmation
```

---

## ✅ **Webhook Setup Complete!**

Once webhooks are configured and tested:
- ✅ **Payments are automatically processed**
- ✅ **Orders are updated in real-time**
- ✅ **Customers receive immediate confirmation**
- ✅ **Admins are notified of new orders**
- ✅ **Payment failures are handled gracefully**

**Your Stripe integration is now fully operational! 🎉**

---

## 📞 **Support Resources**

- **Stripe Webhooks Documentation:** [https://stripe.com/docs/webhooks](https://stripe.com/docs/webhooks)
- **Stripe CLI Documentation:** [https://stripe.com/docs/stripe-cli](https://stripe.com/docs/stripe-cli)
- **Webhook Testing Guide:** [https://stripe.com/docs/webhooks/test](https://stripe.com/docs/webhooks/test)
- **GENOSYS Support:** WhatsApp +971 58 548 7665