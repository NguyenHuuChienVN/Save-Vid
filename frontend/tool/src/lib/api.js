import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

if (!BASE_URL) {
  throw new Error("VITE_API_URL environment variable is not defined");
}

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 300000,
});

// VIDEO INFO
export async function getVideoInfo(url, quality = "720") {
  const res = await api.post("/info", { url, quality });
  return res.data;
}

// IMAGES
export async function getImages(url) {
  const res = await api.post("/images", { url });
  return res.data;
}

// STREAM VIDEO
export function getStreamUrl(url, quality = "720") {
  return `${BASE_URL}/download?url=${encodeURIComponent(url)}&quality=${quality}`;
}

// STREAM IMAGE
export function getImageStreamUrl(imgUrl, index = 1) {
  return `${BASE_URL}/image/stream?url=${encodeURIComponent(imgUrl)}&index=${index}`;
}

// DOWNLOAD
export function downloadFile(videoUrl, filename = "video.mp4") {
  const a = document.createElement("a");
  a.href = videoUrl;
  a.download = filename;
  a.target = "_blank";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// DETECT PLATFORM
export function detectPlatform(url) {
  if (url.includes("tiktok.com") || url.includes("vt.tiktok.com")) return "tiktok";
  return null;
}

// CHECK PHOTO
export function isTikTokPhoto(url) {
  return (
    (url.includes("tiktok.com") || url.includes("vt.tiktok.com")) &&
    url.includes("/photo/")
  );
}

// AUDIO
export function getAudioUrl(url) {
  return `${BASE_URL}/audio?url=${encodeURIComponent(url)}`;
}