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
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    if (!open && status === 'connected') {
      void stop();
    }
  }, [open, status, stop]);

  if (!open) return null;

  const connected = status === 'connected';

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-start justify-center pt-[18vh]"
      style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)' }}
      onClick={() => setOpen(false)}
      role="dialog"
      aria-label="Voice command overlay"
    >
      <div
        className="rounded-2xl shadow-2xl w-[min(640px,92vw)] overflow-hidden"
        style={{ background: 'var(--color-surface, #1f1f27)', color: 'var(--color-text, #f5f5f7)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full"
              style={{
                background: connected ? (isSpeaking ? '#f5872a' : '#3e8f4a') : '#666',
                boxShadow: connected ? '0 0 12px currentColor' : 'none',
              }}
              aria-hidden
            />
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>
              {connected ? (isSpeaking ? 'agent speaking' : 'listening') : status}
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, opacity: 0.6 }}>
            {AGENT_ID ? AGENT_ID.slice(0, 14) + '...' : 'no agent id'}
          </div>
        </div>

        <div className="px-5 py-6 flex items-center gap-4">
          {connected ? (
            <button
              onClick={() => void stop()}
              className="px-4 py-2 rounded-lg font-medium"
              style={{ background: '#d4342a', color: 'white' }}
            >
              End session
            </button>
          ) : (
            <button
              onClick={() => void start()}
              className="px-4 py-2 rounded-lg font-medium"
              style={{ background: '#3e8f4a', color: 'white' }}
              disabled={!AGENT_ID || status === 'connecting'}
            >
              {status === 'connecting' ? 'Connecting...' : 'Start speaking'}
            </button>
          )}
          <div style={{ fontSize: 13, opacity: 0.7 }}>
            Try: "open terminal", "open the file manager", "launch settings".
          </div>
        </div>

        <div
          className="px-5 py-4 border-t border-white/10 max-h-56 overflow-y-auto"
          style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}
        >
          <div style={{ opacity: 0.5, marginBottom: 6 }}>intent log</div>
          {log.length === 0 ? (
            <div style={{ opacity: 0.4 }}>(empty)</div>
          ) : (
            <ul className="space-y-1">
              {log.slice(-12).map((entry, i) => (
                <li key={entry.ts + ':' + i}>
                  <span style={{ opacity: 0.6 }}>{new Date(entry.ts).toLocaleTimeString()} </span>
                  <span style={{ color: '#82bcd2' }}>{entry.tool}</span>
                  <span style={{ opacity: 0.7 }}>({JSON.stringify(entry.args)})</span>
                  <span style={{ opacity: 0.5 }}> -&gt; {entry.result}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
