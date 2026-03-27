import sys
from PIL import Image

def remove_white_bg(input_path, output_path):
    print(f"Loading {input_path}")
    try:
        img = Image.open(input_path).convert("RGBA")
        datas = img.getdata()
        
        newData = []
        # Convert near-white pixels to transparent
        for item in datas:
            # item is (R, G, B, A)
            if item[0] > 220 and item[1] > 220 and item[2] > 220:
                newData.append((255, 255, 255, 0)) # transparent
            else:
                # keep original drawing color (dark lines), but make them opaque
                newData.append(item)
                
        img.putdata(newData)
        img.save(output_path, "PNG")
        print(f"Saved transparent image to {output_path}")
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python remove_bg.py <input> <output>")
        sys.exit(1)
    remove_white_bg(sys.argv[1], sys.argv[2])
