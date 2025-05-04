import { MachineStatus } from "../types/machine";

interface MachineStatusChipProps {
  status?: MachineStatus;
  className?: string;
}

export default function MachineStatusChip({
  status,
  className = "",
}: MachineStatusChipProps) {
  if (!status) return null;

  const getStatusColor = (status: MachineStatus) => {
    switch (status) {
      case MachineStatus.RUNNING:
        return "bg-green-100 text-green-800";
      case MachineStatus.FAILED:
        return "bg-red-100 text-red-800";
      case MachineStatus.FINISHED:
        return "bg-blue-100 text-blue-800";
      case MachineStatus.IDLE:
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(
        status
      )} ${className}`}
    >
      {status}
    </span>
  );
}
