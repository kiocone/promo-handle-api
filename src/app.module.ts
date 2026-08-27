import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DevicesModule } from './modules/devices/devices.module.js';
import { PromosModule } from './modules/promos/promos.module.js';
import { EventsModule } from './modules/events/events.module.js';
import { HealthModule } from './modules/health/health.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DevicesModule,
    PromosModule,
    EventsModule,
    HealthModule,
  ],
})
export class AppModule {}
