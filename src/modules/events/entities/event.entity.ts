export interface HubInfo {
  hardware_id: string;
  device_name?: string;
  location?: string;
}

export interface SourceInfo {
  hardware_id: string;
  device_name?: string;
  location?: string;
  role?: string;
}

export interface EventItem {
  event_id: string;
  seq: number;
  boot_id: string;
  type: string;
  source?: string;
  value: unknown;
  uptime_ms?: number;
  received_at?: string;
}

export interface StoredEvent extends EventItem {
  hub: HubInfo;
  source_device: SourceInfo;
  stored_at: string;
}
