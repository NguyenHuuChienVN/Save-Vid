import { useLang } from "../lib/LanguageContext";

export default function HowTo() {
  const { t } = useLang();
  
  const STEPS = t.howTo.steps.map((step, i) => ({
    num: String(i + 1),
    icon: i === 0 ? "🔗" : i === 1 ? "📋" : "⬇️",
    title: step.title,
    desc: step.desc,
  }));

  return (
    <section id="how-to" className="bg-white border-y border-gray-100 py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <p className="text-center text-xs font-bold text-violet-600 uppercase tracking-widest mb-2">{t.howTo.label}</p>
        <h2 className="text-center text-2xl sm:text-3xl font-bold text-gray-900 mb-10 tracking-tight">
          {t.howTo.title}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative">
          {/* Connector line */}
          <div className="hidden sm:block absolute top-8 left-1/4 right-1/4 h-0.5 bg-violet-100 z-0" />

          {STEPS.map((s, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-violet-600 text-white rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-lg shadow-violet-200">
                {s.icon}
              </div>
              <span className="absolute -top-2 -right-2 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 w-6 h-6 bg-violet-100 text-violet-600 rounded-full text-xs font-bold flex items-center justify-center">
                {s.num}
              </span>
              <h3 className="font-bold text-gray-900 text-sm mb-2">{s.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed max-w-xs">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
