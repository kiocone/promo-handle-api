---
description: Regla de commits Git según el estándar de Angular (Conventional Commits)
globs: ["**/*"]
---

# Regla del Agente Git: Estándar Angular para Mensajes de Commit

Cada vez que el agente genere, proponga o ejecute commits de Git en este repositorio, **DEBE** seguir rigurosamente el estándar de **Angular / Conventional Commits**.

Guía completa disponible en: [docs/GIT_COMMITS.md](file:///home/kiocone/repos/kiocone/promo-handle-api/docs/GIT_COMMITS.md).

## Formato Requerido

```text
<type>(<scope>): <short description in imperative present tense, no trailing period>

[optional body explaining motivation and context]

[optional footer for BREAKING CHANGES or issue references]
```

## Tipos Válidos
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Documentación
- `style`: Formateo / estilos de código
- `refactor`: Refactorización sin alterar comportamiento
- `perf`: Mejoras de rendimiento
- `test`: Añadir o actualizar pruebas
- `build`: Cambios en build o dependencias
- `ci`: Configuración de CI/CD
- `chore`: Tareas de mantenimiento o tooling
- `revert`: Revertir commit previo

## Alcances Recomendados
- `devices`, `promos`, `health`, `auth`, `common`, `config`, `deps`, `docs`, `agents`

## Ejemplos
- `feat(devices): add sequential name suffix generator`
- `refactor(core): migrate express api to nestjs architecture`
- `docs(api): add curl examples and error response schemas`
- `test(devices): add concurrency registration test case`
