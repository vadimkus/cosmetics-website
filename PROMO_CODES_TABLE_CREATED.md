# Promo Codes Table - Created Successfully ✅

## 📊 Database Table Created: `promo_codes`

### Table Structure:

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | TEXT | NO | Unique identifier (cuid) |
| `code` | TEXT | NO | Promo code (e.g., "WELCOME20") - **UNIQUE** |
| `discountType` | TEXT | NO | Type identifier (e.g., "QR_SIGNUP") |
| `discountPercent` | DOUBLE PRECISION | NO | Discount percentage (e.g., 20.0) |
| `isActive` | BOOLEAN | NO | Can be used? (default: true) |
| `expiresAt` | TIMESTAMP | YES | Optional expiration date |
| `maxUses` | INTEGER | YES | Max uses (null = unlimited) |
| `usedCount` | INTEGER | NO | Times used (default: 0) |
| `description` | TEXT | YES | Admin notes |
| `createdBy` | TEXT | YES | Admin who created it |
| `createdAt` | TIMESTAMP | NO | Created timestamp |
| `updatedAt` | TIMESTAMP | NO | Last updated timestamp |

---

## 🎯 Indexes Created:

1. **`promo_codes_code_idx`** - Fast lookup by code
2. **`promo_codes_isActive_idx`** - Filter active codes
3. **`promo_codes_expiresAt_idx`** - Check expiration efficiently

---

## 🎁 Default Promo Codes Added:

### 1. **WELCOME20**
- **Code:** `WELCOME20`
- **Discount:** 20%
- **Type:** QR_SIGNUP
- **Status:** Active ✅
- **Max Uses:** Unlimited
- **Description:** "Welcome discount for new QR code registrations"

### 2. **QR20**
- **Code:** `QR20`
- **Discount:** 20%
- **Type:** QR_SIGNUP
- **Status:** Active ✅
- **Max Uses:** Unlimited
- **Description:** "QR code scan discount for new users"

---

## 🔗 QR Code URLs:

Generate QR codes for these URLs:

### URL 1:
```
https://genosys.ae/signup?promo=WELCOME20
```

### URL 2:
```
https://genosys.ae/signup?promo=QR20
```

---

## 🎨 How to Generate QR Codes:

### Option 1: Online Tool (Quick)
1. Go to: https://www.qr-code-generator.com/
2. Enter URL: `https://genosys.ae/signup?promo=WELCOME20`
3. Customize design (add logo, colors)
4. Download PNG/SVG
5. Print on marketing materials

### Option 2: Command Line (Programmatic)
```bash
npm install -g qrcode-terminal

qrcode-terminal "https://genosys.ae/signup?promo=WELCOME20"
```

### Option 3: Node.js Script
```javascript
const QRCode = require('qrcode');

QRCode.toFile('welcome20-qr.png', 'https://genosys.ae/signup?promo=WELCOME20', {
  width: 800,
  margin: 4,
  color: {
    dark: '#000000',
    light: '#FFFFFF'
  }
});
```

---

## 🔄 How It Works:

### User Journey:
1. **User scans QR code** (at clinic, event, etc.)
2. **Opens:** `https://genosys.ae/signup?promo=WELCOME20`
3. **Sees:** "20% discount applied!" banner
4. **Fills out registration form**
5. **Submits registration**
6. **Backend:**
   - Validates promo code
   - Checks if active and not expired
   - Applies 20% discount to user profile
   - Increments `usedCount`
7. **User gets:** Instant 20% discount on all orders!

### Backend Validation:
```typescript
// Pseudo-code for registration endpoint
const promoCode = request.query.promo || body.promoCode;

if (promoCode) {
  const promo = await prisma.promoCode.findUnique({
    where: { code: promoCode.toUpperCase() }
  });
  
  if (promo && promo.isActive) {
    // Check expiration
    if (!promo.expiresAt || new Date() < promo.expiresAt) {
      // Check max uses
      if (!promo.maxUses || promo.usedCount < promo.maxUses) {
        // Apply discount!
        newUser.discountType = promo.discountType;
        newUser.discountPercentage = promo.discountPercent;
        
        // Increment use count
        await prisma.promoCode.update({
          where: { id: promo.id },
          data: { usedCount: { increment: 1 } }
        });
      }
    }
  }
}
```

---

## 📊 Database Schema (Prisma):

```prisma
model PromoCode {
  id              String    @id @default(cuid())
  code            String    @unique
  discountType    String
  discountPercent Float
  isActive        Boolean   @default(true)
  expiresAt       DateTime?
  maxUses         Int?
  usedCount       Int       @default(0)
  description     String?   @db.Text
  createdBy       String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@index([code])
  @@index([isActive])
  @@index([expiresAt])
  @@map("promo_codes")
}
```

---

## 💼 Admin Management:

You can create an admin interface to:
- ✅ Add new promo codes
- ✅ Edit existing codes
- ✅ Deactivate codes
- ✅ Set expiration dates
- ✅ Set usage limits
- ✅ View usage statistics
- ✅ Track which codes are most effective

---

## 📈 Use Cases:

### QR Codes:
- **In-clinic promotions** - `CLINIC20`
- **Event marketing** - `EVENT20`
- **Partner referrals** - `PARTNER20`
- **Social media campaigns** - `SOCIAL20`

### Special Promotions:
- **Limited time** - Set `expiresAt` to end date
- **Limited quantity** - Set `maxUses` to 100
- **VIP codes** - Higher discount (e.g., `VIP30` = 30% off)
- **First-time only** - Check user has no previous orders

---

## 🎯 Next Steps:

### Backend:
1. ⏳ Update `/api/auth/register` to accept and validate promo codes
2. ⏳ Apply discount to new user based on valid promo code
3. ⏳ Increment `usedCount` when code is used
4. ⏳ Add admin endpoint to manage promo codes

### Frontend:
1. ⏳ Update signup page to detect `?promo=` URL parameter
2. ⏳ Show discount banner when promo code detected
3. ⏳ Pass promo code to registration API
4. ⏳ Show success message with discount confirmation

### QR Codes:
1. ⏳ Generate QR codes for `WELCOME20` and `QR20`
2. ⏳ Print on marketing materials
3. ⏳ Test scanning and registration flow

---

## ✅ Table Creation Status:

**Status:** ✅ **COMPLETED**

- ✅ Table `promo_codes` created
- ✅ 12 columns defined
- ✅ 3 indexes created for performance
- ✅ 2 default promo codes added (WELCOME20, QR20)
- ✅ Prisma schema updated
- ✅ Ready for use!

---

## 🔍 Quick Query Examples:

### Check all active promo codes:
```sql
SELECT code, discountPercent, usedCount 
FROM promo_codes 
WHERE isActive = true;
```

### Check specific promo code:
```sql
SELECT * FROM promo_codes WHERE code = 'WELCOME20';
```

### Get usage statistics:
```sql
SELECT code, usedCount, maxUses, 
       CASE WHEN maxUses IS NULL THEN 'Unlimited' 
            ELSE CONCAT(usedCount, '/', maxUses) 
       END as usage
FROM promo_codes
WHERE isActive = true;
```

---

**Ready to implement the registration flow! 🎉**


