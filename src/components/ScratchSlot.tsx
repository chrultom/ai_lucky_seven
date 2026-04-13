import React, { useRef, useEffect, useState } from 'react';
import clsx from 'clsx';

interface ScratchSlotProps {
  content: React.ReactNode;
  isRevealed: boolean;
  onReveal: () => void;
  className?: string;
  isWin?: boolean;
}

export const ScratchSlot: React.FC<ScratchSlotProps> = ({ 
  content, 
  isRevealed, 
  onReveal, 
  className,
  isWin 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [localRevealed, setLocalRevealed] = useState(false);
  const revealThreshold = 0.6;

  const effectivelyRevealed = isRevealed || localRevealed;

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const { width, height } = container.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;

    if (!effectivelyRevealed) {
      // Silver base
      ctx.fillStyle = '#C0C0C0';
      ctx.fillRect(0, 0, width, height);

      // Texture
      ctx.fillStyle = '#A9A9A9';
      for (let i = 0; i < 200; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const w = Math.random() * 3 + 1;
        const h = Math.random() * 3 + 1;
        ctx.fillRect(x, y, w, h);
      }
      
      // Pattern
      ctx.strokeStyle = '#999';
      ctx.lineWidth = 1;
      for (let i = 0; i < width + height; i += 10) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(0, i);
        ctx.stroke();
      }
    } else {
      ctx.clearRect(0, 0, width, height);
    }
  }, [effectivelyRevealed]);

  const checkRevealProgress = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) {
        transparentPixels++;
      }
    }

    const totalPixels = pixels.length / 4;
    const percentRevealed = transparentPixels / totalPixels;

    if (percentRevealed > revealThreshold) {
      setLocalRevealed(true);
      onReveal();
    }
  };

  const scratch = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas || effectivelyRevealed) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, Math.PI * 2);
    ctx.fill();
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (effectivelyRevealed) return;
    setIsDrawing(true);
    const { x, y } = getCoordinates(e);
    scratch(x, y);
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || effectivelyRevealed) return;
    const { x, y } = getCoordinates(e);
    scratch(x, y);
  };

  const handleEnd = () => {
    setIsDrawing(false);
    if (!effectivelyRevealed) {
      checkRevealProgress();
    }
  };

  return (
    <div 
      ref={containerRef}
      className={clsx(
        "relative flex items-center justify-center overflow-hidden bg-white select-none",
        effectivelyRevealed && isWin ? "bg-green-100" : "",
        className
      )}
    >
      <div className="w-full h-full flex items-center justify-center">
        {content}
      </div>

      <canvas
        ref={canvasRef}
        className={clsx(
          "absolute inset-0 touch-none cursor-crosshair transition-opacity duration-500",
          effectivelyRevealed ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
      />
    </div>
  );
};
