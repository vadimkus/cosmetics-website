# Gift Certificate Feature - GENOSYS

## Overview
Beautiful, printable digital gift certificates accessible at `https://www.genosys.ae/certificate/[CODE]`

## Features Implemented

✅ **Dynamic Routing**: Certificate codes can be accessed via `/certificate/[code]` URLs
✅ **Beautiful Design**: Luxury cosmetics theme with gold accents, soft pastels, and elegant typography
✅ **Print-Friendly**: Optimized A4 print layout with print button
✅ **Responsive**: Works on all devices - desktop, tablet, and mobile
✅ **SEO Optimized**: Proper metadata and social sharing tags
✅ **Animations**: Subtle fade-in, shimmer, and float animations for premium feel
✅ **Validation**: Certificate code validation (alphanumeric, 4-10 characters)
✅ **Bilingual Ready**: Structure supports easy addition of Russian/Arabic translations

## Live URLs

### Development
- Main certificate: http://localhost:3001/certificate/178B2
- Test certificate: http://localhost:3001/certificate/ABC123

### Production (after deployment)
- https://www.genosys.ae/certificate/178B2
- https://www.genosys.ae/certificate/[ANY_VALID_CODE]

## Files Created

```
/app/certificate/[code]/
  ├── page.tsx           # Server component with metadata and validation
  └── CertificateClient.tsx  # Client component with certificate UI
```

## Certificate Details (Code: 178B2)

- **Amount**: 200 AED
- **Validity**: 6 months from issue date
- **Issue Date**: December 29, 2025
- **Expiry Date**: June 29, 2026

## Design Features

