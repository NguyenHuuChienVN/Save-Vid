from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from app.routes import downloader
from slowapi import Limiter
from slowapi.util import get_remote_address

import os
import logging
from dotenv import load_dotenv

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*").split(",")

app = FastAPI(title="SaveIt API", version="1.0.0")

# Rate limiter
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

# CORS 
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS if ALLOWED_ORIGINS != ["*"] else ["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Trusted host
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"]
)

app.include_router(downloader.router, prefix="/api")


@app.on_event("startup")
async def startup_event():
    """Cleanup file khi server start"""
    try:
        from app.services.downloader_service import cleanup_old_files
        cleanup_old_files(hours=24)
        logger.info("Cleanup completed")
    except Exception as e:
        logger.warning(f"Cleanup skipped: {e}")


@app.get("/")
def root():
    return {"status": "API OK"}