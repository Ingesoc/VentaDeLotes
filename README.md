# Verdant Horizon - Luxury Rural Estates

Welcome to **Verdant Horizon**, the premium digital investment portal and showcase for high-end luxury rural estates in the coffee region of Colombia.

This frontend application is built to convey growth, serenity, and stability through nature-centric visuals, spacious modernism, and tactile design elements.

## Tech Stack
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4 (configured CSS-first in `src/index.css`)
- **State Management**: TanStack React Query v5
- **Routing**: React Router Dom v7
- **Icons**: Lucide React
- **Animations**: Framer Motion

## Design Tokens & Palette
Our brand identity is supported by the following design system tokens:
- **Forest Green** (`#1B4332`): Core brand, primary CTAs, stability.
- **Coffee Green** (`#2D6A4F`): Hover states, financing indicators.
- **Soft Gold** (`#D4A373`): Appreciation tags, premium accents.
- **Warm White** (`#FAFAF8`): Surfaces, clean luxury background.
- **Deep Forest** (`#081C15`): Rich typography, high contrast accents.
- **Typography**: Paired display serif (Playfair Display) for headlines and high-legibility sans-serif (Inter) for copy.

## Linting & CI

### React Doctor

This project uses [React Doctor](https://react.doctor) to catch React-specific bugs, security issues, and maintainability problems. Run it locally:

```bash
bun run lint:doctor
```

It runs automatically in CI on every push/PR to `main` (see `.github/workflows/ci.yml`).

### Resolved: `artifact-baas-authority-surface`

`@supabase/supabase-js` is loaded from **esm.sh CDN** at runtime (see importmap in `index.html`) instead of being bundled — the library code never enters a `dist/assets/` file, so the diagnostic can't fire.

All app-level mitigations remain in place:
- **RLS enforced**: `lots` restricted to `disponible`, `leads`/`page_views` write-only via `SECURITY DEFINER` RPC functions
- **Table names hidden**: all `supabase.from()` calls replaced with `supabase.rpc()`
- **Admin screens code-split**: all admin imports are `lazy()`

## Getting Started
To launch the development server locally, install dependencies and run:
```bash
bun install
bun run dev
```

Or using npm:
```bash
npm install
npm run dev
```
