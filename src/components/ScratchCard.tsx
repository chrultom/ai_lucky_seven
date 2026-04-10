import React, { useState, useEffect } from 'react';
import { Row } from '../types/game';
import { useI18n } from '../context/i18n';
import { ScratchSlot } from './ScratchSlot';

interface ScratchCardProps {
  rows: Row[];
  onReveal: () => void;
  isRevealed: boolean;
}

export const ScratchCard: React.FC<ScratchCardProps> = ({ rows, onReveal, isRevealed }) => {
  const { t } = useI18n();
  const [revealedCount, setRevealedCount] = useState(0);
  const totalSlots = rows.length * 2;

  const handleSlotReveal = () => {
    setRevealedCount(prev => {
      const next = prev + 1;
      if (next === totalSlots && !isRevealed) {
        onReveal();
      }
      return next;
    });
  };

  useEffect(() => {
    if (isRevealed) {
      setRevealedCount(totalSlots);
    }
  }, [isRevealed, totalSlots]);

  return (
    <div className="relative w-full max-w-sm mx-auto bg-slate-50 rounded-xl shadow-2xl overflow-hidden border-[6px] border-yellow-500 select-none flex flex-col p-3">
      
      {/* Branding Header */}
      <div className="flex flex-col items-center mb-3">
        <h2 className="text-3xl font-black text-red-600 tracking-widest uppercase drop-shadow-sm">
          LUCKY 7
        </h2>
        <div className="w-3/4 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mt-1"></div>
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
              
              <div className="flex flex-1 justify-around items-center gap-2 px-1">
                
                {/* Number Zone */}
                <div className="flex flex-col items-center">
                  <span className="text-[9px] text-slate-500 font-bold mb-0.5 uppercase leading-none">Number</span>
                  <ScratchSlot
                    className="w-10 h-10 rounded-full border-2 border-white shadow-sm text-xl font-black text-slate-800 flex items-center justify-center"
                    content={<span className={isWin ? "text-red-600" : ""}>{row.leftNumber}</span>}
                    isRevealed={isRevealed}
                    onReveal={handleSlotReveal}
                    isWin={isWin}
                  />
                </div>

                {/* Prize Zone */}
                <div className="flex flex-col items-center">
                  <span className="text-[9px] text-slate-500 font-bold mb-0.5 uppercase leading-none">Prize</span>
                  <ScratchSlot
                    className="w-20 h-10 rounded-md border-2 border-white shadow-sm text-base font-black text-slate-800 flex items-center justify-center"
                    content={<span className={isWin ? "text-green-600" : ""}>{row.prize} {t.currency}</span>}
                    isRevealed={isRevealed}
                    onReveal={handleSlotReveal}
                    isWin={isWin}
                  />
                </div>

              </div>
            </div>
          );
        })}
      </div>
      
    </div>
  );
};
