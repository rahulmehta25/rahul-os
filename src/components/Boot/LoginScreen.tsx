import { useCallback, useEffect, useRef, useState } from 'react';

interface LoginScreenProps {
  onLogin: () => void;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

function createParticles(count: number): Particle[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2.5 + 0.5,
    speedX: (Math.random() - 0.5) * 0.15,
    speedY: (Math.random() - 0.5) * 0.1 - 0.05,
    opacity: Math.random() * 0.3 + 0.05,
  }));
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [exiting, setExiting] = useState(false);
  const [particles, setParticles] = useState<Particle[]>(() => createParticles(40));
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef(0);

  const handleLogin = useCallback(() => {
    if (exiting) return;
    setExiting(true);
    setTimeout(onLogin, 400);
  }, [exiting, onLogin]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter') handleLogin();
    },
    [handleLogin],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Particle animation loop
  useEffect(() => {
    const animate = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const dt = (time - lastTimeRef.current) / 16;
      lastTimeRef.current = time;

      setParticles((prev) =>
        prev.map((p) => {
          let nx = p.x + p.speedX * dt;
          let ny = p.y + p.speedY * dt;
          if (nx < -2) nx = 102;
          if (nx > 102) nx = -2;
          if (ny < -2) ny = 102;
          if (ny > 102) ny = -2;
          return { ...p, x: nx, y: ny };
        }),
      );

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{
        zIndex: 'var(--z-boot)',
        cursor: 'pointer',
        transform: exiting ? 'scale(1.02)' : 'scale(1)',
        opacity: exiting ? 0 : 1,
        transition: exiting
          ? 'transform 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 400ms ease'
          : 'none',
      }}
      onClick={handleLogin}
    >
      {/* Wallpaper background with heavy blur */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, #1a0533 0%, #0d2b5e 18%, #0a4d8c 30%, #1b7a8a 42%, #2d8f6f 52%, #4da660 60%, #8cc63f 68%, #d4a843 76%, #e8834a 84%, #c74a6e 92%, #6a2c91 100%)',
          filter: 'blur(60px) brightness(1.1) saturate(1.5)',
          transform: 'scale(1.3)',
        }}
      />

      {/* Dark overlay for depth */}
      <div
        className="absolute inset-0"
        style={{
          background: 'rgba(0, 0, 0, 0.15)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden" style={{ pointerEvents: 'none' }}>
        {particles.map((p, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              borderRadius: '50%',
              background: '#ffffff',
              opacity: p.opacity,
              willChange: 'transform',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div
        className="flex flex-col items-center relative"
        style={{ animation: 'login-content-in 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) both' }}
      >
        {/* Avatar circle */}
        <div
          className="flex items-center justify-center rounded-full"
          style={{
            width: '120px',
            height: '120px',
            background: 'linear-gradient(135deg, #4A90D9 0%, #7B5EA7 100%)',
            border: '3px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.3)',
            fontSize: '40px',
            fontWeight: 400,
            color: '#ffffff',
            fontFamily: 'var(--font-system)',
            letterSpacing: '-0.5px',
          }}
        >
          RM
        </div>

        {/* Name */}
        <div
          style={{
            marginTop: '16px',
            fontSize: '24px',
            fontWeight: 500,
            color: '#ffffff',
            fontFamily: 'var(--font-system)',
            textShadow: '0 1px 8px rgba(0, 0, 0, 0.4)',
            letterSpacing: '-0.3px',
          }}
        >
          Rahul Mehta
        </div>

        {/* Hint text with pulse */}
        <div
          style={{
            marginTop: '12px',
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.5)',
            fontFamily: 'var(--font-system)',
            fontWeight: 400,
            animation: 'login-pulse 2.5s ease-in-out infinite',
          }}
        >
          Click anywhere or press Enter
        </div>
      </div>

      <style>{`
        @keyframes login-content-in {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes login-pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
