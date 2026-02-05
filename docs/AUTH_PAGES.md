# Authentication Pages Documentation

> **Last Updated**: February 2026
> **Status**: Production Ready

## Overview

The authentication pages provide a clean, professional experience for password recovery on mobile web. These pages are designed with mobile-first principles and include full internationalization support.

---

## Pages

### 1. Forgot Password (`/forgot-password`)

Allows users to request a password reset link via email.

**Features:**
- Clean, centered card layout
- Email input with icon
- Loading state with spinner
- Success state with confirmation message
- "Back to Login" navigation
- Ghostbusters mascot image

**Flow:**
1. User enters email address
2. API creates reset token (valid 30 minutes)
3. Email sent with reset link
4. Success message displayed (same response whether user exists or not - security)

### 2. Reset Password (`/reset-password/[token]`)

Allows users to set a new password using a valid reset token.

**States:**
- **Verifying**: Token validation in progress
- **Invalid Token**: Token expired or invalid
- **Form**: Password entry form
- **Success**: Password reset confirmation

**Features:**
- Password visibility toggle (eye icon)
- Password strength indicator (weak/fair/good/strong)
- Confirm password matching validation
- Auto-redirect to login after success

---

## Technical Implementation

### File Locations

| File | Purpose |
|------|---------|
| `app/forgot-password/page.tsx` | Forgot password page component |
| `app/reset-password/[token]/page.tsx` | Reset password page component |
| `app/api/auth/forgot-password/route.ts` | Forgot password API endpoint |
| `app/api/auth/reset-password/[token]/route.ts` | Reset password API endpoint |
| `lib/passwordReset.ts` | Token creation and verification |
| `lib/email.ts` | Password reset email sending |

### API Endpoints

#### POST `/api/auth/forgot-password`

Request a password reset link.

**Request:**
```json
{
  "email": "user@example.com",
  "csrfToken": "...",
  "locale": "en"
}
```

**Response:**
```json
{
  "success": true,
  "message": "If an account with that email exists, a password reset link has been sent."
}
```

**Security:**
- CSRF protection required
- Rate limited: 20 requests/hour per IP
- Same response whether user exists or not (prevents email enumeration)

#### GET `/api/auth/reset-password/[token]`

Verify if a reset token is valid.

**Response (valid):**
```json
{
  "valid": true,
  "message": "Token is valid"
}
```

**Response (invalid):**
```json
{
  "valid": false,
  "error": "Invalid or expired token"
}
```

#### POST `/api/auth/reset-password/[token]`

Reset password using a valid token.

**Request:**
```json
{
  "newPassword": "newSecurePassword123",
  "csrfToken": "..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password has been reset successfully"
}
```

**Security:**
- CSRF protection required
- Password minimum 8 characters
- Token marked as used after success
- All other user tokens invalidated

---

## Translation Keys

All text is internationalized. Keys are in `messages/{locale}.json` under the `auth` section.

### Forgot Password Keys

| Key | EN | AR | RU |
|-----|----|----|-----|
| `forgotPassword` | Forgot Password? | نسيت كلمة المرور؟ | Забыли пароль? |
| `forgotPasswordDescription` | Enter your email address... | أدخل بريدك الإلكتروني... | Введите ваш email... |
| `emailAddress` | Email Address | البريد الإلكتروني | Email адрес |
| `emailPlaceholder` | your.email@example.com | your.email@example.com | your.email@example.com |
| `sendResetLink` | Send Reset Link | إرسال رابط إعادة التعيين | Отправить ссылку |
| `backToLogin` | Back to Login | العودة لتسجيل الدخول | Назад к входу |
| `checkYourEmail` | Check Your Email | تحقق من بريدك الإلكتروني | Проверьте почту |
| `resetLinkSent` | A password reset link has been sent to | تم إرسال رابط إعادة تعيين... | Ссылка для сброса отправлена на |
| `linkExpiresIn` | The link will expire in 30 minutes | ستنتهي صلاحية الرابط خلال 30 دقيقة | Ссылка действительна 30 минут |

### Reset Password Keys

