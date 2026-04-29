# Mobile Owner Admin Cockpit

Date: 2026-04-29

## Context

The existing `/admin` page was responsive, but on iPhone it still behaved like the desktop dashboard compressed into a small screen. The owner workflow is operational: check users, check orders, update order status, and send orders to MoySklad.

## Change

Added a dedicated mobile-only owner admin cockpit for `/admin`.

Desktop remains unchanged. On screens below the `md` breakpoint, `/admin` now renders `MobileOwnerAdmin` instead of the desktop dashboard.

## UX

Mobile first screen:

- Header: `GENOSYS Control`
- Summary cards:
  - Open operational orders
  - Orders not yet sent to MoySklad
  - Total users loaded
- Bottom navigation:
  - `Orders`
  - `Users`

Orders mobile flow:

- Big touch-friendly order cards.
- Order number, status, customer, phone/email, total, item count, created date.
- One-tap actions:
  - Open order
  - Send to MoySklad
  - Confirm
  - Ship
  - Delivered
  - Cancel
- Existing `OrderDetails` is reused for the full detail screen, including MoySklad push and status selector.

Users mobile flow:

- Search by customer name, email, or phone.
- Recent/active customers sorted first.
- Customer cards show:
  - Name
  - Email
  - Phone
  - Discount percentage
  - Order count
  - Total spent
  - Last order date

## Files Changed

- `components/admin/MobileOwnerAdmin.tsx`
  - New mobile-only owner cockpit component.
- `app/admin/page.tsx`
  - Dynamically imports `MobileOwnerAdmin`.
  - Shows mobile cockpit under `md:hidden`.
  - Keeps existing desktop admin under `md:block`.
  - Extracts shared `handleUpdateOrderStatus` logic for desktop and mobile.

## Verification

- Focused ESLint passed:
  - `app/admin/page.tsx`
  - `components/admin/MobileOwnerAdmin.tsx`
- Full TypeScript check still fails on known pre-existing test fixture/matcher issues, not on the changed mobile admin files:
  - missing `jest-dom` matcher types in tests
  - stale `Product.stock` test fixtures
