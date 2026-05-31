import { useLang } from "../lib/LanguageContext";

export default function Features() {
  const { t } = useLang();

  const FEATURES = [
    { icon: "⚡", title: t.features.items[0].title, desc: t.features.items[0].desc, bg: "bg-yellow-50", color: "text-yellow-500" },
    { icon: "🛡️", title: t.features.items[1].title, desc: t.features.items[1].desc, bg: "bg-green-50", color: "text-green-500" },
    { icon: "🚫", title: t.features.items[2].title, desc: t.features.items[2].desc, bg: "bg-red-50", color: "text-red-500" },
    { icon: "📱", title: t.features.items[3].title, desc: t.features.items[3].desc, bg: "bg-blue-50", color: "text-blue-500" },
  ];

  return (
    <section id="features" className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <p className="text-center text-xs font-bold text-violet-600 uppercase tracking-widest mb-2">{t.features.label}</p>
      <h2 className="text-center text-2xl sm:text-3xl font-bold text-gray-900 mb-10 tracking-tight">
        {t.features.title}
      </h2>

      <div className="grid text-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {FEATURES.map((f, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
            <div className={`w-12 h-12 ${f.bg} rounded-xl flex items-center justify-center text-2xl mb-4`}>
              {f.icon}
            </div>
            <h3 className="font-bold text-gray-900 text-sm mb-2">{f.title}</h3>
            <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}