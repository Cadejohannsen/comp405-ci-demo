from PIL import Image, ImageDraw

# Create a new image with transparent background
size = 256
img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
draw = ImageDraw.Draw(img)

# Car color - sleek dark gray
car_color = (40, 40, 40, 255)  # Dark gray
accent_color = (225, 6, 0, 255)  # Red accent (F1 inspired)

# Draw car silhouette
# Main body
body_points = [
    (40, 120),    # Front bottom
    (60, 100),    # Front wheel well
    (80, 100),    # Front wheel well
    (90, 85),     # Hood start
    (140, 85),    # Hood end (windshield start)
    (145, 75),    # Windshield top
    (180, 75),    # Windshield top end
    (185, 85),    # Rear windshield start
    (210, 85),    # Rear windshield end
    (220, 100),   # Rear wheel well
    (240, 100),   # Rear wheel well
    (260, 120),   # Rear bottom
    (260, 140),   # Rear side
    (40, 140),    # Front side
]

draw.polygon(body_points, fill=car_color)

# Draw windows
window_color = (180, 200, 220, 255)  # Light blue
windshield_points = [(145, 75), (180, 75), (185, 85), (140, 85)]
draw.polygon(windshield_points, fill=window_color)

rear_window_points = [(185, 85), (210, 85), (220, 100), (180, 100)]
draw.polygon(rear_window_points, fill=window_color)

# Draw wheels
wheel_color = (20, 20, 20, 255)  # Very dark
front_wheel = [(60, 110), (80, 110), (80, 130), (60, 130)]
rear_wheel = [(220, 110), (240, 110), (240, 130), (220, 130)]
draw.polygon(front_wheel, fill=wheel_color)
draw.polygon(rear_wheel, fill=wheel_color)

# Draw red accent stripe
stripe_points = [(100, 105), (200, 105), (200, 110), (100, 110)]
draw.polygon(stripe_points, fill=accent_color)

# Add headlights
headlight_color = (255, 255, 200, 255)  # Light yellow
draw.ellipse((35, 115, 45, 125), fill=headlight_color)
draw.ellipse((255, 115, 265, 125), fill=headlight_color)

# Save as icon with multiple sizes
sizes = [(256, 256), (128, 128), (64, 64), (48, 48), (32, 32), (16, 16)]
icons = []

for size_tuple in sizes:
    resized = img.resize(size_tuple, Image.Resampling.LANCZOS)
    icons.append(resized)

# Save as ICO
icons[0].save('x:\\Comp405\\New folder\\car-compare\\CarIcon.ico', 
               format='ICO', 
               sizes=[(256,256),(128,128),(64,64),(48,48),(32,32),(16,16)])

print("Car icon created successfully!")
