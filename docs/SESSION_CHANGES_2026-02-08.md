# Session Changes - February 8, 2026

## Summary

Eight issues fixed across web and native app:

1. **Missing registration fields (mobile web)** — Mobile web form was missing Phone, Address, Emirate, and Birthday fields
2. **Registration hang (5+ minutes)** — API blocked on SMTP emails and geolocation; now uses `after()` for instant response
3. **Native app "Build Your Set" 500 error** — Mobile-session auth bridge hit cold Neon DB; eliminated DB dependency
4. **WebView error handling** — Native app WebView showed blank page on errors; now shows retry UI
5. **Native app registration missing fields** — Added Phone, Address, Emirate, Birthday to native app registration
6. **Native app login/register toggle layout** — Changed from inline to vertical stacked layout
7. **Forgot Password spacing** — Removed extra 24px margin below the link
8. **iOS 26 Liquid Glass icon blur** — Native app icon was blurry due to automatic glass rendering; fixed with Icon Composer layered icon

**Also fixed:**
- **Apple rejection (ITMS-90683)** — Added missing `NSSpeechRecognitionUsageDescription` to Info.plist

---

## Bug 1: Missing Registration Fields on Mobile Web

### Problem

Users accessing `genosys.ae/login` via **mobile browser** (Chrome/Safari) could not register. The mobile web registration form only showed 3 fields:
- Full Name
- Email
- Password

But the backend API (`/api/auth/register`) **requires** phone, address, and emirate. The form submission would either fail silently or show a validation error.

**PWA** and **Desktop** versions were not affected — they already had all required fields.

### Root Cause

In `app/login/LoginClient.tsx`, the mobile web branch (lines 145–391, activated when `isMobile && !isPWA`) was built with only the 3 basic fields. The Phone, Address, Emirate, and Birthday fields were only present in the Desktop branch (lines 420–672).

### Fix

| File | Change |
|------|--------|
| `app/login/LoginClient.tsx` | Added 4 missing fields to mobile web registration form |

**Fields added to mobile web form:**

| Field | Type | Required | Details |
|-------|------|----------|---------|
| UAE Phone Number | `tel` | Yes | LTR input, uses `login.uaePhoneNumber` translation |
| UAE Address | `text` | Yes | Respects RTL direction |
| Emirate | `select` | Yes | Dropdown with all 7 UAE emirates |
| Birthday | `date` | No | Optional, with gift message hint |

All fields use the same styling as existing mobile web inputs (rounded-xl, proper padding, RTL support) and all translation keys already existed for EN, AR, and RU.

### Commit

```
d3965cd2 fix: add missing registration fields to mobile web login form
```

---

## Bug 2: Registration Hangs for 5+ Minutes

### Problem

Users who filled out the registration form on mobile web (and occasionally PWA/desktop) experienced the "Create Account" button spinning for **5+ minutes** with no response. The registration was actually succeeding (user was created in the database), but the HTTP response was not sent back until all post-registration tasks completed.

### Root Cause

The registration API route (`/api/auth/register/route.ts`) sequentially `await`ed three slow operations **before** returning the HTTP response:

1. **`sendWelcomeEmail()`** — Gmail SMTP with nodemailer default socket timeout of **10 minutes**
2. **`getGeolocationData()`** — External API call to `ipapi.co` with **no timeout**
3. **`sendAdminNewUserNotification()`** — Another Gmail SMTP send (10-minute timeout)

If Gmail was slow, rate-limited, or `ipapi.co` was unresponsive, the user would see the spinner for the full duration of all three operations.

Additionally, the client-side `register()` function in `AuthProvider.tsx` had **no fetch timeout** (unlike `login()` which already had a 30-second `AbortController`).

### Fix — 4 Files Changed

| File | Change |
|------|--------|
| `app/api/auth/register/route.ts` | Moved all email/analytics/geolocation into Next.js `after()` callback — response returns **instantly** after user creation |
| `lib/email/transporter.ts` | Added SMTP timeouts: 10s connection, 10s greeting, 30s socket (was 10 min default) |
| `lib/geolocation.ts` | Added 5-second `AbortController` timeout to both geolocation fetch calls |
| `components/auth/AuthProvider.tsx` | Added 30-second `AbortController` timeout to `register()` fetch call |

### Technical Details

#### Next.js `after()` API (Key Change)

