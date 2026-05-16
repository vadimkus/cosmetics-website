# Session — Mobile Admin Open Customer Fix (2026-05-16)

- **Issue:** On mobile `/admin`, tapping **Open customer** in the Users tab appeared to do nothing.
- **Root cause:** `MobileOwnerAdmin` called `onSelectCustomer(user)`, but the selected customer detail screen was only rendered inside the desktop admin block. On mobile, `selectedCustomer` state changed in `app/admin/page.tsx` but no mobile UI consumed it.
- **Fix:** Passed `selectedCustomer`, back, update, and delete handlers into `MobileOwnerAdmin`, and render `CustomerProfile` inside the mobile admin when a customer is selected.
- **Files changed:** `components/admin/MobileOwnerAdmin.tsx`, `app/admin/page.tsx`.
- **Verification:** `npx eslint components/admin/MobileOwnerAdmin.tsx app/admin/page.tsx` passed; `npx tsc --noEmit` passed.
