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

interface MachineDetailsProps {
  machine: Machine;
  onClose: () => void;
}

export default function MachineDetails({
  machine,
  onClose,
}: MachineDetailsProps) {
  // Format date if it exists
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
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
                <p>{formatDate(machine.install_date)}</p>
              </div>
            )}

            {machine.last_maintenance && (
              <div>
                <h4 className="text-sm font-medium">Last Maintenance</h4>
                <p>{formatDate(machine.last_maintenance)}</p>
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
              Last updated: {new Date(machine.last_update).toLocaleString()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
