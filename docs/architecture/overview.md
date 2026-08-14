---
tags:
  - architecture
  - overview
created: 2026-07-21
updated: 2026-08-13
---

# Arquitectura del proyecto

Los diagramas están en [Diagramas de arquitectura](../diagrams/architecture.md). Son archivos HTML que se abren en cualquier navegador y usan la paleta del proyecto. Incluyen la vista general del sistema, el flujo de autenticación, el modelo de datos, el árbol de rutas, el pipeline de CI y la estructura de carpetas.

---

## Estructura del código

```
src/
├── components/     Componentes globales (layout, ui, seo, home, quindio)
├── constants/      Datos estaticos (lotes, stats, navLinks, project)
├── features/       Modulos por funcionalidad (admin, home, investment, projects)
│   └── home/
│       ├── components/   JSX y presentacion
│       └── hooks/        Logica de negocio (useContactForm)
├── hooks/          Custom hooks globales (auth, scroll reveal, tracking)
├── lib/            Clientes e integraciones (supabase, cloudinary, leads, checkAdmin)
├── pages/          Paginas independientes (Contacto, DescubreQuindio)
├── router/         Configuracion de rutas
├── main.tsx        Punto de entrada
└── index.css       Tema Tailwind v4 + estilos globales
```

---

## Principios de arquitectura

### 1. Organización por funcionalidad (feature-based)

Los módulos se organizan por dominio funcional en `src/features/`. Cada feature contiene sus componentes, hooks y lógica. Esto facilita el mantenimiento, la escalabilidad y el code splitting.

### 2. Code splitting por ruta

Las rutas secundarias y todo el panel admin se cargan bajo demanda con la propiedad `lazy` de React Router v8:

```typescript
{
  path: "investment",
  lazy: () => import("@/features/investment/InvestmentPage")
    .then((m) => ({ Component: m.InvestmentPage })),
}
```

Las páginas principales (Home, Projects) se cargan de inmediato para un primer render rápido. Ver [ADR-001](../decisions/adr-001-react-router-code-splitting.md).

### 3. Estado y datos

- El estado de autenticación vive en React Context (`AuthProvider`).
- Los datos de los lotes son estáticos e inmutables en `src/constants/` (objetos `as const`).
- Las escrituras (leads, visitas, CRUD admin) van a Supabase mediante funciones RPC o el cliente REST.
- El componente `ContactForm` depende de una función inyectable (`submitLead`) en lugar de usar Supabase directamente (ver [leads.ts](../../src/lib/leads.ts)).

### 4. Tema CSS-first (Tailwind v4)

Tailwind v4 se configura en CSS con `@theme` dentro de `src/index.css`. No existe `tailwind.config.js`:

```css
@theme {
  --color-primary: #1B4332;
  --color-soft-gold: #D4A373;
  --font-display-lg: "Playfair Display", serif;
}
```

### 5. Autenticación delegada

Supabase Auth administra el ciclo de vida de la sesión (login, refresh, logout). El frontend solo consume el estado con `onAuthStateChange`. La verificación de rol admin se hace en PostgreSQL con la función RPC `has_backstage_access`.

### 6. Import Map para el SDK de Supabase

`@supabase/supabase-js` se empaqueta con Vite en el chunk `vendor-supabase` (bundle local). Antes se cargaba desde esm.sh vía Import Map, pero encadenaba ~15 requests en el camino crítico de Lighthouse; se revirtió y se desactivó la regla de react-doctor que lo motivó. Ver [ADR-004](../decisions/adr-004-import-map-supabase.md).

### 7. Supabase tolerante a configuraciones incompletas

El cliente de Supabase (`src/lib/supabase.ts`) no interrumpe el arranque de la app si faltan las variables de entorno: usa una URL provisional y las llamadas fallan de forma controlada. Esto permite que los tests e2e del CI funcionen sin secrets configurados.

### 8. Fuentes self-hosted (rendimiento del LCP)

Las fuentes (Inter y Playfair Display, ambas variable fonts) se sirven desde `/fonts/*.woff2` en lugar de Google Fonts. El CSS de Google Fonts era render-blocking (~1s en Lighthouse) y el fetch de los woff2 solo arrancaba cuando React pintaba el texto (~680ms después de la navegación), retrasando el LCP del hero. Ahora:

- `index.html` precarga las dos fuentes (`rel="preload" as="font"`) → descargan en T≈0.
- `src/index.css` define los `@font-face` con `font-display: swap`.
- El service worker las precachea (glob `fonts/**/*.woff2`).

**Nota sobre el LCP:** Chrome ignora por diseño (desde Chrome 88) las imágenes que ocupan el viewport completo como candidatas a LCP (cambio de métrica anti-"wallpaper"). Por eso el elemento LCP de la home es el texto del hero, y el preload de fuentes es lo que más lo mejora.

---

## Seguridad

| Aspecto | Implementación |
| --- | --- |
| Rutas protegidas | `AdminGuard` verifica autenticación + rol admin |
| RLS en base de datos | Políticas Row Level Security en cada tabla |
| Secrets | Variables de entorno `VITE_*`, nunca hardcodeadas |
| Verificación de admin | Server-side vía RPC en PostgreSQL |
| Iframes | `sandbox` sin `allow-same-origin` en el reproductor de YouTube |

---

## Decisiones técnicas relacionadas

- [ADR-001: Code splitting](../decisions/adr-001-react-router-code-splitting.md)
- [ADR-002: Tailwind v4 CSS-first](../decisions/adr-002-tailwind-css-v4-theme.md)
- [ADR-003: Auth con Supabase](../decisions/adr-003-supabase-auth.md)
- [ADR-004: Import Map Supabase](../decisions/adr-004-import-map-supabase.md)

## Enlaces relacionados

- [Diagramas de arquitectura](../diagrams/architecture.md)
- [Guía de onboarding](../guides/onboarding.md)
- [Stack tecnológico](../stack/tech-stack.md)
