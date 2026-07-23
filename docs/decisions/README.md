---
tags:
  - decisions
  - adr
  - index
created: 2026-07-21
---

# 📐 Architecture Decision Records (ADR)

Este directorio contiene los **Architecture Decision Records** del proyecto. Cada ADR documenta una decisión técnica significativa, el contexto que la motivó y las alternativas consideradas.

## ADRs Activos

| # | Título | Estado | Fecha |
|---|--------|--------|-------|
| [ADR-001](./adr-001-react-router-code-splitting.md) | Code Splitting con React Router y Lazy Loading | ✅ Aprobado | 2026-07-21 |
| [ADR-002](./adr-002-tailwind-css-v4-theme.md) | Tema CSS-first con Tailwind CSS v4 | ✅ Aprobado | 2026-07-21 |
| [ADR-003](./adr-003-supabase-auth.md) | Autenticación con Supabase Auth | ✅ Aprobado | 2026-07-21 |
| [ADR-004](./adr-004-import-map-supabase.md) | Import Map para Supabase SDK vía CDN | ✅ Aprobado | 2026-07-21 |

## Formato de ADR

Cada ADR sigue el formato [Michael Nygard](https://thinkrelevance.com/blog/2011/11/15/documenting-architecture-decisions):

```markdown
# ADR-NNN: Título de la Decisión

## Contexto
¿Qué problema estamos resolviendo? ¿Qué factores influyen?

## Decisión
¿Qué elegimos hacer?

## Consecuencias
¿Qué trade-offs, riesgos y beneficios resultan?

## Alternativas Consideradas
¿Qué otras opciones exploramos y por qué las descartamos?
```
