import { useState, useCallback } from 'react';
import { GameState, Row, PrizeType } from '../types/game';

const CARD_COST = 2;
const INITIAL_BALANCE = 10;
const ROWS_PER_CARD = 7;

// Prize Probabilities: 2: 45%, 5: 25%, 10: 15%, 20: 10%, 100: 4%, 1000: 0.9%, 77777: 0.1%.
const PRIZE_WEIGHTS: { prize: PrizeType; weight: number }[] = [
  { prize: 2, weight: 450 },
  { prize: 5, weight: 250 },
  { prize: 10, weight: 150 },
  { prize: 20, weight: 100 },
  { prize: 100, weight: 40 },
  { prize: 1000, weight: 9 },
  { prize: 77777, weight: 1 },
];

const TOTAL_WEIGHT = PRIZE_WEIGHTS.reduce((sum, item) => sum + item.weight, 0);

const getRandomPrize = (): PrizeType => {
  const random = Math.random() * TOTAL_WEIGHT;
  let cumulativeWeight = 0;
  for (const { prize, weight } of PRIZE_WEIGHTS) {
    cumulativeWeight += weight;
    if (random < cumulativeWeight) {
      return prize;
    }
  }
  return 2; // Fallback
};

const getRandomNumber = (exclude7: boolean = false): number => {
  let num;
  do {
    num = Math.floor(Math.random() * 9) + 1; // 1 to 9
  } while (exclude7 && num === 7);
  return num;
};

export const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameState>({
    balance: INITIAL_BALANCE,
    cardCost: CARD_COST,
    rows: [],
    isCardActive: false,
    totalWonOnCard: 0,
    cardRevealed: false,
  });

  const generateCard = useCallback(() => {
    if (gameState.balance < CARD_COST) return;

    const rows: Row[] = [];
    let winAmount = 0;

    for (let i = 0; i < ROWS_PER_CARD; i++) {
      // 10% chance per row to be a 7
      const isWinner = Math.random() < 0.1;
      const leftNumber = isWinner ? 7 : getRandomNumber(true);
      const prize = getRandomPrize();
      
      if (isWinner) {
        winAmount += prize;
      }

      rows.push({
        id: `row-${Date.now()}-${i}`,
        leftNumber,
        prize,
        isRevealed: false,
      });
    }

    setGameState((prev) => ({
      ...prev,
      balance: prev.balance - CARD_COST,
      rows,
      isCardActive: true,
      totalWonOnCard: winAmount,
      cardRevealed: false,
    }));
  }, [gameState.balance]);

  const revealCard = useCallback(() => {
    setGameState((prev) => {
      if (prev.cardRevealed) return prev;
      return {
        ...prev,
        cardRevealed: true,
        balance: prev.balance + prev.totalWonOnCard,
        rows: prev.rows.map(row => ({ ...row, isRevealed: true }))
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    setGameState({
      balance: INITIAL_BALANCE,
      cardCost: CARD_COST,
      rows: [],
      isCardActive: false,
      totalWonOnCard: 0,
      cardRevealed: false,
    });
  }, []);

  return {
    gameState,
    generateCard,
    revealCard,
    resetGame,
  };
};
