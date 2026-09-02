import { useCallback, useEffect, useState } from 'react';
import { SEQUOIA_DARK } from '../../styles/wallpapers.ts';

interface LoginScreenProps {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [exiting, setExiting] = useState(false);

  const handleLogin = useCallback(() => {
    if (exiting) return;
    setExiting(true);
    setTimeout(onLogin, 480);
  }, [exiting, onLogin]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') handleLogin();
    },
    [handleLogin],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{
        zIndex: 'var(--z-boot)',
        cursor: 'pointer',
        transform: exiting ? 'scale(1.015)' : 'scale(1)',
        opacity: exiting ? 0 : 1,
        transition: exiting
          ? 'transform 480ms cubic-bezier(0.22, 1, 0.36, 1), opacity 420ms ease'
          : 'none',
      }}
      onClick={handleLogin}
    >
      <div
        className="absolute inset-0"
        style={{
          background: SEQUOIA_DARK,
          filter: 'blur(72px) brightness(0.72) saturate(1.15)',
          transform: 'scale(1.18)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 42%, transparent 28%, rgba(0,0,0,0.38) 100%)',
        }}
      />

      <div
        className="flex flex-col items-center relative"
        style={{ animation: 'login-content-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) both' }}
      >
        <div
          className="flex items-center justify-center rounded-full"
          style={{
            width: '96px',
            height: '96px',
            background: 'linear-gradient(160deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 100%)',
            backdropFilter: 'blur(24px) saturate(160%)',
            WebkitBackdropFilter: 'blur(24px) saturate(160%)',
            border: '0.5px solid rgba(255, 255, 255, 0.28)',
            boxShadow:
              'inset 0 0.5px 0 rgba(255,255,255,0.4), 0 12px 40px rgba(0,0,0,0.28)',
            fontSize: '28px',
            fontWeight: 500,
            color: '#ffffff',
            fontFamily: 'var(--font-system)',
            letterSpacing: '-0.03em',
          }}
        >
          RM
        </div>

        <div
          style={{
            marginTop: '28px',
            fontSize: 'var(--text-display)',
            fontWeight: 500,
            color: '#ffffff',
            fontFamily: 'var(--font-system)',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
          }}
        >
          Rahul Mehta
        </div>

        <div
          style={{
            marginTop: '14px',
            fontSize: 'var(--text-md)',
            color: 'rgba(255, 255, 255, 0.52)',
            fontFamily: 'var(--font-system)',
            fontWeight: 400,
            letterSpacing: '0.04em',
            animation: 'login-pulse 3s ease-in-out infinite',
          }}
        >
          Click to enter
        </div>
      </div>

      <style>{`
        @keyframes login-content-in {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes login-pulse {
          0%, 100% { opacity: 0.52; }
          50% { opacity: 0.82; }
        }
      `}</style>
    </div>
  );
}
