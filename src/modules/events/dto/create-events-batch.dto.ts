import {
  ArrayMinSize,
  IsArray,
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class HubInfoDto {
  @IsNotEmpty({ message: 'El campo "hub.hardware_id" no puede estar vacío.' })
  @IsString({ message: 'El campo "hub.hardware_id" debe ser una cadena de texto.' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  hardware_id!: string;

  @IsOptional()
  @IsString({ message: 'El campo "hub.device_name" debe ser una cadena de texto.' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  device_name?: string;

  @IsOptional()
  @IsString({ message: 'El campo "hub.location" debe ser una cadena de texto.' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  location?: string;
}

export class SourceInfoDto {
  @IsNotEmpty({ message: 'El campo "source.hardware_id" no puede estar vacío.' })
  @IsString({ message: 'El campo "source.hardware_id" debe ser una cadena de texto.' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  hardware_id!: string;

  @IsOptional()
  @IsString({ message: 'El campo "source.device_name" debe ser una cadena de texto.' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  device_name?: string;

  @IsOptional()
  @IsString({ message: 'El campo "source.location" debe ser una cadena de texto.' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  location?: string;

  @IsOptional()
  @IsString({ message: 'El campo "source.role" debe ser una cadena de texto.' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  role?: string;
}

export class EventItemDto {
  @IsNotEmpty({ message: 'El campo "event_id" es obligatorio y no puede estar vacío.' })
  @IsString({ message: 'El campo "event_id" debe ser una cadena de texto.' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  event_id!: string;

  @IsNotEmpty({ message: 'El campo "seq" es obligatorio.' })
  @IsInt({ message: 'El campo "seq" debe ser un número entero.' })
  @Min(0, { message: 'El campo "seq" debe ser mayor o igual a 0.' })
  seq!: number;

  @IsNotEmpty({ message: 'El campo "boot_id" es obligatorio y no puede estar vacío.' })
  @IsString({ message: 'El campo "boot_id" debe ser una cadena de texto.' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  boot_id!: string;

  @IsNotEmpty({ message: 'El campo "type" es obligatorio.' })
  @IsString({ message: 'El campo "type" debe ser una cadena de texto.' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  type!: string;

  @IsOptional()
  @IsString({ message: 'El campo "source" del evento debe ser una cadena de texto.' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  source?: string;

  @IsDefined({ message: 'El campo "value" es obligatorio.' })
  value!: unknown;

  @IsOptional()
  @IsNumber({}, { message: 'El campo "uptime_ms" debe ser un valor numérico.' })
  uptime_ms?: number;

  @IsOptional()
  @IsString({ message: 'El campo "received_at" debe ser una cadena de fecha ISO.' })
  received_at?: string;
}

export class CreateEventsBatchDto {
  @IsNotEmpty({ message: 'El objeto "hub" es obligatorio.' })
  @IsObject({ message: 'El campo "hub" debe ser un objeto.' })
  @ValidateNested()
  @Type(() => HubInfoDto)
  hub!: HubInfoDto;

  @IsNotEmpty({ message: 'El objeto "source" es obligatorio.' })
  @IsObject({ message: 'El campo "source" debe ser un objeto.' })
  @ValidateNested()
  @Type(() => SourceInfoDto)
  source!: SourceInfoDto;

  @IsNotEmpty({ message: 'La lista "events" es obligatoria.' })
  @IsArray({ message: 'El campo "events" debe ser una lista de eventos.' })
  @ArrayMinSize(1, { message: 'La lista "events" debe contener al menos un evento.' })
  @ValidateNested({ each: true })
  @Type(() => EventItemDto)
  events!: EventItemDto[];
}
