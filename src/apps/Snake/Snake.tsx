import { useCallback, useEffect, useRef, useState } from 'react';

const GRID_SIZE = 20;
const CELL_SIZE = 16;
const TICK_MS = 100;

type Direction = 'up' | 'down' | 'left' | 'right';
type Point = { x: number; y: number };

function randomFood(snake: Point[]): Point {
  let p: Point;
  do {
    p = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (snake.some((s) => s.x === p.x && s.y === p.y));
  return p;
}

export function Snake() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'over'>('idle');
  const [score, setScore] = useState(0);

  const stateRef = useRef({
    snake: [{ x: 10, y: 10 }] as Point[],
    food: { x: 15, y: 10 } as Point,
    dir: 'right' as Direction,
    nextDir: 'right' as Direction,
    score: 0,
  });

  const reset = useCallback(() => {
    const s = stateRef.current;
    s.snake = [{ x: 10, y: 10 }];
    s.food = randomFood(s.snake);
    s.dir = 'right';
    s.nextDir = 'right';
    s.score = 0;
    setScore(0);
    setGameState('playing');
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const s = stateRef.current;

    const w = GRID_SIZE * CELL_SIZE;
    const h = GRID_SIZE * CELL_SIZE;
    canvas.width = w;
    canvas.height = h;

    // Background
    ctx.fillStyle = '#11111b';
    ctx.fillRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, h);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(w, i * CELL_SIZE);
      ctx.stroke();
    }

    // Food
    ctx.fillStyle = '#f38ba8';
    ctx.beginPath();
    ctx.arc(
      s.food.x * CELL_SIZE + CELL_SIZE / 2,
      s.food.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2 - 2,
      0,
      Math.PI * 2,
    );
    ctx.fill();

    // Snake
    s.snake.forEach((seg, i) => {
      const r = CELL_SIZE / 2 - 1;
      ctx.fillStyle = i === 0 ? '#a6e3a1' : '#74c7ec';
      ctx.beginPath();
      ctx.roundRect(seg.x * CELL_SIZE + 1, seg.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2, r / 2);
      ctx.fill();
    });
  }, []);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    draw();

    const interval = setInterval(() => {
      const s = stateRef.current;
      s.dir = s.nextDir;

      const head = { ...s.snake[0] };
      switch (s.dir) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
      }

      // Wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameState('over');
        return;
      }

      // Self collision
      if (s.snake.some((seg) => seg.x === head.x && seg.y === head.y)) {
        setGameState('over');
        return;
      }

      s.snake.unshift(head);

      // Ate food?
      if (head.x === s.food.x && head.y === s.food.y) {
        s.score++;
        setScore(s.score);
        s.food = randomFood(s.snake);
      } else {
        s.snake.pop();
      }

      draw();
    }, TICK_MS);

    return () => clearInterval(interval);
  }, [gameState, draw]);

  // Keyboard controls
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const s = stateRef.current;
      const keyMap: Record<string, Direction> = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
        w: 'up',
        s: 'down',
        a: 'left',
        d: 'right',
      };
      const newDir = keyMap[e.key];
      if (!newDir) return;

      e.preventDefault();

      const opposites: Record<Direction, Direction> = {
        up: 'down',
        down: 'up',
        left: 'right',
        right: 'left',
      };
      if (opposites[newDir] !== s.dir) {
        s.nextDir = newDir;
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const canvasWidth = GRID_SIZE * CELL_SIZE;
  const canvasHeight = GRID_SIZE * CELL_SIZE;

  return (
    <div
      className="flex flex-col items-center justify-center h-full gap-3"
      style={{ background: '#11111b', fontFamily: 'var(--font-mono)' }}
    >
      {/* Score */}
      <div style={{ color: '#a6adc8', fontSize: '13px' }}>
        Score: <span style={{ color: '#a6e3a1', fontWeight: 600 }}>{score}</span>
      </div>

      {/* Canvas area */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          style={{
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '4px',
          }}
        />

        {/* Overlay for idle/over states */}
        {gameState !== 'playing' && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-3"
            style={{
              background: 'rgba(17,17,27,0.85)',
              borderRadius: '4px',
            }}
          >
            {gameState === 'over' && (
              <div style={{ color: '#f38ba8', fontSize: '16px', fontWeight: 600 }}>
                Game Over
              </div>
            )}
            {gameState === 'over' && (
              <div style={{ color: '#a6adc8', fontSize: '12px' }}>
                Final score: {score}
              </div>
            )}
            <button
              className="px-4 py-1.5 rounded-md"
              style={{
                background: '#a6e3a1',
                color: '#1e1e2e',
                fontWeight: 600,
                fontSize: '13px',
                border: 'none',
                cursor: 'pointer',
              }}
              onClick={reset}
            >
              {gameState === 'idle' ? 'Start Game' : 'Play Again'}
            </button>
            <div style={{ color: '#6c7086', fontSize: '11px' }}>
              Arrow keys or WASD to move
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
