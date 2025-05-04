import { z } from "zod";

// Possbile machine statusses I have seen:
export enum MachineStatus {
  ALL = "all",
  RUNNING = "running",
  FAILED = "failed",
  FINISHED = "finished",
  IDLE = "idle",
}

// For Ui filtering
export const MACHINE_STATUSES = Object.values(MachineStatus);

export const locationSchema = z.object({
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const machineSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  machine_type: z.string().optional(),
  status: z
    .enum([
      MachineStatus.RUNNING,
      MachineStatus.FAILED,
      MachineStatus.FINISHED,
      MachineStatus.IDLE,
    ])
    .optional(),
  location: locationSchema.optional(),
  floor: z.number().optional(),
  install_date: z.string().optional(),
  last_maintenance: z.string().optional(),
  last_update: z.string().optional(),
});

export const machinesSchema = z.array(machineSchema);

export const WsDataSchema = z.object({
  timestamp: z.string().optional(),
  machineId: z.string().optional(),
  status: z.enum([
    MachineStatus.RUNNING,
    MachineStatus.FAILED,
    MachineStatus.FINISHED,
    MachineStatus.IDLE,
  ]),
});

// Schema for WebSocket
export const wsEventSchema = z.object({
  type: z.string(),
  data: WsDataSchema.optional(),
});

// WebSocket initialization message
export const wsInitSchema = z.object({
  type: z.literal("init"),
});

export type Machine = z.infer<typeof machineSchema>;
export type WsEvent = z.infer<typeof wsEventSchema>;
export type WsInit = z.infer<typeof wsInitSchema>;
