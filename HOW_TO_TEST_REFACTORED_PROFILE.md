# How to Test the Refactored Profile Page

## 🚀 Quick Steps (Recommended)

### Step 1: Switch to Refactored Version

Run these commands:

```bash
cd /Users/vadimkus/cosmetics-website

# Backup current production page
mv app/profile/page.tsx app/profile/page-production-backup.tsx

# Use refactored version
cp app/profile/page-refactored.tsx app/profile/page.tsx
```

### Step 2: Restart Server (if not already running)

The server should auto-reload, but if needed:
```bash
# Kill existing server
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Start dev server
npm run dev
```

### Step 3: Test in Browser

1. Open: **http://localhost:3000/profile**
2. Login if needed
3. Test all features (see checklist below)

---

## ✅ Quick Test Checklist

### Visual Checks (5 seconds)
- [ ] Name displays with gradient text (gray gradient)
- [ ] "Family Member #X" badge shows with Sparkles icon (red gradient)
- [ ] "Member since YYYY" badge shows with Calendar icon
- [ ] All looks identical to current design

### Functionality Tests (2 minutes)

#### Profile Tab:
- [ ] Click "Edit" button - form becomes editable
- [ ] Change name/phone/address - fields update
- [ ] Click "Save Changes" - profile updates successfully
- [ ] Scroll down - see "Need Help?" section with WhatsApp link
- [ ] Scroll more - see "Skin Recommendation" section

#### Orders Tab:
- [ ] Orders display correctly
- [ ] Click "Cancel Order" on a pending order
- [ ] Modal appears (NOT browser confirm popup)
- [ ] Click "Cancel" in modal - modal closes
- [ ] Click "Cancel Order" again, then "Yes, Cancel Order" - order cancels

#### Settings Tab:
- [ ] Click "Delete Account"
- [ ] Modal appears with warning
- [ ] Click "Cancel" - modal closes
- [ ] All settings display correctly

---

## 🔄 Revert to Production Version

If something doesn't work, revert immediately:

```bash
cd /Users/vadimkus/cosmetics-website

# Remove refactored version
rm app/profile/page.tsx

# Restore production version
mv app/profile/page-production-backup.tsx app/profile/page.tsx

# Restart server
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
npm run dev
```

---

## 🧪 Detailed Testing Checklist

For comprehensive testing, see: `PROFILE_REFACTORING_TEST_CHECKLIST.md`

---

## 💡 Pro Tips

1. **Test in Incognito/Private Window** - Fresh session, no cache
2. **Open Browser DevTools (F12)** - Check for console errors
3. **Test on Mobile View** - Resize browser to mobile width
4. **Test with Different Users** - If you have test accounts

---

## ⚠️ What to Look For

### ✅ Should Work:
- All tabs navigate correctly
- Profile editing saves successfully
- Order cancellation works with modal
- Support and Skin Recommendation sections visible
- All styling matches current design

### ❌ Red Flags:
- Console errors (F12 → Console tab)
- White screen or blank page
- Missing sections (Support, Skin Recommendation)
- Browser confirm popup instead of modal for order cancellation
- Styling differences from current design

---

## 📊 Current Status

- ✅ Build: PASSED
- ✅ TypeScript: PASSED
- ✅ Bundle size: 15.1 kB
- ✅ All components: Ready
- ✅ CSRF Protection: Implemented
- ✅ Visual Design: Matches production

---

## 🆘 Need Help?

If something goes wrong:
1. Check browser console (F12)
2. Revert to production version (see above)
3. All backups are in:
   - `app/profile/page-refactored.backup.tsx`
   - `app/profile/page-production-backup.tsx` (after backup)
   - `components/profile/*.backup.tsx`

