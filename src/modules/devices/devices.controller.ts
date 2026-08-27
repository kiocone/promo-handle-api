import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DevicesService } from './devices.service.js';
import { RegisterDeviceDto } from './dto/register-device.dto.js';
import { DeviceResponse } from './entities/device.entity.js';
import { AuthGuard } from '../../common/guards/auth.guard.js';

@Controller('api/v1/devices')
@UseGuards(AuthGuard)
export class DevicesController {
  constructor(
    @Inject(DevicesService)
    private readonly devicesService: DevicesService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      expectedType: RegisterDeviceDto,
    }),
  )
  async register(
    @Body(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        expectedType: RegisterDeviceDto,
      }),
    )
    dto: RegisterDeviceDto,
  ): Promise<DeviceResponse> {
    const device = await this.devicesService.registerDevice(dto);
    return {
      status: 'success',
      data: device,
    };
  }
}
