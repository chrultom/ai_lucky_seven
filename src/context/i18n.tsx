import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'pl';

interface Dictionary {
  buyCard: string;
  balance: string;
  win: string;
  betterLuck: string;
  scratchHere: string;
  price: string;
  currency: string;
  cashOut: string;
  summaryTitle: string;
  finalBalance: string;
  totalWon: string;
  winnerMessage: string;
  thanksMessage: string;
  playAgain: string;
}

const dictionaries: Record<Language, Dictionary> = {
  en: {
    buyCard: 'Buy Card',
    balance: 'Balance',
    win: 'Win!',
    betterLuck: 'Better luck next time',
    scratchHere: 'Scratch here to reveal',
    price: 'Price',
    currency: 'PLN',
    cashOut: 'Cash Out',
    summaryTitle: 'Game Summary',
    finalBalance: 'Final Balance',
    totalWon: 'Total Won',
    winnerMessage: 'Winner!',
    thanksMessage: 'Thanks for playing',
    playAgain: 'Play Again'
  },
  pl: {
    buyCard: 'Kup zdrapkę',
    balance: 'Saldo',
    win: 'Wygrana!',
    betterLuck: 'Spróbuj ponownie',
    scratchHere: 'Zdrap tutaj',
    price: 'Cena',
    currency: 'PLN',
    cashOut: 'Wypłać / Zakończ',
    summaryTitle: 'Podsumowanie gry',
    finalBalance: 'Końcowe Saldo',
    totalWon: 'Zysk',
    winnerMessage: 'Zwycięzca!',
    thanksMessage: 'Dzięki za grę',
    playAgain: 'Zagraj ponownie'
  }
};

interface I18nContextType {
  lang: Language;
  t: Dictionary;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

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

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
