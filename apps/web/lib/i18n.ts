'use client'

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ru from '../locales/ru.json';

const resources = {
  ru: { common: ru },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ru',
    fallbackLng: 'ru',
    supportedLngs: ['ru'],
    ns: ['common'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    react: {
      useSuspense: false,
    }
  });

export const initialLocaleReady = Promise.resolve();

/**
 * Switch language safely — only Russian is supported.
 */
export async function changeLanguage(_lng: string) {
  return i18n.changeLanguage('ru')
}

export default i18n;
