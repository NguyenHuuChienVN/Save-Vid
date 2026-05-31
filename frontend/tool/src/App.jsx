import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ResultCard from "./components/ResultCard";
import HowTo from "./components/HowTo";
import Features from "./components/Features";
import Footer from "./components/Footer";
import { getVideoInfo, getImages, detectPlatform, isTikTokPhoto } from "./lib/api";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [currentUrl, setCurrentUrl] = useState("");
  const [quality, setQuality] = useState("720");

  const handleSubmit = async (url) => {
    const platform = detectPlatform(url);
    if (!platform) {
      setError("Link không hợp lệ. Chỉ hỗ trợ TikTok.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    setCurrentUrl(url);
    try {
      if (isTikTokPhoto(url)) {
        const data = await getImages(url);
        setResult({ type: "images", ...data.data });
      } else {
        const data = await getVideoInfo(url, quality);
        setResult({ type: "video", ...data.data });
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Có lỗi xảy ra, thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // Reset về trang chủ
  const handleReset = () => {
    setResult(null);
    setError(null);
    setCurrentUrl("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Hero onSubmit={handleSubmit} loading={loading} resetUrl={!result} />

      {error && (
        <div className="max-w-2xl mx-auto px-4 mt-4">
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-5 py-4 text-sm font-medium flex items-center gap-3">
            <span>⚠️</span> {error}
          </div>
        </div>
      )}

      <ResultCard
        result={result}
        url={currentUrl}
        quality={quality}
        onQualityChange={setQuality}
        onReset={handleReset}
      />

      {!result && (
        <>
          <HowTo />
          <Features />
          <Footer />
        </>
      )}
    </div>
  );
}