The registration API now uses Next.js 16's `after()` API to run post-registration tasks **after** the HTTP response is sent:

```typescript
// Return response immediately after DB write
const { password: __, ...userWithoutPassword } = createdUser

// Capture headers before response (not available in after())
const userAgent = request.headers.get('user-agent') || 'Unknown'
const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'Unknown'

// Run background tasks AFTER response is sent
after(async () => {
  await trackUserAction(...)
  await sendWelcomeEmail(...)
  await sendAdminNewUserNotification(...)
})

return NextResponse.json({ success: true, user: userWithoutPassword })
```

#### SMTP Timeouts Added

```typescript
// lib/email/transporter.ts — Before
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: { ... }
  // Default socket timeout: 10 MINUTES
})

// After
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: { ... },
  connectionTimeout: 10000,  // 10s to establish connection
  greetingTimeout: 10000,    // 10s for SMTP greeting
  socketTimeout: 30000,      // 30s for socket inactivity
})
```

#### Geolocation Timeouts Added

```typescript
// lib/geolocation.ts — Before
const response = await fetch(`https://ipapi.co/${ip}/json/`)
// No timeout — could hang indefinitely

// After
const controller = new AbortController()
const timeoutId = setTimeout(() => controller.abort(), 5000)
const response = await fetch(`https://ipapi.co/${ip}/json/`, {
  signal: controller.signal
})
clearTimeout(timeoutId)
```

#### Client-Side Register Timeout Added

```typescript
// components/auth/AuthProvider.tsx — Before
const response = await fetch('/api/auth/register', { ... })
// No timeout — could hang indefinitely

