import { MachineStatus } from "../types/machine";

interface HeaderProps {
  isConnected: boolean;
  lastUpdate: Date | null;
  floorFilter: number | null;
  statusFilter: MachineStatus;
  setFloorFilter: (floor: number | null) => void;
  setStatusFilter: (status: MachineStatus) => void;
  totalMachines: number;
  filteredCount: number;
}

export default function Header({
  isConnected,
  lastUpdate,
  floorFilter,
  statusFilter,
  setFloorFilter,
  setStatusFilter,
  totalMachines,
  filteredCount,
}: HeaderProps) {
  return (
    <>
      <header className="border-b sticky top-0 bg-gray-50 z-[1000]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
            <h1 className="text-xl sm:text-2xl font-bold">
              IoT Machine Monitor
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm">{"Live updates:"}</span>
              <div
                className={`h-2 w-2 rounded-full ${
                  isConnected ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <span className="text-sm">
                {isConnected ? "Connected" : "Disconnected"}
              </span>
              {lastUpdate && (
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full bg-blue-500 animate-pulse`}
                  ></div>
                  <span className="text-sm">
                    Last update: {lastUpdate.toLocaleTimeString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-3 bg-white border-b">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Floor
            </label>
            <select
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
              value={floorFilter === null ? "all" : floorFilter.toString()}
              onChange={(e) =>
                setFloorFilter(
                  e.target.value === "all" ? null : parseInt(e.target.value)
                )
              }
            >
              <option value="all">All Floors</option>
              {[0, 1, 2, 3, 4].map((floor) => (
                <option key={floor} value={floor}>
                  Floor {floor}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as MachineStatus)}
            >
              {Object.values(MachineStatus).map((status) => (
                <option key={status} value={status}>
                  {status === MachineStatus.ALL
                    ? "All Statuses"
                    : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1"></div>

          <div className="text-sm text-gray-500">
            Showing {filteredCount} of {totalMachines} machines
          </div>
        </div>
      </div>
    </>
  );
}
