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
El proyecto necesita un sistema de diseño robusto y consistente con una paleta de colores inspirada en la naturaleza del Quindío (verdes bosque, dorados suaves, cremas cálidos). Al iniciar el proyecto, Tailwind CSS v4 había sido lanzado con un nuevo paradigma **CSS-first** que reemplaza el archivo `tailwind.config.js` por directivas `@theme` en CSS.

## Decisión
Adoptar **Tailwind CSS v4 con configuración CSS-first** usando `@theme` en `src/index.css`:

```css
@import "tailwindcss";

@theme {
  /* Colores */
  --color-primary: #1B4332;
  --color-forest-green: #1B4332;
  --color-soft-gold: #D4A373;
  --color-warm-white: #FAFAF8;
  
  /* Tipografía */
  --font-display-lg: "Playfair Display", serif;
  --font-body-lg: "Inter", sans-serif;
  
  /* Tamaños */
  --text-display-lg: 64px;
  --text-display-lg--line-height: 72px;
}
```

### Características del Tema
- **Paleta completa Material 3**: primary, secondary, tertiary, surface, error con sus variantes
- **Tokens de marca**: `forest-green`, `coffee-green`, `soft-gold`, `warm-white`, `deep-forest`, etc.
- **Tipografía**: Playfair Display para títulos, Inter para cuerpo
- **Escala tipográfica completa**: desde `display-lg` (64px) hasta `caption` (12px)
- **Efectos visuales**: `glass-card`, `hover-lift`, `img-zoom`, `pulse-glow`, `link-arrow`
- **Animaciones**: scroll reveal, page enter, stagger reveal via CSS classes utilitarias

## Consecuencias
✅ **Positivas:**
- Sin archivo `tailwind.config.js` — toda la configuración en un solo lugar (`index.css`)
- Los tokens de diseño son CSS custom properties nativas, accesibles desde cualquier CSS
- Coherencia visual garantizada: los componentes usan tokens semánticos (`bg-primary`, `text-on-primary`)
- Más fácil de mantener que un archivo JS de configuración

⚠️ **Trade-offs:**
- Equipo debe aprender sintaxis CSS-first de Tailwind v4
- No hay autocompletado nativo para valores de `@theme` en algunos editores (mejora gradual)
- Migrar de v3 requiere cambiar la sintaxis de clases utilitarias

## Alternativas Consideradas
1. **Tailwind v3 con `tailwind.config.js`:** Descartado por estar desactualizado; v4 es el estándar actual
2. **CSS Modules + styled-components:** Excesivo para un proyecto landing page; Tailwind ofrece mejor DX
3. **SCSS/SASS puro:** Sin sistema de diseño atómico; mayor propensión a inconsistencias visuales