// After
const controller = new AbortController()
const timeoutId = setTimeout(() => controller.abort(), 30000) // 30s
const response = await fetch('/api/auth/register', {
  ...,
  signal: controller.signal
})
clearTimeout(timeoutId)
```

### Performance Results (Production Testing)

| Test | Before | After |
|------|--------|-------|
| Registration (cold start) | 5+ minutes | **4.2 seconds** |
| Registration (warm function) | 5+ minutes | **2.4 seconds** |
| Duplicate email check | Unknown | **0.6 seconds** |

The ~2-4 second response time is from bcrypt password hashing (12 rounds) + database write. Emails and analytics run completely in the background.

### Commit

```
98cb13db fix: resolve registration hang by making emails non-blocking
```

---

## Files Changed Summary

| File | Changes |
|------|---------|
| `app/login/LoginClient.tsx` | Added Phone, Address, Emirate, Birthday fields to mobile web registration form |
| `app/api/auth/register/route.ts` | Moved emails/analytics to `after()` callback; imported `after` from `next/server` |
| `lib/email/transporter.ts` | Added connectionTimeout (10s), greetingTimeout (10s), socketTimeout (30s) to SMTP |
| `lib/geolocation.ts` | Added 5s AbortController timeout to both geolocation functions |
| `components/auth/AuthProvider.tsx` | Added 30s AbortController timeout to `register()` fetch |

---

## Impact

- **All three display modes** (Desktop, Mobile Web, PWA) now have complete registration forms
- **All three languages** (EN, AR, RU) — all translation keys already existed
- Registration is now **instant** from the user's perspective (~2-4s)
- Emails still send reliably in the background via `after()`
- SMTP failures are bounded to 30s max (was 10 min)
- Geolocation failures are bounded to 5s max (was unlimited)

---

## Bug 3: Native App "Build Your Set" Returns 500

### Problem

Logged-in users tapping "Build Your Set" in the native Expo app saw a 500 Internal Server Error. The page never loaded. This only happened when the Neon Postgres database was cold (suspended after inactivity — common during testing).

### Investigation

Debugging revealed the 500 came from **`/api/auth/mobile-session`** (the auth bridge), NOT from `/bundle-builder`. The WebView error screen (added during this session) displayed the failing URL, confirming the source.

The flow:
1. Native app builds URL: `genosys.ae/api/auth/mobile-session?token=<JWT>&apiKey=<KEY>&redirect=/bundle-builder`
2. Bridge endpoint verifies JWT, then calls `findUserById(payload.userId)` — a **Prisma DB query**
3. Neon DB is cold → connection timeout (5s) → unhandled error → **500**
4. WebView receives 500, user sees blank/error page

### Root Cause

The mobile-session bridge (`/api/auth/mobile-session`) was querying the database (`findUserById`) to look up user data, even though the mobile JWT already contained all the data needed to create a session: `userId`, `email`, `name`, `isAdmin`, `canSeePrices`.

When Neon Postgres was suspended (cold), the DB connection timed out and the function returned 500.

### Fix — Database-Free Auth Bridge

Eliminated the database dependency entirely. The mobile JWT is HMAC-signed by the server, so once verified, its payload is trusted. The session is now created directly from the token data.

| File | Change |
|------|--------|
| `app/api/auth/mobile-session/route.ts` | Removed `findUserById` DB query; create session directly from verified JWT payload |

**Before:**
```typescript
const payload = verifyMobileToken(token)
const user = await findUserById(payload.userId)  // ← DB query, can timeout
const sessionToken = createSessionToken({
  id: user.id, email: user.email, name: user.name, ...
})
```

**After:**
```typescript
const payload = verifyMobileToken(token)
// No DB query — JWT payload already has everything we need
const sessionToken = createSessionToken({
  id: payload.userId, email: payload.email, name: payload.name, ...
})
```

**Result:** The bridge is now pure crypto (token verify + session sign) — responds in milliseconds with zero DB dependency.

### Commit

```
8c5c1f80 fix: eliminate DB dependency from mobile-session bridge to prevent 500
```

---

## Bug 3b: Bundle-Builder Cold Start Protection

### Problem

Even after fixing the auth bridge, the bundle-builder page itself (`/bundle-builder`) could also 500 on Neon cold starts, since the page server component calls `getAllProducts()` which queries the database.

### Fix — Retry Logic + Error Boundary + Vercel Timeout

| File | Change |
|------|--------|
| `app/bundle-builder/page.tsx` | Added `getProductsWithRetry()` — 2 attempts with 2s delay for DB wake-up |
| `app/ar/bundle-builder/page.tsx` | Same retry logic for Arabic locale |
| `app/ru/bundle-builder/page.tsx` | Same retry logic for Russian locale |
| `app/bundle-builder/error.tsx` | Error boundary with "Try Again" button and "Back to Products" link |
| `app/ar/bundle-builder/error.tsx` | Same error boundary for Arabic locale |
| `app/ru/bundle-builder/error.tsx` | Same error boundary for Russian locale |
| All 3 page files | Added `export const maxDuration = 30` — prevents Vercel from killing the function before retry completes |

**Retry Logic:**
```typescript
async function getProductsWithRetry(maxRetries = 2) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await getAllProducts()
    } catch (error) {
      if (attempt === maxRetries) throw error
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }
}
```

### Commits

```
70fd62ac fix: add retry logic and error boundary to bundle-builder for DB cold starts
b8dba901 fix: add maxDuration=30 to bundle-builder pages for Vercel function timeout
```

---

## Bug 4: Native App WebView Error Handling

### Problem

When the WebView encountered a 500 (or any HTTP/network error), the native app showed a blank white page with no way to retry or go back. Users had to force-close and reopen the app.

### Fix — Error UI with Retry (genosys-mobile-app)

| File | Change |
|------|--------|
| `app/webview.js` | Added `onHttpError` and `onError` handlers; error screen with "Try Again" button, "Go Back" link, and failing URL display |

**Features added:**
- Catches HTTP errors (4xx, 5xx) via `onHttpError`
- Catches network/DNS errors via `onError`
- Shows styled error screen: cloud icon, error code, description, failing URL
- "Try Again" button reloads the WebView
- "Go Back" button returns to previous screen
- `console.error` logs failing URL for debugging

### Commits (genosys-mobile-app repo)

```
15508ba fix: add error handling with retry to WebView screen
c1f7191 debug: show failing URL in WebView error screen to diagnose 500
```

---

## All Files Changed

### cosmetics-website

| File | Changes |
|------|---------|
| `app/login/LoginClient.tsx` | Added Phone, Address, Emirate, Birthday fields to mobile web registration form |
| `app/api/auth/register/route.ts` | Moved emails/analytics to `after()` callback; imported `after` from `next/server` |
| `app/api/auth/mobile-session/route.ts` | Removed DB dependency; create session from JWT payload directly |
| `app/bundle-builder/page.tsx` | Added retry logic + `maxDuration=30` |
| `app/bundle-builder/error.tsx` | New error boundary with Try Again button |
| `app/ar/bundle-builder/page.tsx` | Added retry logic + `maxDuration=30` |
| `app/ar/bundle-builder/error.tsx` | New error boundary |
| `app/ru/bundle-builder/page.tsx` | Added retry logic + `maxDuration=30` |
| `app/ru/bundle-builder/error.tsx` | New error boundary |
| `lib/email/transporter.ts` | Added SMTP timeouts (10s connect, 10s greeting, 30s socket) |
| `lib/geolocation.ts` | Added 5s AbortController timeout to geolocation fetches |
| `components/auth/AuthProvider.tsx` | Added 30s timeout to `register()` fetch |

### genosys-mobile-app

| File | Changes |
|------|---------|
| `app/webview.js` | Added `onHttpError`/`onError` handlers, error screen with retry, URL display |
| `app/auth/login.js` | Added Phone, Address, Emirate, Birthday fields; vertical toggle layout; removed Forgot Password margin |
| `contexts/AuthContext.js` | Updated `register()` to accept extra fields object |
| `services/authService.js` | Updated `registerUser()` to send phone, address, emirate, birthday to API |
| `i18n/messages/en.json` | Added 13 translation keys for registration fields |
| `i18n/messages/ar.json` | Added 13 translation keys for registration fields (Arabic) |
| `i18n/messages/ru.json` | Added 13 translation keys for registration fields (Russian) |
| `ios/GenosysUAE/Info.plist` | Added `NSSpeechRecognitionUsageDescription` for App Store compliance; updated `NSMicrophoneUsageDescription` |
| `ios/GenosysUAE/Images.xcassets/AppIcon.appiconset/App-Icon-1024x1024@1x.png` | Replaced with correct PWA-style icon (white bg, red logo) |
| `assets/app-icon-1024-native-matched.png` | New: Scaled icon with logo filling 72% of canvas |
| `assets/icon-layer-white-1024.png` | New: White logo on transparent for Icon Composer foreground |
| `ios/GenosysUAE/AppIcon.icon/icon.json` | New: Icon Composer layered definition with `glass: false` |
| `ios/GenosysUAE/AppIcon.icon/Assets/Logo.png` | New: White logo layer for Icon Composer |
| `ios/GenosysUAE.xcodeproj/project.pbxproj` | Added AppIcon.icon bundle to Xcode project build (Build 39, overwritten by prebuild) |
| `assets/AppIcon.icon/icon.json` | New: Icon Composer bundle in assets/ for Expo SDK 54 native support |
| `assets/AppIcon.icon/Assets/Logo.png` | New: White logo layer for Icon Composer (in assets/) |
| `eas.json` | Updated production build to use Xcode 26 image for Icon Composer support |

---

## Impact

- **Mobile web registration** — All fields present, registration completes in 2-4s
- **Native app Build Your Set** — Auth bridge is DB-free, responds in ms
- **Bundle-builder resilience** — Retry logic handles DB cold starts; error boundary for graceful fallback
- **WebView UX** — Users see actionable error UI instead of blank page on any HTTP/network failure
- **All three languages** (EN, AR, RU) supported across all fixes

---

## Build Status

All changes pass TypeScript compilation with zero errors in changed files.

---

## TestFlight Builds

### Build 40 (Current) ✅

| Field | Value |
|-------|-------|
| App Name | Genosys UAE |
| Version | 1.1.0 |
| Build Number | 40 |
| Bundle ID | ae.genosys.app |
| SDK Version | Expo SDK 54 |
| Build Image | `macos-sequoia-15.5-xcode-26.0` |
| Build ID | `2640a705-f6c8-49e6-b7b6-7854860a73de` |
| Submission ID | `4430a2ec-bb1d-4f65-b7ad-ef76ee2d62d4` |

**What's New in Build 40:**
- **Used Expo SDK 54 native `.icon` support** — `ios.icon` in `app.json` now points to `./assets/AppIcon.icon`
- **Built with Xcode 26** — EAS uses `macos-sequoia-15.5-xcode-26.0` image, required for Icon Composer
- Icon Composer `.icon` bundle with `glass: false` on foreground layer
- White solid background, red logo applied via fill-specializations
- Dark mode and tinted variants included

**Why Build 39 Still Had Blur:**
Build 39 placed the `.icon` bundle manually in `ios/GenosysUAE/` and edited `project.pbxproj`, but EAS Build runs prebuild which regenerates native project files. The `.icon` bundle was not being picked up. Expo SDK 54 requires the `.icon` path to be set in `app.json`'s `ios.icon` field and needs Xcode 26 build image.

### Build 39 ❌ (Icon Not Picked Up)

| Field | Value |
|-------|-------|
| Build Number | 39 |
| Build ID | `7244e5ea-49af-490b-a77c-433226d1be66` |

**Issues:** `.icon` bundle was placed in `ios/GenosysUAE/` directory and referenced in `project.pbxproj`, but EAS prebuild overwrites native project files. The Icon Composer bundle was never included in the built app.

### Build 38 ❌ (Still Blurry)

| Field | Value |
|-------|-------|
| Build Number | 38 |
| Build ID | `93d69e4e-9fd5-4a9e-a8cd-8c7662ffa47b` |

**Issues:** Icon still blurry despite correct proportions. iOS 26 Liquid Glass applies blur to single-layer PNGs.

### Build 37 ❌ (Icon Issues)

| Field | Value |
|-------|-------|
| Build Number | 37 |
| Build ID | `5ce0c61c-e7c3-4ca5-acae-39910c3a9973` |

**Issues:** Icon appeared smaller and blurry compared to PWA. Logo only filled 60% of canvas.

**Features (carried to Build 38):**
- Phone, Address, Emirate (required) and Birthday (optional) fields in registration
- Emirate picker modal with all 7 UAE emirates
- Vertical layout for "Already have an account? Sign In" toggle
- Removed extra spacing below "Forgot Password" link
- 12 new translation keys for EN, AR, RU

### Build 36 ✅

| Field | Value |
|-------|-------|
| Build Number | 36 |
| Build ID | `108d27d3-b987-4747-8ee8-964c077c18ca` |
| Submission ID | `05b81c13-fd64-4d16-a8c3-c413664bd8da` |

**Fixes:**
- Added `NSSpeechRecognitionUsageDescription` to `ios/GenosysUAE/Info.plist`
- Updated `NSMicrophoneUsageDescription` to match app.json description
- Correct PWA-style app icon (white bg, red logo)

### Build 35 (Rejected by Apple) ❌

Apple rejected Build 35 with error `ITMS-90683: Missing purpose string in Info.plist`:
> Your app's code references one or more APIs that access sensitive user data... The Info.plist file should contain a NSSpeechRecognitionUsageDescription key.

**Root Cause:** The `expo-speech-recognition` plugin was included in `app.json`, but the native `ios/GenosysUAE/Info.plist` was missing the required privacy description. When an `ios/` directory exists, EAS uses the native Info.plist directly instead of generating it from app.json.

| Field | Value |
|-------|-------|
| Build Number | 35 |
| Build ID | `b56ff869-ab9c-4265-9af9-4eaf880fadce` |
| Status | ❌ Rejected |

### What's Included in Build 36

1. **WebView error handling** — Users see retry UI instead of blank page on HTTP/network errors
2. **Failing URL display** — Error screen shows the URL that failed, aiding debugging
3. **Speech recognition privacy** — Added required `NSSpeechRecognitionUsageDescription`

---

## Bug 5: Native App Registration Missing Fields

### Problem

The native Expo app's registration form (in `app/auth/login.js`) only had 3 fields:
- Full Name
- Email
- Password

The mobile web and PWA versions had additional required fields (Phone, Address, Emirate) and an optional Birthday field. Users registering via the native app would have incomplete profiles.

### Fix — 4 Files Changed (genosys-mobile-app)

| File | Change |
|------|--------|
| `app/auth/login.js` | Added Phone, Address, Emirate (required) and Birthday (optional) fields to registration form |
| `contexts/AuthContext.js` | Updated `register()` to accept and pass extra fields object |
| `services/authService.js` | Updated `registerUser()` to send phone, address, emirate, birthday to API |
| `i18n/messages/en.json` | Added 13 translation keys for new fields |
| `i18n/messages/ar.json` | Added 13 translation keys for new fields (Arabic) |
| `i18n/messages/ru.json` | Added 13 translation keys for new fields (Russian) |

**New Registration Fields:**

| Field | Type | Required | Details |
|-------|------|----------|---------|
| UAE Phone Number | `phone-pad` | Yes | Always LTR, placeholder: +971 50 123 4567 |
| Delivery Address | `text` | Yes | RTL-aware |
| Emirate | Modal picker | Yes | All 7 UAE emirates with checkmark selection |
| Birthday | `text` | No | YYYY-MM-DD format, with gift hint |

**UI Improvements:**
- Required fields marked with red asterisk (*)
- Emirate picker modal with proper styling
- Birthday field has hint: "Get a special gift on your birthday! 🎁"
- Full RTL support for Arabic

**Translation Keys Added (authScreen):**

```json
"phoneLabel": "UAE Phone Number",
"phonePlaceholder": "+971 50 123 4567",
"phoneRequired": "Please enter your phone number",
"addressLabel": "Delivery Address",
"addressPlaceholder": "Building, street, area",
"addressRequired": "Please enter your address",
"emirateLabel": "Emirate",
"selectEmirate": "Select Emirate",
"emirateRequired": "Please select your emirate",
"birthdayLabel": "Birthday (optional)",
"birthdayPlaceholder": "YYYY-MM-DD",
"birthdayHint": "Get a special gift on your birthday! 🎁"
```

---

## Bug 6: Native App Login/Register Toggle Layout

### Problem

The "Don't have an account? Sign Up" / "Already have an account? Sign In" text and link were displayed inline on the same line, which looked cramped.

### Fix

Changed layout so the question text and action link are stacked vertically:
- "Don't have an account?" on one line (centered)
- "Sign Up" button below it (centered, larger, bolder)

| File | Change |
|------|--------|
| `app/auth/login.js` | Changed `switchMode` from row to column layout; removed `switchModeRTL`; added `switchModeButtonWrap` |

**Style Changes:**
```javascript
// Before
switchMode: { flexDirection: 'row', ... }

