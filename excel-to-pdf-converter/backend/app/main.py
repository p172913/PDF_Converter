from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import shutil
import subprocess
import pandas as pd
from xlsx2html import xlsx2html

app = FastAPI()

# Allow CORS for frontend dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production
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
async def convert_excel_to_pdf(files: list[UploadFile] = File(...)):
    if not files:
        raise HTTPException(status_code=400, detail="No files uploaded.")

    pdf_urls = []

    for file in files:
        if not (file.filename.endswith(".xlsx") or file.filename.endswith(".xls")):
            raise HTTPException(status_code=400, detail="Only .xlsx or .xls files allowed")

        safe_filename = os.path.basename(file.filename).replace(" ", "_")
        upload_path = os.path.join(UPLOAD_DIR, safe_filename)

        with open(upload_path, "wb") as f:
            shutil.copyfileobj(file.file, f)

        # Convert Excel to HTML
        html_file_path = upload_path.replace(".xlsx", ".html").replace(".xls", ".html")
        try:
            xlsx2html(upload_path, html_file_path)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to convert Excel to HTML: {e}")

        # Convert HTML to PDF
        pdf_filename = os.path.splitext(safe_filename)[0] + ".pdf"
        pdf_file_path = os.path.join(OUTPUT_DIR, pdf_filename)

        try:
            convert_html_to_pdf(html_file_path, pdf_file_path)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to convert HTML to PDF: {e}")

        os.remove(upload_path)
        os.remove(html_file_path)

        pdf_urls.append(f"/converted/{pdf_filename}")

    return JSONResponse(content={"pdfs": pdf_urls})


def convert_html_to_pdf(html_file_path, pdf_file_path):
    import pdfkit
    config = pdfkit.configuration(wkhtmltopdf='/usr/local/bin/wkhtmltopdf')  # Adjust path if needed
    pdfkit.from_file(html_file_path, pdf_file_path, configuration=config)