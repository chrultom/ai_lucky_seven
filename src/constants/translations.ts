import { Language, Dictionary } from '../types/i18n';

export const dictionaries: Record<Language, Dictionary> = {
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