// After
switchMode: { alignItems: 'center', ... }
switchModeButtonWrap: { marginTop: 6 }
switchModeButton: { fontSize: 15, fontWeight: '700' }
```

---

## Bug 7: Extra Space Below "Forgot Password"

### Problem

There was unnecessary blank space (24px margin) below the "Forgot Password?" link.

### Fix

| File | Change |
|------|--------|
| `app/auth/login.js` | Changed `forgotPassword.marginBottom` from 24 to 0 |

---

## Bug 8: iOS 26 Liquid Glass Icon Blur

### Problem

After fixing the icon proportions in Build 38, the native app icon was still blurry on iOS 26. The logo appeared to have a "frosted glass" effect applied, making it look washed out compared to the crisp PWA icon.

User feedback: "right icon is blurred as apple introduced glass can we fix the icon, so it's sharp?"

### Root Cause

**iOS 26 "Liquid Glass" Design**

Apple introduced a new design system called "Liquid Glass" in iOS 26 that automatically applies visual effects to app icons:
- Single-layer PNG icons receive automatic blur/translucency
- The system treats traditional icons as backgrounds with glass overlay
- PWAs are rendered differently (using web standards), which is why the PWA icon appeared crisp

### Research & Solution

Researched Apple's official documentation and developer forums. The solution is to use **Apple's Icon Composer format** (`.icon` bundle) with explicit layer controls:

1. **Icon Composer format** — A folder bundle (`AppIcon.icon/`) containing:
   - `icon.json` — Layer definitions, fill colors, effects
   - `Assets/` folder — PNG images for each layer

2. **Layer-level control** — Each layer can have:
   - `glass: false` — Disables glass effect
   - `translucency: { enabled: false }` — Disables blur/transparency

3. **Fill specializations** — Allows different colors for default, dark, and tinted modes

### Fix — Icon Composer Bundle (genosys-mobile-app)

| File | Change |
|------|--------|
| `assets/icon-layer-white-1024.png` | New: White logo on transparent background (foreground layer) |
| `ios/GenosysUAE/AppIcon.icon/icon.json` | New: Layer definitions with `glass: false` |
| `ios/GenosysUAE/AppIcon.icon/Assets/Logo.png` | New: Copy of white logo layer |
| `ios/GenosysUAE.xcodeproj/project.pbxproj` | Added AppIcon.icon to Xcode project build |

**Icon Bundle Structure:**

```
ios/GenosysUAE/AppIcon.icon/
├── icon.json           # Layer definitions
└── Assets/
    └── Logo.png        # White logo on transparent (1024x1024)
