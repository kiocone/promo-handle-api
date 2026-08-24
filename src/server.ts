import app from './app.js';
import { config } from './config/env.js';

app.listen(config.port, () => {
  console.log(`Servidor de Promos escuchando en el puerto ${config.port}`);
  console.log(`Endpoint: GET http://localhost:${config.port}/api/v1/promos`);
});
