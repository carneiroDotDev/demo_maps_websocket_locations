import { describe, test, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useMachines } from "../useMachines";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fetchMachines } from "../../services/api";
import { useWebSocket } from "../useWebSocket";
import { ReactNode } from "react";

vi.mock("../../services/api", () => ({
  fetchMachines: vi.fn(),
}));

vi.mock("../useWebSocket", () => ({
  useWebSocket: vi.fn(),
}));

const mockMachines = [
  {
    id: "123",
    name: "Machine 1",
    status: "active",
    machine_type: "type1",
    floor: 1,
    location: { latitude: 1, longitude: 1 },
    last_update: "2024-03-10T10:00:00Z",
  },
  {
    id: "456",
    name: "Machine 2",
    status: "inactive",
    machine_type: "type2",
    floor: 2,
    location: { latitude: 2, longitude: 2 },
    last_update: "2024-03-10T11:00:00Z",
  },
];

describe("useMachines", () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    queryClient.clear();
    vi.clearAllMocks();
    (useWebSocket as jest.Mock).mockReturnValue({ isConnected: true });
  });

  test("should fetch machines successfully", async () => {
    (fetchMachines as jest.Mock).mockResolvedValueOnce(mockMachines);

    const { result } = renderHook(() => useMachines(), { wrapper });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.machines).toEqual([]);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.machines).toEqual(mockMachines);
    expect(result.current.isError).toBe(false);
  });

  test("should handle WebSocket updates", async () => {
    (fetchMachines as jest.Mock).mockResolvedValueOnce(mockMachines);

    const { result } = renderHook(() => useMachines(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Simulate WebSocket message
    const wsHandler = (useWebSocket as jest.Mock).mock.calls[0][0].onMessage;
    const updateEvent = {
      type: "event",
      data: {
        machineId: "123",
        status: "maintenance",
        timestamp: "2024-03-10T12:00:00Z",
      },
    };

    act(() => {
      wsHandler(updateEvent);
    });

    // Check if machine was updated
    const updatedMachine = result.current.machines.find((m) => m.id === "123");
    expect(updatedMachine?.status).toBe("maintenance");
    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0].message).toContain(
      "Machine 1 updated"
    );
  });

  test("should handle error when fetching machines fails", async () => {
    const error = new Error("Failed to fetch");
    (fetchMachines as jest.Mock).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useMachines(), { wrapper });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.machines).toEqual([]);
    expect(result.current.error).toBeDefined();
  });

  test("should handle notification removal", async () => {
    (fetchMachines as jest.Mock).mockResolvedValueOnce(mockMachines);

    const { result } = renderHook(() => useMachines(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Add a notification through WebSocket update
    const wsHandler = (useWebSocket as jest.Mock).mock.calls[0][0].onMessage;
    act(() => {
      wsHandler({
        type: "event",
        data: {
          machineId: "123",
          status: "maintenance",
          timestamp: "2024-03-10T12:00:00Z",
        },
      });
    });

    expect(result.current.notifications).toHaveLength(1);
    const notificationId = result.current.notifications[0].id;

    act(() => {
      result.current.removeNotification(notificationId);
    });

    expect(result.current.notifications).toHaveLength(0);
  });
});
