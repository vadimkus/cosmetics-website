# Image Optimization Guide - WebP/AVIF Implementation

## Overview
This document outlines the image optimization improvements implemented for WebP/AVIF formats to enhance performance and reduce bandwidth usage.

## What Was Implemented

### 1. Enhanced Next.js Image Configuration (`next.config.js`)
- **Format Priority**: AVIF first (better compression), then WebP fallback
- **Device Sizes**: Optimized breakpoints for responsive images
- **Image Sizes**: Predefined sizes for different use cases
- **Cache TTL**: Minimum cache time of 60 seconds

### 2. Removed `unoptimized` Flags
- **ProductCard**: Removed `unoptimized={true}` to enable WebP/AVIF conversion
- **ProductImageGallery**: Removed conditional `unoptimized` flags
- All images now automatically convert to modern formats

### 3. Enhanced Image Components

#### OptimizedImage Component
- Default quality increased to 85 (from 75)
- Changed placeholder from 'empty' to 'blur' for better UX
- Added smooth opacity transition on load

#### ProductCard
- Added blur placeholder
- Quality set to 85
- Proper sizes attribute for responsive loading

#### ProductImageGallery
- Main images: Quality 90 with blur placeholder
- Thumbnails: Quality 75 with blur placeholder
- Proper sizes attributes

#### CartItem
- Added quality and blur placeholder
- Optimized sizes for cart context

### 4. Image Optimization Utility (`lib/imageOptimization.ts`)
Created a comprehensive utility library with:

#### Quality Presets
```typescript
ImageQuality.HIGH      // 90 - Hero images, product galleries
ImageQuality.STANDARD  // 85 - Product cards, standard images
ImageQuality.LOW      // 75 - Thumbnails, small images
ImageQuality.MINIMUM  // 60 - Placeholders
```

#### Size Presets
```typescript
ImageSizes.PRODUCT_CARD     // Responsive sizes for product cards
ImageSizes.PRODUCT_GALLERY   // Product gallery main images
ImageSizes.HERO             // Hero/banner images
ImageSizes.BLOG             // Blog post images
ImageSizes.THUMBNAIL        // Small thumbnails
ImageSizes.LOGO             // Logo images
```

#### Helper Functions
- `getOptimalQuality()` - Get quality based on image type
- `getOptimalSizes()` - Get sizes attribute based on image type
- `supportsAVIF()` - Check browser AVIF support
- `supportsWebP()` - Check browser WebP support
- `getBestSupportedFormat()` - Get best format for current browser

## Benefits

### Performance Improvements
1. **Smaller File Sizes**: AVIF provides ~50% better compression than JPEG
2. **Faster Loading**: WebP/AVIF images load faster, improving LCP (Largest Contentful Paint)
3. **Better UX**: Blur placeholders provide visual feedback during loading
4. **Bandwidth Savings**: Reduced data usage, especially on mobile

### Format Support
- **AVIF**: Supported in Chrome 85+, Firefox 93+, Safari 16+
- **WebP**: Supported in Chrome 23+, Firefox 65+, Edge 18+, Safari 14+
- **Fallback**: Automatic JPEG fallback for older browsers

## Usage Examples

### Using OptimizedImage Component
```tsx
import OptimizedImage from '@/components/OptimizedImage'

<OptimizedImage
  src="/images/product.jpg"
  alt="Product name"
  width={300}
  height={300}
  quality={85}
  priority={false}
/>
```

### Using Image Optimization Utilities
```tsx
import { ImageQuality, ImageSizes, getOptimalQuality } from '@/lib/imageOptimization'

// Get optimal quality for product images
const quality = getOptimalQuality('product', false) // Returns 85

// Use predefined sizes
<Image
  src="/images/product.jpg"
  sizes={ImageSizes.PRODUCT_CARD}
  quality={ImageQuality.STANDARD}
/>
```

### Direct Next.js Image Usage
```tsx
import Image from 'next/image'

<Image
  src="/images/product.jpg"
  alt="Product"
  width={300}
  height={300}
  quality={85}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
/>
```

## Best Practices

1. **Always specify width and height** to prevent layout shift
2. **Use appropriate quality** based on image importance:
   - Hero images: 90
   - Product images: 85
   - Thumbnails: 75
3. **Use blur placeholders** for better perceived performance
4. **Set priority={true}** only for above-the-fold images
5. **Use proper sizes attributes** for responsive images

## Testing

### Verify Optimization
1. Open browser DevTools → Network tab
2. Filter by "Img" or "Image"
3. Check response headers:
   - `Content-Type: image/avif` or `image/webp`
   - Smaller file sizes compared to original

### Browser Support Testing
- Test in Chrome/Edge (AVIF support)
- Test in Firefox (AVIF support)
- Test in Safari 16+ (AVIF support)
- Test in older browsers (WebP/JPEG fallback)

## Performance Metrics

Expected improvements:
- **File Size Reduction**: 40-60% smaller than JPEG
- **LCP Improvement**: 0.5-1.5 seconds faster
- **Bandwidth Savings**: 30-50% reduction on image-heavy pages

## Migration Notes

### Before
```tsx
<Image
  src="/images/product.jpg"
  alt="Product"
  width={300}
  height={300}
  unoptimized={true}  // ❌ Bypasses optimization
/>
```

### After
```tsx
<Image
  src="/images/product.jpg"
  alt="Product"
  width={300}
  height={300}
  quality={85}        // ✅ Optimized quality
  placeholder="blur"  // ✅ Better UX
  // unoptimized removed ✅
/>
```

## Troubleshooting

### Images not converting to WebP/AVIF?
1. Check `next.config.js` has `formats: ['image/avif', 'image/webp']`
2. Ensure `unoptimized: false` in config
3. Verify image is served through Next.js Image component
4. Check browser DevTools Network tab for actual format

### Blur placeholder not showing?
1. Ensure `placeholder="blur"` is set
2. Provide `blurDataURL` or use default
3. Check image is loading correctly

### Quality issues?
1. Adjust quality value (60-100)
2. Higher quality = larger files
3. Test different quality levels for your use case

## Future Enhancements

Potential improvements:
1. **Lazy loading optimization**: Implement intersection observer for better lazy loading
2. **Image CDN integration**: Use CDN for even faster delivery
3. **Automatic format detection**: Detect best format based on image content
4. **Progressive image loading**: Implement progressive JPEG/WebP loading
5. **Responsive image generation**: Auto-generate multiple sizes

## References

- [Next.js Image Optimization](https://nextjs.org/docs/app/api-reference/components/image)
- [AVIF Format](https://caniuse.com/avif)
- [WebP Format](https://caniuse.com/webp)
- [Image Optimization Best Practices](https://web.dev/fast/#optimize-your-images)

