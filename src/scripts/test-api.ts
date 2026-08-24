import http from 'http';
import app from '../app.js';
import { config } from '../config/env.js';

const server = http.createServer(app);

server.listen(0, async () => {
  const address = server.address();
  if (!address || typeof address === 'string') {
    process.exit(1);
  }

  const port = address.port;
  const baseUrl = `http://localhost:${port}/api/v1/promos`;

  console.log(`Ejecutando pruebas en el puerto ${port}...`);

  // Test 1: Sin header auth_token
  const res1 = await fetch(baseUrl);
  console.log('Test 1 (Sin header): Status', res1.status);
  const data1 = await res1.json();
  console.log('Response:', data1);

  // Test 2: Header auth_token incorrecto
  const res2 = await fetch(baseUrl, {
    headers: { auth_token: 'token_incorrecto' },
  });
  console.log('Test 2 (Header incorrecto): Status', res2.status);
  const data2 = await res2.json();
  console.log('Response:', data2);

  // Test 3: Header auth_token correcto
  const res3 = await fetch(baseUrl, {
    headers: { auth_token: config.authToken },
  });
  console.log('Test 3 (Header auth_token correcto): Status', res3.status);
  const data3 = await res3.json();
  console.log('Response:', JSON.stringify(data3, null, 2));

  server.close(() => {
    console.log('Pruebas finalizadas con éxito.');
    process.exit(0);
  });
});
