# from PIL import Image
# import os

# async def convert_images_to_pdf(uploaded_files):
#     # Ensure the uploads directory exists
#     os.makedirs("uploads", exist_ok=True)  # Create the directory if it doesn't exist

#     image_paths = []
    
#     # A4 dimensions in pixels at 300 DPI
#     A4_WIDTH, A4_HEIGHT = 2480, 3508

#     # Save each uploaded image
#     for uploaded_file in uploaded_files:
#         image_path = os.path.join("uploads", uploaded_file.filename)
#         with open(image_path, "wb") as f:
#             f.write(await uploaded_file.read())
#         image_paths.append(image_path)

#     # Convert images to PDF
#     pdf_path = "uploads/combined.pdf"  # Specify the output PDF file name
#     images = []

#     for image_path in image_paths:
#         img = Image.open(image_path)

#         # Resize image to fit A4 while maintaining aspect ratio
#         img.thumbnail((A4_WIDTH, A4_HEIGHT), Image.LANCZOS)  # Use LANCZOS for high-quality downsampling
        
#         # Create a new blank A4 page
#         a4_page = Image.new("RGB", (A4_WIDTH, A4_HEIGHT), (255, 255, 255))  # White background
#         # Center the image on the A4 page
#         x = (A4_WIDTH - img.width) // 2
#         y = (A4_HEIGHT - img.height) // 2
#         a4_page.paste(img, (x, y))
        
#         images.append(a4_page)

#     # Save all images to a single PDF
#     images[0].save(pdf_path, save_all=True, append_images=images[1:])  # Save all images to a single PDF

#     return os.path.basename(pdf_path)  # Return just the filename
from PIL import Image
import os

async def convert_images_to_pdf(uploaded_files):
    # Ensure the uploads directory exists
    os.makedirs("uploads", exist_ok=True)  # Create the directory if it doesn't exist

    image_paths = []
    
    # Save each uploaded image
    for uploaded_file in uploaded_files:
        image_path = os.path.join("uploads", uploaded_file.filename)
        with open(image_path, "wb") as f:
            f.write(await uploaded_file.read())
        image_paths.append(image_path)

    # Convert images to PDF
    pdf_path = "uploads/combined.pdf"  # Specify the output PDF file name
    images = []

    max_width = 0
    max_height = 0

    # First pass: Determine the maximum width and height
    for image_path in image_paths:
        img = Image.open(image_path)
        max_width = max(max_width, img.width)
        max_height = max(max_height, img.height)

    # Second pass: Create pages with the maximum dimensions
    for image_path in image_paths:
        img = Image.open(image_path)

        # Resize image to fit within the maximum dimensions while maintaining aspect ratio
        img.thumbnail((max_width, max_height), Image.LANCZOS)  # Use LANCZOS for high-quality downsampling
        
        # Create a new blank page with the maximum dimensions
        page = Image.new("RGB", (max_width, max_height), (255, 255, 255))  # White background
        # Center the image on the page
        x = (max_width - img.width) // 2
        y = (max_height - img.height) // 2
        page.paste(img, (x, y))
        
        images.append(page)

    # Save all images to a single PDF
    images[0].save(pdf_path, save_all=True, append_images=images[1:])  # Save all images to a single PDF

    return os.path.basename(pdf_path)  # Return just the filename