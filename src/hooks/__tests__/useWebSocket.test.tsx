import { describe, expect, vi, beforeEach, test } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useWebSocket } from "../useWebSocket";
import webSocketService from "../../services/websocket";
import type { WsEvent } from "../../types/machine";
import { MachineStatus, wsEventTypes } from "../../types/machine";

vi.mock("../../services/websocket", () => ({
  default: {
    connect: vi.fn(),
    disconnect: vi.fn(),
    addMessageListener: vi.fn(),
    removeMessageListener: vi.fn(),
  },
}));

describe("useWebSocket", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should connect automatically when autoConnect is true", () => {
    renderHook(() => useWebSocket({ autoConnect: true }));
    expect(webSocketService.connect).toHaveBeenCalled();
  });

  test("should not connect automatically when autoConnect is false", () => {
    renderHook(() => useWebSocket({ autoConnect: false }));
    expect(webSocketService.connect).not.toHaveBeenCalled();
  });

  test("should handle message callback", () => {
    const mockMessage: WsEvent = {
      type: wsEventTypes.EVENT,
      data: {
        status: MachineStatus.RUNNING,
        machineId: "123",
        timestamp: "2024-03-10T10:00:00Z",
      },
    };
    const onMessage = vi.fn();

    const { result } = renderHook(() => useWebSocket({ onMessage }));

    const messageListener = (
      webSocketService.addMessageListener as jest.Mock<(event: WsEvent) => void>
    ).mock.calls[0][0];

    // AS it were receiving a message
    act(() => {
      messageListener(mockMessage);
    });

    expect(onMessage).toHaveBeenCalledWith(mockMessage);
    expect(result.current.lastEvent).toEqual(mockMessage);
  });

  test("should handle connect and disconnect", () => {
    const { result } = renderHook(() => useWebSocket({ autoConnect: false }));

    act(() => {
      result.current.connect();
    });
    expect(webSocketService.connect).toHaveBeenCalled();
    expect(result.current.isConnected).toBe(true);

    act(() => {
      result.current.disconnect();
    });
    expect(webSocketService.disconnect).toHaveBeenCalled();
    expect(result.current.isConnected).toBe(false);
  });

  test("should cleanup on unmount", () => {
    const { unmount } = renderHook(() => useWebSocket());
    unmount();
    expect(webSocketService.removeMessageListener).toHaveBeenCalled();
  });

  test("should handle multiple message listeners", () => {
    const mockMessage1: WsEvent = {
      type: wsEventTypes.EVENT,
      data: {
        status: MachineStatus.RUNNING,
        machineId: "123",
        timestamp: "2024-03-10T10:00:00Z",
      },
    };
    const mockMessage2: WsEvent = {
      type: wsEventTypes.EVENT,
      data: {
        status: MachineStatus.FINISHED,
        machineId: "123",
        timestamp: "2024-03-10T10:01:00Z",
      },
    };
    const onMessage = vi.fn();

    const { result } = renderHook(() => useWebSocket({ onMessage }));

    // Get the message listener that was registered
    const messageListener = (
      webSocketService.addMessageListener as jest.Mock<(event: WsEvent) => void>
    ).mock.calls[0][0];

    // As receiving multiple messages
    act(() => {
      messageListener(mockMessage1);
      messageListener(mockMessage2);
    });

    expect(onMessage).toHaveBeenCalledTimes(2);
    expect(onMessage).toHaveBeenCalledWith(mockMessage1);
    expect(onMessage).toHaveBeenCalledWith(mockMessage2);
    expect(result.current.lastEvent).toEqual(mockMessage2);
  });
});