### Visual Elements
- **Colors**: Soft rose (50-500), pink, purple gradients, gold accents (#d4af37)
- **Logo**: Official GENOSYS logo from `/Logo/BIGLogo-high.png`
- **Typography**: Clean sans-serif with decorative serif for headings
- **Icons**: Lucide React icons (Gift, Calendar, Phone, Mail, Globe, Sparkles, Award)
- **Animations**: Fade-in-up, shimmer on gold elements, floating sparkles
- **Ornaments**: Corner decorations, decorative borders, patterned backgrounds

### Layout Sections
1. **Header**: GENOSYS logo prominently displayed
2. **Title**: "Gift Certificate" with decorative gift icons
3. **Certificate Number**: Large, bold, gold-accented badge
4. **Amount**: Prominent circular badge with gradient (200 AED)
5. **Description**: Clear explanation of certificate value
6. **Redemption Instructions**: How to use the certificate
7. **Validity Period**: Dates and expiry information
8. **Footer**: Contact information (email, phone, website)

### Print Optimization
- A4 page size
- Removes action buttons and URLs when printing
- Maintains colors and decorations
- Page-break-inside: avoid
- Print-specific CSS with `@media print`

## How to Use

### For Customers
1. Navigate to the certificate URL
2. View the beautiful certificate on screen
3. Click "Print Certificate" button for PDF/print
4. Share the URL or screenshot via WhatsApp, email, or social media
5. Present the code during checkout to redeem

### For Administrators
1. Generate unique codes (e.g., using a simple algorithm or random generator)
2. Share the URL: `https://www.genosys.ae/certificate/[CODE]`
3. Track redemptions (see Database Integration section below)

## Certificate Code Validation

Current validation rules:
- Alphanumeric characters (A-Z, 0-9)
- Case-insensitive
- Length: 4-10 characters
- Invalid codes return 404 Not Found

### Example Valid Codes
- `178B2` ✅
- `ABC123` ✅
- `GENOSYS2025` ✅
- `5X7K` ✅

### Example Invalid Codes
- `ABC` ❌ (too short)
- `ABCDEFGHIJK` ❌ (too long)
- `ABC-123` ❌ (contains hyphen)
- `ABC 123` ❌ (contains space)

## Customization

### Changing Certificate Values

Edit `/app/certificate/[code]/page.tsx`:

```typescript
const certificateData = {
  code: code.toUpperCase(),
  amount: code === '178B2' ? 200 : 100, // Customize amounts per code
  currency: 'AED',
  issueDate: '2025-12-29',
  validityMonths: 6,
}
```

### Adding Translations

To add Russian or Arabic:

1. Wrap text in translation function (next-intl)
2. Add translations to `/messages/en.json`, `/messages/ru.json`, `/messages/ar.json`
3. Update component to use `useTranslations()`

Example:
```typescript
import { useTranslations } from 'next-intl'

const t = useTranslations('certificate')
<h1>{t('title')}</h1>
```

### Styling Adjustments

All styles are in `/app/certificate/[code]/CertificateClient.tsx`:
- Colors: Tailwind classes (rose-*, pink-*, gold-*)
- Animations: `@keyframes` in `<style jsx global>`
- Layout: Flexbox and Grid with responsive breakpoints

## Database Integration (Optional)

### Recommended Schema

Add to `/prisma/schema.prisma`:

```prisma
model GiftCertificate {
  id            String    @id @default(cuid())
  code          String    @unique
  amount        Int
  currency      String    @default("AED")
  issueDate     DateTime  @default(now())
  expiryDate    DateTime
  validityMonths Int      @default(6)
  
  // Redemption tracking
  isRedeemed    Boolean   @default(false)
  redeemedAt    DateTime?
  redeemedBy    String?   // User ID or email
  orderId       String?   // Link to order
  
  // Metadata
  createdBy     String?   // Admin who created it
  recipientName String?
  recipientEmail String?
  message       String?
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  @@index([code])
  @@index([isRedeemed])
}
```

### API Endpoints to Create

1. **GET /api/certificate/[code]** - Fetch certificate details
2. **POST /api/admin/certificates/create** - Generate new certificate
3. **POST /api/certificate/redeem** - Mark certificate as redeemed
4. **GET /api/admin/certificates** - List all certificates

### Example API Route

Create `/app/api/certificate/[code]/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { code: string } }
) {
  try {
    const certificate = await prisma.giftCertificate.findUnique({
      where: { code: params.code.toUpperCase() },
    })
    
    if (!certificate) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 })
    }
    
    // Check if expired
    const isExpired = new Date() > certificate.expiryDate
    
    return NextResponse.json({
      ...certificate,
      isExpired,
      canRedeem: !certificate.isRedeemed && !isExpired,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

### Update Page to Use Database

Modify `/app/certificate/[code]/page.tsx`:

```typescript
import { prisma } from '@/lib/prisma'

export default async function CertificatePage({ params }: Props) {
  const { code } = await params
  
  // Fetch from database
  const certificate = await prisma.giftCertificate.findUnique({
    where: { code: code.toUpperCase() },
  })
  
  if (!certificate) {
    notFound()
  }
  
  const certificateData = {
    code: certificate.code,
    amount: certificate.amount,
    currency: certificate.currency,
    issueDate: certificate.issueDate.toISOString().split('T')[0],
    validityMonths: certificate.validityMonths,
  }
  
  return <CertificateClient {...certificateData} />
}
```

## Testing Checklist

- [x] Certificate page loads successfully
- [x] Valid codes display certificate (178B2, ABC123)
- [x] Invalid codes show 404
- [x] Print button works
- [x] Responsive on mobile/tablet/desktop
- [x] Print layout is A4-friendly
- [ ] Test on actual printer/PDF generator
- [ ] Test social media sharing (Facebook, WhatsApp)
- [ ] Test with database integration (if implemented)

## Future Enhancements

1. **QR Code**: Add QR code for easy mobile scanning
   ```bash
   npm install qrcode.react
   ```

2. **Email Templates**: Send certificate via email to recipient
3. **Admin Panel**: UI for creating/managing certificates
4. **Redemption Tracking**: Show redemption history in admin panel
5. **Bulk Generation**: Create multiple certificates at once
6. **Custom Designs**: Different designs based on occasion (birthday, holiday, etc.)
7. **Variable Amounts**: Allow custom amounts instead of fixed values
8. **Multi-language**: Full i18n support for Arabic and Russian

## Security Considerations

⚠️ **Important**: 
- Use secure, random code generation (crypto.randomBytes)
- Implement rate limiting on certificate validation
- Add CSRF protection for redemption endpoints
- Log all redemption attempts for audit
- Consider adding expiry checks
- Implement fraud detection for repeated redemption attempts

## Contact & Support

For issues or questions:
- **Email**: sales@genosys.ae
- **Phone**: +971 58 548 76 65
- **Website**: https://www.genosys.ae

## Deployment

### Prerequisites
- Node.js 18+ installed
- Next.js 16.0.7
- Prisma (if using database)

### Deploy to Vercel

```bash
# Push to GitHub
git add .
git commit -m "Add gift certificate feature"
git push

# Deploy via Vercel CLI or connect GitHub repo to Vercel
vercel --prod
```

### Environment Variables

If using database integration, ensure these are set:

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..." # For Prisma migrations
```

## License

This feature is part of the GENOSYS Middle East FZ-LLC website. All rights reserved.

---

**Created**: December 29, 2025
**Version**: 1.0.0
**Status**: ✅ Production Ready



