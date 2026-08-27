import { Module } from '@nestjs/common';
import { DevicesController } from './devices.controller.js';
import { DevicesService } from './devices.service.js';
import { DEVICE_REPOSITORY } from './repositories/device.repository.interface.js';
import { InMemoryDeviceRepository } from './repositories/in-memory-device.repository.js';

@Module({
  controllers: [DevicesController],
  providers: [
    DevicesService,
    {
      provide: DEVICE_REPOSITORY,
      useClass: InMemoryDeviceRepository,
    },
  ],
  exports: [DevicesService, DEVICE_REPOSITORY],
})
export class DevicesModule {}
