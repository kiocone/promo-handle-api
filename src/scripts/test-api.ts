import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '../app.module.js';
import { config } from '../config/env.js';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter.js';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor.js';
import { DevicesService } from '../modules/devices/devices.service.js';
import { EventsService } from '../modules/events/events.service.js';

async function runTestSuite() {
  const app = await NestFactory.create(AppModule, { logger: false });

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

  await app.listen(0);

  const server = app.getHttpServer();
  const address = server.address();
  if (!address || typeof address === 'string') {
    process.exit(1);
  }

  const port = address.port;
  const baseUrl = `http://localhost:${port}/api/v1`;
  const registerUrl = `${baseUrl}/devices/register`;
  const promosUrl = `${baseUrl}/promos`;
  const eventsUrl = `${baseUrl}/events`;

  console.log(`\n========================================`);
  console.log(`Iniciando suite de pruebas NestJS en puerto ${port}`);
  console.log(`========================================\n`);

  let totalTests = 0;
  let passedTests = 0;

  const assert = (condition: boolean, testName: string, details?: unknown) => {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`✅ [PASS] Test ${totalTests}: ${testName}`);
    } else {
      console.error(`❌ [FAIL] Test ${totalTests}: ${testName}`);
      if (details) {
        console.error('Detalles del fallo:', JSON.stringify(details, null, 2));
      }
      process.exitCode = 1;
    }
  };

  try {
    const devicesService = app.get(DevicesService);
    const eventsService = app.get(EventsService);
    await devicesService.clear();
    await eventsService.clear();

    // 1. Rechazo por auth_token ausente en registro
    const res1 = await fetch(registerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hardware_id: 'DEV001',
        name: 'hub-norte',
        role: 'hub',
      }),
    });
    const data1 = await res1.json();
    assert(
      res1.status === 401 &&
        data1.status === 'error' &&
        data1.message === 'Unauthorized',
      'Rechazo por auth_token ausente (HTTP 401)',
      data1,
    );

    // 2. Rechazo por auth_token incorrecto en registro
    const res2 = await fetch(registerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        auth_token: 'token_falso',
      },
      body: JSON.stringify({
        hardware_id: 'DEV001',
        name: 'hub-norte',
        role: 'hub',
      }),
    });
    const data2 = await res2.json();
    assert(
      res2.status === 401 &&
        data2.status === 'error' &&
        data2.message === 'Unauthorized',
      'Rechazo por auth_token incorrecto (HTTP 401)',
      data2,
    );

    // 3. Rechazo por hardware_id ausente
    const res3 = await fetch(registerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        auth_token: config.authToken,
      },
      body: JSON.stringify({
        name: 'hub-norte',
        role: 'hub',
      }),
    });
    const data3 = await res3.json();
    assert(
      res3.status === 400 && data3.status === 'error',
      'Rechazo por hardware_id ausente (HTTP 400)',
      data3,
    );

    // 4. Rechazo por name ausente
    const res4 = await fetch(registerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        auth_token: config.authToken,
      },
      body: JSON.stringify({
        hardware_id: 'DEV001',
        role: 'hub',
      }),
    });
    const data4 = await res4.json();
    assert(
      res4.status === 400 && data4.status === 'error',
      'Rechazo por name ausente (HTTP 400)',
      data4,
    );

    // 5. Rechazo por role inválido
    const res5 = await fetch(registerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        auth_token: config.authToken,
      },
      body: JSON.stringify({
        hardware_id: 'DEV001',
        name: 'hub-norte',
        role: 'invalid_role',
      }),
    });
    const data5 = await res5.json();
    assert(
      res5.status === 400 && data5.status === 'error',
      'Rechazo por role inválido (HTTP 400)',
      data5,
    );

    // 6. Registro exitoso de un dispositivo nuevo
    const res6 = await fetch(registerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        auth_token: config.authToken,
      },
      body: JSON.stringify({
        hardware_id: '  A4CF12B89001  ',
        name: '  hub-recepcion  ',
        location: '  Bogota/Sede Norte/Recepcion  ',
        role: 'hub',
      }),
    });
    const data6 = await res6.json();
    assert(
      res6.status === 200 &&
        data6.status === 'success' &&
        data6.data.hardware_id === 'A4CF12B89001' &&
        data6.data.requested_name === 'hub-recepcion' &&
        data6.data.assigned_name === 'hub-recepcion' &&
        data6.data.location === 'Bogota/Sede Norte/Recepcion' &&
        data6.data.role === 'hub' &&
        typeof data6.data.created_at === 'string' &&
        typeof data6.data.updated_at === 'string' &&
        typeof data6.data.last_seen_at === 'string',
      'Registro exitoso de un dispositivo nuevo con normalización de espacios',
      data6,
    );

    // 7. Registro repetido con el mismo hardware_id sin duplicación y actualización de location
    const res7 = await fetch(registerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        auth_token: config.authToken,
      },
      body: JSON.stringify({
        hardware_id: 'A4CF12B89001',
        name: 'hub-recepcion-modificado',
        location: 'Bogota/Sede Norte/Piso 2',
        role: 'hub',
      }),
    });
    const data7 = await res7.json();
    assert(
      res7.status === 200 &&
        data7.status === 'success' &&
        data7.data.hardware_id === 'A4CF12B89001' &&
        data7.data.assigned_name === 'hub-recepcion' &&
        data7.data.location === 'Bogota/Sede Norte/Piso 2',
      'Registro repetido con mismo hardware_id conserva assigned_name y actualiza location',
      data7,
    );

    // 8. Dos hardware_id solicitando el mismo name -> Asignación de name y name-002
    const res8 = await fetch(registerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        auth_token: config.authToken,
      },
      body: JSON.stringify({
        hardware_id: 'B5DE23C90112',
        name: 'hub-recepcion',
        role: 'hub',
      }),
    });
    const data8 = await res8.json();
    assert(
      res8.status === 200 &&
        data8.data.hardware_id === 'B5DE23C90112' &&
        data8.data.requested_name === 'hub-recepcion' &&
        data8.data.assigned_name === 'hub-recepcion-002',
      'Segundo dispositivo con mismo nombre recibe sufijo -002',
      data8,
    );

    // Tercer dispositivo con mismo nombre recibe -003
    const res8b = await fetch(registerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        auth_token: config.authToken,
      },
      body: JSON.stringify({
        hardware_id: 'C6EF34D01223',
        name: 'hub-recepcion',
        role: 'display',
      }),
    });
    const data8b = await res8b.json();
    assert(
      res8b.status === 200 &&
        data8b.data.assigned_name === 'hub-recepcion-003' &&
        data8b.data.role === 'display',
      'Tercer dispositivo con mismo nombre recibe sufijo -003',
      data8b,
    );

    // 9. Conservación del assigned_name durante registros posteriores
    const res9 = await fetch(registerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        auth_token: config.authToken,
      },
      body: JSON.stringify({
        hardware_id: 'B5DE23C90112',
        name: 'hub-recepcion',
        role: 'hub',
      }),
    });
    const data9 = await res9.json();
    assert(
      res9.status === 200 && data9.data.assigned_name === 'hub-recepcion-002',
      'Conservación del assigned_name (-002) durante registros posteriores',
      data9,
    );

    // 10. Consulta de promociones con device_id y device_name
    const res10 = await fetch(promosUrl, {
      headers: {
        auth_token: config.authToken,
        device_id: 'A4CF12B89001',
        device_name: 'hub-recepcion',
      },
    });
    const data10 = await res10.json();
    assert(
      res10.status === 200 &&
        data10.status === 'success' &&
        data10.device_id === 'A4CF12B89001' &&
        data10.device_name === 'hub-recepcion' &&
        data10.data.otp === 'a1b23c',
      'Consulta de promociones con device_id y device_name exitosa',
      data10,
    );

    // 11. Devolución del nombre canónico cuando device_name está desactualizado
    const res11 = await fetch(promosUrl, {
      headers: {
        auth_token: config.authToken,
        device_id: 'B5DE23C90112',
        device_name: 'nombre-antiguo-desactualizado',
      },
    });
    const data11 = await res11.json();
    assert(
      res11.status === 200 &&
        data11.device_id === 'B5DE23C90112' &&
        data11.device_name === 'hub-recepcion-002',
      'Devolución del nombre canónico (hub-recepcion-002) cuando device_name está desactualizado',
      data11,
    );

    // 12. Manejo seguro de registros concurrentes con el mismo nombre
    const concurrentPromises = Array.from({ length: 5 }).map((_, i) =>
      fetch(registerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          auth_token: config.authToken,
        },
        body: JSON.stringify({
          hardware_id: `CONCURRENT_DEV_${i + 1}`,
          name: 'hub-concurrente',
          role: 'hub',
        }),
      }).then((r) => r.json()),
    );

    const concurrentResults = await Promise.all(concurrentPromises);
    const assignedNamesSet = new Set(
      concurrentResults.map((r) => r.data?.assigned_name),
    );
    assert(
      concurrentResults.length === 5 &&
        assignedNamesSet.size === 5 &&
        assignedNamesSet.has('hub-concurrente') &&
        assignedNamesSet.has('hub-concurrente-002') &&
        assignedNamesSet.has('hub-concurrente-003') &&
        assignedNamesSet.has('hub-concurrente-004') &&
        assignedNamesSet.has('hub-concurrente-005'),
      'Manejo seguro de 5 registros concurrentes con nombres únicos consecutivos',
      concurrentResults.map((r) => r.data?.assigned_name),
    );

    // 13. Compatibilidad hacia atrás: GET /promos sin headers adicionales
    const res13 = await fetch(promosUrl, {
      headers: {
        auth_token: config.authToken,
      },
    });
    const data13 = await res13.json();
    assert(
      res13.status === 200 &&
        data13.status === 'success' &&
        data13.device_id === 'eficair-002-123' &&
        data13.data.otp === 'a1b23c',
      'Compatibilidad hacia atrás en GET /promos sin headers de dispositivo',
      data13,
    );

    // 14. Eventos: Rechazo por auth_token ausente (HTTP 401)
    const res14 = await fetch(eventsUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hub: { hardware_id: 'SIM-HUB-001' },
        source: { hardware_id: 'ESP32-A4CF12B89001' },
        events: [],
      }),
    });
    const data14 = await res14.json();
    assert(
      res14.status === 401 && data14.status === 'error' && data14.message === 'Unauthorized',
      'Eventos: Rechazo por auth_token ausente (HTTP 401)',
      data14,
    );

    // 15. Eventos: Rechazo por payload inválido (events vacío) (HTTP 400)
    const res15 = await fetch(eventsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        auth_token: config.authToken,
      },
      body: JSON.stringify({
        hub: { hardware_id: 'SIM-HUB-001' },
        source: { hardware_id: 'ESP32-A4CF12B89001' },
        events: [],
      }),
    });
    const data15 = await res15.json();
    assert(
      res15.status === 400 && data15.status === 'error',
      'Eventos: Rechazo por events vacío (HTTP 400)',
      data15,
    );

    // 16. Eventos: Ingesta exitosa de lote de eventos (HTTP 200)
    const sampleBatchPayload = {
      hub: {
        hardware_id: 'SIM-HUB-001',
        device_name: 'hub-recepcion',
        location: 'Bogota/Sede Norte',
      },
      source: {
        hardware_id: 'ESP32-A4CF12B89001',
        device_name: 'apartamento-301',
        location: 'Torre A/Apartamento 301',
        role: 'legacy',
      },
      events: [
        {
          event_id: 'ESP32-A4CF12B89001:7f31a2:41',
          seq: 41,
          boot_id: '7f31a2',
          type: 'sensor',
          source: 'door-01',
          value: 'open',
          uptime_ms: 152430,
          received_at: '2026-08-27T21:30:05.000Z',
        },
      ],
    };

    const res16 = await fetch(eventsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        auth_token: config.authToken,
      },
      body: JSON.stringify(sampleBatchPayload),
    });
    const data16 = await res16.json();
    assert(
      res16.status === 200 &&
        data16.status === 'success' &&
        Array.isArray(data16.accepted) &&
        data16.accepted.length === 1 &&
        data16.accepted[0] === 'ESP32-A4CF12B89001:7f31a2:41',
      'Eventos: Ingesta exitosa de lote de eventos (HTTP 200)',
      data16,
    );

    // 17. Eventos: Descarte / Idempotencia en reintento del lote con el mismo event_id
    const res17 = await fetch(eventsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        auth_token: config.authToken,
      },
      body: JSON.stringify(sampleBatchPayload),
    });
    const data17 = await res17.json();
    assert(
      res17.status === 200 &&
        data17.status === 'success' &&
        data17.accepted.includes('ESP32-A4CF12B89001:7f31a2:41'),
      'Eventos: Reintento idempotente con deduplicación por event_id',
      data17,
    );

    console.log(`\n========================================`);
    console.log(
      `Resumen: ${passedTests} / ${totalTests} pruebas pasadas exitosamente.`,
    );
    console.log(`========================================\n`);

    await app.close();
    process.exit(passedTests === totalTests ? 0 : 1);
  } catch (err) {
    console.error('Error durante la ejecución de las pruebas:', err);
    await app.close();
    process.exit(1);
  }
}

runTestSuite();
