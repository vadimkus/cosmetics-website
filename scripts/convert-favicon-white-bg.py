#!/usr/bin/env python3
"""
Convert favicon.ico from black background to white background
"""

from PIL import Image
import os

PUBLIC_DIR = os.path.join(os.path.dirname(__file__), '..', 'public')

def convert_favicon():
    """
    Convert favicon.ico to white background
    """
    input_path = os.path.join(PUBLIC_DIR, 'favicon.ico')
    
    if not os.path.exists(input_path):
        print("⚠️  favicon.ico not found")
        return
    
    # Create backup
    backup_path = os.path.join(PUBLIC_DIR, 'favicon-black-bg.ico')
    if not os.path.exists(backup_path):
        img = Image.open(input_path)
        img.save(backup_path)
        print(f"💾 Backup created: favicon-black-bg.ico")
    
    # Open the favicon (it may contain multiple sizes)
    img = Image.open(input_path)
    
    # Convert to RGBA
    img = img.convert('RGBA')
    
    # Get image data
    data = img.getdata()
    
    # Create new data list
    new_data = []
    
    for item in data:
        # item is (R, G, B, A)
        r, g, b, a = item
        
        # If pixel is very dark (close to black) but not red, make it white
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
    
    # Convert to RGB with white background
    if img.mode == 'RGBA':
        background = Image.new('RGB', img.size, (255, 255, 255))
        background.paste(img, mask=img.split()[3])
        img = background
    
    # Save as ICO
    img.save(input_path, format='ICO')
    print(f"✅ Converted: favicon.ico")

def main():
    print("🎨 Converting favicon.ico to white background...\n")
    convert_favicon()
    print("\n✅ Favicon converted successfully!")

if __name__ == '__main__':
    main()
