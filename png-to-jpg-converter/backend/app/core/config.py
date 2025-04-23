import os

class Settings:
    PROJECT_NAME: str = "PNG to JPG Converter"
    UPLOAD_DIRECTORY: str = os.getenv("UPLOAD_DIRECTORY", "./uploads")

settings = Settings()