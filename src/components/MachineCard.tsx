import { Machine } from "../types/machine";
import MachineStatusChip from "./MachineStatusChip";

interface MachineCardProps {
  machine: Machine;
  isSelected: boolean;
  onSelect: (machine: Machine) => void;
}

export default function MachineCard({
  machine,
  isSelected,
  onSelect,
}: MachineCardProps) {
  return (
    <div
      key={machine.id}
      className={`p-4 border rounded-md cursor-pointer hover:bg-gray-100 transition-colors ${
        isSelected ? "ring-2 ring-primary-500" : ""
      }`}
      onClick={() => onSelect(machine)}
    >
      <h3 className="font-medium">{machine.name}</h3>
      <div className="flex justify-between">
        <p className="text-sm text-gray-500">Type: {machine.machine_type}</p>
        {machine.floor !== undefined && (
          <p className="text-sm text-gray-500">Floor: {machine.floor}</p>
        )}
      </div>
      {machine.status && (
        <div className="mt-1">
          <MachineStatusChip status={machine.status} />
        </div>
      )}
    </div>
  );
}
