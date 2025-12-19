# Scripts Directory

## Active Scripts

### User Management
- `check-apple-user-data.ts` - Check Apple Sign-In user data
- `change-user-password.ts` - Change user password
- `create-admin-user.js` - Create admin user
- `fix-apple-user-names.ts` - Fix Apple user names
- `find-user.js` - Find user by email
- `check-user-auth-method.js` - Check user authentication method
- `check-user-discount-status.js` - Check user discount status

### Testing & Debugging
- `test-mobile-api.js` - Test mobile API endpoints
- `test-mobile-localization.ts` - Test mobile app localization
- `test-user-and-orders.js` - Test user and order functionality
- `test-password-reset-comprehensive.js` - Test password reset flow
- `check-password-reset-requests.js` - Check password reset requests
- `check-profile-picture-column.ts` - Check profile picture column

### Email & Campaigns
- `send-sample-emails.js` - Send sample emails for testing
- `send-discount-test-email.ts` - Send discount email
- `send-welcome-email.js` - Send welcome email

### Orders & Products
- `create-test-orders.ts` - Create test orders
- `check-product-description.ts` - Check product descriptions

### Blog Management
- `create-blog-direct-db.ts` - Create blog posts directly in database
- `create-blog-via-localhost.js` - Create blog posts via localhost API
- `create-blog-with-env.js` - Create blog posts with environment variables
- `add-payment-blog-post.ts` - Add payment blog post
- `setup-russian-blog.ts` - Setup Russian blog

### Deployment & Validation
- `deploy-setup.js` - Setup deployment configuration
- `validate-sitemap.js` - Validate sitemap

### Icon/Image Processing
- `convert-icons-white-bg.py` - Convert icons to white background
- `convert-favicon-white-bg.py` - Convert favicon
- `add-biomeso2-image.js` - Add BioMeso2 image
- `add-spacing-after-biomeso.js` - Add spacing after BioMeso

### Security & Password
- `check-plaintext-passwords.js` - Check for plaintext passwords
- `verify-contact-email-column.ts` - Verify contact email column

## Archived Scripts

Completed migrations, translations, and campaigns have been moved to:

### `archive/migrations/` - Database Migrations
- Russian columns migrations (6 files)
- Payment fields migrations
- Variant migrations
- Profile picture, gender, billing fields
- Expo push token, order notes columns
- Price sync and comparison scripts

### `archive/translations/` - Translation Scripts
- Russian translation scripts (8 files)
- Product translation batches
- Blog translation scripts
- Comprehensive translation utilities

### `archive/campaigns/` - Marketing Campaigns
- Black Friday campaign scripts
- Black Friday blog posts

## Usage

Most TypeScript scripts can be run with:
```bash
npx ts-node scripts/script-name.ts
```

JavaScript scripts:
```bash
node scripts/script-name.js
```

**Important:** For database scripts, ensure environment variables are set in `.env` file.

## Notes

- Active scripts are frequently used utilities and tools
- Archived scripts are completed one-time migrations
- Do not delete archived scripts - they serve as documentation
- Check script source for specific usage instructions
