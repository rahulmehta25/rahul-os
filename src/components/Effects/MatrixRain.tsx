import { useEffect, useRef, useState } from 'react';
import { useEffectsStore } from '../../stores/effectsStore';

const CHARS = 'ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';
const FONT_SIZE = 16;
const DURATION = 5000;
const FADE_DURATION = 800;

export function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const clearEffect = useEffectsStore((s) => s.clearEffect);
  const [fading, setFading] = useState(false);
  const columnsRef = useRef<number[]>([]);
  const animRef = useRef<number>(0);

  // Start fade timer
  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), DURATION);
    const dismissTimer = setTimeout(() => clearEffect(), DURATION + FADE_DURATION);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(dismissTimer);
    };
  }, [clearEffect]);

  // Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const columnCount = Math.floor(canvas.width / FONT_SIZE);
      // Preserve existing drops, add new ones for wider screen
      const existing = columnsRef.current;
      columnsRef.current = Array.from({ length: columnCount }, (_, i) =>
        i < existing.length ? existing[i] : Math.random() * -50,
      );
    };

    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const columns = columnsRef.current;
      for (let i = 0; i < columns.length; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const x = i * FONT_SIZE;
        const y = columns[i] * FONT_SIZE;

        // Lead character is white-green, trail is green
        if (Math.random() > 0.8) {
          ctx.fillStyle = '#fff';
        } else {
          const brightness = 180 + Math.floor(Math.random() * 75);
          ctx.fillStyle = `rgb(0, ${brightness}, 0)`;
        }

        ctx.font = `${FONT_SIZE}px monospace`;
        ctx.fillText(char, x, y);

        // Reset column randomly when it goes off screen
        if (y > canvas.height && Math.random() > 0.975) {
          columns[i] = 0;
        }
        columns[i]++;
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#000',
        opacity: fading ? 0 : 1,
        transition: `opacity ${FADE_DURATION}ms ease`,
        pointerEvents: 'all',
      }}
    >
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          width: '100%',
          textAlign: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: '18px',
          color: '#0f0',
          textShadow: '0 0 10px #0f0, 0 0 20px #0f0',
          animation: 'matrix-text-pulse 2s ease-in-out infinite',
        }}
      >
        Wake up, Neo...
      </div>
      <style>{`
        @keyframes matrix-text-pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
