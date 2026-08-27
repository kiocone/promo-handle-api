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
import { EventsService } from './events.service.js';
import { CreateEventsBatchDto } from './dto/create-events-batch.dto.js';
import { EventsBatchResponse } from './dto/events-response.dto.js';
import { AuthGuard } from '../../common/guards/auth.guard.js';

@Controller('api/v1/events')
@UseGuards(AuthGuard)
export class EventsController {
  constructor(
    @Inject(EventsService)
    private readonly eventsService: EventsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      expectedType: CreateEventsBatchDto,
    }),
  )
  async createEventsBatch(
    @Body(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        expectedType: CreateEventsBatchDto,
      }),
    )
    dto: CreateEventsBatchDto,
  ): Promise<EventsBatchResponse> {
    return await this.eventsService.processBatch(dto);
  }
}
