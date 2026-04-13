export type Language = 'en' | 'pl';

export interface Dictionary {
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

export interface I18nContextType {
  lang: Language;
  t: Dictionary;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
}
