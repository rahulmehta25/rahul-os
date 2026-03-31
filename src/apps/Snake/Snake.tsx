import { useEffect, useRef, useState, useCallback } from 'react';

const GRID = 20;
const CELL = 24;
const SIZE = GRID * CELL;
const BASE_TICK = 120;
const MIN_TICK = 55;
const PTS = 10;
const LS_KEY = 'rahulos-snake-best';

type Dir = 'up' | 'down' | 'left' | 'right';
type Pt = { x: number; y: number };

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number; decay: number;
  color: string; size: number;
}

const OPP: Record<Dir, Dir> = { up: 'down', down: 'up', left: 'right', right: 'left' };
const DV: Record<Dir, Pt> = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };

function rFood(snake: Pt[]): Pt {
  let p: Pt;
  do {
    p = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
  } while (snake.some(s => s.x === p.x && s.y === p.y));
  return p;
}

function getBest(): number {
  try { return parseInt(localStorage.getItem(LS_KEY) || '0', 10) || 0; } catch { return 0; }
}
function setBest(v: number) {
  try { localStorage.setItem(LS_KEY, String(v)); } catch { /* noop */ }
}

export function Snake() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [uiState, setUiState] = useState<'idle' | 'playing' | 'over'>('idle');
  const [score, setScore] = useState(0);
  const [best, setBestState] = useState(getBest);

  const g = useRef({
    state: 'idle' as 'idle' | 'playing' | 'over',
    snake: [{ x: 10, y: 10 }] as Pt[],
    prev: [{ x: 10, y: 10 }] as Pt[],
    food: { x: 15, y: 10 } as Pt,
    dir: 'right' as Dir,
    nextDir: 'right' as Dir,
    score: 0,
    lastTick: 0,
    tickMs: BASE_TICK,
    tickT: 0,
    particles: [] as Particle[],
    shake: 0,
    shakeAmt: 0,
    flash: 0,
    pulse: 0,
    demoT: 0,
    raf: 0,
    touchStart: null as Pt | null,
  });

  const start = useCallback(() => {
    const s = g.current;
    s.snake = [{ x: 10, y: 10 }];
    s.prev = [{ x: 9, y: 10 }];
    s.food = rFood(s.snake);
    s.dir = 'right';
    s.nextDir = 'right';
    s.score = 0;
    s.tickMs = BASE_TICK;
    s.tickT = 0;
    s.lastTick = performance.now();
    s.particles = [];
    s.shake = 0;
    s.flash = 0;
    s.state = 'playing';
    setScore(0);
    setUiState('playing');
  }, []);

  const spawnEatFx = useCallback((fx: number, fy: number) => {
    const cx = fx * CELL + CELL / 2;
    const cy = fy * CELL + CELL / 2;
    for (let i = 0; i < 14; i++) {
      const a = (Math.PI * 2 * i) / 14 + Math.random() * 0.4;
      const spd = 1.5 + Math.random() * 3.5;
      g.current.particles.push({
        x: cx, y: cy,
        vx: Math.cos(a) * spd, vy: Math.sin(a) * spd,
        life: 1, decay: 1 / (20 + Math.random() * 15),
        color: ['#FF453A', '#FF6B6B', '#FF8A80', '#FFD60A'][Math.floor(Math.random() * 4)],
        size: 2 + Math.random() * 3,
      });
    }
  }, []);

  const spawnWallFx = useCallback((hx: number, hy: number) => {
    const cx = Math.max(0, Math.min(GRID - 1, hx)) * CELL + CELL / 2;
    const cy = Math.max(0, Math.min(GRID - 1, hy)) * CELL + CELL / 2;
    for (let i = 0; i < 10; i++) {
      const a = Math.random() * Math.PI * 2;
      const spd = 2 + Math.random() * 3;
      g.current.particles.push({
        x: cx, y: cy,
        vx: Math.cos(a) * spd, vy: Math.sin(a) * spd,
        life: 1, decay: 1 / (15 + Math.random() * 10),
        color: ['#FF453A', '#FF6B6B', '#fff'][Math.floor(Math.random() * 3)],
        size: 2 + Math.random() * 2,
      });
    }
  }, []);

  // Single persistent animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    canvas.width = SIZE;
    canvas.height = SIZE;

    const drawGrid = () => {
      ctx.strokeStyle = 'rgba(255,255,255,0.035)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= GRID; i++) {
        ctx.beginPath(); ctx.moveTo(i * CELL, 0); ctx.lineTo(i * CELL, SIZE); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i * CELL); ctx.lineTo(SIZE, i * CELL); ctx.stroke();
      }
    };

    const drawFood = () => {
      const s = g.current;
      s.pulse += 0.06;
      const scale = 1 + Math.sin(s.pulse) * 0.15;
      const cx = s.food.x * CELL + CELL / 2;
      const cy = s.food.y * CELL + CELL / 2;
      const r = (CELL / 2 - 2) * scale;

      // Glow
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 3);
      glow.addColorStop(0, 'rgba(255,69,58,0.25)');
      glow.addColorStop(1, 'rgba(255,69,58,0)');
      ctx.fillStyle = glow;
      ctx.beginPath(); ctx.arc(cx, cy, r * 3, 0, Math.PI * 2); ctx.fill();

      // Body
      const fg = ctx.createRadialGradient(cx - 2, cy - 2, 0, cx, cy, r);
      fg.addColorStop(0, '#FF6B6B');
      fg.addColorStop(1, '#FF453A');
      ctx.fillStyle = fg;
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();

      // Highlight
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.beginPath(); ctx.arc(cx - r * 0.25, cy - r * 0.25, r * 0.3, 0, Math.PI * 2); ctx.fill();
    };

    const drawSnake = (t: number) => {
      const s = g.current;
      const len = s.snake.length;

      for (let i = len - 1; i >= 0; i--) {
        const cur = s.snake[i];
        const prv = s.prev[i] || cur;

        let dx = cur.x - prv.x;
        let dy = cur.y - prv.y;
        if (Math.abs(dx) > 1) dx = 0;
        if (Math.abs(dy) > 1) dy = 0;

        const px = (prv.x + dx * t) * CELL + CELL / 2;
        const py = (prv.y + dy * t) * CELL + CELL / 2;

        const ratio = len > 1 ? i / (len - 1) : 0;
        const rv = Math.round(50 + (27 - 50) * ratio);
        const gv = Math.round(215 + (94 - 215) * ratio);
        const bv = Math.round(75 + (32 - 75) * ratio);
        const col = `rgb(${rv},${gv},${bv})`;

        if (i === 0) {
          // Head: circle, slightly larger, with glow and eyes
          const hr = CELL * 0.55;
          ctx.shadowColor = '#32D74B';
          ctx.shadowBlur = 10;
          ctx.fillStyle = col;
          ctx.beginPath(); ctx.arc(px, py, hr, 0, Math.PI * 2); ctx.fill();
          ctx.shadowBlur = 0;

          // Eyes
          const dv = DV[s.dir];
          const eo = hr * 0.35;
          const nx = -dv.y;
          const ny = dv.x;

          ctx.fillStyle = '#fff';
          ctx.beginPath(); ctx.arc(px + dv.x * eo * 0.5 + nx * eo, py + dv.y * eo * 0.5 + ny * eo, 2.8, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(px + dv.x * eo * 0.5 - nx * eo, py + dv.y * eo * 0.5 - ny * eo, 2.8, 0, Math.PI * 2); ctx.fill();

          ctx.fillStyle = '#111';
          ctx.beginPath(); ctx.arc(px + dv.x * eo * 0.8 + nx * eo, py + dv.y * eo * 0.8 + ny * eo, 1.5, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(px + dv.x * eo * 0.8 - nx * eo, py + dv.y * eo * 0.8 - ny * eo, 1.5, 0, Math.PI * 2); ctx.fill();
        } else {
          // Body: rounded rect with 3D effect, tapers toward tail
          const sz = CELL * (0.44 - ratio * 0.07);
          // Shadow for depth
          ctx.fillStyle = `rgba(0,0,0,0.3)`;
          ctx.beginPath();
          ctx.roundRect(px - sz + 1, py - sz + 1.5, sz * 2, sz * 2, sz * 0.6);
          ctx.fill();
          // Main body
          ctx.fillStyle = col;
          ctx.beginPath();
          ctx.roundRect(px - sz, py - sz, sz * 2, sz * 2, sz * 0.6);
          ctx.fill();
          // Highlight for 3D
          const hlAlpha = 0.25 - ratio * 0.15;
          ctx.fillStyle = `rgba(255,255,255,${Math.max(0.05, hlAlpha)})`;
          ctx.beginPath();
          ctx.roundRect(px - sz + 1, py - sz, sz * 2 - 2, sz, sz * 0.4);
          ctx.fill();
        }
      }
    };

    const drawParticles = () => {
      const s = g.current;
      s.particles = s.particles.filter(p => {
        p.x += p.vx; p.y += p.vy;
        p.vx *= 0.95; p.vy *= 0.95;
        p.life -= p.decay;
        if (p.life <= 0) return false;

        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
        return true;
      });
    };

    const drawIdle = () => {
      const s = g.current;
      s.demoT += 0.018;
      const cx = SIZE / 2;
      const cy = SIZE / 2;
      const r = 75;
      const segs = 10;

      for (let i = segs - 1; i >= 0; i--) {
        const t = s.demoT - i * 0.14;
        const x = cx + r * Math.sin(t);
        const y = cy + r * Math.sin(t * 2) * 0.45;
        const ratio = i / (segs - 1);
        const rv = Math.round(50 + (27 - 50) * ratio);
        const gv = Math.round(215 + (94 - 215) * ratio);
        const bv = Math.round(75 + (32 - 75) * ratio);

        ctx.globalAlpha = 1 - ratio * 0.5;
        if (i === 0) {
          ctx.fillStyle = `rgb(${rv},${gv},${bv})`;
          ctx.shadowColor = '#32D74B'; ctx.shadowBlur = 10;
          ctx.beginPath(); ctx.arc(x, y, CELL * 0.5, 0, Math.PI * 2); ctx.fill();
          ctx.shadowBlur = 0;
        } else {
          const sz = CELL * (0.38 - ratio * 0.06);
          ctx.fillStyle = `rgb(${rv},${gv},${bv})`;
          ctx.beginPath(); ctx.roundRect(x - sz, y - sz, sz * 2, sz * 2, sz * 0.6); ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };

    const loop = (ts: number) => {
      const s = g.current;
      ctx.save();

      // Shake offset
      if (s.shake > 0) {
        const intensity = s.shakeAmt * (s.shake / 0.35);
        ctx.translate((Math.random() - 0.5) * intensity, (Math.random() - 0.5) * intensity);
        s.shake = Math.max(0, s.shake - 1 / 60);
      }

      // Background
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(-20, -20, SIZE + 40, SIZE + 40);
      drawGrid();

      if (s.state === 'idle') {
        drawIdle();
      } else {
        // Game tick
        if (s.state === 'playing') {
          const elapsed = ts - s.lastTick;
          s.tickT = Math.min(elapsed / s.tickMs, 1);

          if (elapsed >= s.tickMs) {
            s.lastTick = ts;
            s.tickT = 0;
            s.prev = s.snake.map(p => ({ ...p }));
            s.dir = s.nextDir;

            const head = { ...s.snake[0] };
            head.x += DV[s.dir].x;
            head.y += DV[s.dir].y;

            // Wall collision
            if (head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID) {
              s.shake = 0.35; s.shakeAmt = 14;
              spawnWallFx(head.x, head.y);
              s.state = 'over';
              const b = getBest();
              if (s.score > b) { setBest(s.score); setBestState(s.score); }
              setUiState('over');
              // keep rendering for effects
            } else if (s.snake.some(seg => seg.x === head.x && seg.y === head.y)) {
              // Self collision
              s.shake = 0.35; s.shakeAmt = 12;
              s.state = 'over';
              const b = getBest();
              if (s.score > b) { setBest(s.score); setBestState(s.score); }
              setUiState('over');
            } else {
              s.snake.unshift(head);
              if (head.x === s.food.x && head.y === s.food.y) {
                s.score += PTS;
                setScore(s.score);
                s.tickMs = Math.max(MIN_TICK, BASE_TICK - Math.floor(s.score / 50) * 8);
                s.flash = 1;
                spawnEatFx(s.food.x, s.food.y);
                s.food = rFood(s.snake);
                s.prev.unshift({ ...s.prev[0] });
              } else {
                s.snake.pop();
              }
            }
          }
        }

        drawFood();
        drawSnake(s.state === 'playing' ? s.tickT : 1);
        drawParticles();

        // Flash
        if (s.flash > 0) {
          ctx.fillStyle = `rgba(50,215,75,${s.flash * 0.15})`;
          ctx.fillRect(-20, -20, SIZE + 40, SIZE + 40);
          s.flash = Math.max(0, s.flash - 1 / 60 / 0.12);
        }
      }

      // Border
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1;
      ctx.strokeRect(0.5, 0.5, SIZE - 1, SIZE - 1);

      ctx.restore();
      s.raf = requestAnimationFrame(loop);
    };

    g.current.raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(g.current.raf);
  }, [spawnEatFx, spawnWallFx]);

  // Keyboard
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (g.current.state !== 'playing') start();
        return;
      }
      const map: Record<string, Dir> = {
        ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
        w: 'up', s: 'down', a: 'left', d: 'right',
        W: 'up', S: 'down', A: 'left', D: 'right',
      };
      const nd = map[e.key];
      if (!nd) return;
      e.preventDefault();
      if (OPP[nd] !== g.current.dir) g.current.nextDir = nd;
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [start]);

  // Touch
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onStart = (e: TouchEvent) => {
      g.current.touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onEnd = (e: TouchEvent) => {
      const s = g.current;
      if (!s.touchStart) return;
      const dx = e.changedTouches[0].clientX - s.touchStart.x;
      const dy = e.changedTouches[0].clientY - s.touchStart.y;
      s.touchStart = null;
      if (Math.abs(dx) < 25 && Math.abs(dy) < 25) {
        if (s.state !== 'playing') start();
        return;
      }
      const nd: Dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
      if (OPP[nd] !== s.dir) s.nextDir = nd;
    };
    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchend', onEnd, { passive: true });
    return () => { el.removeEventListener('touchstart', onStart); el.removeEventListener('touchend', onEnd); };
  }, [start]);

  return (
    <div
      ref={wrapRef}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        height: '100%', gap: '14px',
        background: '#111', fontFamily: 'var(--font-mono, "SF Mono", "Fira Code", monospace)',
        userSelect: 'none', touchAction: 'none', WebkitUserSelect: 'none',
      }}
    >
      {/* Score HUD */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '20px' }}>
        <span style={{ color: '#555', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase' as const }}>
          Score
        </span>
        <span style={{
          color: '#32D74B', fontWeight: 700, fontSize: '28px',
          fontVariantNumeric: 'tabular-nums',
          textShadow: score > 0 ? '0 0 12px rgba(50,215,75,0.35)' : 'none',
        }}>
          {score}
        </span>
        {best > 0 && (
          <span style={{ color: '#3a3a3a', fontSize: '11px', letterSpacing: '0.1em' }}>
            BEST {best}
          </span>
        )}
      </div>

      {/* Canvas */}
      <div style={{ position: 'relative' }}>
        <canvas
          ref={canvasRef}
          width={SIZE}
          height={SIZE}
          style={{ borderRadius: '8px', display: 'block' }}
        />

        {/* Overlays */}
        {uiState !== 'playing' && (
          <div
            style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              background: uiState === 'over' ? 'rgba(17,17,17,0.82)' : 'transparent',
              borderRadius: '8px', gap: '10px', cursor: 'pointer',
            }}
            onClick={() => { if (g.current.state !== 'playing') start(); }}
          >
            {uiState === 'idle' && (
              <>
                <div style={{
                  fontSize: '44px', fontWeight: 800, color: '#32D74B',
                  letterSpacing: '0.3em',
                  textShadow: '0 0 30px rgba(50,215,75,0.4), 0 0 60px rgba(50,215,75,0.12)',
                }}>
                  SNAKE
                </div>
                <div style={{ color: '#444', fontSize: '12px', marginTop: '-2px' }}>
                  A classic, reimagined
                </div>
                <div style={{
                  color: '#32D74B', fontSize: '13px', marginTop: '20px',
                  animation: 'snkPulse 2s ease-in-out infinite',
                }}>
                  Press SPACE or tap to start
                </div>
                {best > 0 && (
                  <div style={{ color: '#3a3a3a', fontSize: '11px', marginTop: '4px' }}>
                    High Score: {best}
                  </div>
                )}
              </>
            )}
            {uiState === 'over' && (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: '32px 40px', borderRadius: '16px', gap: '6px',
                background: 'rgba(30,30,30,0.65)',
                backdropFilter: 'blur(20px) saturate(1.5)',
                WebkitBackdropFilter: 'blur(20px) saturate(1.5)',
                border: '0.5px solid rgba(255,255,255,0.1)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              }}>
                <div style={{
                  fontSize: '30px', fontWeight: 800, color: '#FF453A',
                  letterSpacing: '0.08em',
                  textShadow: '0 0 24px rgba(255,69,58,0.4)',
                  animation: 'snkShake 0.35s ease-out',
                }}>
                  GAME OVER
                </div>
                <div style={{
                  fontSize: '48px', fontWeight: 700, color: '#fff',
                  fontVariantNumeric: 'tabular-nums', marginTop: '2px',
                }}>
                  {score}
                </div>
                <div style={{ color: '#888', fontSize: '12px', marginTop: '-2px' }}>
                  {score > 0 && score >= best ? (
                    <span style={{ color: '#FFD60A', fontWeight: 600 }}>NEW BEST!</span>
                  ) : (
                    <>Best: {best}</>
                  )}
                </div>
                <div style={{
                  color: '#32D74B', fontSize: '13px', marginTop: '14px',
                  animation: 'snkPulse 2s ease-in-out infinite',
                }}>
                  Press SPACE to play again
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Controls hint */}
      <div style={{ color: '#2a2a2a', fontSize: '10px', letterSpacing: '0.12em' }}>
        WASD / ARROWS
      </div>

      <style>{`
        @keyframes snkPulse {
          0%,100%{opacity:1}
          50%{opacity:0.35}
        }
        @keyframes snkShake {
          0%{transform:translateX(-10px)}
          20%{transform:translateX(8px)}
          40%{transform:translateX(-6px)}
          60%{transform:translateX(4px)}
          80%{transform:translateX(-2px)}
          100%{transform:translateX(0)}
        }
      `}</style>
    </div>
  );
}
