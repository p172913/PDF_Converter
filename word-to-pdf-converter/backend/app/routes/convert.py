# from fastapi import APIRouter, UploadFile, File
# from app.utils.pdf_utils import convert_images_to_pdf
# from typing import List

# router = APIRouter()

# @router.post("/convert/")
# async def convert(files: List[UploadFile] = File(...)):
#     # Logic to convert images to PDF
#     pdf_file = await convert_images_to_pdf(files)
#     return {"filename": pdf_file}

from fastapi import APIRouter, UploadFile, File
from app.utils.pdf_utils import convert_images_to_pdf
from typing import List
router = APIRouter()

@router.post("/convert/")
async def convert(files: List[UploadFile] = File(...)):
    pdf_file = await convert_images_to_pdf(files)
    return {"filename": pdf_file}