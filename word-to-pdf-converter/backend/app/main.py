# from fastapi import FastAPI, File, UploadFile, HTTPException
# from fastapi.responses import JSONResponse
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.staticfiles import StaticFiles
# import os
# import shutil
# import tempfile
# import subprocess

# app = FastAPI()

# # Allow CORS for frontend dev
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # Adjust this for production
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Paths
# UPLOAD_DIR = "/tmp"
# OUTPUT_DIR = os.path.join(os.getcwd(), "converted")
# os.makedirs(OUTPUT_DIR, exist_ok=True)

# # Serve static files
# app.mount("/converted", StaticFiles(directory=OUTPUT_DIR), name="converted")

# @app.post("/convert/")
# async def convert_word_to_pdf(files: list[UploadFile] = File(...)):
#     if not files:
#         raise HTTPException(status_code=400, detail="No files uploaded.")
    
#     pdf_urls = []
    
#     for file in files:
#         if not (file.filename.endswith(".docx") or file.filename.endswith(".doc")):
#             raise HTTPException(status_code=400, detail="Only .doc or .docx files allowed")

#         with tempfile.NamedTemporaryFile(delete=False, suffix=".docx", dir=UPLOAD_DIR) as tmp_file:
#             shutil.copyfileobj(file.file, tmp_file)
#             input_path = tmp_file.name
#             output_filename = os.path.splitext(file.filename)[0] + ".pdf"
#             output_path = os.path.join(OUTPUT_DIR, output_filename)

#         try:
#             subprocess.run([
#                 "libreoffice",
#                 "--headless",
#                 "--convert-to",
#                 "pdf",
#                 "--outdir",
#                 OUTPUT_DIR,
#                 input_path
#             ], check=True)
#             print(f"Converted {input_path} to {output_path}")  # Debugging line
#         except subprocess.CalledProcessError as e:
#             print(f"Conversion failed: {str(e)}")  # Log the error
#             raise HTTPException(status_code=500, detail=f"Conversion failed: {str(e)}")

#         # Check if the PDF file was created
#         if not os.path.exists(output_path):
#             print(f"PDF file not found: {output_path}")  # Log the missing file
#             print(f"Current contents of {OUTPUT_DIR}: {os.listdir(OUTPUT_DIR)}")  # List directory contents
#             raise HTTPException(status_code=500, detail=f"PDF file not found: {output_path}")

#         pdf_urls.append(f"/converted/{output_filename}")

#     return JSONResponse(content={"pdfs": pdf_urls})
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import shutil
import subprocess

app = FastAPI()

# Allow CORS for frontend dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Paths
UPLOAD_DIR = "/tmp"
OUTPUT_DIR = os.path.join(os.getcwd(), "converted")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Serve static files
app.mount("/converted", StaticFiles(directory=OUTPUT_DIR), name="converted")

@app.post("/convert/")
async def convert_word_to_pdf(files: list[UploadFile] = File(...)):
    if not files:
        raise HTTPException(status_code=400, detail="No files uploaded.")
    
    pdf_urls = []
    
    for file in files:
        if not (file.filename.endswith(".docx") or file.filename.endswith(".doc")):
            raise HTTPException(status_code=400, detail="Only .doc or .docx files allowed")
        
        # Sanitize filename (remove slashes and ensure it ends with .docx/.doc)
        safe_filename = os.path.basename(file.filename).replace(" ", "_")
        upload_path = os.path.join(UPLOAD_DIR, safe_filename)

        # Save the uploaded file with the original name
        with open(upload_path, "wb") as f:
            shutil.copyfileobj(file.file, f)

        output_filename = os.path.splitext(safe_filename)[0] + ".pdf"
        output_path = os.path.join(OUTPUT_DIR, output_filename)

        try:
            subprocess.run([
                "libreoffice",
                "--headless",
                "--convert-to",
                "pdf",
                "--outdir",
                OUTPUT_DIR,
                upload_path
            ], check=True)
            print(f"Converted {upload_path} to {output_path}")
        except subprocess.CalledProcessError as e:
            print(f"Conversion failed: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Conversion failed: {str(e)}")

        # Check if the expected PDF file was created
        if not os.path.exists(output_path):
            print(f"PDF file not found: {output_path}")
            print(f"Current contents of {OUTPUT_DIR}: {os.listdir(OUTPUT_DIR)}")
            raise HTTPException(status_code=500, detail=f"PDF file not found: {output_path}")

        # Clean up uploaded file
        os.remove(upload_path)

        pdf_urls.append(f"/converted/{output_filename}")

    return JSONResponse(content={"pdfs": pdf_urls})