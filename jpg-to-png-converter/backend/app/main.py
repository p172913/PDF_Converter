from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from PIL import Image
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
async def convert_image(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(('.jpg', '.jpeg')):
        raise HTTPException(status_code=400, detail="Only JPG or JPEG files are supported")

    # Sanitize filename
    safe_name = file.filename.replace(" ", "_")
    jpg_path = os.path.join(UPLOAD_FOLDER, safe_name)
    png_filename = os.path.splitext(safe_name)[0] + '.png'
    png_path = os.path.join(UPLOAD_FOLDER, png_filename)

    # Save uploaded JPG
    with open(jpg_path, "wb") as f:
        f.write(await file.read())

    # Convert JPG to PNG
    with Image.open(jpg_path) as img:
        img.convert("RGB").save(png_path, "PNG")

    return {"filename": png_filename}

@app.get("/uploads/{filename}")
async def get_uploaded_file(filename: str):
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path)

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8004)
