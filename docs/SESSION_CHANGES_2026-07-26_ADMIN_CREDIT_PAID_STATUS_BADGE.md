# Admin orders — credit paid badge in STATUS

Date: 2026-07-26

## Change

`components/admin/AdminOrdersManager.tsx` — STATUS column now stacks:

1. Existing fulfillment `StatusBadge` (`DELIVERED`, etc.) — unchanged
2. For credit/consignment settlement orders (non-cancelled): a second badge
   - **Credit paid** / **Settled** (green) when `paymentStatus === paid`
   - **Credit overdue** (red) when credit past `paymentDueDate`
   - **Credit open** / **Unpaid** (amber) otherwise

## Safety

- Does **not** change `order.status` values or APIs
- Does **not** replace DELIVERED with PAID
- Mark-paid action and ORDER-column “Paid · date” line kept as before