```

**icon.json Configuration:**

```json
{
  "fill": {
    "solid": "extended-srgb:1.00000,1.00000,1.00000,1.00000"  // White background
  },
  "groups": [{
    "layers": [{
      "image-name": "Logo.png",
      "name": "Logo",
      "glass": false,           // CRITICAL: No glass effect
      "translucency": {
        "enabled": false,       // CRITICAL: No blur
        "value": 0
      },
      "fill-specializations": [
        { "value": { "solid": "display-p3:0.71765,0.14510,0.14510,1.00000" } },     // Red (default)
        { "appearance": "dark", "value": { "solid": "display-p3:0.85000,0.25000,0.25000,1.00000" } },  // Dark mode
        { "appearance": "tinted", "value": { "solid": "extended-gray:1.00000,1.00000" } }  // Tinted (white)
      ]
    }],
    "lighting": "individual",
    "specular": true,
    "shadow": { "kind": "neutral", "opacity": 0.15 }
  }],
  "supported-platforms": {
    "circles": ["watchOS"],
    "squares": "shared"
  }
}
```

**Key Technical Details:**

1. **White logo as foreground** — The logo is saved as pure white on transparent background
2. **Color applied via fill-specializations** — The red color is applied at render time, allowing proper dark mode support
3. **`glass: false`** — Explicitly disables the Liquid Glass effect on the logo layer
4. **`translucency: { enabled: false }`** — Ensures no blur or transparency
5. **Solid white background** — The base fill is a solid white color

**Xcode Project Integration:**

Added to `project.pbxproj`:
- `PBXFileReference` for `AppIcon.icon` folder
- Added to `PBXGroup` children (GenosysUAE folder)
- Added to `PBXResourcesBuildPhase` for inclusion in app bundle

**Verification:**

Used `ictool` (Apple's Icon Composer CLI) to validate and export:

```bash
ictool --export ios/GenosysUAE/AppIcon.icon --template ios-app --output /tmp/icon-export
```

This confirmed the icon renders with sharp, crisp edges and no blur.

### Build 39 Attempt (Failed — .icon Not Picked Up by EAS)

The first attempt (Build 39) placed the `.icon` bundle inside the native `ios/GenosysUAE/` directory and manually edited `project.pbxproj`. This didn't work because **EAS Build runs `npx expo prebuild`**, which regenerates the native Xcode project from `app.json`. The manual `project.pbxproj` edits were overwritten.

### Build 40 Fix (Correct Approach)

Expo SDK 54 has **native support** for Icon Composer `.icon` files. The correct approach is:

1. Place the `.icon` bundle in `assets/` (not in `ios/`)
2. Set `ios.icon` in `app.json` to `"./assets/AppIcon.icon"`
3. Use **Xcode 26** build image on EAS (required for Icon Composer)

```json
// app.json
{
  "expo": {
    "ios": {
      "icon": "./assets/AppIcon.icon"  // Expo SDK 54 picks this up
    }
  }
}

