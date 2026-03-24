import { create } from 'zustand';

export interface Notification {
  id: string;
  title: string;
  body: string;
  duration?: number;
  timestamp: number;
}

interface NotificationStore {
  notifications: Notification[];
  push: (notification: Omit<Notification, 'id' | 'timestamp'>) => string;
  dismiss: (id: string) => void;
  clear: () => void;
}

let notifCounter = 0;

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],

  push: (notification) => {
    const id = `notif-${++notifCounter}`;
    const entry: Notification = {
      ...notification,
      id,
      timestamp: Date.now(),
      duration: notification.duration ?? 5000,
    };
    set((state) => ({
      notifications: [...state.notifications, entry],
    }));
    return id;
  },

  dismiss: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  clear: () => set({ notifications: [] }),
}));
