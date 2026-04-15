import { useEffect, useState } from 'react';
import { Wallet, Globe, Coins, PlayCircle, LogOut, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useGameLogic } from './hooks/useGameLogic';
import { ScratchCard } from './components/ScratchCard';
import { useI18n } from './hooks/useI18n';
import clsx from 'clsx';

function App() {
  const { gameState, generateCard, revealCard, resetGame, claimPrize } = useGameLogic();
  const { lang, t, toggleLang } = useI18n();
  const [showWinMessage, setShowWinMessage] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [balanceAnim, setBalanceAnim] = useState(false);

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  useEffect(() => {
    let animationStartTimer: ReturnType<typeof setTimeout>;
    let animationEndTimer: ReturnType<typeof setTimeout>;
    if (gameState.balance !== undefined) {
      animationStartTimer = setTimeout(() => setBalanceAnim(true), 0);
      animationEndTimer = setTimeout(() => setBalanceAnim(false), 500);
    }
    return () => {
      clearTimeout(animationStartTimer);
      clearTimeout(animationEndTimer);
    };
  }, [gameState.balance]);

  const revealedWinnings = gameState.rows.reduce((sum, row) => {
    return (row.isRevealed && row.leftNumber === 7 && row.isPaid) ? sum + row.prize : sum;
  }, 0);

  useEffect(() => {
    if (revealedWinnings > 0) {
      const showTimer = setTimeout(() => {
        setShowWinMessage(true);
        if (revealedWinnings >= 100) {
          triggerConfetti();
        }
      }, 0);
      
      // Hide message after a few seconds
      const hideTimer = setTimeout(() => {
        setShowWinMessage(false);
      }, 4000);
      
      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [revealedWinnings]);


  const handleCashOut = () => {
    setShowSummary(true);
  };

  const handlePlayAgain = () => {
    resetGame();
    setShowSummary(false);
  };

  const netProfit = gameState.balance - 10; // Starting balance is 10
  const isWinner = gameState.balance > 10;

  return (
    <div className="min-h-100dvh bg-slate-900 text-white font-sans selection:bg-yellow-500 selection:text-black relative">
      {/* Header */}
      <header className="bg-slate-800/80 backdrop-blur-md border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-yellow-500 p-2 rounded-lg">
              <Coins className="w-6 h-6 text-slate-900" />
            </div>
            <h1 className="text-xl font-black tracking-tight text-yellow-500 hidden sm:block">
              LUCKY 7
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 bg-slate-700 px-4 py-2 rounded-full border border-slate-600 transition-transform ${balanceAnim ? 'scale-110 shadow-[0_0_15px_rgba(250,204,21,0.5)]' : 'scale-100'}`}>
              <Wallet className="w-5 h-5 text-yellow-400" />
              <span className="font-bold">
                {t.balance}: <span className="text-yellow-400">{gameState.balance} {t.currency}</span>
              </span>
            </div>
            
            <button
              onClick={toggleLang}
              className="p-2 hover:bg-slate-700 rounded-full transition-colors flex items-center gap-2 border border-transparent hover:border-slate-600"
              aria-label="Toggle language"
            >
              <Globe className="w-5 h-5 text-slate-300" />
              <span className="font-semibold text-sm uppercase text-slate-300">{lang}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 pb-32 sm:py-12 flex flex-col items-center">
        
        {/* Game Area */}
        <div className="w-full flex flex-col items-center gap-8">
          
          {/* Controls */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                data-testid="buy-button"
                onClick={() => {
                  setShowWinMessage(false);
                  generateCard();
                }}
                disabled={gameState.balance < gameState.cardCost}
                className={clsx(
                  "appearance-none group relative px-8 py-4 rounded-2xl font-black text-xl tracking-wide uppercase transition-all duration-300 flex items-center gap-3 overflow-hidden",
                  gameState.balance >= gameState.cardCost
                    ? "hover:scale-105 hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] active:scale-95"
                    : "bg-slate-700 text-slate-500 cursor-not-allowed"
                )}
                style={
                  gameState.balance >= gameState.cardCost
                    ? { background: 'linear-gradient(to bottom, #fde047, #ca8a04)', color: '#0f172a' }
                    : {}
                }
              >
                <span className="relative z-10 flex items-center gap-2">
                  <PlayCircle className="w-6 h-6" />
                  {t.buyCard} (-{gameState.cardCost} {t.currency})
                </span>
                {gameState.balance >= gameState.cardCost && (
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                )}
              </button>

              <button
                onClick={handleCashOut}
                className="group relative px-6 py-4 rounded-2xl font-black text-xl tracking-wide uppercase transition-all duration-300 flex items-center gap-3 overflow-hidden bg-slate-700 text-white hover:bg-slate-600 active:scale-95 border border-slate-600"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <LogOut className="w-6 h-6 text-red-400" />
                  {t.cashOut}
                </span>
              </button>
            </div>
            
            {gameState.balance < gameState.cardCost && !gameState.isCardActive && (
              <p className="text-red-400 font-medium bg-red-400/10 px-4 py-2 rounded-lg border border-red-400/20">
                Not enough funds!
              </p>
            )}
          </div>

          {/* Win/Loss Message */}
          <div className="h-16 flex items-center justify-center">
            {showWinMessage && (
              <div data-testid="win-message" className="animate-bounce bg-green-500 text-white px-8 py-3 rounded-full font-black text-2xl shadow-[0_0_30px_rgba(34,197,94,0.5)] border-4 border-green-400 flex items-center gap-2">
                🎉 {t.win} +{revealedWinnings} {t.currency} 🎉
              </div>
            )}
            {gameState.cardRevealed && gameState.totalWonOnCard === 0 && !showWinMessage && (
              <div className="bg-slate-800 text-slate-400 px-6 py-3 rounded-full font-bold text-lg border border-slate-700">
                {t.betterLuck}
              </div>
            )}
          </div>

          {/* Scratch Card Container */}
          <div className="w-full flex justify-center">
            {gameState.isCardActive ? (
              <ScratchCard
                key={`card-${gameState.rows[0]?.id}`} // Force re-mount on new card
                rows={gameState.rows}
                isRevealed={gameState.cardRevealed}
                onReveal={revealCard}
                onClaimPrize={claimPrize}
              />
            ) : (
              <div className="w-full max-w-sm aspect-3/4.5 bg-slate-800/50 rounded-xl border-4 border-dashed border-slate-700 flex flex-col items-center justify-center text-slate-500 p-8 text-center mx-auto">
                <Coins className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-xl font-bold mb-2">Ready to play?</p>
                <p>Click "{t.buyCard}" to get a new scratch card.</p>
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Summary Modal */}
      {showSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-800 border-2 border-slate-600 rounded-2xl shadow-2xl p-8 max-w-sm w-full flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
            
            <h2 className="text-3xl font-black text-yellow-500 mb-6 uppercase tracking-wider">
              {t.summaryTitle}
            </h2>
            
            <div className="flex flex-col gap-4 w-full mb-8">
              <div className="bg-slate-700/50 rounded-xl p-4 flex justify-between items-center">
                <span className="text-slate-400 font-bold uppercase text-sm">{t.finalBalance}</span>
                <span className="text-2xl font-black text-white">{gameState.balance} {t.currency}</span>
              </div>
              
              <div className="bg-slate-700/50 rounded-xl p-4 flex justify-between items-center">
                <span className="text-slate-400 font-bold uppercase text-sm">{t.totalWon}</span>
                <span className={clsx("text-2xl font-black", netProfit > 0 ? "text-green-400" : netProfit < 0 ? "text-red-400" : "text-white")}>
                  {netProfit > 0 ? "+" : ""}{netProfit} {t.currency}
                </span>
              </div>
            </div>

            <div className="mb-8">
              {isWinner ? (
                <div className="text-green-400 font-black text-2xl flex items-center gap-2 animate-bounce">
                  🎉 {t.winnerMessage} 🎉
                </div>
              ) : (
                <div className="text-slate-300 font-bold text-xl">
                  {t.thanksMessage}
                </div>
              )}
            </div>

            <button
              data-testid="reset-button"
              onClick={handlePlayAgain}
              className="w-full group relative px-6 py-4 rounded-xl font-black text-lg tracking-wide uppercase transition-all duration-300 flex justify-center items-center gap-3 overflow-hidden bg-linear-to-r from-blue-500 to-indigo-600 text-white hover:scale-105 active:scale-95 shadow-lg"
            >
              <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              {t.playAgain}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;