from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from PIL import Image
from typing import List
import os

app = FastAPI(title="Image Converter API")

# CORS settings (adjust for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = 'uploads/'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.post("/convert/")
async def convert_images(files: List[UploadFile] = File(...)):
    jpg_filenames = []

    for file in files:
        if not file.filename.lower().endswith('.png'):
            raise HTTPException(status_code=400, detail="Only PNG files are supported")

        # Sanitize filename
        safe_name = file.filename.replace(" ", "_")
        png_path = os.path.join(UPLOAD_FOLDER, safe_name)
        jpg_filename = os.path.splitext(safe_name)[0] + '.jpg'
        jpg_path = os.path.join(UPLOAD_FOLDER, jpg_filename)

        # Save uploaded PNG
        with open(png_path, "wb") as f:
            f.write(await file.read())

        # Convert PNG to JPG
        with Image.open(png_path) as img:
            rgb_img = img.convert('RGB')  # Convert to RGB
            rgb_img.save(jpg_path, format='JPEG')  # Save as JPG

        jpg_filenames.append(jpg_filename)

    return {"filenames": jpg_filenames}

@app.get("/uploads/{filename}")
async def get_uploaded_file(filename: str, download: bool = False):
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    if download:
        return FileResponse(file_path, media_type='application/octet-stream', filename=filename)
    
    return FileResponse(file_path)

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8005)
