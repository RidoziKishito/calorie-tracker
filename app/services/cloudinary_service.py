import cloudinary
import cloudinary.uploader
import os
from dotenv import load_dotenv

load_dotenv()

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)

class CloudinaryService:
    @staticmethod
    def upload_image(file_content, folder="nutrition_tracker"):
        """
        Uploads an image to Cloudinary.
        :param file_content: The file object or byte content to upload.
        :param folder: The folder in Cloudinary to store the image.
        :return: The URL of the uploaded image or None if failed.
        """
        try:
            upload_result = cloudinary.uploader.upload(file_content, folder=folder)
            return upload_result.get("secure_url")
        except Exception as e:
            print(f"Cloudinary upload error: {e}")
            return None
