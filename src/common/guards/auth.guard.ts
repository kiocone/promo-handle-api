import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { config } from '../../config/env.js';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authToken = request.headers['auth_token'];
    const expectedToken = config.authToken || process.env.AUTH_TOKEN;

    if (!authToken || !expectedToken || authToken !== expectedToken) {
      throw new UnauthorizedException('Unauthorized');
    }

    return true;
  }
}
