import os
import cloudinary

def configure_cloudinary():

    cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME")
    api_key = os.getenv("CLOUDINARY_API_KEY")
    api_secret = os.getenv("CLOUDINARY_API_SECRET")

    if cloud_name and api_key and api_secret:
        cloudinary.config(
            cloud_name=cloud_name,
            api_key=api_key,
            api_secret=api_secret
        )
        print(f"✓ Cloudinary configurado: {cloud_name}")
    else:
        print("✗ Cloudinary não configurado")
