import logo from "../assets/savevid-logo.svg";
import { useLang } from "../lib/LanguageContext";

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="bg-gray-300 flex text-center text-gray-900 py-10 mt-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        <div className="border-t border-gray-800 pt-6 text-center text-xs text-gray-600">
          {t.footer.copyright}
        </div>
      </div>
    </footer>
  );
}