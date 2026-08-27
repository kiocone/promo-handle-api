import { Controller, Get, Headers, Inject, UseGuards } from '@nestjs/common';
import { PromosService } from './promos.service.js';
import { PromoResponse } from './dto/promo-response.dto.js';
import { AuthGuard } from '../../common/guards/auth.guard.js';

@Controller('api/v1/promos')
@UseGuards(AuthGuard)
export class PromosController {
  constructor(
    @Inject(PromosService)
    private readonly promosService: PromosService,
  ) {}

  @Get()
  async getPromos(
    @Headers('device_id') deviceId?: string,
    @Headers('device_name') deviceName?: string,
  ): Promise<PromoResponse> {
    return await this.promosService.getPromos(deviceId, deviceName);
  }
}
