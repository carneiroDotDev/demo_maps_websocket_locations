import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchMachines } from "../services/api";
import { Machine, WsEvent } from "../types/machine";
import { useWebSocket } from "./useWebSocket";
import { useCallback, useId, useState } from "react";

export function useMachines() {
  const queryClient = useQueryClient();
  const [notifications, setNotifications] = useState<
    Array<{ id: string; message: string; timestamp: Date }>
  >([]);

  // Fetch machines data
  const {
    data: machines = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["machines"],
    queryFn: fetchMachines,
  });

  const notificationId = useId();

  // Handle WebSocket messages
  const handleWsMessage = useCallback(
    (event: WsEvent) => {
      // Enhanced WebSocket logging with detailed information
      console.log("======= WebSocket Event Received =======");
      console.log("Event Type:", event.type);
      console.log("Machine ID:", event?.data?.machineId || "Not specified");
      console.log("Timestamp:", event?.data?.timestamp || "Not provided");
      console.log(
        "Data:",
        event.data ? JSON.stringify(event.data, null, 2) : "No data"
      );
      console.log("========================================");

      if (
        event.type === "machine_update" &&
        event?.data?.machineId &&
        event.data
      ) {
        // Get current machines data
        const currentMachines =
          queryClient.getQueryData<Machine[]>(["machines"]) || [];

        // Find the machine that was updated
        const machineIndex = currentMachines.findIndex(
          (machine) => machine.id === event?.data?.machineId
        );

        if (machineIndex !== -1) {
          console.log(
            `Updating machine ${currentMachines[machineIndex].name} with WebSocket data`
          );

          // Create a new array with the updated machine
          const updatedMachines = [...currentMachines];
          const previousMachine = { ...updatedMachines[machineIndex] };

          updatedMachines[machineIndex] = {
            ...updatedMachines[machineIndex],
            ...(event.data as Partial<Machine>),
            last_update: event?.data?.timestamp || new Date().toISOString(),
          };

          // Log changes between previous and new state
          console.log("Machine State Changes:");
          const changedProperties = Object.keys(event.data as object);
          changedProperties.forEach((prop) => {
            console.log(
              `- ${prop}: ${previousMachine[prop as keyof Machine]} → ${
                (event.data as Record<string, unknown>)[prop]
              }`
            );
          });

          queryClient.setQueryData(["machines"], updatedMachines);

          setNotifications((prev) => [
            {
              id: notificationId,
              message: `Machine ${updatedMachines[machineIndex].name} updated`,
              timestamp: new Date(),
            },
            ...prev.slice(0, 9), // 10 notifications max
          ]);
        }
      }
    },
    [queryClient, notificationId]
  );

  // WebSocket connection
  const { isConnected } = useWebSocket({
    onMessage: handleWsMessage,
  });

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  }, []);

  return {
    machines,
    isLoading,
    isError,
    error,
    isConnected,
    notifications,
    removeNotification,
  };
}
