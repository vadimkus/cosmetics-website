# Register age "-1 years old" — 2026-07-31

## Incident
Admin email for new user **Daria Kolomiiets** (`dash_ks@mail.ru`) showed **Age: -1 years old**.

## Cause
Not a typed age. Admin email computes age from optional `birthday`.

- Stored birthday: **`2026-08-02`** (future relative to registration `2026-07-31`)
- Formula: year diff → `0`, then decrement because birthday month/day not yet reached → **`-1`**
- Form (`type="date"`) has no `max` / no server reject of future dates
- Template gate `if (additionalInfo?.age)` treats `-1` as truthy, so it renders

## Likely user intent
Birth **day/month** Aug 2; year left on current year by date-picker default.

## Fix (shipped)
- Shared `validateBirthday` / `getTodayYmd` / `getLocalTodayYmd` in `lib/validation.ts`
- API reject future birthdays: web + mobile register, web + mobile profile update
  (`validateUserProfileInput` / `/api/profile/update` covered via shared helper)
- Form `max={today}`: LoginClient, LoginModal, ProfileForm, profile edit, CustomerProfile
- Admin email age row only when `age >= 0`
