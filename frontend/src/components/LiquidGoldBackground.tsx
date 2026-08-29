"use client";

import { useEffect, useRef } from "react";

export default function LiquidGoldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resize);
    resize();

    const render = () => {
      time += 0.003; // Slow, viscous motion
      const w = canvas.width;
      const h = canvas.height;

      // Obsidian Background
      ctx.fillStyle = "#0A0B0E";
      ctx.fillRect(0, 0, w, h);

      // Liquid Gold Waves
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(0, h);
        
        for (let x = 0; x <= w; x += 10) {
          const y = 
            Math.sin(x * 0.001 + time + i) * 200 +
            Math.sin(x * 0.003 - time * 0.8 + i * 2) * 100 +
            (h * 0.65) - (i * 80);
          ctx.lineTo(x, y);
        }
        
        ctx.lineTo(w, h);
        ctx.closePath();

        const gradient = ctx.createLinearGradient(0, 0, w, h);
        gradient.addColorStop(0, `rgba(212, 175, 55, ${0.08 - i * 0.01})`);
        gradient.addColorStop(0.5, `rgba(255, 245, 210, ${0.04 - i * 0.01})`);
        gradient.addColorStop(1, "rgba(10, 11, 14, 0)");

        ctx.fillStyle = gradient;
        ctx.fill();
      }

      animationFrameId = window.requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
    />
  );
}
