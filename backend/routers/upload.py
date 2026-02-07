from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import shutil
import os
import uuid

router = APIRouter(
    prefix="/upload",
    tags=["upload"]
)

UPLOAD_DIR = "static/images"

# Ensure upload directory exists
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("")
async def upload_image(file: UploadFile = File(...)):
    try:
        # Generate unique filename
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)
        
        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Return URL
        # Note: In production, this should be the full URL. 
        # For now, we return the relative path from the static mount.
        image_url = f"http://localhost:8000/static/images/{unique_filename}"
        
        return JSONResponse(content={"url": image_url})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