| Key | EN | AR | RU |
|-----|----|----|-----|
| `resetPassword` | Reset Password | إعادة تعيين كلمة المرور | Сбросить пароль |
| `createNewPassword` | Create New Password | إنشاء كلمة مرور جديدة | Создать новый пароль |
| `newPassword` | New Password | كلمة المرور الجديدة | Новый пароль |
| `confirmPassword` | Confirm Password | تأكيد كلمة المرور | Подтвердите пароль |
| `weakPassword` | Weak password | كلمة مرور ضعيفة | Слабый пароль |
| `fairPassword` | Fair password | كلمة مرور مقبولة | Средний пароль |
| `goodPassword` | Good password | كلمة مرور جيدة | Хороший пароль |
| `strongPassword` | Strong password | كلمة مرور قوية | Надёжный пароль |
| `passwordsDoNotMatch` | Passwords do not match | كلمات المرور غير متطابقة | Пароли не совпадают |
| `passwordsMatch` | Passwords match | كلمات المرور متطابقة | Пароли совпадают |
| `passwordResetSuccess` | Password Reset Successful! | تم إعادة تعيين كلمة المرور بنجاح! | Пароль успешно сброшен! |
| `invalidResetLink` | Invalid Reset Link | رابط غير صالح | Недействительная ссылка |
| `requestNewLink` | Request New Reset Link | طلب رابط جديد | Запросить новую ссылку |

---

## Mobile Optimizations

### No Breadcrumbs on Mobile
Breadcrumbs are hidden on mobile (`hidden md:flex`) for a cleaner experience. They remain visible on desktop for navigation context.

### Dynamic Viewport Height
Uses `min-h-[100dvh]` instead of `min-h-screen` to prevent scroll bounce on iOS mobile browsers.

### Centered Layout
Cards are vertically and horizontally centered using flexbox for optimal mobile viewing.

### Touch-Friendly Inputs
- Large input fields (`py-3.5`)
- Clear tap targets
- Password visibility toggle buttons

---

## Chatbot Visibility

The chatbot is hidden on all authentication pages for a distraction-free experience.

**Configuration** in `components/ChatWidget.tsx`:

```typescript
const hiddenPages = [
  '/cart', 
  '/bag', 
  '/checkout', 
  '/profile', 
  '/login', 
  '/bundle-builder', 
  '/success', 
  '/forgot-password',  // Added
  '/reset-password'    // Added
]
```

---

## Security Features

### Token Security
- Tokens are hashed before storage (bcrypt)
- 30-minute expiration
- Single-use (marked as used after password reset)
- All user tokens invalidated after successful reset

### Rate Limiting
- 20 forgot-password requests per hour per IP
- Prevents brute force attacks

### Email Enumeration Prevention
- Same response whether user exists or not
- Attackers cannot determine valid email addresses

### CSRF Protection
- All POST requests require valid CSRF token
- Token sent in both header and body

### Password Requirements
- Minimum 8 characters
- Strength indicator encourages stronger passwords

---

## Password Strength Calculation

```typescript
let score = 0
if (password.length >= 8) score++      // Length
if (/[a-z]/.test(password)) score++    // Lowercase
if (/[A-Z]/.test(password)) score++    // Uppercase
if (/[0-9]/.test(password)) score++    // Numbers
if (/[^a-zA-Z0-9]/.test(password)) score++ // Special chars

// Score interpretation:
// 0-2: Weak (red)
// 3: Fair (yellow)
// 4-5: Good/Strong (green)
```

---

## Testing

### Test URLs (Development)

```bash
# Forgot password page
http://localhost:3000/forgot-password

# Reset password page (requires valid token)
http://localhost:3000/reset-password/[token]
```

### API Testing

```bash
# Get CSRF token
curl -s http://localhost:3000/api/csrf-token -c cookies.txt

# Request password reset
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: TOKEN" \
  -b cookies.txt \
  -d '{"email": "user@example.com", "csrfToken": "TOKEN"}'

# Verify reset token
curl http://localhost:3000/api/auth/reset-password/TOKEN

# Reset password
curl -X POST http://localhost:3000/api/auth/reset-password/TOKEN \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: CSRF_TOKEN" \
  -b cookies.txt \
  -d '{"newPassword": "newPassword123", "csrfToken": "CSRF_TOKEN"}'
```

---

## Related Documentation

- [PROJECT_GUIDE.md](./PROJECT_GUIDE.md) - Overall project patterns
- [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) - UI design system
- [SUCCESS_PAGE.md](./SUCCESS_PAGE.md) - Order success page
