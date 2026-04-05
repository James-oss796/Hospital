import React, { createContext, useContext, useState, useCallback } from 'react';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  title?: string;
}

interface NotificationContextType {
  notify: (message: string, type?: NotificationType, title?: string) => void;
  notifications: Notification[];
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const notify = useCallback((message: string, type: NotificationType = 'info', title?: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, message, type, title }]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  }, [removeNotification]);

  return (
    <NotificationContext.Provider value={{ notify, notifications, removeNotification }}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotification();
  
  return (
    <div className="fixed top-20 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      {notifications.map((n) => (
        <div 
          key={n.id}
          className={`pointer-events-auto min-w-[300px] max-w-md p-4 rounded-2xl shadow-2xl border flex items-start gap-3 animate-in slide-in-from-right-4 duration-300 ${
            n.type === 'success' ? 'bg-secondary text-white border-secondary/20' :
            n.type === 'error' ? 'bg-error text-white border-error/20' :
            n.type === 'warning' ? 'bg-tertiary-fixed text-on-tertiary-fixed border-tertiary-fixed/20' :
            'bg-primary text-white border-primary/20'
          }`}
        >
          <span className="material-symbols-outlined mt-0.5">
            {n.type === 'success' ? 'check_circle' :
             n.type === 'error' ? 'error' :
             n.type === 'warning' ? 'warning' : 'info'}
          </span>
          <div className="flex-1">
            {n.title && <p className="font-bold text-sm mb-0.5">{n.title}</p>}
            <p className="text-xs opacity-90 leading-relaxed font-medium">{n.message}</p>
          </div>
          <button 
            onClick={() => removeNotification(n.id)}
            className="opacity-70 hover:opacity-100 transition-opacity"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      ))}
    </div>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within NotificationProvider');
  return context;
};
