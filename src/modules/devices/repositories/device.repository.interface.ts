import { Device } from '../entities/device.entity.js';

export const DEVICE_REPOSITORY = 'DEVICE_REPOSITORY';

export interface IDeviceRepository {
  findByHardwareId(hardwareId: string): Promise<Device | null>;
  findByAssignedName(assignedName: string): Promise<Device | null>;
  getAllAssignedNames(): Promise<string[]>;
  save(device: Device): Promise<Device>;
  updateLastSeen(hardwareId: string, timestamp: string): Promise<Device | null>;
  clear(): Promise<void>;
}
