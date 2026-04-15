import React, { useEffect } from 'react';
import { Row } from '../types/game';
import { useI18n } from '../hooks/useI18n';
import { ScratchSlot } from './ScratchSlot';

interface ScratchCardProps {
  rows: Row[];
  onReveal: () => void;
  isRevealed: boolean;
  onClaimPrize: (rowIndex: number) => void;
}

export const ScratchCard: React.FC<ScratchCardProps> = ({ rows, onReveal, isRevealed, onClaimPrize }) => {
  const { t } = useI18n();

  const handleSlotReveal = (rowIndex: number) => {
    onClaimPrize(rowIndex);
  };

  useEffect(() => {
    if (!isRevealed && rows.length > 0 && rows.every(row => row.isRevealed)) {
      onReveal();
    }
  }, [rows, isRevealed, onReveal]);

  return (
    <div data-testid="scratch-card" className="relative w-full max-w-sm mx-auto bg-zinc-900 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-zinc-800 to-black rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden border-4 border-yellow-500/50 select-none flex flex-col p-4 transition-transform duration-500 hover:rotate-[0.5deg] hover:scale-[1.01] group min-h-[500px]">
      
      {/* Branding Header */}
      <div className="flex flex-col items-center mb-4 shrink-0">
        <h2 className="text-4xl font-black text-transparent bg-clip-text bg-linear-to-br from-yellow-300 to-orange-500 tracking-widest uppercase drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] filter">
          LUCKY 7
        </h2>
        <div className="w-4/5 h-1 bg-linear-to-r from-transparent via-yellow-500/50 to-transparent mt-2"></div>
      </div>

      {/* Rows Container */}
      <div className="flex-1 flex flex-col gap-2 w-full mt-2 justify-center">
        {rows.map((row, i) => {
          const isWin = row.leftNumber === 7;
          
          return (
            <div 
              key={row.id} 
              className="flex items-center justify-between p-1.5 rounded-lg bg-slate-800/80 border border-slate-700 shadow-inner"
            >
              <div className="w-6 text-center text-slate-500 font-black text-xs">
                #{i + 1}
              </div>
              
              <div className="flex-1 px-1">
                <ScratchSlot
                  testId={`scratch-cell-${i}`}
                  className="w-full h-12 rounded-md border border-slate-900 shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)] flex items-center justify-center overflow-hidden bg-[#fdfbf7]"
                  content={
                    <div className={`w-full h-full flex items-center justify-between px-6 transition-all duration-500 ${row.isRevealed && !isWin ? 'opacity-40 grayscale' : 'opacity-100'}`}>
                      <div className="flex flex-col items-start w-1/3">
                        <span className="text-[9px] text-slate-500 font-bold uppercase leading-none">Number</span>
                        <span className={`text-2xl font-black ${isWin ? "text-yellow-600 animate-pulse drop-shadow-[0_0_8px_rgba(202,138,4,0.8)]" : "text-slate-800"}`}>
                          {row.leftNumber}
                        </span>
                      </div>
                      <div className="flex flex-col items-end w-1/3 text-right">
                        <span className="text-[9px] text-slate-500 font-bold uppercase leading-none">Prize</span>
                        <span className={`text-lg font-black ${isWin ? "text-yellow-600 animate-pulse drop-shadow-[0_0_8px_rgba(202,138,4,0.8)]" : "text-slate-800"}`}>
                          {row.prize} {t.currency}
                        </span>
                      </div>
                    </div>
                  }
                  isRevealed={isRevealed || row.isRevealed}
                  onReveal={() => handleSlotReveal(i)}
                  isWin={isWin}
                />
              </div>
            </div>
          );
        })}
      </div>
      
    </div>
  );
};
