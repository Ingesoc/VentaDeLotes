---
tags:
  - adr
  - styling
  - css
created: 2026-07-21
status: approved
---

# ADR-002: Tema CSS-first con Tailwind CSS v4

## Contexto

El proyecto necesita un sistema de diseño consistente con una paleta inspirada en la naturaleza del Quindío (verdes bosque, dorados suaves, cremas cálidos). Tailwind CSS v4 introduce un paradigma CSS-first que reemplaza el archivo `tailwind.config.js` por directivas `@theme` en CSS.

## Decisión

Usar Tailwind CSS v4 con configuración CSS-first en `src/index.css`:

```css
@import "tailwindcss";

@theme {
  --color-primary: #1B4332;
  --color-soft-gold: #D4A373;
  --color-warm-white: #FAFAF8;
  --font-display-lg: "Playfair Display", serif;
  --text-display-lg: 64px;
}
```

Características del tema:

- Paleta completa con variantes (primary, secondary, tertiary, surface, error).
- Tokens de marca: `forest-green`, `coffee-green`, `soft-gold`, `warm-white`, `deep-forest`.
- Tipografía: Playfair Display para títulos e Inter para el cuerpo.
- Escala tipográfica desde `display-lg` (64px) hasta `caption` (12px).
- Efectos utilitarios: `glass-card`, `hover-lift`, `img-zoom`, `tap-target`, `safe-input`.
- Animaciones: `page-enter`, scroll reveal.

## Consecuencias

Ventajas:

- No existe `tailwind.config.js`; toda la configuración vive en `index.css`.
- Los tokens son custom properties nativas de CSS.
- Coherencia visual: los componentes usan tokens semánticos (`bg-primary`, `text-on-surface-variant`).

Desventajas:

- El equipo debe aprender la sintaxis CSS-first de Tailwind v4.
- No hay autocompletado de los valores de `@theme` en algunos editores.

## Alternativas consideradas

1. **Tailwind v3 con `tailwind.config.js`:** descartado por estar desactualizado.
2. **CSS Modules + styled-components:** excesivo para un proyecto tipo landing page.
3. **SCSS/SASS puro:** sin sistema de diseño atómico y con mayor riesgo de inconsistencias.
