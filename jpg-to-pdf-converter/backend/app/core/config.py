import os

class Settings:
    PROJECT_NAME: str = "JPG to PDF Converter"
    UPLOAD_DIRECTORY: str = os.getenv("UPLOAD_DIRECTORY", "./uploads")

settings = Settings()