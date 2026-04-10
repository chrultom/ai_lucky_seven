export interface Row {
  id: string;
  leftNumber: number;
  prize: number;
  isRevealed: boolean;
}

export type PrizeType = 2 | 5 | 10 | 20 | 100 | 1000 | 77777;

export interface GameState {
  balance: number;
  cardCost: number;
  rows: Row[];
  isCardActive: boolean;
  totalWonOnCard: number;
  cardRevealed: boolean;
}