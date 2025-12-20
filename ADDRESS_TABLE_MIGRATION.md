# Address Table Migration Guide

## Overview

This migration adds support for multiple addresses per user, replacing the single `User.address` string field with a proper `Address` table that supports:
- Multiple addresses per user (home, work, other)
- Default address selection
- Structured address fields (name, phone, address lines, city, emirate, country)
- Backward compatibility with existing `User.address` data

## Changes Made

### 1. Prisma Schema (`prisma/schema.prisma`)
- Added `Address` model with all required fields
- Added relation from `User` to `Address` (one-to-many)
- Kept `User.address` field for backward compatibility (marked as legacy)

### 2. API Routes
- **GET `/api/mobile/user/addresses`** - Get all user addresses
- **POST `/api/mobile/user/addresses`** - Create new address
- **PUT `/api/mobile/user/addresses/:id`** - Update specific address
- **DELETE `/api/mobile/user/addresses/:id`** - Delete specific address

All routes support:
- New structured format with individual fields
- Legacy format (GENOSYS_ADDR_V1: prefix or plain string)
- Automatic migration of legacy data on GET requests

### 3. Database Migration
- Created migration SQL: `prisma/migrations/20251219180000_add_address_table/migration.sql`
- Creates `addresses` table with proper indexes and foreign keys

### 4. Data Migration Script
- Created `scripts/migrate-user-addresses-to-table.ts`
- Migrates existing `User.address` data to `Address` table
- Parses legacy GENOSYS_ADDR_V1 format
- Sets first migrated address as default

## Deployment Steps

### 1. Run Database Migration

```bash
# Set direct database URL (NOT Accelerate URL)
export POSTGRES_URL="postgres://..."

# Deploy migration
npx prisma migrate deploy
```

### 2. Generate Prisma Client

```bash
npx prisma generate
```

### 3. Migrate Existing Data (Optional but Recommended)

```bash
# Run data migration script
npx tsx scripts/migrate-user-addresses-to-table.ts
```

This will:
- Find all users with addresses in `User.address`
- Parse legacy formats (GENOSYS_ADDR_V1 or plain strings)
- Create `Address` records
- Set first address as default

### 4. Deploy Code

Push the changes and deploy to production. The API routes will automatically:
- Use `Address` table for new addresses
- Fall back to `User.address` for users without migrated addresses
- Support both formats during transition

## API Usage

### Create Address

```typescript
POST /api/mobile/user/addresses
Headers:
  x-api-key: <mobile-api-key>
  Authorization: Bearer <jwt-token>

Body:
{
  type: "home" | "work" | "other",
  label?: "My Home",
  name: "John Doe",
  phone: "+971501234567",
  addressLine1: "123 Main Street",
  addressLine2?: "Apt 4B",
  city: "Dubai",
  emirate: "Dubai",
  country?: "United Arab Emirates",
  isDefault?: true
}
```

### Get Addresses

```typescript
GET /api/mobile/user/addresses
Headers:
  x-api-key: <mobile-api-key>
  Authorization: Bearer <jwt-token>

Response:
{
  success: true,
  data: [
    {
      id: "clx...",
      type: "home",
      label: "My Home",
      name: "John Doe",
      phone: "+971501234567",
      addressLine1: "123 Main Street",
      addressLine2: "Apt 4B",
      city: "Dubai",
      emirate: "Dubai",
      country: "United Arab Emirates",
      isDefault: true
    }
  ]
}
```

### Update Address

```typescript
PUT /api/mobile/user/addresses/:id
Headers:
  x-api-key: <mobile-api-key>
  Authorization: Bearer <jwt-token>

Body: (partial update - only include fields to change)
{
  label: "Updated Label",
  isDefault: true
}
```

### Delete Address

```typescript
DELETE /api/mobile/user/addresses/:id
Headers:
  x-api-key: <mobile-api-key>
  Authorization: Bearer <jwt-token>
```

## Backward Compatibility

The API maintains backward compatibility:
1. **GET requests**: If no addresses exist in `Address` table, falls back to `User.address`
2. **POST requests**: Accepts both new structured format and legacy string format
3. **Legacy format**: Supports `GENOSYS_ADDR_V1:` prefix format for smooth transition

## Address Model Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | String (cuid) | Yes | Unique identifier |
| userId | String (FK) | Yes | Reference to User |
| type | String | Yes | "home" \| "work" \| "other" |
| label | String? | No | Display label (e.g., "My Home") |
| name | String | Yes | Recipient full name |
| phone | String | Yes | Phone number |
| addressLine1 | String | Yes | Street/building |
| addressLine2 | String? | No | Apt/unit |
| city | String | Yes | City |
| emirate | String | Yes | Emirate (UAE) |
| country | String | Yes | Default: "United Arab Emirates" |
| isDefault | Boolean | Yes | Only one per user can be true |
| createdAt | DateTime | Yes | Auto-generated |
| updatedAt | DateTime | Yes | Auto-updated |

## Notes

- The `User.address` field is kept for backward compatibility but should not be used for new addresses
- Only one address per user can have `isDefault: true`
- When setting an address as default, other defaults are automatically unset
- When deleting the default address, another address is automatically set as default (if available)
- Foreign key constraint ensures addresses are deleted when user is deleted (CASCADE)

