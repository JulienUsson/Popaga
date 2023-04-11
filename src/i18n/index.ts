import { locale } from 'expo-localization'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import enTranslation from './en.json'
import frTranslation from './fr.json'

const resources = {
  en: { translation: enTranslation },
  fr: { translation: frTranslation },
}

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources,
  lng: locale,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n

export function getDateFnsLocale() {
  if (locale.startsWith('fr')) {
    return require('date-fns/locale/fr')
  }
  return require('date-fns/locale/en-US')
}