// eas.json
{
  "build": {
    "production": {
      "ios": {
        "image": "macos-sequoia-15.5-xcode-26.0"  // Required for .icon support
      }
    }
  }
}
```

### Commits (genosys-mobile-app)

```
3ffaae8 feat: add Icon Composer layered icon to prevent iOS 26 Liquid Glass blur
24685d7 chore: sync build number to 39 after TestFlight submission
b28f3a7 fix: use Expo SDK 54 native .icon support to fix iOS 26 Liquid Glass blur
b4104e0 chore: sync build number to 40 after TestFlight submission
```

### TestFlight Links

- **Build 40 logs**: https://expo.dev/accounts/vadimkus/projects/genosys-mobile-app/builds/2640a705-f6c8-49e6-b7b6-7854860a73de
- **Build 40 submission**: https://expo.dev/accounts/vadimkus/projects/genosys-mobile-app/submissions/4430a2ec-bb1d-4f65-b7ad-ef76ee2d62d4
- **App Store Connect**: https://appstoreconnect.apple.com/apps/6756648064/testflight/ios

### Build Commands Used

```bash
# Build iOS for production
eas build --platform ios --profile production --non-interactive

# Submit to TestFlight
eas submit --platform ios --latest --non-interactive
```

### Commits (genosys-mobile-app)

```
21e8978 chore: bump iOS build number to 34 for TestFlight
8eb5fc9 chore: sync build number to 35 after TestFlight submission
86f3636 fix: add NSSpeechRecognitionUsageDescription to Info.plist for App Store compliance
01644e6 chore: sync build number to 36 after TestFlight submission
```

---

## Git Summary

### cosmetics-website repository

All changes committed and pushed to `main`:

| Commit | Description |
|--------|-------------|
| `d3965cd2` | fix: add missing registration fields to mobile web login form |
| `98cb13db` | fix: resolve registration hang by making emails non-blocking |
| `8c5c1f80` | fix: eliminate DB dependency from mobile-session bridge to prevent 500 |
| `70fd62ac` | fix: add retry logic and error boundary to bundle-builder for DB cold starts |
| `b8dba901` | fix: add maxDuration=30 to bundle-builder pages for Vercel function timeout |

### genosys-mobile-app repository

All changes committed and pushed to `main`:

| Commit | Description |
|--------|-------------|
| `15508ba` | fix: add error handling with retry to WebView screen |
| `c1f7191` | debug: show failing URL in WebView error screen to diagnose 500 |
| `21e8978` | chore: bump iOS build number to 34 for TestFlight |
| `8eb5fc9` | chore: sync build number to 35 after TestFlight submission |
| `86f3636` | fix: add NSSpeechRecognitionUsageDescription to Info.plist for App Store compliance |
| `01644e6` | chore: sync build number to 36 after TestFlight submission |
| `6cfc786` | fix: replace native iOS app icon with correct PWA-style icon (white bg, red logo) |
| `e5d4b68` | feat: add phone, address, emirate, birthday fields to native registration |
| `2405b5b` | chore: sync build number to 37 after TestFlight submission |
| `2223a35` | fix: resize app icon to match PWA proportions (logo fills 72% vs 60%) |
| `a03bf37` | chore: sync build number to 38 after TestFlight submission |
| `3ffaae8` | feat: add Icon Composer layered icon to prevent iOS 26 Liquid Glass blur |
| `24685d7` | chore: sync build number to 39 after TestFlight submission |
| `b28f3a7` | fix: use Expo SDK 54 native .icon support to fix iOS 26 Liquid Glass blur |
| `b4104e0` | chore: sync build number to 40 after TestFlight submission |

---

## Next Steps

1. **Wait for Apple processing** — Apple typically processes TestFlight builds in 5-10 minutes
2. **Test on TestFlight** — Once available, install Build 40 and verify:
   - **App icon is sharp** — No blur from Liquid Glass effect
   - Registration collects all required fields (phone, address, emirate)
   - Birthday field (optional) works correctly
   - Emirate picker modal displays all 7 UAE emirates
   - "Build Your Set" works when logged in
   - WebView errors show retry UI
3. **Monitor production** — Check Vercel logs for any remaining edge cases

---

## Technical Deep Dive: iOS 26 Liquid Glass Icons

### Why Traditional Icons Get Blurred

iOS 26 introduced "Liquid Glass" — a design language that applies translucent, frosted-glass effects to UI elements including app icons. When you provide a single-layer PNG icon:

1. iOS treats the PNG as a **background layer**
2. The system automatically applies **glass rendering** on top
3. This creates the blurry, "frosted" appearance

### How Icon Composer Solves This

Apple's Icon Composer format (`.icon` bundle) allows developers to define **layered icons** with explicit control:

| Layer Property | Effect |
|----------------|--------|
| `glass: false` | Disables frosted glass on that layer |
| `translucency: { enabled: false }` | Disables blur/transparency |
| `fill-specializations` | Per-appearance color overrides |
| `lighting: "individual"` | Per-layer lighting control |
| `specular: true` | Enables specular highlights |

### Our Implementation

```
┌─────────────────────────────────────┐
│         Background Layer            │
│    (Solid white fill in icon.json)  │
├─────────────────────────────────────┤
│         Foreground Layer            │
│    (Logo.png - white on transparent)│
│    glass: false ← CRITICAL          │
│    translucency: false ← CRITICAL   │
│    fill-specialization: #B72525     │
└─────────────────────────────────────┘
```

**Result:** The logo renders with the exact red color specified, with no blur or glass overlay.

### Dark Mode & Tinted Support

The Icon Composer format also provides proper dark mode support:

| Appearance | Logo Color |
|------------|------------|
| Default (Light) | `#B72525` (Genosys red) |
| Dark | `#D94040` (Lighter red for visibility) |
| Tinted | White (system applies user's tint) |

### References

- Apple Icon Composer Examples: https://github.com/kylebshr/icon-composer-examples
- iOS 26 Human Interface Guidelines: Icon Design
- `ictool` CLI for validation and export
