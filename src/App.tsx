import { useEffect, useState } from 'react';
import { Wallet, Globe, Coins, PlayCircle, LogOut, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useGameLogic } from './hooks/useGameLogic';
import { ScratchCard } from './components/ScratchCard';
import { useI18n } from './context/i18n';
import clsx from 'clsx';

function App() {
  const { gameState, generateCard, revealCard, resetGame } = useGameLogic();
  const { lang, t, toggleLang } = useI18n();
  const [showWinMessage, setShowWinMessage] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    if (gameState.cardRevealed) {
      if (gameState.totalWonOnCard > 0) {
        setShowWinMessage(true);
        if (gameState.totalWonOnCard >= 100) {
          triggerConfetti();
        }
        // Hide message after a few seconds
        const timer = setTimeout(() => {
          setShowWinMessage(false);
        }, 4000);
        return () => clearTimeout(timer);
      }
    }
  }, [gameState.cardRevealed, gameState.totalWonOnCard]);

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
    <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-yellow-500 selection:text-black relative">
      {/* Header */}
      <header className="bg-slate-800/80 backdrop-blur-md border-b border-slate-700 sticky top-0 z-10">
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
            <div className="flex items-center gap-2 bg-slate-700 px-4 py-2 rounded-full border border-slate-600">
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
      <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center">
        
        {/* Game Area */}
        <div className="w-full flex flex-col items-center gap-8">
          
          {/* Controls */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={generateCard}
                disabled={gameState.balance < gameState.cardCost}
                className={clsx(
                  "group relative px-8 py-4 rounded-2xl font-black text-xl tracking-wide uppercase transition-all duration-300 flex items-center gap-3 overflow-hidden",
                  gameState.balance >= gameState.cardCost
                    ? "bg-linear-to-b from-yellow-300 to-yellow-600 text-slate-900 hover:scale-105 hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] active:scale-95"
                    : "bg-slate-700 text-slate-500 cursor-not-allowed"
                )}
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
              <div className="animate-bounce bg-green-500 text-white px-8 py-3 rounded-full font-black text-2xl shadow-[0_0_30px_rgba(34,197,94,0.5)] border-4 border-green-400 flex items-center gap-2">
                🎉 {t.win} +{gameState.totalWonOnCard} {t.currency} 🎉
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
              />
            ) : (
              <div className="w-full max-w-md aspect-3/4 bg-slate-800/50 rounded-xl border-4 border-dashed border-slate-700 flex flex-col items-center justify-center text-slate-500 p-8 text-center">
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