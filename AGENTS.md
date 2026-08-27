# Promo Handle API - Agent Guidelines & Context

> [!NOTE]
> Las directrices y contexto unificado del agente se encuentran centralizadas en [docs/AGENTS.md](file:///home/kiocone/repos/kiocone/promo-handle-api/docs/AGENTS.md).

## Resumen Rápido

- **Framework:** NestJS (Node.js, TypeScript, ESM/NodeNext).
- **Módulos:**
  - `DevicesModule`: `POST /api/v1/devices/register`
  - `PromosModule`: `GET /api/v1/promos`
  - `EventsModule`: `POST /api/v1/events`
  - `HealthModule`: `GET /health`
- **Seguridad:** Header `auth_token` con respuesta 401 `{ "status": "error", "message": "Unauthorized" }`.
- **Identidad:** `hardware_id` (inmutable), `assigned_name` (único, sufijos `-002`, `-003`), `location` (mutable).
- **Eventos:** Lotes con deduplicación por `event_id`.
- **Commits:** Estándar Angular / Conventional Commits (`<type>(<scope>): <desc>`).
- **Testing:** `npm test` (`NODE_ENV=test tsx src/scripts/test-api.ts`).

Consulta la documentación técnica completa en:
- [docs/AGENTS.md](file:///home/kiocone/repos/kiocone/promo-handle-api/docs/AGENTS.md)
- [docs/API.md](file:///home/kiocone/repos/kiocone/promo-handle-api/docs/API.md)
- [docs/ARCHITECTURE.md](file:///home/kiocone/repos/kiocone/promo-handle-api/docs/ARCHITECTURE.md)
- [docs/GIT_COMMITS.md](file:///home/kiocone/repos/kiocone/promo-handle-api/docs/GIT_COMMITS.md)
