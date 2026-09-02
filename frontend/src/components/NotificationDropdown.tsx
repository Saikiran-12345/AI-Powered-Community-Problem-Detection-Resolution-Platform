import React, { useState } from 'react';
import { Bell, Check, Info } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  time: string;
}

export const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', title: 'AI Analysis Complete', message: 'Issue CIV-1024 has been prioritized.', isRead: false, time: '2m ago' },
    { id: '2', title: 'System Alert', 'Local AI Model successfully loaded into memory.'', isRead: false, time: '1h ago' }
  ]);

  const unread = notifications.filter(n => !n.isRead).length;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({...n, isRead: true})));
  };

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none">
        <Bell className="w-6 h-6" />
        {unread > 0 && <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 className="font-bold text-gray-900">Notifications</h3>
            {unread > 0 && (
              <button onClick={markAllRead} className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1">
                <Check className="w-3 h-3" /> Mark all read
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.map(n => (
              <div key={n.id} className={`p-4 border-b border-gray-50 flex items-start gap-3 hover:bg-gray-50 cursor-pointer ${!n.isRead ? 'bg-primary-50/30' : ''}`}>
                <div className={`mt-1 p-1.5 rounded-full ${!n.isRead ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-400'}`}>
                   <Info className="w-4 h-4" />
                </div>
                <div>
                   <h4 className={`text-sm font-bold ${!n.isRead ? 'text-gray-900' : 'text-gray-600'}`}>{n.title}</h4>
                   <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.message}</p>
                   <span className="text-[10px] font-semibold text-gray-400 mt-2 block">{n.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
