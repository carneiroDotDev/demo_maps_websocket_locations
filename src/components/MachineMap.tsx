import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { LatLngBounds, LatLngTuple } from "leaflet";
import { Machine } from "../types/machine";
import MachineStatusChip from "./MachineStatusChip";

// Set view component to update map bounds when machines change
function SetBoundsToMachines({ machines }: { machines: Machine[] }) {
  const map = useMap();

  useEffect(() => {
    // Filter out machines without locations
    const validMachines = machines.filter(
      (machine) =>
        machine.location &&
        typeof machine.location.latitude === "number" &&
        typeof machine.location.longitude === "number"
    );

    if (validMachines.length > 0) {
      try {
        const bounds = new LatLngBounds(
          validMachines.map(
            (machine) =>
              [
                machine.location!.latitude!,
                machine.location!.longitude!,
              ] as LatLngTuple
          )
        );
        map.fitBounds(bounds, { padding: [50, 50] });
      } catch (error) {
        console.error("Error setting map bounds:", error);
      }
    } else {
      map.setView([48.09, 11.52], 4);
    }
  }, [machines, map]);

  return null;
}

// A separate component just for rendering markers
function MachineMarkers({
  machines,
  onSelectMachine,
}: {
  machines: Machine[];
  onSelectMachine: (machine: Machine) => void;
}) {
  return (
    <>
      {machines
        .filter(
          (machine) =>
            machine.location &&
            typeof machine.location.latitude === "number" &&
            typeof machine.location.longitude === "number"
        )
        .map((machine) => (
          <Marker
            key={machine.id}
            position={[
              machine.location!.latitude!,
              machine.location!.longitude!,
            ]}
            eventHandlers={{
              click: () => onSelectMachine(machine),
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-lg">{machine.name}</h3>
                <p className="text-sm">Type: {machine.machine_type}</p>
                {machine.status && (
                  <div className="mt-1">
                    <MachineStatusChip status={machine.status} />
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
    </>
  );
}

interface MachineMapProps {
  machines: Machine[];
  selectedMachine: Machine | null;
  onSelectMachine: (machine: Machine) => void;
}

export default function MachineMap({
  machines,
  onSelectMachine,
}: MachineMapProps) {
  // Process machines for display - ensure we have location data
  const validMachines = useMemo(() => {
    // First check if any machine has valid location data
    const withValidLocation = machines.filter(
      (m) =>
        m.location &&
        typeof m.location.latitude === "number" &&
        typeof m.location.longitude === "number"
    );

    if (!withValidLocation.length) {
      console.error("No machine with proper location found!");
    }
    return machines;
  }, [machines]);

  return (
    <div className="w-full h-full relative min-h-[400px] z-0">
      <MapContainer
        center={[48.09, 11.52]}
        zoom={4}
        className="w-full h-full min-h-[400px]"
      >
        <TileLayer
          attribution="Luiz Carneiro"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* This will fix the map limitss based on machines found */}
        <SetBoundsToMachines machines={validMachines} />

        {/* Display markers for each machine */}
        <MachineMarkers
          machines={validMachines}
          onSelectMachine={onSelectMachine}
        />
      </MapContainer>
    </div>
  );
}
