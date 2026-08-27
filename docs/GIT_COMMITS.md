# Guía de Commits de Git - Convención Angular

Este documento define el estándar de mensajes de commit para el repositorio **Promo Handle API**, basado en la especificación de **Angular Commit Message Guidelines** (Conventional Commits).

---

## 1. Estructura del Mensaje

Todo commit debe seguir el siguiente formato:

```text
<tipo>(<alcance>): <descripción corta en imperativo y minúsculas>

[cuerpo opcional explicando el porqué y contexto del cambio]

[pie de página opcional para issues o BREAKING CHANGES]
```

### Ejemplo:
```text
feat(devices): implement idempotent device registration endpoint

Add POST /api/v1/devices/register to allow ESP32 hubs to register
and assign unique sequential numeric suffixes (-002, -003).

Closes #12
```

---

## 2. Tipos Permitidos (`<tipo>`)

| Tipo | Descripción | Ejemplo |
| :--- | :--- | :--- |
| **`feat`** | Una nueva funcionalidad o endpoint para el usuario o firmware. | `feat(devices): add sequential name suffix generator` |
| **`fix`** | Corrección de un error o bug en la lógica existente. | `fix(auth): return 401 when auth_token is invalid` |
| **`docs`** | Cambios exclusivamente en la documentación. | `docs(readme): update endpoints and curl examples` |
| **`style`** | Formateo, espaciado, comas o punto y coma (sin cambios de lógica). | `style(common): format logging interceptor output` |
| **`refactor`** | Refactorización de código que no añade features ni corrige bugs. | `refactor(core): migrate express architecture to nestjs` |
| **`perf`** | Mejora de rendimiento o reducción de tiempos de respuesta. | `perf(devices): optimize repository lookup indexing` |
| **`test`** | Adición o corrección de pruebas automatizadas. | `test(devices): add concurrency registration test case` |
| **`build`** | Cambios en el sistema de compilación o dependencias externas. | `build(deps): add class-validator and nestjs packages` |
| **`ci`** | Modificaciones en scripts o configuración de CI/CD. | `ci(github): add automated test workflow` |
| **`chore`** | Tareas de mantenimiento o configuración general. | `chore(repo): update gitignore and workspace agents` |
| **`revert`** | Reversión de un commit anterior. | `revert: feat(promos): revert legacy promo payload` |

---

## 3. Alcances Permitidos (`<alcance>`)

El alcance debe ser el módulo, paquete o capa afectada:

- `devices`: Módulo de dispositivos (`src/modules/devices/`).
- `promos`: Módulo de promociones (`src/modules/promos/`).
- `health`: Módulo de health check (`src/modules/health/`).
- `auth`: Autenticación y `AuthGuard` (`src/common/guards/`).
- `common`: Filtros, interceptores o utilidades compartidas (`src/common/`).
- `config`: Variables de entorno y configuración (`src/config/`).
- `deps`: Actualizaciones de dependencias (`package.json`).
- `docs`: Documentación en `/docs` o `README.md`.
- `agents`: Configuración de agentes y directrices (`AGENTS.md`, `.agents/`).

---

## 4. Reglas para la Descripción (`<descripción>`)

1. **Tiempo verbal imperativo en presente:** Usar verbos de acción ("add", "fix", "update", "implement" o en español "agrega", "corrige", "actualiza").
2. **Minúsculas:** Comenzar siempre con letra minúscula.
3. **Sin punto final:** No colocar punto (`.`) al final de la línea del asunto.
4. **Límite de longitud:** Máximo 72 caracteres en la línea principal.

---

## 5. Cambios con Ruptura (`BREAKING CHANGE`)

Si un commit introduce un cambio incompatible con versiones previas (cambio de contrato en la API o respuestas):
- Añadir `!` tras el tipo/alcance (ej. `feat(promos)!: change response root schema`)
- Incluir una sección al pie del commit comenzando con `BREAKING CHANGE: <explicación>`.
