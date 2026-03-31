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
      className="flex items-start gap-3"
      style={{
        padding: '10px 12px',
        background: 'var(--color-bg-surface)',
        backdropFilter: 'blur(40px) saturate(1.8)',
        WebkitBackdropFilter: 'blur(40px) saturate(1.8)',
        border: '0.5px solid var(--color-border-active)',
        borderRadius: '14px',
        boxShadow: 'var(--shadow-context-menu)',
        width: '340px',
        animation: 'notif-slide-in 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        fontFamily: 'var(--font-system)',
      }}
    >
      {/* App icon */}
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #0A84FF, #5E5CE6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          fontSize: '16px',
          color: 'white',
          fontWeight: 600,
        }}
      >
        R
      </div>
      <div className="flex-1 min-w-0">
        <div
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            marginBottom: '1px',
            lineHeight: 1.3,
          }}
        >
          {notification.title}
        </div>
        <div
          style={{
            fontSize: '12px',
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
      className="fixed flex flex-col gap-2"
      style={{
        top: 'calc(var(--menubar-height) + 8px)',
        right: '8px',
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
            transform: translateX(100%) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
