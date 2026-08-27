# Promo Handle API - Agent Guidelines & Context

Este documento centraliza todas las directrices, especificaciones técnicas y contexto de arquitectura para que los agentes y desarrolladores no tengan que repetir prompts ni especificaciones en futuras sesiones.

---

## 1. Visión General del Proyecto

- **Stack:** Node.js, TypeScript (ESM / NodeNext), NestJS, tsx.
- **Propósito:** API REST modular de alto rendimiento para consulta de promociones, registro/identificación de dispositivos IoT físicos (ESP32 hubs y pantallas displays) y recepción telemétrica de lotes de eventos.
- **Puerto por defecto:** `3000` (configurable con `PORT`).

---

## 2. Arquitectura del Código (NestJS)

El proyecto está organizado siguiendo la arquitectura modular y desacoplada de NestJS:

```text
src/
├── main.ts                            # Bootstrap de la app NestJS (CORS, Pipes, Filters, Interceptors)
├── app.module.ts                      # Módulo raíz que importa ConfigModule y submódulos
├── config/
│   └── env.ts                         # Carga de variables de entorno tipadas
├── common/
│   ├── guards/
│   │   └── auth.guard.ts              # Guard de autenticación para validar auth_token
│   ├── filters/
│   │   └── http-exception.filter.ts   # Formateador global de respuestas de error
│   └── interceptors/
│       └── logging.interceptor.ts     # Interceptor de auditoría de tiempos y peticiones
└── modules/
    ├── devices/
    │   ├── dto/
    │   │   └── register-device.dto.ts # DTO con validaciones class-validator
    │   ├── entities/
    │   │   └── device.entity.ts       # Definición de entidades y tipos de respuesta
    │   ├── repositories/
    │   │   ├── device.repository.interface.ts # Token IDeviceRepository
    │   │   └── in-memory-device.repository.ts # Persistencia en memoria thread-safe
    │   ├── devices.service.ts         # Registro idempotente, sufijos (-002, -003) y mutex
    │   ├── devices.controller.ts      # Endpoint POST /api/v1/devices/register
    │   └── devices.module.ts          # Módulo de dispositivos
    ├── promos/
    │   ├── dto/
    │   │   └── promo-response.dto.ts
    │   ├── promos.service.ts          # Resolución de promociones y nombre canónico
    │   ├── promos.controller.ts       # Endpoint GET /api/v1/promos
    │   └── promos.module.ts           # Módulo de promociones
    ├── events/
    │   ├── dto/
    │   │   ├── create-events-batch.dto.ts # DTO validado para lote de eventos
    │   │   └── events-response.dto.ts
    │   ├── entities/
    │   │   └── event.entity.ts
    │   ├── repositories/
    │   │   ├── events.repository.interface.ts
    │   │   └── in-memory-events.repository.ts # Deduplicación por event_id
    │   ├── events.service.ts          # Procesamiento y deduplicación de lotes
    │   ├── events.controller.ts       # Endpoint POST /api/v1/events
    │   └── events.module.ts           # Módulo de eventos
    └── health/
        ├── health.controller.ts       # Endpoint GET /health
        └── health.module.ts           # Módulo de health check
```

---

## 3. Convenciones Técnicas Obligatorias

1. **Resolución ESM / NodeNext:** Todas las importaciones relativas en archivos TypeScript deben incluir obligatoriamente la extensión `.js` (ej. `import { AppModule } from './app.module.js';`).
2. **Inyección de Dependencias:** Usar siempre los decoradores de NestJS (`@Injectable()`, `@Inject()`, `@Controller()`, `@Module()`).
3. **Autenticación:**
   - Header requerido: `auth_token: <AUTH_TOKEN>`
   - Validación contra `process.env.AUTH_TOKEN` (o `config.authToken`).
   - Si falta o es incorrecto: HTTP 401 con cuerpo:
     ```json
     {
       "status": "error",
       "message": "Unauthorized"
     }
     ```
   - **Los tokens nunca deben ser registrados en logs ni devueltos en respuestas.**
4. **Formato Estándar de Errores:**
   ```json
   {
     "status": "error",
     "message": "Mensaje descriptivo del error",
     "errors": ["detalle 1", "detalle 2"]
   }
   ```
5. **Identidad de Dispositivos y Sufijos:**
   - `hardware_id`: Clave primaria técnica e inmutable (ej. MAC del ESP32).
   - `requested_name`: Nombre solicitado por el cliente.
   - `assigned_name`: Nombre canónico asignado por el servidor. El primer dispositivo obtiene `nombre`, y colisiones posteriores obtienen sufijos de tres dígitos (`nombre-002`, `nombre-003`, etc.).
   - `location`: Metadato mutable de ubicación física.
   - `role`: `'hub' | 'display'`.
   - **Idempotencia:** Si se vuelve a registrar un `hardware_id` existente, se mantiene su `assigned_name` y se actualiza `location`, `role`, `updated_at` y `last_seen_at`.
6. **Ingesta de Eventos y Deduplicación:**
   - `event_id`: Identificador único de evento (`<hardware_id>:<boot_id>:<seq>`).
   - El endpoint `POST /api/v1/events` procesa lotes y descarta eventos duplicados en reintentos del hub sin generar error.
7. **Logging:** El interceptor registra `[timestamp] METODO /ruta STATUS - TIEMPOms [device: ID]` sin filtrar credenciales.
8. **Estándar de Commits (Angular / Conventional Commits):** Todo commit debe seguir `<type>(<scope>): <descripción>` según [docs/GIT_COMMITS.md](file:///home/kiocone/repos/kiocone/promo-handle-api/docs/GIT_COMMITS.md).

---

## 4. Scripts y Verificación

- `npm run dev`: Inicia el entorno de desarrollo con recarga en caliente (`tsx watch src/main.ts`).
- `npm run build`: Compila TypeScript con `tsc`.
- `npm start`: Inicia el build de producción (`node dist/main.js`).
- `npm test`: Ejecuta la suite de pruebas automatizadas (`NODE_ENV=test tsx src/scripts/test-api.ts`).

---

## 5. Documentación Adicional

- [Documentación detallada de Endpoints y API (docs/API.md)](file:///home/kiocone/repos/kiocone/promo-handle-api/docs/API.md)
- [Arquitectura y Guía NestJS (docs/ARCHITECTURE.md)](file:///home/kiocone/repos/kiocone/promo-handle-api/docs/ARCHITECTURE.md)
- [Estándar de Commits de Git Angular (docs/GIT_COMMITS.md)](file:///home/kiocone/repos/kiocone/promo-handle-api/docs/GIT_COMMITS.md)
