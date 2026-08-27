import { Inject, Injectable } from '@nestjs/common';
import { CreateEventsBatchDto } from './dto/create-events-batch.dto.js';
import { EventsBatchResponse } from './dto/events-response.dto.js';
import { StoredEvent } from './entities/event.entity.js';
import {
  EVENTS_REPOSITORY,
  IEventsRepository,
} from './repositories/events.repository.interface.js';
import { DevicesService } from '../devices/devices.service.js';

@Injectable()
export class EventsService {
  constructor(
    @Inject(EVENTS_REPOSITORY)
    private readonly eventsRepo: IEventsRepository,
    @Inject(DevicesService)
    private readonly devicesService: DevicesService,
  ) {}

  async processBatch(dto: CreateEventsBatchDto): Promise<EventsBatchResponse> {
    const storedAt = new Date().toISOString();
    const accepted: string[] = [];

    // Actualizar last_seen_at de los dispositivos si existen registrados
    if (dto.hub?.hardware_id) {
      await this.devicesService.findAndUpdateLastSeen(dto.hub.hardware_id);
    }
    if (dto.source?.hardware_id) {
      await this.devicesService.findAndUpdateLastSeen(dto.source.hardware_id);
    }

    for (const item of dto.events) {
      const storedEvent: StoredEvent = {
        ...item,
        hub: {
          hardware_id: dto.hub.hardware_id,
          device_name: dto.hub.device_name,
          location: dto.hub.location,
        },
        source_device: {
          hardware_id: dto.source.hardware_id,
          device_name: dto.source.device_name,
          location: dto.source.location,
          role: dto.source.role,
        },
        stored_at: storedAt,
      };

      // Si es nuevo se almacena, si ya existía simplemente se confirma aceptación
      await this.eventsRepo.saveEvent(storedEvent);
      accepted.push(item.event_id);
    }

    return {
      status: 'success',
      accepted,
    };
  }

  async clear(): Promise<void> {
    await this.eventsRepo.clear();
  }
}
