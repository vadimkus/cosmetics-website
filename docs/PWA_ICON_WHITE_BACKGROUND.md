# PWA Icon White Background Update

## Summary
Updated all PWA (Progressive Web App) icons from black background to white background while preserving the red Genosys logo.

## Date
December 14, 2025

## Changes Made

### Icons Updated
All the following icon files now have white backgrounds instead of black:

1. **icon-512x512.png** - Main PWA icon (512x512)
2. **icon-192x192.png** - PWA icon (192x192)
3. **apple-touch-icon.png** - Apple Touch Icon (180x180)
4. **apple-icon-180x180.png** - Apple Icon (180x180)
5. **favicon-32x32.png** - Favicon 32x32
6. **favicon-16x16.png** - Favicon 16x16
7. **favicon.ico** - Main favicon

### Design
- **Background**: Changed from black (#000000) to white (#FFFFFF)
- **Logo**: Red geometric logo preserved exactly as before
- **Quality**: All icons optimized for web delivery

### Backups
Original black background icons are backed up with the suffix `-black-bg`:
- `icon-512x512-black-bg.png`
- `icon-192x192-black-bg.png`
- `apple-touch-icon-black-bg.png`
- `apple-icon-180x180-black-bg.png`
- `favicon-32x32-black-bg.png`
- `favicon-16x16-black-bg.png`
- `favicon-black-bg.ico`

## Technical Details

### Conversion Method
Used Python with PIL (Pillow) library to:
1. Load each icon in RGBA mode
2. Identify dark/black pixels (R, G, B < 50)
3. Preserve red pixels (R > 100, G < 100, B < 100)
4. Replace black pixels with white
5. Save with optimization

### Scripts Created
- `scripts/convert-icons-white-bg.py` - Converts PNG icons
- `scripts/convert-favicon-white-bg.py` - Converts favicon.ico

## Testing
After deployment, verify the icons appear correctly:

### Desktop
- Visit https://genosys.ae
- Check browser tab favicon
- Check if "Add to Desktop" icon shows correctly

### Mobile
1. **iOS Safari**:
   - Visit https://genosys.ae
   - Tap Share → Add to Home Screen
   - Verify icon has white background

2. **Android Chrome**:
   - Visit https://genosys.ae
   - Tap Menu → Add to Home Screen
   - Verify icon has white background

3. **PWA Install**:
   - Install the PWA when prompted
   - Check app icon on home screen
   - Verify splash screen icon

## Manifest.json
No changes needed to `manifest.json` - it already references these icon files:
```json
"icons": [
  { "src": "/icon-192x192.png", "sizes": "192x192", "type": "image/png" },
  { "src": "/icon-512x512.png", "sizes": "512x512", "type": "image/png" },
  { "src": "/apple-touch-icon.png", "sizes": "180x180", "type": "image/png" }
]
```

The manifest already specifies `"background_color": "#ffffff"`, which now matches the icon backgrounds.

## Rollback Instructions
If needed, to restore black background icons:

```bash
cd /Users/vadimkus/cosmetics-website/public

# Restore all icons
mv icon-512x512-black-bg.png icon-512x512.png
mv icon-192x192-black-bg.png icon-192x192.png
mv apple-touch-icon-black-bg.png apple-touch-icon.png
mv apple-icon-180x180-black-bg.png apple-icon-180x180.png
mv favicon-32x32-black-bg.png favicon-32x32.png
mv favicon-16x16-black-bg.png favicon-16x16.png
mv favicon-black-bg.ico favicon.ico
```

## Related Files
- `/public/icon-512x512.png` - Main PWA icon
- `/public/icon-192x192.png` - PWA icon
- `/public/apple-touch-icon.png` - iOS icon
- `/public/favicon.ico` - Browser favicon
- `/public/manifest.json` - PWA manifest (unchanged)
- `/scripts/convert-icons-white-bg.py` - Conversion script
- `/scripts/convert-favicon-white-bg.py` - Favicon conversion script

## Benefits
1. ✅ Better visibility on mobile home screens (many phones have dark backgrounds)
2. ✅ Consistent with modern design trends (white/light icons)
3. ✅ Matches the manifest's `background_color: #ffffff`
4. ✅ Professional appearance across all platforms
5. ✅ Original black background icons preserved as backups

## Preview

### Before (Black Background)
- Red logo on black background
- May be hard to see on dark home screens

### After (White Background)
- Red logo on white background
- Clear visibility on all backgrounds
- Professional, modern appearance
