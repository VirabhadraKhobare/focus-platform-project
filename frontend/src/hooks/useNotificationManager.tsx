import { useState, useEffect } from 'react';

interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  dismissAction?: {
    label: string;
    onClick: () => void;
  };
  showOnce?: boolean; // Show only once per day
  priority?: number;   // Higher priority shows first
}

interface NotificationState {
  notifications: Notification[];
  shownToday: string[];
  lastShownDate: string;
}

const STORAGE_KEY = 'focusflow_notifications';

export function useNotificationManager() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [shownToday, setShownToday] = useState<string[]>([]);

  // Get today's date as string
  const getTodayString = () => {
    return new Date().toDateString();
  };

  // Load notification state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const today = getTodayString();

    if (saved) {
      try {
        const state: NotificationState = JSON.parse(saved);
        
        // Reset if it's a new day
        if (state.lastShownDate !== today) {
          setShownToday([]);
          localStorage.setItem(STORAGE_KEY, JSON.stringify({
            notifications: [],
            shownToday: [],
            lastShownDate: today
          }));
        } else {
          setShownToday(state.shownToday || []);
        }
      } catch (error) {
        console.error('Error loading notification state:', error);
        // Reset on error
        setShownToday([]);
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          notifications: [],
          shownToday: [],
          lastShownDate: today
        }));
      }
    } else {
      // Initialize for first time
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        notifications: [],
        shownToday: [],
        lastShownDate: today
      }));
    }
  }, []);

  // Save state to localStorage whenever it changes
  const saveState = (newShownToday: string[]) => {
    const state: NotificationState = {
      notifications: [],
      shownToday: newShownToday,
      lastShownDate: getTodayString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  };

  // Add a notification
  const addNotification = (notification: Notification) => {
    // Check if it's a show-once notification that was already shown today
    if (notification.showOnce && shownToday.includes(notification.id)) {
      return; // Don't show again
    }

    setNotifications(prev => {
      // Remove existing notification with same id
      const filtered = prev.filter(n => n.id !== notification.id);
      
      // Add new notification and sort by priority
      const updated = [...filtered, notification].sort((a, b) => 
        (b.priority || 0) - (a.priority || 0)
      );
      
      return updated;
    });

    // Mark as shown if it's a show-once notification
    if (notification.showOnce) {
      const newShownToday = [...shownToday, notification.id];
      setShownToday(newShownToday);
      saveState(newShownToday);
    }
  };

  // Remove a notification
  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Check if a notification was shown today
  const wasShownToday = (id: string) => {
    return shownToday.includes(id);
  };

  // Reset daily notifications (for testing purposes)
  const resetDailyNotifications = () => {
    setShownToday([]);
    const state: NotificationState = {
      notifications: [],
      shownToday: [],
      lastShownDate: getTodayString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    wasShownToday,
    resetDailyNotifications
  };
}