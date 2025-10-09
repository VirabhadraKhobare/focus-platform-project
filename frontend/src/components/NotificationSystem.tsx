import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotificationManager } from '../hooks/useNotificationManager';

interface NotificationSystemProps {
  className?: string;
}

export default function NotificationSystem({ className = '' }: NotificationSystemProps) {
  const { notifications, addNotification, removeNotification } = useNotificationManager();
  const navigate = useNavigate();

  // Initialize daily notifications - only show once per day
  useEffect(() => {
    const timer = setTimeout(() => {
      // Daily streak achievement notification
      addNotification({
        id: 'daily-streak',
        type: 'success',
        title: 'Streak Achievement! 🔥',
        message: 'You\'ve maintained your 7-day streak! Keep it up!',
        showOnce: true,
        priority: 5,
        action: {
          label: 'View Progress',
          onClick: () => {
            removeNotification('daily-streak');
            navigate('/dashboard');
            setTimeout(() => {
              const progressElement = document.querySelector('[data-progress-section]');
              progressElement?.scrollIntoView({ behavior: 'smooth' });
            }, 500);
          }
        }
      });

      // Morning activity suggestion
      const hour = new Date().getHours();
      if (hour >= 6 && hour <= 11) {
        addNotification({
          id: 'morning-activity',
          type: 'info',
          title: 'New Activity Available! 🎯',
          message: 'Morning meditation session is ready for you',
          showOnce: true,
          priority: 4,
          action: {
            label: 'Start Now',
            onClick: () => {
              removeNotification('morning-activity');
              navigate('/activity/1');
            }
          }
        });
      }

      // Streak bonus notification
      addNotification({
        id: 'streak-bonus',
        type: 'warning',
        title: 'Streak Bonus Available! 🎁',
        message: 'Complete any activity for +70% XP bonus!',
        showOnce: true,
        priority: 3,
        action: {
          label: 'Claim Bonus',
          onClick: () => {
            removeNotification('streak-bonus');
            addNotification({
              id: 'bonus-activated',
              type: 'success',
              title: 'Bonus Activated! ⚡',
              message: '+70% XP boost active for your next activity!',
              showOnce: false,
              priority: 6,
              action: {
                label: 'Choose Activity',
                onClick: () => {
                  removeNotification('bonus-activated');
                  const activitiesSection = document.querySelector('[data-activities-grid]');
                  activitiesSection?.scrollIntoView({ behavior: 'smooth' });
                }
              }
            });
          }
        }
      });

      // Peak time alert (afternoon)
      if (hour >= 14 && hour <= 17) {
        addNotification({
          id: 'peak-time',
          type: 'info',
          title: 'Peak Time Alert ⚡',
          message: 'You\'re in your peak focus window! Perfect for learning activities.',
          showOnce: true,
          priority: 2,
          action: {
            label: 'Show Learning Activities',
            onClick: () => {
              removeNotification('peak-time');
              const learningButton = document.querySelector('[data-category="learning"]');
              if (learningButton) {
                (learningButton as HTMLElement).click();
                setTimeout(() => {
                  const activitiesSection = document.querySelector('[data-activities-grid]');
                  activitiesSection?.scrollIntoView({ behavior: 'smooth' });
                }, 300);
              }
            }
          }
        });
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [addNotification, removeNotification, navigate]);

  const getNotificationStyle = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-green-500/20 to-emerald-400/20 border-green-500/30';
      case 'info':
        return 'bg-gradient-to-r from-blue-500/20 to-cyan-400/20 border-blue-500/30';
      case 'warning':
        return 'bg-gradient-to-r from-yellow-500/20 to-orange-400/20 border-yellow-500/30';
      case 'error':
        return 'bg-gradient-to-r from-red-500/20 to-pink-400/20 border-red-500/30';
      default:
        return 'bg-gradient-to-r from-violet-500/20 to-cyan-400/20 border-violet-500/30';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅';
      case 'info': return 'ℹ️';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return '🔔';
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 space-y-3 ${className}`}>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`glass rounded-xl p-4 border shadow-lg max-w-sm animate-in slide-in-from-right-full duration-300 ${getNotificationStyle(notification.type)}`}
        >
          <div className="flex items-start gap-3">
            <div className="text-2xl flex-shrink-0">
              {getNotificationIcon(notification.type)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-white mb-1 truncate">
                {notification.title}
              </h4>
              <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                {notification.message}
              </p>
              <div className="flex items-center justify-between gap-2">
                <div className="flex gap-2">
                  {notification.action && (
                    <button
                      onClick={notification.action.onClick}
                      className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium transition-all transform hover:scale-105"
                    >
                      {notification.action.label}
                    </button>
                  )}
                  {notification.dismissAction && (
                    <button
                      onClick={notification.dismissAction.onClick}
                      className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium transition-all transform hover:scale-105 opacity-75"
                    >
                      {notification.dismissAction.label}
                    </button>
                  )}
                </div>
                <button
                  onClick={() => removeNotification(notification.id)}
                  className="ml-auto p-1 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                  title="Dismiss"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}