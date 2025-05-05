import { WsEvent, wsEventSchema } from "../types/machine";
import { WS_URL } from "../config";

export type MessageCallback = (event: WsEvent) => void;

export class WebSocketService {
  private socket: WebSocket | null = null;
  private messageCallbacks: MessageCallback[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 2000; // milliseconds
  private reconnectTimeoutId: number | null = null;
  private isInitialized = false;
  private static instance: WebSocketService;

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  public connect(): void {
    if (this.socket) {
      return;
    }

    try {
      this.socket = new WebSocket(WS_URL);

      this.socket.onopen = this.handleOpen.bind(this);
      this.socket.onmessage = this.handleMessage.bind(this);
      this.socket.onclose = this.handleClose.bind(this);
      this.socket.onerror = this.handleError.bind(this);
    } catch (error) {
      console.error("WebSocket connection error:", error);
      this.attemptReconnect();
    }
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }

    if (this.reconnectTimeoutId) {
      window.clearTimeout(this.reconnectTimeoutId);
      this.reconnectTimeoutId = null;
    }

    this.reconnectAttempts = 0;
    this.isInitialized = false;
  }

  /**
   * Add a callback function to be called when a message is received
   * @param callback Function to call when message is received
   */
  public addMessageListener(callback: MessageCallback): void {
    this.messageCallbacks.push(callback);
  }

  /**
   * Clean callback function when unmounted
   * @param callback Function to remove
   */
  public removeMessageListener(callback: MessageCallback): void {
    const index = this.messageCallbacks.indexOf(callback);
    if (index !== -1) {
      this.messageCallbacks.splice(index, 1);
    }
  }

  public initialize(): void {
    if (
      this.isInitialized ||
      !this.socket ||
      this.socket.readyState !== WebSocket.OPEN
    ) {
      return;
    }

    this.socket.send(JSON.stringify({ type: "init" }));
    console.log("WebSocket initialized with init message");
    this.isInitialized = true;
  }

  private handleOpen(): void {
    console.log("WebSocket connection established");
    this.reconnectAttempts = 0;
    this.initialize();
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data);
      const validatedEvent = wsEventSchema.parse(data);

      // Call all registered callbacks with the validated event data
      this.messageCallbacks.forEach((callback) => {
        callback(validatedEvent);
      });
    } catch (error) {
      console.error("Error processing WebSocket message:", error);
    }
  }

  private handleClose(event: CloseEvent): void {
    this.isInitialized = false;
    if (event.code !== 1000) {
      this.attemptReconnect();
    }
    this.socket = null;
  }

  private handleError(): void {
    console.error("WebSocket error");
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.isInitialized = false;
    this.attemptReconnect();
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Maximum WebSocket reconnection attempts reached");
      return;
    }

    this.reconnectAttempts++;

    this.reconnectTimeoutId = window.setTimeout(() => {
      this.connect();
    }, this.reconnectInterval);
  }
}

// Websocket service singleton
export default WebSocketService.getInstance();
