'use client';

import { useEffect, useRef } from 'react';

interface WaveformCanvasProps {
  active: boolean;
  getLevels: () => Uint8Array;
}

const BAR_WIDTH = 4;
const BAR_GAP = 3;

export function WaveformCanvas({ active, getLevels }: WaveformCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    if (!active) return;

    let frame = 0;
    const draw = () => {
      const levels = getLevels();
      const count = Math.floor(width / (BAR_WIDTH + BAR_GAP));
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#12131A';
      for (let i = 0; i < count; i += 1) {
        const level = (levels[Math.floor((i / count) * levels.length)] ?? 0) / 255;
        const barHeight = Math.max(3, level * height);
        ctx.globalAlpha = 0.35 + level * 0.5;
        ctx.fillRect(i * (BAR_WIDTH + BAR_GAP), (height - barHeight) / 2, BAR_WIDTH, barHeight);
      }
      ctx.globalAlpha = 1;
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [active, getLevels]);

  return <canvas ref={canvasRef} className="h-full w-full" aria-hidden />;
}
