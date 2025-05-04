import { useState, useEffect, useCallback } from "react";
import MachineMap from "../components/MachineMap";
import MachineDetails from "../components/MachineDetails";
import MachineCard from "../components/MachineCard";
import Header from "../components/Header";
import { useMachines } from "../hooks/useMachines";
import { Machine, MachineStatus } from "../types/machine";

export default function Home() {
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const {
    machines,
    isLoading,
    isError,
    notifications = [
      {
        id: "Test-ID",
        message: "Testing message",
        timestamp: new Date(),
      },
    ],
    removeNotification,
    isConnected,
  } = useMachines();

  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [floorFilter, setFloorFilter] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<MachineStatus>(
    MachineStatus.ALL
  );

  // Update the last update timestamp when notifications change
  useEffect(() => {
    if (notifications.length > 0) {
      setLastUpdate(new Date());
    }
  }, [notifications]);

  const handleSelectMachine = useCallback((machine: Machine) => {
    setSelectedMachine(machine);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setSelectedMachine(null);
  }, []);

  // Tobe in a custom hook as well? - useMachineFilter or smt
  const filteredMachines = machines.filter((machine) => {
    if (floorFilter !== null && machine.floor !== floorFilter) {
      return false;
    }

    if (statusFilter !== MachineStatus.ALL && machine.status !== statusFilter) {
      return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header
        isConnected={isConnected}
        lastUpdate={lastUpdate}
        floorFilter={floorFilter}
        statusFilter={statusFilter}
        setFloorFilter={setFloorFilter}
        setStatusFilter={setStatusFilter}
        totalMachines={machines.length}
        filteredCount={filteredMachines.length}
      />

      <main className="container mx-auto px-4 py-6">
        {isError && (
          <div className="bg-red-100 border border-red-500 text-red-700 p-4 rounded-md mb-6">
            Failed to load machines data. Please check your connection and try
            again.
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-[60vh]">
            <p>Loading machines data...</p>
          </div>
        ) : (
          <>
            <div className="lg:grid lg:grid-cols-3 lg:gap-6">
              {/* Main content area = map + machine list */}
              <div
                className={`${
                  selectedMachine ? "lg:col-span-2" : "lg:col-span-3"
                }`}
              >
                {/* Map */}
                <div className="h-[60vh] rounded-md overflow-hidden mb-4">
                  <MachineMap
                    machines={filteredMachines}
                    selectedMachine={selectedMachine}
                    onSelectMachine={handleSelectMachine}
                  />
                </div>

                {/* Machine list */}
                <div className="mt-4">
                  <h2 className="text-xl font-bold mb-2">All Machines</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredMachines.map((machine) => (
                      <MachineCard
                        key={machine.id}
                        machine={machine}
                        isSelected={selectedMachine?.id === machine.id}
                        onSelect={handleSelectMachine}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {selectedMachine && (
                <>
                  {/* Mobile */}
                  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 lg:hidden">
                    <div className="w-full max-w-md">
                      <MachineDetails
                        machine={selectedMachine}
                        onClose={handleCloseDetails}
                      />
                    </div>
                  </div>

                  {/* Desktop */}
                  <div className="hidden lg:block lg:col-span-1">
                    <div className="sticky top-24">
                      <MachineDetails
                        machine={selectedMachine}
                        onClose={handleCloseDetails}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </main>

      {/* Tobe finished - Notifications */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50 max-w-md">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="bg-primary-500 text-white p-4 rounded-md shadow-lg flex items-start gap-3"
          >
            <div className="flex-1">
              <p className="text-sm font-medium">{notification.message}</p>
              <p className="text-xs mt-1 opacity-80">
                {notification.timestamp.toLocaleTimeString()}
              </p>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="text-white/80 hover:text-white"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
