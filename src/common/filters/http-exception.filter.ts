import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';
    let errors: string[] | undefined = undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const resObj = exceptionResponse as Record<string, unknown>;
        if (Array.isArray(resObj.message)) {
          errors = resObj.message as string[];
          message = errors[0] || 'Cuerpo de solicitud inválido.';
        } else if (typeof resObj.message === 'string') {
          message = resObj.message;
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    if (status === HttpStatus.UNAUTHORIZED) {
      response.status(HttpStatus.UNAUTHORIZED).json({
        status: 'error',
        message: 'Unauthorized',
      });
      return;
    }

    response.status(status).json({
      status: 'error',
      message,
      ...(errors && errors.length > 0 ? { errors } : {}),
    });
  }
}
