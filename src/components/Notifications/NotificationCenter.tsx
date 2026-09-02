import { useEffect, useRef } from 'react';
import { useNotificationStore, type Notification } from '../../stores/notificationStore.ts';
import { RahulOSMark } from '../shared/RahulOSMark.tsx';

function NotificationToast({ notification }: { notification: Notification }) {
  const dismiss = useNotificationStore((s) => s.dismiss);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (notification.duration && notification.duration > 0) {
      timerRef.current = setTimeout(() => {
        dismiss(notification.id);
      }, notification.duration);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [notification.id, notification.duration, dismiss]);

  return (
    <div
      className="flex items-start"
      style={{
        gap: '12px',
        padding: '12px 14px',
        background: 'var(--color-bg-surface)',
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        border: '0.5px solid var(--color-border-active)',
        borderRadius: '14px',
        boxShadow: 'var(--shadow-toast)',
        width: '336px',
        animation: 'chrome-rise var(--rise-panel) both',
        fontFamily: 'var(--font-system)',
      }}
    >
      <div
        style={{
          width: '30px',
          height: '30px',
          borderRadius: '8px',
          background: 'linear-gradient(160deg, rgba(255,255,255,0.16), rgba(255,255,255,0.04))',
          border: '0.5px solid var(--color-border-active)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          color: 'var(--color-text-primary)',
        }}
      >
        <RahulOSMark size={14} />
      </div>
      <div className="flex-1 min-w-0">
        <div
          style={{
            fontSize: 'var(--text-sm)',
            fontWeight: 590,
            letterSpacing: 'var(--tracking-snug)',
            color: 'var(--color-text-primary)',
            marginBottom: '2px',
            lineHeight: 1.25,
          }}
        >
          {notification.title}
        </div>
        <div
          style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.45,
          }}
        >
          {notification.body}
        </div>
      </div>
      <button
        className="shrink-0"
        style={{
          color: 'var(--color-text-tertiary)',
          fontSize: '16px',
          lineHeight: 1,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '2px',
          borderRadius: '50%',
          width: '20px',
          height: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={() => dismiss(notification.id)}
        aria-label="Dismiss notification"
      >
        &times;
      </button>
    </div>
  );
}

export function NotificationCenter() {
  const notifications = useNotificationStore((s) => s.notifications);

  if (notifications.length === 0) return null;

  return (
    <div
      className="fixed flex flex-col"
      style={{
        gap: '8px',
        top: 'calc(var(--menubar-height) + 12px)',
        right: '12px',
        zIndex: 'var(--z-notification)',
        pointerEvents: 'none',
      }}
    >
      {notifications.map((n) => (
        <div key={n.id} style={{ pointerEvents: 'auto' }}>
          <NotificationToast notification={n} />
        </div>
      ))}
    </div>
  );
}
