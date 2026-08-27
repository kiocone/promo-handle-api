import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const startTime = process.hrtime();
    const method = request.method;
    const url = request.originalUrl || request.url;

    return next.handle().pipe(
      tap({
        next: () => {
          this.log(startTime, method, url, response.statusCode, request);
        },
        error: (err) => {
          const status = err.status || 500;
          this.log(startTime, method, url, status, request);
        },
      }),
    );
  }

  private log(
    startTime: [number, number],
    method: string,
    url: string,
    statusCode: number,
    request: Request,
  ): void {
    const [seconds, nanoseconds] = process.hrtime(startTime);
    const durationMs = (seconds * 1000 + nanoseconds / 1e6).toFixed(2);
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const deviceIdHeader = request.headers['device_id'];
    const deviceIdBody =
      request.body && typeof request.body === 'object'
        ? request.body.hardware_id
        : undefined;
    const deviceContext =
      deviceIdHeader || deviceIdBody
        ? ` [device: ${deviceIdHeader || deviceIdBody}]`
        : '';

    console.log(
      `[${timestamp}] ${method.padEnd(6)} ${url.padEnd(30)} ${statusCode} - ${durationMs}ms${deviceContext}`,
    );
  }
}
