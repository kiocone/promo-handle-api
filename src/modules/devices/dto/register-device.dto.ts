import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { DeviceRole } from '../entities/device.entity.js';

export class RegisterDeviceDto {
  @IsNotEmpty({ message: 'El campo "hardware_id" no puede estar vacío.' })
  @IsString({ message: 'El campo "hardware_id" debe ser una cadena de texto.' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  hardware_id!: string;

  @IsNotEmpty({ message: 'El campo "name" no puede estar vacío.' })
  @IsString({ message: 'El campo "name" debe ser una cadena de texto.' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  name!: string;

  @IsOptional()
  @IsString({ message: 'El campo "location" debe ser una cadena de texto si se proporciona.' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  location?: string;

  @IsNotEmpty({ message: 'El campo "role" es obligatorio.' })
  @IsIn(['hub', 'display'], {
    message: 'El campo "role" debe ser uno de los siguientes valores permitidos: hub, display.',
  })
  role!: DeviceRole;
}
