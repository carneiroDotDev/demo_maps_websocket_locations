import { useQuery } from "@tanstack/react-query";
import { fetchMachineById } from "../services/api";
import { MachineDetails } from "../types/machine";

export function useMachineDetails(machineId: string) {
  const {
    data: machineDetails,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["machine", machineId],
    queryFn: () => fetchMachineById(machineId) as Promise<MachineDetails>,
    enabled: !!machineId,
  });

  return {
    machineDetails,
    isLoading,
    isError,
    error,
  };
}
