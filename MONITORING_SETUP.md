# 🔍 Monitoring & Error Tracking Setup Guide

This guide explains how to set up external monitoring and error tracking for production environments.

## 📋 Overview

The application now includes comprehensive monitoring capabilities with support for multiple monitoring services:

- **Console Monitoring** (Development)
- **Sentry** (Production Error Tracking)
- **LogRocket** (Production Session Recording)

## 🚀 Quick Setup

### 1. Install Dependencies

The monitoring dependencies are already included in `package.json`:

```bash
npm install
```

### 2. Environment Variables

Add these environment variables to your `.env.local` or production environment:

```bash
# Sentry (Optional - for production error tracking)
SENTRY_DSN="https://your-sentry-dsn@sentry.io/project-id"

# LogRocket (Optional - for session recording)
LOGROCKET_APP_ID="your-logrocket-app-id"
```

### 3. Initialize Monitoring

The monitoring is automatically initialized when the app starts. No additional setup required.

## 🔧 Service Configuration

### Sentry Setup

1. **Create Sentry Account**: Go to [sentry.io](https://sentry.io) and create an account
2. **Create Project**: Create a new Next.js project
3. **Get DSN**: Copy your DSN from the project settings
4. **Add to Environment**: Add `SENTRY_DSN` to your environment variables

### LogRocket Setup

1. **Create LogRocket Account**: Go to [logrocket.com](https://logrocket.com) and create an account
2. **Create App**: Create a new app in your dashboard
3. **Get App ID**: Copy your App ID from the app settings
4. **Add to Environment**: Add `LOGROCKET_APP_ID` to your environment variables

## 📊 Features

### Error Tracking

- **Automatic Error Capture**: All unhandled errors are automatically tracked
- **Context Information**: User ID, email, URL, user agent, and custom tags
- **Error Classification**: Errors are categorized by type and severity
- **Breadcrumb Trail**: User actions leading to errors are tracked

### Performance Monitoring

- **Core Web Vitals**: LCP, FID, CLS tracking
- **API Performance**: Request duration and status tracking
- **Custom Metrics**: Track any performance metric
- **Slow Operation Detection**: Automatic detection of slow operations

### User Journey Tracking

- **Page Views**: Automatic page view tracking
- **User Actions**: Custom user action tracking
- **Navigation Flow**: User navigation patterns
- **Session Recording**: Full user session recording (LogRocket)

## 🛠️ Usage Examples

### Basic Error Tracking

```typescript
import { trackError } from '@/lib/monitoring'

try {
  // Your code here
} catch (error) {
  await trackError(error, {
    userId: 'user123',
    userEmail: 'user@example.com',
    severity: 'high',
    tags: { component: 'checkout' }
  })
}
```

### Custom Message Tracking

```typescript
import { trackMessage } from '@/lib/monitoring'

await trackMessage('User completed checkout', 'info', {
  userId: 'user123',
  tags: { action: 'checkout_complete' }
})
```

### Performance Tracking

```typescript
import { trackPerformance } from '@/lib/monitoring'

await trackPerformance({
  name: 'api_call_duration',
  value: 150,
  unit: 'ms',
  tags: { endpoint: '/api/checkout' }
})
```

### React Hook Usage

```typescript
import { useUserTracking } from '@/components/MonitoringProvider'

function MyComponent() {
  const { trackAction, trackPageView } = useUserTracking()

  useEffect(() => {
    trackPageView('product-page')
  }, [])

  const handleClick = async () => {
    await trackAction('add-to-cart', { productId: '123' })
  }

  return <button onClick={handleClick}>Add to Cart</button>
}
```

## 🔍 Monitoring Dashboard

### Sentry Dashboard
- **Errors**: All captured errors with stack traces
- **Performance**: Performance metrics and transactions
- **Releases**: Error tracking by release version
- **Alerts**: Custom alerts for critical errors

### LogRocket Dashboard
- **Sessions**: Recorded user sessions
- **Errors**: Client-side errors with context
- **Network**: API calls and responses
- **Console**: Browser console logs

## 📈 Analytics Integration

The monitoring system integrates with your existing analytics:

- **Page Views**: Tracked automatically
- **User Actions**: Custom action tracking
- **Error Rates**: Error frequency and patterns
- **Performance**: Core Web Vitals and custom metrics

## 🚨 Alerting

### Sentry Alerts
- **Error Rate**: Alert when error rate exceeds threshold
- **New Issues**: Alert for new error types
- **Performance**: Alert for slow operations

### LogRocket Alerts
- **Session Errors**: Alert for user session errors
- **Performance Issues**: Alert for slow page loads

## 🔒 Privacy & Security

- **Data Retention**: Configurable data retention policies
- **PII Protection**: Automatic PII detection and masking
- **GDPR Compliance**: Built-in GDPR compliance features
- **Data Encryption**: All data encrypted in transit and at rest

## 📱 Mobile Support

The monitoring system works seamlessly with:
- **PWA**: Progressive Web App monitoring
- **Mobile Browsers**: Full mobile browser support
- **Responsive Design**: Mobile-specific performance tracking

## 🛡️ Security Considerations

- **API Keys**: Store monitoring API keys securely
- **Data Sensitivity**: Configure data filtering for sensitive information
- **Access Control**: Limit monitoring dashboard access
- **Audit Logs**: Monitor access to monitoring systems

## 📊 Cost Optimization

### Sentry
- **Free Tier**: 5,000 errors/month
- **Paid Plans**: Based on error volume and features
- **Optimization**: Filter out non-critical errors

### LogRocket
- **Free Tier**: 1,000 sessions/month
- **Paid Plans**: Based on session volume
- **Optimization**: Sample sessions for high-traffic sites

## 🔧 Troubleshooting

### Common Issues

1. **Monitoring Not Initializing**
   - Check environment variables
   - Verify network connectivity
   - Check browser console for errors

2. **Missing Error Context**
   - Ensure user context is set
   - Check breadcrumb configuration
   - Verify error boundaries are in place

3. **Performance Issues**
   - Monitor monitoring overhead
   - Configure sampling rates
   - Optimize error filtering

### Debug Mode

Enable debug mode for development:

```typescript
// In development, all monitoring goes to console
// In production, monitoring goes to external services
```

## 📚 Additional Resources

- [Sentry Documentation](https://docs.sentry.io/)
- [LogRocket Documentation](https://docs.logrocket.com/)
- [Next.js Monitoring Best Practices](https://nextjs.org/docs/advanced-features/measuring-performance)

## 🆘 Support

For monitoring-related issues:
1. Check the browser console for errors
2. Verify environment variables
3. Test with console monitoring first
4. Check service status pages
5. Contact support with error details

---

**Note**: Monitoring services are optional. The application will work without them, but you'll only get console logging in development.
