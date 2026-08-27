import { Inject, Injectable } from '@nestjs/common';
import { Device } from './entities/device.entity.js';
import { RegisterDeviceDto } from './dto/register-device.dto.js';
import {
  DEVICE_REPOSITORY,
  IDeviceRepository,
} from './repositories/device.repository.interface.js';

@Injectable()
export class DevicesService {
  private mutex: Promise<void> = Promise.resolve();

  constructor(
    @Inject(DEVICE_REPOSITORY)
    private readonly repo: IDeviceRepository,
  ) {}

  private async acquireLock(): Promise<() => void> {
    let release: () => void;
    const currentMutex = this.mutex;
    this.mutex = new Promise<void>((resolve) => {
      release = resolve;
    });
    await currentMutex;
    return release!;
  }

  private async generateUniqueAssignedName(
    baseName: string,
    hardwareId: string,
  ): Promise<string> {
    const existingForName = await this.repo.findByAssignedName(baseName);
    if (!existingForName || existingForName.hardware_id === hardwareId) {
      return baseName;
    }

    const assignedNames = new Set(await this.repo.getAllAssignedNames());

    let counter = 2;
    while (true) {
      const suffix = String(counter).padStart(3, '0');
      const candidate = `${baseName}-${suffix}`;
      if (!assignedNames.has(candidate)) {
        return candidate;
      }
      counter++;
    }
  }

  async registerDevice(dto: RegisterDeviceDto): Promise<Device> {
    const releaseLock = await this.acquireLock();
    try {
      const now = new Date().toISOString();
      const hardwareId = typeof dto.hardware_id === 'string' ? dto.hardware_id.trim() : dto.hardware_id;
      const requestedName = typeof dto.name === 'string' ? dto.name.trim() : dto.name;
      const location = typeof dto.location === 'string' ? dto.location.trim() : dto.location;

      const existingDevice = await this.repo.findByHardwareId(hardwareId);

      if (existingDevice) {
        const updatedDevice: Device = {
          ...existingDevice,
          requested_name: requestedName,
          location: location !== undefined ? location : existingDevice.location,
          role: dto.role,
          updated_at: now,
          last_seen_at: now,
        };

        return await this.repo.save(updatedDevice);
      }

      const assignedName = await this.generateUniqueAssignedName(
        requestedName,
        hardwareId,
      );

      const newDevice: Device = {
        hardware_id: hardwareId,
        requested_name: requestedName,
        assigned_name: assignedName,
        location,
        role: dto.role,
        created_at: now,
        updated_at: now,
        last_seen_at: now,
      };

      return await this.repo.save(newDevice);
    } finally {
      releaseLock();
    }
  }

  async findAndUpdateLastSeen(hardwareId: string): Promise<Device | null> {
    const now = new Date().toISOString();
    return await this.repo.updateLastSeen(hardwareId.trim(), now);
  }

  async getDevice(hardwareId: string): Promise<Device | null> {
    return await this.repo.findByHardwareId(hardwareId.trim());
  }

  async clear(): Promise<void> {
    await this.repo.clear();
  }
}
