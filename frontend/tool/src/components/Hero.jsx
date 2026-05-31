import { useState, useEffect } from "react";
import { useLang } from "../lib/LanguageContext";

const PLATFORMS = [
  { id: "tiktok", label: "TikTok", icon: "🎵", color: "hover:border-slate-800 hover:text-slate-800" },
];

export default function Hero({ onSubmit, loading, resetUrl }) {
  const { t } = useLang();
  const [url, setUrl] = useState("");
  const [platform, setPlatform] = useState("tiktok");

  useEffect(() =>{
    if (resetUrl) setUrl("");
  }, [resetUrl])

const handlePaste = async () => {
  try {
    if (!navigator?.clipboard) {
      alert("Trình duyệt không hỗ trợ paste trực tiếp!");
      return;
    }

    const text = await navigator.clipboard.readText();
    setUrl(text);
  } catch (err) {
    console.error(err);
  }
};

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    onSubmit?.(url, platform);
  };

  return (
    <section className="relative bg-gradient-to-b from-violet-50 to-white overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-violet-100 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-50" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full translate-x-1/3 -translate-y-1/3 opacity-60" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white border border-violet-200 text-violet-600 rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold mb-6 shadow-sm">
          <span className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-pulse" />
          {t.hero.badge}
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-4 leading-tight">
          {t.hero.title1}{" "}
          <span className="bg-gradient-to-r from-violet-600 to-blue-500 bg-clip-text text-transparent">
            {t.hero.title2}
          </span>
        </h1>

        <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto mb-8">
          {t.hero.subtitle}
        </p>

        {/* Input */}
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-6">
          <div className="flex items-center bg-white border-2 border-gray-200 rounded-2xl overflow-hidden shadow-lg focus-within:border-violet-500 focus-within:ring-4 focus-within:ring-violet-100 transition-all">
            <span className="px-4 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </span>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={t.hero.placeholder}
              className="flex-1 py-4 text-sm text-gray-900 outline-none bg-transparent placeholder:text-gray-400 min-w-0"
            />
            <button
              type="button"
              onClick={handlePaste}
              className="hidden sm:block px-4 text-xs font-bold text-violet-500 border-l border-gray-200 py-4 hover:bg-violet-50 transition-colors shrink-0"
            >
              Paste
            </button>
            <button
              type="submit"
              disabled={loading}
              className="m-1.5 px-5 sm:px-8 py-3 bg-violet-600 hover:bg-violet-700 disabled:bg-gray-300 text-white text-sm font-bold rounded-xl transition-all flex items-center gap-2 shrink-0 shadow-md"
            >
              {loading ? (
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              )}
              <span className="hidden sm:inline">{t.hero.btn}</span>
            </button>
          </div>
        </form>

        {/* Platform tabs */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {PLATFORMS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPlatform(p.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full border-2 text-sm font-semibold transition-all bg-white shadow-sm
                ${platform === p.id
                  ? p.id === "tiktok"
                    ? "border-slate-800 text-slate-800 shadow-md"
                    : "border-pink-500 text-pink-500 shadow-md"
                  : "border-gray-200 text-gray-500 hover:shadow-md " + p.color
                }`}
            >
              <span>{p.icon}</span>
              {p.label}
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}