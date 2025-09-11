# Email Setup Guide

## Overview
The email service is now fully implemented and ready to use. It includes:
- Order confirmation emails to customers
- Order notification emails to admin
- Order status update emails to customers
- Professional HTML email templates
- AED currency formatting

## Configuration

### Environment Variables
Create a `.env.local` file in your project root with the following variables:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=sales@genosys.ae
SMTP_PASS=your_app_password_here
EMAIL_PASSWORD=your_app_password_here

# Admin Configuration
ADMIN_EMAIL=sales@genosys.ae
```

### Email Provider Setup for sales@genosys.ae

**Choose your email provider and follow the appropriate setup:**

#### Option 1: Outlook/Microsoft 365
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=sales@genosys.ae
SMTP_PASS=your_outlook_password
```

#### Option 2: Yahoo Mail
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=sales@genosys.ae
SMTP_PASS=your_yahoo_app_password
```

#### Option 3: Gmail (if using Gmail)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=sales@genosys.ae
SMTP_PASS=your_gmail_app_password
```

#### Option 4: Custom Hosting Provider
```env
SMTP_HOST=mail.genosys.ae
SMTP_PORT=587
SMTP_USER=sales@genosys.ae
SMTP_PASS=your_email_password
```

**Note:** Replace `your_email_password` with your actual email password or app-specific password.

### Alternative Email Providers
You can use other SMTP providers by changing the configuration:

```env
# For Outlook/Hotmail
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587

# For Yahoo
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587

# For custom SMTP
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
```

## Features

### 1. Order Confirmation Emails
- Sent automatically when a new order is placed
- Includes order details, customer information, and total
- Professional HTML template with Genosys branding

### 2. Admin Notification Emails
- Sent to admin when new orders are received
- Detailed order summary with all items
- Customer contact information
- Order totals and breakdown

### 3. Order Status Update Emails
- Sent to customers when order status changes
- Custom messages for different statuses:
  - PROCESSING: "Your order is being processed"
  - SHIPPED: "Your order has been shipped"
  - DELIVERED: "Your order has been delivered"
  - CANCELLED: "Your order has been cancelled"

## Usage

### Automatic Emails
Emails are sent automatically during:
- Order placement (confirmation + admin notification)
- Order status updates (when admin changes status)

### Manual Email Sending
You can also send emails manually using the email service functions:

```typescript
import { sendOrderConfirmation, sendOrderNotification, sendOrderStatusUpdate } from '@/lib/emailService'

// Send order confirmation
await sendOrderConfirmation(order)

// Send admin notification
await sendOrderNotification(order)

// Send status update
await sendOrderStatusUpdate(order, 'SHIPPED')
```

## Testing

### Local Testing
1. Set up your environment variables
2. Place a test order through the checkout process
3. Check your email inbox for confirmation
4. Check admin email for notification

### Production Testing
1. Deploy with environment variables set in Vercel
2. Place a test order on the live site
3. Verify emails are received

## Troubleshooting

### Common Issues
1. **Authentication Error**: Check your Gmail app password
2. **Connection Timeout**: Verify SMTP settings and port
3. **Emails Not Sending**: Check console logs for error messages
4. **Spam Folder**: Check spam folder for test emails

### Debug Mode
Enable debug logging by adding to your environment:
```env
DEBUG_EMAIL=true
```

## Security Notes
- Never commit `.env.local` to version control
- Use app passwords instead of your main Gmail password
- Consider using a dedicated email account for business emails
- Regularly rotate your app passwords

## Support
If you encounter issues:
1. Check the console logs for error messages
2. Verify your SMTP configuration
3. Test with a simple email first
4. Contact support if problems persist
