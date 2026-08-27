import { Inject, Injectable } from '@nestjs/common';
import { DevicesService } from '../devices/devices.service.js';
import { PromoResponse } from './dto/promo-response.dto.js';

@Injectable()
export class PromosService {
  constructor(
    @Inject(DevicesService)
    private readonly devicesService: DevicesService,
  ) {}

  async getPromos(
    rawDeviceId?: string,
    rawDeviceName?: string,
  ): Promise<PromoResponse> {
    let resolvedDeviceId = 'eficair-002-123';
    let resolvedDeviceName: string | undefined = undefined;

    if (typeof rawDeviceId === 'string' && rawDeviceId.trim().length > 0) {
      const hardwareId = rawDeviceId.trim();
      resolvedDeviceId = hardwareId;

      const device = await this.devicesService.getDevice(hardwareId);
      if (device) {
        await this.devicesService.findAndUpdateLastSeen(hardwareId);
        resolvedDeviceName = device.assigned_name;
      } else if (
        typeof rawDeviceName === 'string' &&
        rawDeviceName.trim().length > 0
      ) {
        resolvedDeviceName = rawDeviceName.trim();
      }
    }

    return {
      status: 'success',
      device_id: resolvedDeviceId,
      ...(resolvedDeviceName ? { device_name: resolvedDeviceName } : {}),
      timestamp: new Date().toISOString(),
      data: {
        otp: 'a1b23c',
        url: 'https://ejemplo.com/solicitud/paquete?otp=a1b23c',
        rich_text: {
          titulo: 'Promo Especial',
          descripcion: 'Aprovecha esta oferta especial',
          footer: 'Válido hasta agotar stock',
        },
      },
    };
  }
}
