import { X } from "lucide-react";

export interface Notification {
  id: string;
  message: string;
  change: string;
  timestamp: Date;
}
interface NotificationsProps {
  notifications: Notification[];
  removeNotification: (id: string) => void;
}

export default function Notifications({
  notifications,
  removeNotification,
}: NotificationsProps) {
  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50 max-w-md">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="bg-amber-300 text-black p-4 rounded-md shadow-lg flex items-start gap-3"
        >
          <div className="flex-1">
            <p className="text-sm font-medium">{notification.message}</p>
            <p className="text-xs mt-1 font-medium">{notification.change}</p>
            <p className="text-xs mt-1 opacity-80">
              {notification.timestamp.toLocaleTimeString()}
            </p>
          </div>
          <button
            onClick={() => removeNotification(notification.id)}
            className="text-black/80 hover:text-black/50 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
