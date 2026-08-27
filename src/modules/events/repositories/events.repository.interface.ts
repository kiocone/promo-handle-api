import { StoredEvent } from '../entities/event.entity.js';

export const EVENTS_REPOSITORY = 'EVENTS_REPOSITORY';

export interface IEventsRepository {
  saveEvent(event: StoredEvent): Promise<boolean>;
  getEventById(eventId: string): Promise<StoredEvent | null>;
  getAllEvents(): Promise<StoredEvent[]>;
  clear(): Promise<void>;
}
