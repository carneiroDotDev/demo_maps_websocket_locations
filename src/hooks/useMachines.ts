import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchMachines } from "../services/api";
import { Machine, WsEvent } from "../types/machine";
import { useWebSocket } from "./useWebSocket";
import { useCallback, useState } from "react";

export function useMachines() {
  const queryClient = useQueryClient();
  const [notifications, setNotifications] = useState<
    Array<{ id: string; message: string; timestamp: Date; change: string }>
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

  // Handle WebSocket messages
  const handleWsMessage = useCallback(
    (event: WsEvent) => {
      // Enhanced WebSocket logging with detailed information
      console.log("======= WebSocket Event Received =======");
      console.log("Event Type:", event.type);
      console.log("Machine ID:", event?.data?.machineId || "Not specified");
      console.log("Timestamp:", event?.data?.timestamp || "Not provided");
      console.log("Data:", event.data ? JSON.stringify(event.data) : "No data");
      console.log("========================================");

      if (event.type === "event" && event?.data?.machineId && event.data) {
        // Get current machines data
        const currentMachines =
          queryClient.getQueryData<Machine[]>(["machines"]) || [];

        // Find the machine that was updated
        const machineIndex = currentMachines.findIndex(
          (machine) => machine.id === event?.data?.machineId
        );

        if (machineIndex !== -1) {
          //check if machine exists
          // Create array with the updated machine
          const updatedMachines = [...currentMachines];
          const previousMachine = { ...updatedMachines[machineIndex] };

          updatedMachines[machineIndex] = {
            ...updatedMachines[machineIndex],
            ...(event.data as Partial<Machine>),
            last_update: event?.data?.timestamp || new Date().toISOString(),
          };

          queryClient.setQueryData(["machines"], updatedMachines);

          setNotifications((prevNot) =>
            [
              {
                id: `machine-${updatedMachines[machineIndex].id}-${event.data?.status}-${event.data?.timestamp}`,
                message: `Machine ${updatedMachines[machineIndex].name} updated`,
                change: `Status change: from ${previousMachine.status} to ${event.data?.status}`,
                timestamp: new Date(),
              },
              ...prevNot,
            ].slice(0, 3)
          );
        }
      }
    },
    [queryClient]
  );

  // WebSocket connection
  const { isConnected } = useWebSocket({
    onMessage: handleWsMessage,
  });

  const removeNotification = useCallback((notificationId: string) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter(
        (notification) => notification.id !== notificationId
      )
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
