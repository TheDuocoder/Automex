#!/usr/bin/env python3
"""
Script to replace image backgrounds with pure white
"""
from PIL import Image
import os

def add_white_background(image_path):
    """Add pure white background to image"""
    # Open the image
    img = Image.open(image_path).convert('RGBA')
    
    # Create a white background
    white_bg = Image.new('RGBA', img.size, (255, 255, 255, 255))
    
    # Composite the image on white background
    result = Image.alpha_composite(white_bg, img)
    
    # Convert to RGB (removes alpha channel)
    result_rgb = result.convert('RGB')
    
    # Save the image
    result_rgb.save(image_path.replace('.png', '_fixed.png'))
    print(f"Fixed: {image_path}")

# Images to fix
images = [
    "/Users/bhabanishankarswain/Automex/Frontend/public/images/Car_images/skoda/Kylaq.png",
    "/Users/bhabanishankarswain/Automex/Frontend/public/images/Car_images/skoda/Superb.png",
    "/Users/bhabanishankarswain/Automex/Frontend/public/images/Car_images/skoda/Yeti.png"
]

for img_path in images:
    if os.path.exists(img_path):
        add_white_background(img_path)
    else:
        print(f"File not found: {img_path}")

print("\nFixed images created with '_fixed.png' suffix")
print("Review them and rename to replace originals if satisfied")
