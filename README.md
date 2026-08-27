# Promo Handle API

API REST empresarial construida con **NestJS**, **TypeScript** y **Node.js** para la consulta de promociones, registro/gestión de dispositivos IoT (hubs y displays ESP32) y recepción telemétrica de lotes de eventos.

---

## 📚 Documentación del Proyecto

Toda la documentación técnica y las guías de agentes se encuentran organizadas en la carpeta [`/docs`](file:///home/kiocone/repos/kiocone/promo-handle-api/docs/):

- 🤖 [**Guía y Contexto del Agente (`docs/AGENTS.md`)**](file:///home/kiocone/repos/kiocone/promo-handle-api/docs/AGENTS.md): Especificaciones técnicas y lineamientos para agentes y desarrolladores.
- 📡 [**Referencia de Endpoints y API (`docs/API.md`)**](file:///home/kiocone/repos/kiocone/promo-handle-api/docs/API.md): Documentación completa de endpoints, contratos JSON, headers y ejemplos cURL.
- 🏗️ [**Arquitectura y Módulos (`docs/ARCHITECTURE.md`)**](file:///home/kiocone/repos/kiocone/promo-handle-api/docs/ARCHITECTURE.md): Diagrama y detalle de la arquitectura modular NestJS e inyección de dependencias.
- 🌿 [**Estándar de Commits Git (`docs/GIT_COMMITS.md`)**](file:///home/kiocone/repos/kiocone/promo-handle-api/docs/GIT_COMMITS.md): Guía de formato de commits bajo la convención Angular / Conventional Commits.

---

## Requisitos Previos

- Node.js (v18 o superior)
- npm

---

## Instalación

```bash
npm install
```

---

## Configuración

Copia el archivo `.env.example` a `.env` y configura el token de autenticación:

```bash
cp .env.example .env
```

Variables de entorno:

```env
PORT=3000
AUTH_TOKEN=YOUR_MOCKED_TOKEN
```

---

## Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo con recarga automática (`tsx watch src/main.ts`).
- `npm run build`: Compila el código TypeScript a JavaScript en la carpeta `dist`.
- `npm start`: Ejecuta el servidor compilado en producción (`node dist/main.js`).
- `npm test`: Ejecuta la suite de pruebas automatizadas contra la API NestJS.

---

## Resumen de Endpoints Principales

| Método | Endpoint | Autenticación | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/devices/register` | `auth_token` | Registro o actualización idempotente de dispositivos IoT. |
| `POST` | `/api/v1/events` | `auth_token` | Ingesta y deduplicación por lote de eventos de hubs ESP32. |
| `GET` | `/api/v1/promos` | `auth_token` | Consulta de promociones activas e identificación de dispositivo. |
| `GET` | `/health` | Ninguna | Health check del servidor. |

Para especificaciones detalladas de cada endpoint, payloads y respuestas, consulta [docs/API.md](file:///home/kiocone/repos/kiocone/promo-handle-api/docs/API.md).