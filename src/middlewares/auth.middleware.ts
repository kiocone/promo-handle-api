import { Request, Response, NextFunction } from 'express';
import { config } from '../config/env.js';

export const validateAuthToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authTokenHeader = req.headers['auth_token'];

  if (!authTokenHeader || authTokenHeader !== config.authToken) {
    res.status(401).json({
      status: 'error',
      message: 'Token de autenticación faltante o no válido en el header auth_token',
    });
    return;
  }

  next();
};
