import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';
import { config } from './config/env.js';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor.js';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  const port = config.port || 3000;
  await app.listen(port);

  console.log(`\n==================================================`);
  console.log(`🚀 NestJS Promo Handle API escuchando en el puerto ${port}`);
  console.log(`- POST http://localhost:${port}/api/v1/devices/register`);
  console.log(`- GET  http://localhost:${port}/api/v1/promos`);
  console.log(`- POST http://localhost:${port}/api/v1/events`);
  console.log(`- GET  http://localhost:${port}/health`);
  console.log(`==================================================\n`);

  return app;
}

if (process.env.NODE_ENV !== 'test') {
  bootstrap();
}
