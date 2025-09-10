# Logo File Instructions

## To use your actual GENOSYS logo:

1. **Place your logo file** in this directory (`/public/images/`)
2. **Name it exactly**: `genosys-logo.png`
3. **Supported formats**: PNG, JPG, SVG, WebP
4. **Recommended size**: At least 200x200 pixels for best quality

## Current setup:
- The Logo component is configured to load `/images/genosys-logo.png`
- The image will be automatically resized based on the size prop (sm, md, lg)
- The file will be preserved and not modified by the system

## File structure:
```
public/
  images/
    genosys-logo.png  <- Place your logo file here
    README.md         <- This file
```

Once you place your logo file, it will automatically appear on the Genosys page at `/genosys`.
