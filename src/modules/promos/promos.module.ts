import { Module } from '@nestjs/common';
import { PromosController } from './promos.controller.js';
import { PromosService } from './promos.service.js';
import { DevicesModule } from '../devices/devices.module.js';

@Module({
  imports: [DevicesModule],
  controllers: [PromosController],
  providers: [PromosService],
})
export class PromosModule {}
