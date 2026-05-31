from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from fastapi.responses import StreamingResponse, FileResponse

import asyncio
import os
import logging
import httpx
import urllib.parse

from slowapi import Limiter
from slowapi.util import get_remote_address

from app.services.downloader_service import (
    get_video_info,
    get_images_info,
    get_tiktok_images,
    download_video_file,
    download_audio_file,
)

logger = logging.getLogger(__name__)

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

MAX_FILE_SIZE = 500 * 1024 * 1024  # 500MB


class DownloadRequest(BaseModel):
    url: str
    quality: str = "720"


#  INFO
@router.post("/info")
@limiter.limit("30/minute")
def get_info(req: DownloadRequest, request: Request):
    try:
        data = get_video_info(req.url, req.quality)
        return {"success": True, "data": data}
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=400, detail=str(e))


#IMAGES
@router.post("/images")
@limiter.limit("30/minute")
def get_images(req: DownloadRequest, request: Request):
    try:
        from app.services.downloader_service import get_tiktok_images
        
        if "tiktok.com" in req.url:
            data = get_tiktok_images(req.url)
        else:
            raise HTTPException(status_code=400, detail="Chỉ hỗ trợ TikTok")

        return {"success": True, "data": data}
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=400, detail=str(e))


#AUDIO 
@router.get("/audio")
@limiter.limit("20/minute")
async def download_audio(url: str, request: Request):
    try:
        loop = asyncio.get_event_loop()
        file_path = await loop.run_in_executor(None, download_audio_file, url)

        if not os.path.exists(file_path):
            raise HTTPException(404, "Download thất bại")

        return FileResponse(file_path, media_type="audio/mpeg", filename="audio.mp3")

    except Exception as e:
        logger.error(e)
        raise HTTPException(400, str(e))


#VIDEO
@router.get("/download")
@limiter.limit("20/minute")
async def download(url: str, quality: str = "720", request: Request = None):
    try:
        loop = asyncio.get_event_loop()
        file_path = await loop.run_in_executor(
            None, download_video_file, url, quality
        )

        if not os.path.exists(file_path):
            raise HTTPException(404, "Download thất bại")

        return FileResponse(file_path, media_type="video/mp4", filename="video.mp4")

    except Exception as e:
        logger.error(e)
        raise HTTPException(400, str(e))


#TREAM IMAGE
@router.get("/image/stream")
@limiter.limit("30/minute")
async def stream_image(url: str, index: int = 1, request: Request = None):
    try:
        async def stream():
            async with httpx.AsyncClient(timeout=60) as client:
                async with client.stream("GET", url) as r:
                    async for chunk in r.aiter_bytes():
                        yield chunk

        filename = f"image_{index}.jpg"

        return StreamingResponse(
            stream(),
            media_type="image/jpeg",
            headers={
                "Content-Disposition": f"attachment; filename*=UTF-8''{urllib.parse.quote(filename)}"
            },
        )

    except Exception as e:
        logger.error(e)
        raise HTTPException(400, str(e))