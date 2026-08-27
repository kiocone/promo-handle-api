export type DeviceRole = 'hub' | 'display';

export interface Device {
  hardware_id: string;
  requested_name: string;
  assigned_name: string;
  location?: string;
  role: DeviceRole;
  created_at: string;
  updated_at: string;
  last_seen_at: string;
}

export interface DeviceResponse {
  status: 'success';
  data: Device;
}
