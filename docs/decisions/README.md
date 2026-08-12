---
tags:
  - decisions
  - adr
  - index
created: 2026-07-21
updated: 2026-08-12
---

# Decisiones de arquitectura (ADR)

Este directorio contiene los Architecture Decision Records (ADR) del proyecto. Cada ADR documenta una decisión técnica importante, el contexto que la motivó y las alternativas consideradas.

## ADRs activos

| # | Título | Estado | Fecha |
| --- | --- | --- | --- |
| [ADR-001](./adr-001-react-router-code-splitting.md) | Code splitting con React Router | Aprobado | 2026-07-21 |
| [ADR-002](./adr-002-tailwind-css-v4-theme.md) | Tema CSS-first con Tailwind v4 | Aprobado | 2026-07-21 |
| [ADR-003](./adr-003-supabase-auth.md) | Autenticación con Supabase | Aprobado | 2026-07-21 |
| [ADR-004](./adr-004-import-map-supabase.md) | Import Map para el SDK de Supabase | Aprobado | 2026-07-21 |

## Formato de ADR

Cada ADR sigue el formato de Michael Nygard:

```markdown
# ADR-NNN: Título de la decisión

## Contexto
¿Qué problema estamos resolviendo? ¿Qué factores influyen?

## Decisión
¿Qué elegimos hacer?

## Consecuencias
¿Qué beneficios y riesgos resultan?

## Alternativas consideradas
¿Qué otras opciones exploramos y por qué las descartamos?
```
