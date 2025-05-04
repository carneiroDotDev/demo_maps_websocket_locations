import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "../lib/utils";

interface Notification {
  id: string;
  message: string;
  timestamp: Date;
}

interface NotificationsProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
  className?: string;
}

// Tobe finished
export default function Notifications({
  notifications = [
    {
      id: "Test-ID",
      message: "Testing message",
      timestamp: new Date(),
    },
  ],
  onDismiss,
  className,
}: NotificationsProps) {
  const [visibleNotifications, setVisibleNotifications] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    const newVisibleNotifications = { ...visibleNotifications };
    notifications.forEach((notification) => {
      if (newVisibleNotifications[notification.id] === undefined) {
        newVisibleNotifications[notification.id] = true;

        setTimeout(() => {
          setVisibleNotifications((prev) => ({
            ...prev,
            [notification.id]: false,
          }));

          // Remove after animation
          setTimeout(() => {
            onDismiss(notification.id);
          }, 300);
        }, 5000);
      }
    });

    setVisibleNotifications(newVisibleNotifications);
  }, [notifications, onDismiss, visibleNotifications]);

  const handleDismiss = (id: string) => {
    setVisibleNotifications((prev) => ({
      ...prev,
      [id]: false,
    }));

    setTimeout(() => {
      onDismiss(id);
    }, 300);
  };

  if (notifications.length === 0) return null;

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 flex flex-col gap-2 z-50 max-w-md",
        className
      )}
    >
      {notifications.map((notification) => (
        <div
          key={`${notification.id}-${notification.timestamp.getTime()}`}
          className={cn(
            "bg-blue-600 text-white p-4 rounded-md shadow-lg transition-all duration-300 flex items-start gap-3",
            visibleNotifications[notification.id]
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2"
          )}
        >
          <div className="flex-1">
            <p className="text-sm font-medium">{notification.message}</p>
            <p className="text-xs mt-1 opacity-80">
              {notification.timestamp.toLocaleTimeString()}
            </p>
          </div>
          <button
            onClick={() => handleDismiss(notification.id)}
            className="text-white/80 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
