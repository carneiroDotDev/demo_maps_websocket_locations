import { Machine, machinesSchema } from "../types/machine";
import { API_BASE_URL } from "../config";

export async function fetchMachines(): Promise<Machine[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/machines`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      // Add timeout using AbortController
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch machines: ${response.status} ${response.statusText}`
      );
    }

    const responseData = await response.json();

    // Extract machines array from response
    // The API response structure is { data: Array<Machine> }
    const machinesData = responseData.data || [];

    // Fallback for empty data
    if (!Array.isArray(machinesData) || machinesData.length === 0) {
      console.warn("No machines found in data, falling back to empty array");
      return [];
    }

    try {
      // data validation using zod - this is actually normal
      // practice when there is better info about the payload schema.
      // In this case that almost everything is being handled as
      // optional. This does nto bring much. Doing it though.
      const validatedMachines = machinesSchema.parse(machinesData);

      // Check if any machines have valid location data
      const machinesWithLocation = validatedMachines.filter(
        (m) =>
          m.location &&
          typeof m.location.latitude === "number" &&
          typeof m.location.longitude === "number"
      );

      console.info(
        `Loaded ${validatedMachines.length} machines, ${machinesWithLocation.length} have location data`
      );

      return validatedMachines;
    } catch (validationError) {
      console.error("Validation error:", validationError);

      // return partial data if possible (safer fallback)
      return machinesData.filter(
        (item) => item && typeof item === "object" && "id" in item
      );
    }
  } catch (error) {
    console.error("Error fetching machines:", error);
    // empty array instead of throwing to avoid breaking the UI
    return [];
  }
}

// Found out that if you add the id to the end of the endpoint,
// it answers details about a single machine.
// Tobe used in the machine details modal.
export async function fetchMachineById(id: string): Promise<Machine> {
  try {
    const response = await fetch(`${API_BASE_URL}/machines/${id}`);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch machine ${id}: ${response.status} ${response.statusText}`
      );
    }

    const responseData = await response.json();
    const machineData = responseData.data || responseData;

    return machineData;
  } catch (error) {
    console.error(`Error fetching machine ${id}:`, error);
    throw error;
  }
}
