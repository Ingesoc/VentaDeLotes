# Procedimientos de QA — La Holanda

## 1. Calidad de código

### Umbrales configurados en el proyecto

| Métrica | Umbral | Herramienta |
| --- | --- | --- |
| Cobertura de statements | 80% | Vitest (coverage v8) |
| Cobertura de branches | 70% | Vitest (coverage v8) |
| Cobertura de funciones | 75% | Vitest (coverage v8) |
| Cobertura de líneas | 80% | Vitest (coverage v8) |
| Mutation score (Stryker) | alto 85 / bajo 70 / fallo 60 | Stryker |
| Errores de TypeScript | 0 | `tsc -b` (dentro del build) |
| Errores de ESLint | 0 | ESLint |
| React Doctor | sin issues | react-doctor |
| Vulnerabilidades de dependencias | 0 (nivel critical) | `npm audit --audit-level=critical` |

### Ejecución local

```bash
# Suite completa de calidad
bun run test:run         # Tests unitarios (257)
bun run test:coverage    # Cobertura
bun run lint             # ESLint
bun run lint:doctor      # React Doctor
bun run test:mutation    # Mutation testing

# E2E (requiere build + preview)
bun run build
bun run test:e2e
```

---

## 2. Pruebas unitarias (Vitest)

### Estructura de tests

Cada módulo tiene su archivo de test en un directorio `__tests__` junto al componente:

```
src/
  components/
    ui/
      YouTubeVideo.tsx
      __tests__/
        YouTubeVideo.test.tsx
  constants/
    navLinks.ts
    __tests__/
      navLinks.test.ts
```

### Convenciones

- Nombrar los archivos como `{Componente}.test.{ts,tsx}`.
- Usar `describe` / `it` / `expect` de Vitest.
- Preferir `screen.getByRole()` sobre `screen.getByText()`.
- Inyectar dependencias (por ejemplo, la función `submitLead` del formulario) en lugar de mockear módulos completos cuando sea posible.
- Mockear servicios externos cuando el componente los usa directamente (Supabase, Cloudinary, router).

### Comandos

```bash
bun run test                 # Modo watch
bun run test:run             # Una sola ejecución
bun run test:coverage        # Con reporte de cobertura
bun run test:run src/lib     # Filtrar por directorio
```

Actualmente hay 257 tests en 18 archivos. La lista completa de archivos de test está en [quality.md](../features/quality.md).

---

## 3. Pruebas de mutación (Stryker)

Stryker introduce cambios deliberados en el código para verificar que los tests los detecten.

### Ejecución

```bash
bun run test:mutation
```

### Interpretación

| Indicador | Significado |
| --- | --- |
| Killed | El test detectó la mutación (buena cobertura) |
| Survived | El test no detectó la mutación (hay que mejorar los tests) |
| No coverage | No hay tests que cubran esa línea |

### Umbrales

- `high`: 85% de mutantes eliminados (objetivo).
- `low`: 70% (alerta).
- `break`: 60% (el comando falla por debajo de este valor).

El reporte HTML se genera en `reports/stryker/index.html`.

---

## 4. Pruebas E2E (Playwright)

### Proyectos

| Proyecto | Viewport | Propósito |
| --- | --- | --- |
| `chromium-mobile` | 375x812 | Navegación móvil, bottom nav, tap targets |
| `chromium-tablet` | 768x1024 | Diseño responsive intermedio |
| `chromium-desktop` | 1280x800 | Navegación completa de escritorio |

### Ejecución

```bash
bun run build
bun run test:e2e                # Todos los proyectos
bun run test:e2e:mobile         # Solo mobile
bun run test:e2e:debug          # Modo debug (UI de Playwright)
```

El CI ejecuta los proyectos `chromium-mobile` y `chromium-desktop` contra el build de producción.

### Cobertura E2E

- Navegación entre todas las rutas públicas.
- Formulario de contacto (render, validación, envío).
- Diseño responsive sin scroll horizontal (320px a 1280px).
- Tap targets de al menos 48px en móvil.
- Página 404.
- Carrusel de la home (carga perezosa del video).
- Páginas admin con sesión mockeada.

Actualmente la suite e2e tiene 146 tests en 5 archivos: `contact-form.spec.ts`, `navigation.spec.ts`, `home.spec.ts`, `projects.spec.ts` y `responsive.spec.ts`.

---

## 5. Checklist de pre-deploy

### Código

- [ ] `bun run build` sin errores.
- [ ] `bun run lint` sin errores.
- [ ] `bun run test:run` — todos los tests pasan.
- [ ] `bun run test:coverage` — umbrales cumplidos.
- [ ] `bun run lint:doctor` — react-doctor sin issues.
- [ ] `npm audit --audit-level=critical` — sin vulnerabilidades.

### Build y PWA

- [ ] Build de producción exitoso.
- [ ] Service worker generado (`dist/sw.js`).
- [ ] Manifest de la PWA correcto.

### E2E

- [ ] `bun run test:e2e` — todos los tests pasan.
- [ ] Navegación móvil funcional.
- [ ] Formulario de contacto funcional.
- [ ] Sin scroll horizontal en ningún viewport.

### SEO y metadatos

- [ ] Meta tags Open Graph en cada página.
- [ ] Datos estructurados JSON-LD válidos.
- [ ] `sitemap.xml` generado con todas las rutas.
- [ ] `robots.txt` configurado.

### Performance

- [ ] Imágenes optimizadas con Cloudinary (`f_auto`, `q_auto`, `dpr_auto`).
- [ ] Code splitting aplicado (lazy por ruta).
- [ ] Auditoría de Lighthouse con resultados razonables.

---

## 6. Reportes de calidad

```bash
bun run test:coverage        # coverage/ → HTML + JSON
bun run test:mutation        # reports/stryker/ → HTML
bun run test:e2e             # reports/e2e-report/ → HTML
```

Los reportes se generan en:

- `coverage/` — cobertura de tests unitarios.
- `reports/stryker/` — resultados de mutation testing.
- `reports/e2e-report/` — reporte E2E de Playwright.

---

## 7. Cuándo actualizar los tests

- Se agrega una ruta nueva: agrega tests de navegación y e2e.
- Se modifica un componente: verifica y actualiza sus tests.
- Se cambia la interfaz de datos: actualiza los tipos en los tests.
- Se cambia un texto o selector de UI: revisa los tests e2e que lo usan.
