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
    <div className="relative w-full max-w-sm mx-auto bg-slate-50 rounded-xl shadow-2xl overflow-hidden border-[6px] border-yellow-500 select-none flex flex-col p-3">
      
      {/* Branding Header */}
      <div className="flex flex-col items-center mb-3">
        <h2 className="text-3xl font-black text-red-600 tracking-widest uppercase drop-shadow-sm">
          LUCKY 7
        </h2>
        <div className="w-3/4 h-1 bg-linear-to-r from-transparent via-yellow-400 to-transparent mt-1"></div>
      </div>

      {/* Rows Container */}
      <div className="flex-1 flex flex-col gap-2 w-full">
        {rows.map((row, i) => {
          const isWin = row.leftNumber === 7;
          
          return (
            <div 
              key={row.id} 
              className="flex items-center justify-between p-1.5 rounded-lg bg-slate-200 border-2 border-slate-300 shadow-inner"
            >
              <div className="w-6 text-center text-slate-400 font-black text-xs">
                #{i + 1}
              </div>
              
              <div className="flex-1 px-1">
                <ScratchSlot
                  className="w-full h-12 rounded-md border-2 border-white shadow-sm flex items-center justify-center overflow-hidden"
                  content={
                    <div className={`w-full h-full flex items-center justify-between px-6 transition-all duration-500 ${row.isRevealed && !isWin ? 'opacity-40' : 'opacity-100'}`}>
                      <div className="flex flex-col items-start w-1/3">
                        <span className="text-[9px] text-slate-500 font-bold uppercase leading-none">Number</span>
                        <span className={`text-xl font-black ${isWin ? "text-yellow-600 animate-pulse drop-shadow-[0_0_8px_rgba(202,138,4,0.8)]" : "text-slate-800"}`}>
                          {row.leftNumber}
                        </span>
                      </div>
                      <div className="flex flex-col items-end w-1/3 text-right">
                        <span className="text-[9px] text-slate-500 font-bold uppercase leading-none">Prize</span>
                        <span className={`text-base font-black ${isWin ? "text-yellow-600 animate-pulse drop-shadow-[0_0_8px_rgba(202,138,4,0.8)]" : "text-slate-800"}`}>
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
