import { Injectable } from '@nestjs/common';
import { Device } from '../entities/device.entity.js';
import { IDeviceRepository } from './device.repository.interface.js';

@Injectable()
export class InMemoryDeviceRepository implements IDeviceRepository {
  private devicesByHardwareId = new Map<string, Device>();
  private hardwareIdByAssignedName = new Map<string, string>();

  async findByHardwareId(hardwareId: string): Promise<Device | null> {
    const device = this.devicesByHardwareId.get(hardwareId);
    return device ? { ...device } : null;
  }

  async findByAssignedName(assignedName: string): Promise<Device | null> {
    const hardwareId = this.hardwareIdByAssignedName.get(assignedName);
    if (!hardwareId) return null;
    const device = this.devicesByHardwareId.get(hardwareId);
    return device ? { ...device } : null;
  }

  async getAllAssignedNames(): Promise<string[]> {
    return Array.from(this.hardwareIdByAssignedName.keys());
  }

  async save(device: Device): Promise<Device> {
    const existingHardwareId = this.hardwareIdByAssignedName.get(device.assigned_name);
    if (existingHardwareId && existingHardwareId !== device.hardware_id) {
      throw new Error(
        `Unique constraint violation: assigned_name "${device.assigned_name}" is already used by device "${existingHardwareId}".`,
      );
    }

    const previousDevice = this.devicesByHardwareId.get(device.hardware_id);
    if (previousDevice && previousDevice.assigned_name !== device.assigned_name) {
      this.hardwareIdByAssignedName.delete(previousDevice.assigned_name);
    }

    const savedDevice = { ...device };
    this.devicesByHardwareId.set(device.hardware_id, savedDevice);
    this.hardwareIdByAssignedName.set(device.assigned_name, device.hardware_id);

    return { ...savedDevice };
  }

  async updateLastSeen(hardwareId: string, timestamp: string): Promise<Device | null> {
    const device = this.devicesByHardwareId.get(hardwareId);
    if (!device) return null;

    device.last_seen_at = timestamp;
    return { ...device };
  }

  async clear(): Promise<void> {
    this.devicesByHardwareId.clear();
    this.hardwareIdByAssignedName.clear();
  }
}
