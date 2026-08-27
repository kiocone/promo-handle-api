# Arquitectura y Diseño del Sistema (NestJS)

La API Promo Handle está implementada sobre el framework **NestJS**, aprovechando la arquitectura basada en módulos, inyección de dependencias (DI) e inversión de control (IoC).

---

## 1. Módulos del Sistema

### `AppModule`
Módulo raíz que encapsula la configuración global de la aplicación (`ConfigModule`) e integra los submódulos de dominio.

### `DevicesModule`
Encargado de la gestión y registro de dispositivos IoT.
- **`DevicesController`**: Expone `POST /api/v1/devices/register`.
- **`DevicesService`**: Contiene la lógica de negocio para asignación de sufijos, idempotencia y bloqueo por mutex de concurrencia.
- **`IDeviceRepository` & `InMemoryDeviceRepository`**: Abstracción de acceso a datos provista mediante inyección de dependencias (`DEVICE_REPOSITORY`).

### `PromosModule`
Encargado de la resolución y entrega de promociones.
- **`PromosController`**: Expone `GET /api/v1/promos`.
- **`PromosService`**: Resuelve las promociones, sincroniza el nombre canónico y actualiza la marca de tiempo `last_seen_at` a través de `DevicesService`.

### `HealthModule`
Proporciona el endpoint ligero `GET /health` para monitoreo de uptime y liveness probes.

---

## 2. Componentes Transversales (`src/common/`)

- **`AuthGuard`**: Intercepta solicitudes entrantes y valida el header `auth_token` contra el token configurado, devolviendo `401 Unauthorized` si es inválido.
- **`HttpExceptionFilter`**: Filtro de excepciones global que garantiza que todos los errores sigan el formato `{ status: "error", message: "...", errors?: [...] }`.
- **`LoggingInterceptor`**: Mide con precisión en nanosegundos (`process.hrtime`) la duración de cada petición y emite logs contextuales en consola sin filtrar credenciales.

---

## 3. Estrategia de Persistencia y Migración Futura

La capa de datos está desacoplada mediante la interfaz `IDeviceRepository`. Para conectar una base de datos real (como PostgreSQL con TypeORM/Prisma o MongoDB):
1. Crear una clase que implemente `IDeviceRepository` (ej. `TypeOrmDeviceRepository`).
2. Actualizar el provider en `DevicesModule`:
   ```typescript
   {
     provide: DEVICE_REPOSITORY,
     useClass: TypeOrmDeviceRepository,
   }
   ```
Sin modificar controladores ni servicios.
