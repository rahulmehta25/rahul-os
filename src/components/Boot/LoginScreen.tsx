import { useCallback, useEffect } from 'react';

interface LoginScreenProps {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter') onLogin();
    },
    [onLogin],
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
        background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 30%, #16213e 60%, #0f3460 100%)',
        cursor: 'pointer',
        animation: 'login-fade-in 0.4s ease',
      }}
      onClick={onLogin}
    >
      <div className="flex flex-col items-center gap-3">
        {/* Avatar */}
        <div
          className="flex items-center justify-center rounded-full"
          style={{
            width: '96px',
            height: '96px',
            background: 'linear-gradient(135deg, #89b4fa, #cba6f7)',
            boxShadow: '0 8px 32px rgba(137, 180, 250, 0.3)',
            fontSize: '40px',
            fontWeight: 600,
            color: '#1e1e2e',
            fontFamily: 'var(--font-system)',
          }}
        >
          RM
        </div>

        {/* Name */}
        <div
          style={{
            fontSize: '20px',
            fontWeight: 600,
            color: '#cdd6f4',
            fontFamily: 'var(--font-system)',
            marginTop: '4px',
          }}
        >
          Rahul Mehta
        </div>

        {/* Prompt */}
        <div
          style={{
            fontSize: '13px',
            color: '#a6adc8',
            fontFamily: 'var(--font-system)',
            animation: 'pulse-opacity 2s ease-in-out infinite',
          }}
        >
          Click anywhere or press Enter
        </div>
      </div>

      <style>{`
        @keyframes login-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pulse-opacity {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
