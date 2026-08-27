import { Module } from '@nestjs/common';
import { EventsController } from './events.controller.js';
import { EventsService } from './events.service.js';
import { EVENTS_REPOSITORY } from './repositories/events.repository.interface.js';
import { InMemoryEventsRepository } from './repositories/in-memory-events.repository.js';
import { DevicesModule } from '../devices/devices.module.js';

@Module({
  imports: [DevicesModule],
  controllers: [EventsController],
  providers: [
    EventsService,
    {
      provide: EVENTS_REPOSITORY,
      useClass: InMemoryEventsRepository,
    },
  ],
  exports: [EventsService, EVENTS_REPOSITORY],
})
export class EventsModule {}
