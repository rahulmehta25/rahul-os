import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useConversation } from '@elevenlabs/react';
import { useWindowStore } from '../../stores/windowStore.ts';
import { appRegistry } from '../../apps/registry.tsx';

type IntentLogEntry = {
  ts: number;
  tool: string;
  args: Record<string, unknown>;
  result: string;
};

const AGENT_ID = import.meta.env.VITE_ELEVENLABS_AGENT_ID as string | undefined;

export function VoiceOverlay() {
  const [open, setOpen] = useState(false);
  const [log, setLog] = useState<IntentLogEntry[]>([]);
  const openWindow = useWindowStore((s) => s.openWindow);
  const logRef = useRef(log);
  logRef.current = log;

  const clientTools = useMemo(
    () => ({
      open_app: ({ app_id }: { app_id: string }) => {
        const manifest = appRegistry[app_id];
        if (!manifest) {
          const result = `unknown app: ${app_id}`;
          setLog((l) => [
            ...l,
            { ts: Date.now(), tool: 'open_app', args: { app_id }, result },
          ]);
          return result;
        }
        openWindow(manifest.id, manifest.name, {
          size: manifest.defaultSize,
          minSize: manifest.minSize,
        });
        const result = `opened ${manifest.name}`;
        setLog((l) => [
          ...l,
          { ts: Date.now(), tool: 'open_app', args: { app_id }, result },
        ]);
        return result;
      },
    }),
    [openWindow],
  );

  const conversation = useConversation({
    clientTools,
    onError: (err) => {
      setLog((l) => [
        ...l,
        { ts: Date.now(), tool: 'error', args: {}, result: String(err) },
      ]);
    },
  });

  const status = conversation.status;
  const isSpeaking = conversation.isSpeaking;

  const start = useCallback(async () => {
    if (!AGENT_ID) {
      setLog((l) => [
        ...l,
        {
          ts: Date.now(),
          tool: 'error',
          args: {},
          result: 'VITE_ELEVENLABS_AGENT_ID not set',
        },
      ]);
      return;
    }
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await conversation.startSession({
        agentId: AGENT_ID,
        connectionType: 'webrtc',
      });
    } catch (err) {
      setLog((l) => [
        ...l,
        { ts: Date.now(), tool: 'error', args: {}, result: String(err) },
      ]);
    }
  }, [conversation]);

  const stop = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };
    const onToggle = () => setOpen((v) => !v);
    document.addEventListener('keydown', onKey);
    window.addEventListener('rahulos:toggle-voice', onToggle);
    return () => {
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('rahulos:toggle-voice', onToggle);
    };
  }, [open]);

  useEffect(() => {
    if (!open && status === 'connected') {
      void stop();
    }
  }, [open, status, stop]);

  if (!open) return null;

  const connected = status === 'connected';
  const statusLabel = connected
    ? isSpeaking
      ? 'Speaking'
      : 'Listening'
    : status === 'connecting'
      ? 'Connecting'
      : 'Ready';

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-start justify-center"
      style={{
        paddingTop: '18vh',
        background: 'var(--color-bg-overlay)',
        backdropFilter: 'blur(18px) saturate(140%)',
        WebkitBackdropFilter: 'blur(18px) saturate(140%)',
        animation: 'chrome-fade 280ms ease-out',
      }}
      onClick={() => setOpen(false)}
      role="dialog"
      aria-label="Voice command overlay"
    >
      <div
        className="w-[min(560px,92vw)] overflow-hidden"
        style={{
          background: 'var(--color-bg-surface)',
          backdropFilter: 'var(--glass-blur)',
          WebkitBackdropFilter: 'var(--glass-blur)',
          border: '0.5px solid var(--color-border-active)',
          borderRadius: '18px',
          boxShadow: 'var(--shadow-window-active)',
          color: 'var(--color-text-primary)',
          animation: 'chrome-rise var(--rise-panel) both',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          aria-hidden
          style={{
            position: 'relative',
            boxShadow: 'var(--glass-highlight)',
          }}
        />

        <div
          className="flex items-center justify-between"
          style={{ padding: '18px 22px 12px' }}
        >
          <div className="flex items-center" style={{ gap: '10px' }}>
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: connected ? (isSpeaking ? '#F5872A' : '#3E8F4A') : 'var(--color-text-tertiary)',
                boxShadow: connected ? '0 0 10px currentColor' : 'none',
              }}
            />
            <div
              style={{
                fontSize: 'var(--text-md)',
                fontWeight: 500,
                letterSpacing: 'var(--tracking-snug)',
              }}
            >
              {statusLabel}
            </div>
          </div>
          <div
            style={{
              fontSize: 'var(--text-xs)',
              letterSpacing: '0.04em',
              color: 'var(--color-text-tertiary)',
              fontWeight: 500,
            }}
          >
            Esc to close
          </div>
        </div>

        <div
          className="flex items-center"
          style={{ padding: '8px 22px 22px', gap: '14px' }}
        >
          {connected ? (
            <button
              onClick={() => void stop()}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-control)',
                border: 'none',
                background: 'rgba(255, 69, 58, 0.16)',
                color: '#FF6B63',
                fontSize: 'var(--text-sm)',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              End session
            </button>
          ) : (
            <button
              onClick={() => void start()}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-control)',
                border: 'none',
                background: 'var(--color-accent)',
                color: '#fff',
                fontSize: 'var(--text-sm)',
                fontWeight: 500,
                cursor: AGENT_ID && status !== 'connecting' ? 'pointer' : 'default',
                opacity: AGENT_ID ? 1 : 0.5,
              }}
              disabled={!AGENT_ID || status === 'connecting'}
            >
              {status === 'connecting' ? 'Connecting' : 'Start speaking'}
            </button>
          )}
          <div
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.45,
            }}
          >
            Open terminal. Open the file manager. Launch settings.
          </div>
        </div>

        <div
          style={{
            padding: '14px 22px 18px',
            borderTop: '0.5px solid var(--color-border)',
            maxHeight: '200px',
            overflowY: 'auto',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: 0,
          }}
        >
          <div
            className="label-quiet"
            style={{ marginBottom: '8px', fontFamily: 'var(--font-system)' }}
          >
            Recent commands
          </div>
          {log.length === 0 ? (
            <div style={{ color: 'var(--color-text-tertiary)' }}>None yet. Try "open terminal".</div>
          ) : (
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {log.slice(-12).map((entry, i) => (
                <li key={entry.ts + ':' + i} style={{ color: 'var(--color-text-secondary)' }}>
                  <span style={{ opacity: 0.5 }}>{new Date(entry.ts).toLocaleTimeString()} </span>
                  <span style={{ color: '#82bcd2' }}>{entry.tool}</span>
                  <span style={{ opacity: 0.65 }}> ({JSON.stringify(entry.args)})</span>
                  <span style={{ opacity: 0.45 }}> {'->'} {entry.result}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
