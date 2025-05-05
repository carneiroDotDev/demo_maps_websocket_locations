import { useEffect, useState, useCallback } from "react";
import { WsEvent } from "../types/machine";
import webSocketService, { MessageCallback } from "../services/websocket";

interface UseWebSocketOptions {
  onMessage?: MessageCallback;
  autoConnect?: boolean;
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const { onMessage, autoConnect = true } = options;
  const [lastEvent, setLastEvent] = useState<WsEvent | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Callback for incoming messages
  const handleMessage = useCallback(
    (event: WsEvent) => {
      setLastEvent(event);
      if (onMessage) {
        onMessage(event);
      }
    },
    [onMessage]
  );

  // Connect to WS server
  const connect = useCallback(() => {
    webSocketService.connect();
    setIsConnected(true);
  }, []);

  // Disconnect from WS server
  const disconnect = useCallback(() => {
    webSocketService.disconnect();
    setIsConnected(false);
  }, []);

  useEffect(() => {
    // listening for messgs
    webSocketService.addMessageListener(handleMessage);

    if (autoConnect && !isConnected) {
      connect();
    }

    return () => {
      webSocketService.removeMessageListener(handleMessage);
    };
  }, [autoConnect, isConnected, connect, handleMessage]);

  return {
    lastEvent,
    isConnected,
    connect,
    disconnect,
  };
}
