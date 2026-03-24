import { useEffect, useRef } from 'react';
import { useNotificationStore, type Notification } from '../../stores/notificationStore.ts';

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
      className="flex items-start gap-3 p-3 rounded-lg"
      style={{
        background: 'var(--color-bg-surface-solid)',
        border: '1px solid var(--color-border-active)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        width: '300px',
        animation: 'notif-slide-in 0.25s ease-out',
        fontFamily: 'var(--font-system)',
      }}
    >
      <div className="flex-1 min-w-0">
        <div
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            marginBottom: '2px',
          }}
        >
          {notification.title}
        </div>
        <div
          style={{
            fontSize: '11px',
            color: 'var(--color-text-secondary)',
            lineHeight: '1.4',
          }}
        >
          {notification.body}
        </div>
      </div>
      <button
        className="shrink-0"
        style={{
          color: 'var(--color-text-tertiary)',
          fontSize: '14px',
          lineHeight: 1,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '2px',
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
      className="fixed flex flex-col gap-2"
      style={{
        top: 'calc(var(--menubar-height) + 8px)',
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

      <style>{`
        @keyframes notif-slide-in {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
