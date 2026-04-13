import React, { useState, ReactNode } from 'react';
import { Language } from '../types/i18n';
import { dictionaries } from '../constants/translations';
import { I18nContext } from './I18nContext';

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('pl');

  const toggleLang = () => {
    setLang(prev => (prev === 'en' ? 'pl' : 'en'));
  };

  const t = dictionaries[lang];

  return (
    <I18nContext.Provider value={{ lang, t, setLang, toggleLang }}>
      {children}
    </I18nContext.Provider>
  );
};
