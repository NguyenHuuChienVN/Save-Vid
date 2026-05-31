import { useLang } from "../lib/LanguageContext";
import logo from "../assets/savevid-logo.svg";

export default function Navbar() {
  const { lang, setLang } = useLang();

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <a href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-50 h-32 rounded-lg flex items-center justify-center">
            <img src={logo} alt="SaveVid Logo" />
          </div>    
        </a>

        {/* Language Toggle */}
        <div className="flex items-center bg-gray-100 rounded-lg p-1 gap-1">
          {["vi", "en"].map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-3 py-1 rounded-md text-xs font-bold uppercase transition-all
                ${lang === l
                  ? "bg-white text-violet-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
                }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}