---
description: Reglas y especificaciones técnicas para Promo Handle API (NestJS)
globs: ["src/**/*", "docs/**/*", "README.md"]
---

# Reglas y Especificaciones Técnicas: Promo Handle API (NestJS)

- Toda la especificación detallada está centralizada en [docs/AGENTS.md](file:///home/kiocone/repos/kiocone/promo-handle-api/docs/AGENTS.md).
- Usar TypeScript con resolución `NodeNext` (incluir extensión `.js` en importaciones relativas).
- Estructura modular de NestJS: `src/modules/<modulo>/` con `controllers`, `services`, `repositories`, `dto`, `entities`.
- Inyección de dependencias con tokens explícitos o decoradores `@Inject()`, `@Injectable()`.
- Validaciones DTO mediante `class-validator` y `class-transformer` con `ValidationPipe`.
- Respuestas de error estandarizadas con `HttpExceptionFilter` `{ "status": "error", "message": "...", errors?: [...] }`.
- Autenticación con `AuthGuard` sobre header `auth_token`.
- Mantener la suite de pruebas automatizadas actualizada (`npm test`).
