import { memo } from "react";
import { Machine } from "../types/machine";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import MachineStatusChip from "./MachineStatusChip";
import { useMachineDetails } from "../hooks/useMachineDetails";

interface MachineDetailsProps {
  machine: Machine;
  onClose: () => void;
}

function MachineDetails({ machine, onClose }: MachineDetailsProps) {
  const { machineDetails, isLoading, isError } = useMachineDetails(machine.id);

  const formatDateTime = (dateString?: string, showTime: boolean = false) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: showTime ? "medium" : undefined,
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        <CardTitle>{machine.name}</CardTitle>
        <CardDescription>Type: {machine.machine_type}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {machine.status && (
              <div>
                <h4 className="text-sm font-medium">Status</h4>
                <MachineStatusChip status={machine.status} />
              </div>
            )}

            {machine.floor !== undefined && (
              <div>
                <h4 className="text-sm font-medium">Floor</h4>
                <p>{machine.floor}</p>
              </div>
            )}

            {machine.install_date && (
              <div>
                <h4 className="text-sm font-medium">Installation Date</h4>
                <p>{formatDateTime(machine.install_date)}</p>
              </div>
            )}

            {machine.last_maintenance && (
              <div>
                <h4 className="text-sm font-medium">Last Maintenance</h4>
                <p>{formatDateTime(machine.last_maintenance)}</p>
              </div>
            )}

            {machine.location?.latitude && machine.location?.longitude && (
              <div>
                <h4 className="text-sm font-medium">Location</h4>
                <p>
                  {machine.location.latitude.toFixed(6)},
                  {machine.location.longitude.toFixed(6)}
                </p>
              </div>
            )}
          </div>

          {machine.last_update && (
            <div className="text-xs text-muted-foreground">
              Last updated: {formatDateTime(machine.last_update, true)}
            </div>
          )}

          {/* Last Events */}
          <div className="mt-6">
            <h4 className="text-sm font-medium mb-2">Recent Events</h4>
            {isLoading && (
              <p className="text-sm text-muted-foreground">
                Loading last events...
              </p>
            )}
            {isError && (
              <p className="text-sm text-red-500">
                Failed to load machine events
              </p>
            )}
            {!isLoading && !isError && machineDetails?.last_events && (
              <div className="space-y-2">
                {machineDetails.last_events.slice(0, 5).map((event) => (
                  <div
                    key={`${event.machineId}-${event.timestamp}`}
                    className="text-sm border-b border-gray-100 pb-2 last:border-0"
                  >
                    <div className="flex items-center justify-between">
                      <MachineStatusChip status={event.status} />
                      <span className="text-xs text-muted-foreground">
                        {formatDateTime(event.timestamp, true)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default memo(MachineDetails);
