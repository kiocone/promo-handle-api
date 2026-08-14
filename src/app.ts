import express, { Application } from 'express';
import cors from 'cors';
import promoRoutes from './routes/promo.routes.js';

const app: Application = express();

app.use(cors());
app.use(express.json());

// API v1 routes
app.use('/api/v1', promoRoutes);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;
