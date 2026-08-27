export interface RichText {
  titulo: string;
  descripcion: string;
  footer: string;
}

export interface PromoData {
  otp: string;
  url: string;
  rich_text: RichText;
}

export interface PromoResponse {
  status: 'success' | 'error';
  device_id: string;
  device_name?: string;
  timestamp: string;
  data: PromoData;
}
