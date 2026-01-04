#!/usr/bin/env python3
"""
Verify Maskable Icons for PWA
Checks if icons follow maskable icon guidelines:
- 192x192 icon should have ~40px padding (safe zone at 80%)
- 512x512 icon should have ~102px padding (safe zone at 80%)
"""

import sys
from PIL import Image
import os

def analyze_maskable_icon(image_path, expected_size):
    """Analyze a maskable icon to check if it follows guidelines"""
    
    if not os.path.exists(image_path):
        return {
            'exists': False,
            'error': f'File not found: {image_path}'
        }
    
    try:
        img = Image.open(image_path)
        width, height = img.size
        
        # Check if image is square
        if width != height:
            return {
                'exists': True,
                'valid': False,
                'error': f'Icon is not square: {width}x{height}'
            }
        
        # Check if size matches expected
        if width != expected_size:
            return {
                'exists': True,
                'valid': False,
                'error': f'Icon size is {width}x{height}, expected {expected_size}x{expected_size}'
            }
        
        # Calculate safe zone (80% of icon)
        safe_zone_size = int(expected_size * 0.8)
        padding = int((expected_size - safe_zone_size) / 2)
        
        # Analyze pixel data to check if content is within safe zone
        pixels = img.load()
        
        # Check corners (should be mostly transparent or background)
        corner_size = padding
        corners_clear = True
        
        # Top-left corner
        non_white_pixels = 0
        for x in range(corner_size):
            for y in range(corner_size):
                pixel = pixels[x, y]
                # Check if pixel is not white (assuming white background)
                if len(pixel) >= 3:
                    r, g, b = pixel[0], pixel[1], pixel[2]
                    if r < 240 or g < 240 or b < 240:
                        non_white_pixels += 1
        
        corner_total_pixels = corner_size * corner_size
        corner_fill_percentage = (non_white_pixels / corner_total_pixels) * 100
        
        # If corners have significant content, icon might not follow guidelines
        has_proper_padding = corner_fill_percentage < 30  # Less than 30% filled
        
        return {
            'exists': True,
            'valid': True,
            'size': f'{width}x{height}',
            'expected_size': f'{expected_size}x{expected_size}',
            'safe_zone': f'{safe_zone_size}x{safe_zone_size}',
            'recommended_padding': f'{padding}px',
            'corner_fill_percentage': f'{corner_fill_percentage:.1f}%',
            'has_proper_padding': has_proper_padding,
            'format': img.format,
            'mode': img.mode,
            'warning': None if has_proper_padding else 'Icon may not have proper safe zone padding'
        }
        
    except Exception as e:
        return {
            'exists': True,
            'valid': False,
            'error': f'Error analyzing icon: {str(e)}'
        }

def main():
    base_path = '/Users/vadimkus/cosmetics-website/public'
    
    icons = [
        {
            'path': os.path.join(base_path, 'icon-192x192-maskable.png'),
            'size': 192,
            'name': 'icon-192x192-maskable.png'
        },
        {
            'path': os.path.join(base_path, 'icon-512x512-maskable.png'),
            'size': 512,
            'name': 'icon-512x512-maskable.png'
        }
    ]
    
    print("=" * 70)
    print("MASKABLE ICONS VERIFICATION REPORT")
    print("=" * 70)
    print()
    
    all_valid = True
    
    for icon in icons:
        print(f"Analyzing: {icon['name']}")
        print("-" * 70)
        
        result = analyze_maskable_icon(icon['path'], icon['size'])
        
        if not result['exists']:
            print(f"❌ ERROR: {result['error']}")
            all_valid = False
        elif not result.get('valid', False):
            print(f"❌ ERROR: {result['error']}")
            all_valid = False
        else:
            print(f"✅ File exists: {icon['path']}")
            print(f"✅ Size: {result['size']} (Expected: {result['expected_size']})")
            print(f"✅ Format: {result['format']}")
            print(f"✅ Color Mode: {result['mode']}")
            print(f"📏 Safe Zone: {result['safe_zone']}")
            print(f"📏 Recommended Padding: {result['recommended_padding']}")
            print(f"📊 Corner Fill: {result['corner_fill_percentage']}")
            
            if result['has_proper_padding']:
                print(f"✅ Padding: Appears to have proper safe zone")
            else:
                print(f"⚠️  WARNING: {result['warning']}")
                all_valid = False
        
        print()
    
    print("=" * 70)
    print("SUMMARY")
    print("=" * 70)
    
    if all_valid:
        print("✅ All maskable icons are properly formatted!")
        print()
        print("Next steps:")
        print("1. Test icons at https://maskable.app/")
        print("2. Verify icons display correctly on Android devices")
        print("3. Check manifest.json references are correct")
        return 0
    else:
        print("⚠️  Some issues found with maskable icons")
        print()
        print("Recommendations:")
        print("1. Ensure icons have proper safe zone (80% content, 20% padding)")
        print("2. Use Maskable.app to validate icons")
        print("3. Regenerate icons if needed")
        return 1

if __name__ == '__main__':
    sys.exit(main())


