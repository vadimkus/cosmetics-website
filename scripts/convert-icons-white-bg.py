#!/usr/bin/env python3
"""
Convert PWA icons from black background to white background
Preserves the red logo and only changes black pixels to white
"""

from PIL import Image
import os

# Icon files to convert
ICON_FILES = [
    'icon-512x512.png',
    'icon-192x192.png',
    'apple-touch-icon.png',
    'apple-icon-180x180.png',
    'favicon-32x32.png',
    'favicon-16x16.png'
]

PUBLIC_DIR = os.path.join(os.path.dirname(__file__), '..', 'public')

def convert_black_to_white(image_path, output_path):
    """
    Convert black background to white while preserving the red logo
    """
    # Open the image
    img = Image.open(image_path).convert('RGBA')
    
    # Get image data
    data = img.getdata()
    
    # Create new data list
    new_data = []
    
    for item in data:
        # item is (R, G, B, A)
        r, g, b, a = item
        
        # If pixel is very dark (close to black) but not red, make it white
        # Red pixels have high R value, low G and B
        is_red = r > 100 and g < 100 and b < 100
        is_dark = r < 50 and g < 50 and b < 50
        
        if is_dark and not is_red:
            # Change black/dark pixels to white
            new_data.append((255, 255, 255, a))
        else:
            # Keep other pixels as is
            new_data.append(item)
    
    # Update image data
    img.putdata(new_data)
    
    # Convert back to RGB if needed (for compatibility)
    if img.mode == 'RGBA':
        # Create a white background
        background = Image.new('RGB', img.size, (255, 255, 255))
        background.paste(img, mask=img.split()[3])  # Use alpha channel as mask
        img = background
    
    # Save the image
    img.save(output_path, 'PNG', optimize=True)
    print(f"✅ Converted: {os.path.basename(output_path)}")

def main():
    print("🎨 Converting PWA icons to white background...\n")
    
    for icon_file in ICON_FILES:
        input_path = os.path.join(PUBLIC_DIR, icon_file)
        
        if not os.path.exists(input_path):
            print(f"⚠️  Skipping {icon_file} - file not found")
            continue
        
        # Create output path (same as input - will overwrite)
        output_path = input_path
        
        # Create backup first
        backup_path = input_path.replace('.png', '-black-bg.png')
        if not os.path.exists(backup_path):
            img = Image.open(input_path)
            img.save(backup_path)
            print(f"💾 Backup created: {os.path.basename(backup_path)}")
        
        # Convert the icon
        convert_black_to_white(input_path, output_path)
    
    print("\n✅ All icons converted successfully!")
    print("📁 Original icons backed up with '-black-bg.png' suffix")

if __name__ == '__main__':
    main()
