import sys
from PIL import Image

def process_hoodie_image(input_path, output_path):
    print(f"Loading {input_path}")
    try:
        img = Image.open(input_path).convert("RGBA")
        width, height = img.size
        
        pixels = list(img.getdata())
        
        # 2D array representation for easier flood fill
        pixel_matrix = [pixels[i:i + width] for i in range(0, len(pixels), width)]
        
        # Visited matrix
        visited = [[False for _ in range(width)] for _ in range(height)]
        
        # Start flood fill from the 4 corners
        queue = [(0,0), (width-1, 0), (0, height-1), (width-1, height-1)]
        
        # Threshold for considering a pixel "white enough" to be background
        def is_bg(rgba):
            return rgba[0] > 220 and rgba[1] > 220 and rgba[2] > 220

        # Run BFS for flood fill
        exterior = set()
        
        for start_node in queue:
            if not visited[start_node[1]][start_node[0]] and is_bg(pixel_matrix[start_node[1]][start_node[0]]):
                q = [start_node]
                visited[start_node[1]][start_node[0]] = True
                exterior.add(start_node)
                
                while q:
                    x, y = q.pop()
                    
                    # check neighbors
                    for dx, dy in [(0,1), (1,0), (0,-1), (-1,0)]:
                        nx, ny = x + dx, y + dy
                        if 0 <= nx < width and 0 <= ny < height:
                            if not visited[ny][nx] and is_bg(pixel_matrix[ny][nx]):
                                visited[ny][nx] = True
                                exterior.add((nx, ny))
                                q.append((nx, ny))
                                
        # Now create new image data
        newData = []
        for y in range(height):
            for x in range(width):
                if (x, y) in exterior:
                    newData.append((255, 255, 255, 0)) # transparent for exterior
                else:
                    newData.append(pixel_matrix[y][x]) # keep original (white body/black lines)
                    
        # Apply to image
        img.putdata(newData)
        img.save(output_path, "PNG")
        print(f"Saved perfect mask image to {output_path}")
        
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        pass
    else:
        process_hoodie_image(sys.argv[1], sys.argv[2])
