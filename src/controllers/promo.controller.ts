import { Request, Response } from 'express';
import { PromoResponse } from '../types/promo.types.js';

export const getPromos = (_req: Request, res: Response): void => {
  const mockResponse: PromoResponse = {
    status: 'success',
    device_id: 'eficair-002-123',
    timestamp: new Date().toISOString(),
    data: {
      otp: 'a1b23c',
      url: 'https://ejemplo.com/solicitud/paquete?otp=a1b23c',
      rich_text: {
        titulo: 'Promo Especial',
        descripcion: 'Aprovecha esta oferta especial',
        footer: 'Válido hasta agotar stock',
      },
    },
  };

  res.status(200).json(mockResponse);
};
