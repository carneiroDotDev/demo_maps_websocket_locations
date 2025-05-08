import { describe, test, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useMachineDetails } from "../useMachineDetails";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fetchMachineById } from "../../services/api";
import { ReactNode } from "react";

// Mock the API service
vi.mock("../../services/api", () => ({
  fetchMachineById: vi.fn(),
}));

const mockMachineDetails = {
  id: "123",
  name: "Test Machine",
  status: "active",
  last_events: [
    { status: "active", timestamp: "2024-03-10T10:00:00Z", machineId: "123" },
  ],
};

describe("useMachineDetails", () => {
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
  });

  test("should fetch machine details successfully", async () => {
    (fetchMachineById as jest.Mock).mockResolvedValueOnce(mockMachineDetails);

    const { result } = renderHook(() => useMachineDetails("123"), { wrapper });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.machineDetails).toBeUndefined();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.machineDetails).toEqual(mockMachineDetails);
    expect(result.current.isError).toBe(false);
    expect(fetchMachineById).toHaveBeenCalledWith("123");
  });

  test("should handle error when fetching machine details fails", async () => {
    const error = new Error("Failed to fetch");
    (fetchMachineById as jest.Mock).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useMachineDetails("123"), { wrapper });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.machineDetails).toBeUndefined();
    expect(result.current.error).toBeDefined();
  });

  test("should not fetch when machineId is not provided", () => {
    const { result } = renderHook(() => useMachineDetails(""), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.machineDetails).toBeUndefined();
    expect(fetchMachineById).not.toHaveBeenCalled();
  });
});
