import yt_dlp
import re
import requests
import os
import uuid
import time
import logging
from pathlib import Path

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_video_info(url: str, quality: str = "720"):
    ydl_opts = {
        "quiet": True,
        "noplaylist": True,

    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=False)
        filename = ydl.prepare_filename(info)
    formats = info.get("formats", [])

    # Lọc format có video
    video_formats = [
        f for f in formats
        if f.get("vcodec") != "none" and f.get("url")
    ]

    # Chọn quality phù hợp
    target_height = int(quality)
    best = None
    for f in sorted(video_formats, key=lambda x: x.get("height") or 0, reverse=True):
        if (f.get("height") or 0) <= target_height:
            best = f
            break
    if not best and video_formats:
        best = video_formats[-1]

    # Lấy ảnh (Instagram carousel)
    images = []
    entries = info.get("entries") or []
    for entry in entries:
        thumb = entry.get("thumbnail") or entry.get("url")
        if thumb:
            images.append(thumb)

    return {
        "title": info.get("title", ""),
        "author": info.get("uploader", ""),
        "thumbnail": info.get("thumbnail", ""),
        "duration": info.get("duration", 0),
        "video_url": best.get("url") if best else None,
        "images": images,
        "platform": info.get("extractor", ""),
    }

def get_images_info(url: str):
    ydl_opts ={
        "quiet": True,
        "noplaylist": True,
        "extract_flat": True,
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=False)

    images = []

    formats = info.get("formats") or []
    for f in formats:
        mime = f.get("mime_type", "")
        ext = f.get("ext", "")
        if "image" in mime or ext in ("jpg", "jpeg", "png", "webp"):
            images.append({
                "url": f.get("url"),
                "index": len(images) + 1,
                "width": f.get("width"),
                "height": f.get("height"),
            })
    if not images:
        thumbnails = info.get("thumbnails") or []
        for i, t in enumerate(thumbnails):
            images.append({
                "url": t.get("url"),
                "index": i + 1,
                "width": t.get("width"),
                "height": t.get("height"),
            })
    return {
        "title": info.get("title", ""),
        "author": info.get("uploader", ""),
        "count": len(images),
        "images": images,
        "platform": info.get("extractor", ""),
    }


def get_tiktok_images(url: str):
    # Dùng tikwm.com API - free, ổn định
    api_url = "https://www.tikwm.com/api/"
    
    params = {
        "url": url,
        "hd": 1,
    }
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
    }

    resp = requests.get(api_url, params=params, headers=headers, timeout=15)
    data = resp.json()

    if data.get("code") != 0:
        raise Exception(data.get("msg", "Lỗi API"))

    video_data = data.get("data", {})
    
    # Lấy danh sách ảnh
    image_list = video_data.get("images") or []
    
    images = []
    for i, img_url in enumerate(image_list):
        images.append({
            "url": img_url,
            "index": i + 1,
        })

    if not images:
        raise Exception("Không tìm thấy ảnh trong post này")

    return {
        "title": video_data.get("title", ""),
        "author": video_data.get("author", {}).get("nickname", ""),
        "count": len(images),
        "images": images,
        "platform": "TikTok",
    }

def download_video_file(url: str, quality: str = "720") -> str:
    """Download video về server, trả về đường dẫn file"""
    os.makedirs("downloads", exist_ok=True)
    output_id = str(uuid.uuid4())[:8]
    output_path = f"downloads/{output_id}.mp4"

    ydl_opts = {
        "quiet": True,
        "noplaylist": True,
        "format": f"bestvideo[height<={quality}]+bestaudio/best[height<={quality}]/best",
        "outtmpl": f"downloads/{output_id}.%(ext)s",
        "merge_output_format": "mp4",
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])
    
    return output_path


def download_audio_file(url: str) -> str:
    try:
        os.makedirs("downloads", exist_ok=True)
        output_id = str(uuid.uuid4())[:8]
        output_path = f"downloads/{output_id}.mp3"

        ydl_opts = {
            "quiet": True,
            "noplaylist": True,
            "format": "bestaudio/best",
            "outtmpl": f"downloads/{output_id}.%(ext)s",
            "postprocessors": [{
                "key": "FFmpegExtractAudio",
                "preferredcodec": "mp3",
                "preferredquality": "192",
            }],
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])

        # Tìm file mp3 thực tế
        base = f"downloads/{output_id}"
        for ext in ["mp3", "m4a", "webm", "opus"]:
            p = f"{base}.{ext}"
            if os.path.exists(p):
                return p

        return output_path
    except Exception as e:
        logger.error(f"Error downloading audio: {e}")
        raise


def cleanup_old_files(folder="downloads", hours=1):
    """Xoá file cũ trong thư mục downloads (mặc định >1 giờ)"""
    now = time.time()
    max_age = hours * 3600  # Convert hours to seconds

    if not os.path.exists(folder):
        return

    for filename in os.listdir(folder):
        file_path = os.path.join(folder, filename)

        if os.path.isfile(file_path):
            file_age = now - os.path.getmtime(file_path)

            if file_age > max_age:
                try:
                    os.remove(file_path)
                    logger.info(f"Deleted old file: {file_path}")
                except Exception as e:
                    logger.error(f"Error deleting {file_path}: {e}")




