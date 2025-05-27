import { useEffect, useState } from "react";
import {
  requestNotificationPermission,
  onMessageListener,
} from "../config/firebase";

export interface NotificationPayload {
  notification: {
    title: string;
    body: string;
  };
  data?: Record<string, string>;
}

export interface NotificationMessage {
  notification: {
    title: string;
    body: string;
  };
  data?: Record<string, string>;
}

export function useNotifications() {
  const [isTokenFound, setTokenFound] = useState(false);
  const [notification, setNotification] = useState<NotificationMessage | null>(
    null
  );

  useEffect(() => {
    // Request notification permission and get token
    const fetchToken = async () => {
      const token = await requestNotificationPermission();
      if (token) {
        setTokenFound(true);
        // Here you would typically send this token to your backend
        console.log("Notification token:", token);
      }
    };

    fetchToken();

    // Listen for foreground messages
    const unsubscribePromise = onMessageListener().then((payload) => {
      const typedPayload = payload as NotificationPayload;
      setNotification({
        notification: {
          title: typedPayload.notification.title || "",
          body: typedPayload.notification.body || "",
        },
        data: typedPayload.data,
      });
    });

    return () => {
      unsubscribePromise.catch(console.error);
    };
  }, []);

  return { isTokenFound, notification };
}
