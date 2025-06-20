import { create } from 'zustand';
import { Language, detectLanguage, saveLanguage, getTranslation, TranslationMessages } from '../i18n';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof TranslationMessages) => string;
}

export const useLanguage = create<LanguageState>((set, get) => ({
  language: detectLanguage(),
  
  setLanguage: (lang: Language) => {
    saveLanguage(lang);
    set({ language: lang });
  },
  
  t: (key: keyof TranslationMessages) => {
    const { language } = get();
    return getTranslation(language, key);
  }
}));