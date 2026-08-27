import { Injectable } from '@nestjs/common';
import { StoredEvent } from '../entities/event.entity.js';
import { IEventsRepository } from './events.repository.interface.js';

@Injectable()
export class InMemoryEventsRepository implements IEventsRepository {
  private eventsById = new Map<string, StoredEvent>();

  async saveEvent(event: StoredEvent): Promise<boolean> {
    if (this.eventsById.has(event.event_id)) {
      // Evento duplicado detectado: no se sobreescribe
      return false;
    }
    this.eventsById.set(event.event_id, { ...event });
    return true;
  }

  async getEventById(eventId: string): Promise<StoredEvent | null> {
    const event = this.eventsById.get(eventId);
    return event ? { ...event } : null;
  }

  async getAllEvents(): Promise<StoredEvent[]> {
    return Array.from(this.eventsById.values());
  }

  async clear(): Promise<void> {
    this.eventsById.clear();
  }
}
