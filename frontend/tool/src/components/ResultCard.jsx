import { useState } from "react";
import { useLang } from "../lib/LanguageContext";
import { getStreamUrl, getImageStreamUrl, getAudioUrl  } from "../lib/api";


const QUALITIES = [
  { label: "1080p", value: "1080" },
  { label: "720p", value: "720" },
  { label: "480p", value: "480" },
  { label: "360p", value: "360" },
];

export default function ResultCard({ result, url, quality, onQualityChange, onReset }) {
  const { t } = useLang();

  if (!result) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 mt-6 mb-10">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">

        {result.type === "video" && (
          <VideoResult
            result={result}
            url={url}
            quality={quality}
            onQualityChange={onQualityChange}
            onReset={onReset}
            t={t}
          />
        )} 

        {result.type === "images" && (
          <ImagesResult result={result} t={t} />
        )}

      </div>
    </div>
  );
}

function VideoResult({ result, url, quality, onQualityChange, onReset, t }) {
  
const handleDownload = () => {
  const downloadUrl = getStreamUrl(url, quality);
  const a = document.createElement("a");
  a.href = downloadUrl;
  a.download = "video.mp4";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const handleDownloadMp3 = () =>{
  const audioUrl = getAudioUrl(url);
  const a = document.createElement("a");
  a.href = audioUrl;
  a.download = "audio.mp3";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a)
}

  return (
    <div className="p-4">
      <div className="flex gap-4">
        {/* Thumbnail */}
        <div className="relative shrink-0 w-28 h-28 sm:w-36 sm:h-36 rounded-xl overflow-hidden bg-black">
          {result.thumbnail ? (
            <img src={result.thumbnail} alt={result.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl">🎬</div>
          )}
          {result.duration > 0 && (
            <span className="absolute bottom-1.5 right-1.5 bg-black/70 text-white text-xs font-bold px-1.5 py-0.5 rounded-md">
              {formatDuration(result.duration)}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex-1 flex flex-col gap-2 min-w-0">
          {/* Quality selector */}
          <div className="flex gap-1.5 flex-wrap mb-1">
            {["1080", "720", "480", "360"].map((q) => (
              <button
                key={q}
                onClick={() => onQualityChange(q)}
                className={`px-2.5 py-1 rounded-lg border text-xs font-bold transition-all
                  ${quality === q
                    ? "bg-violet-600 border-violet-600 text-white"
                    : "border-gray-200 text-gray-400 hover:border-violet-400 hover:text-violet-600"
                  }`}
              >
                {q}p
              </button>
            ))}
          </div>

          {/* Tải video */}
          <button
            onClick={handleDownload}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all"
          >
            {t.resultCard.downloadVideo}
          </button>

          {/* MP3 */}
          <button
          onClick={handleDownloadMp3}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-violet-300 hover:bg-violet-400 text-white font-bold text-xs sm:text-sm rounded-xl transition-all">
            {t.resultCard.downloadAudio}
          </button>

          {/* Thử link khác */}
          <button
            onClick={onReset}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-400 hover:bg-red-500 text-white font-bold text-xs sm:text-sm rounded-xl transition-all"
          >
            {t.resultCard.reset}
          </button>
        </div>
      </div>

      {result.title && (
        <p className="text-xs text-gray-400 mt-3 line-clamp-2">{result.title}</p>
      )}
    </div>
  );
}

function ImagesResult({ result, t }) {
  const [selectedImages, setSelectedImages] = useState(new Set());

  const toggleImage = (index) => {
    const newSelected = new Set(selectedImages);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedImages(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedImages.size === result.images.length) {
      setSelectedImages(new Set());
    } else {
      setSelectedImages(new Set(result.images.map((_, i) => i)));
    }
  };

  const downloadSelected = () => {
    selectedImages.forEach((index) => {
      const img = result.images[index];
      const a = document.createElement("a");
      a.href = getImageStreamUrl(img.url, img.index);
      a.download = `image_${img.index}.jpg`;
      a.click();
    });
  };

  return (
    <div className="p-5">
      <p className="font-semibold text-gray-900 text-sm mb-1">
        {result.title || "TikTok Photos"}
      </p>
      <p className="text-xs text-gray-400 mb-4">
        @{result.author} · {result.count} ảnh
      </p>

      {/* Image grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
        {result.images.map((img, i) => (
          <div 
            key={i} 
            className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-pointer"
            onClick={() => toggleImage(i)}
          >
            <img
              src={img.url}
              alt={`Image ${i + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            {/* Checkbox overlay */}
            <div className="absolute top-2 left-2">
              <input
                type="checkbox"
                checked={selectedImages.has(i)}
                onChange={() => toggleImage(i)}
                className="w-5 h-5 rounded cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Select all / Download buttons */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={toggleSelectAll}
          className="flex-1 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold text-xs rounded-lg transition-all"
        >
          {selectedImages.size === result.images.length ? t.resultCard.deselectAll : t.resultCard.selectAll}
        </button>
      </div>

      {/* Download selected */}
      <button
        onClick={downloadSelected}
        disabled={selectedImages.size === 0}
        className={`w-full flex items-center justify-center gap-2 py-3.5 font-bold text-sm rounded-xl transition-all shadow-md ${
          selectedImages.size === 0
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-violet-600 hover:bg-violet-700 text-white"
        }`}
      >
        {t.resultCard.downloadImages} {selectedImages.size > 0 ? `${selectedImages.size}/${result.count}` : `0/${result.count}`}
      </button>
    </div>
  );
}

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}