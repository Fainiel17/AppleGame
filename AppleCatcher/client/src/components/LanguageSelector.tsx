import React from "react";
import { useLanguage } from "../lib/stores/useLanguage";
import { Language } from "../lib/i18n";

const languageNames = {
  ko: "한국어",
  en: "English", 
  zh: "中文"
};

const languageFlags = {
  ko: "🇰🇷",
  en: "🇺🇸",
  zh: "🇨🇳"
};

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
      <div className="flex gap-2">
        {(Object.keys(languageNames) as Language[]).map((lang) => (
          <button
            key={lang}
            onClick={() => setLanguage(lang)}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
              language === lang
                ? "bg-white text-gray-900 shadow-sm"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            <span>{languageFlags[lang]}</span>
            <span className="hidden md:inline">{languageNames[lang]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}