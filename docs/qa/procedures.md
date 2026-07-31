# Procedimientos de QA — La Holanda

## 1. Calidad de Código

### Gate de Calidad (Automático en CI)

| Métrica | Umbral Mínimo | Severidad |
|---------|---------------|-----------|
| Cobertura de statements | ≥ 80% | ❌ Bloqueante |
| Cobertura de branches | ≥ 75% | ❌ Bloqueante |
| Cobertura de funciones | ≥ 80% | ❌ Bloqueante |
| Cobertura de líneas | ≥ 80% | ❌ Bloqueante |
| Tasa de mutantes sobrevivientes (Stryker) | ≤ 15% | ⚠️ Alerta |
| Errores de TypeScript | 0 | ❌ Bloqueante |
| Advertencias de ESLint | ≤ 5 | ⚠️ Alerta |
| Errores de ESLint | 0 | ❌ Bloqueante |

### Ejecución Local

```bash
# Suite completa de calidad
npm run test:run         # Tests unitarios
npm run test:coverage    # Cobertura
npm run lint            # Linting
npm run test:mutation   # Mutation testing
npx tsc --noEmit        # TypeScript check

# E2E (requiere build + preview)
npm run build
npm run test:e2e
```

---

## 2. Pruebas Unitarias (Vitest)

### Estructura de Tests

Cada módulo debe tener su archivo de test correspondiente:

```
src/
  components/
    seo/
      PageSEO.tsx
      __tests__/
        PageSEO.test.tsx      ← Tests
    layout/
      TopNavBar.tsx
      __tests__/
        TopNavBar.test.tsx    ← Tests
  constants/
    navLinks.ts
    __tests__/
      navLinks.test.ts        ← Tests
```

### Convenciones

- Nombrar archivos como `{Componente}.test.{ts,tsx}`
- Colocar en directorio `__tests__/` junto al componente
- Usar `describe` / `it` / `expect` de Vitest
- Preferir `screen.getByRole()` sobre `screen.getByText()` para accesibilidad
- Mockear dependencias externas (Supabase, Cloudinary, router)

### Comandos

```bash
npx vitest                    # Watch mode
npx vitest run                # Single run
npx vitest run --coverage     # Con cobertura
npx vitest run src/seo        # Filtrado por directorio
```

---

## 3. Pruebas de Mutación (Stryker)

Stryker introduce mutaciones (cambios deliberados) en el código para verificar que los tests los detecten.

### Ejecución

```bash
npm run test:mutation
```

### Interpretación

| Indicador | Significado |
|-----------|-------------|
| ✅ **Killed** | El test detectó la mutación — buena cobertura |
| ❌ **Survived** | El test NO detectó la mutación — mejorar tests |
| 🟡 **No coverage** | Sin tests cubriendo esa línea |
| ⚪ **Timeout** | Mutación causó loop infinito |

### Objetivo

- **Tasa de mutantes asesinados:** ≥ 85%
- **Acción:** Si un mutante sobrevive, agregar test que cubra ese escenario

---

## 4. Pruebas E2E (Playwright)

### Proyectos

| Proyecto | Viewport | Propósito |
|----------|----------|-----------|
| `chromium-mobile` | 375×812 | Navegación móvil, bottom nav, tap targets |
| `chromium-tablet` | 768×1024 | Diseño responsive intermedio |
| `chromium-desktop` | 1280×800 | Navegación completa desktop |

### Ejecución

```bash
npm run build
npm run test:e2e              # Todos los proyectos
npm run test:e2e:mobile       # Solo mobile
npm run test:e2e:debug        # Modo debug
```

### Cobertura E2E Requerida

- ✅ Navegación entre todas las rutas públicas
- ✅ Formulario de contacto (render, validación, envío)
- ✅ Responsive design (320px – 1280px)
- ✅ Tap targets ≥ 48px en mobile
- ✅ Página 404

---

## 5. QA Checklist — Pre-Deploy

### 🔲 Código
- [ ] `npx tsc --noEmit` sin errores
- [ ] `npm run lint` sin errores
- [ ] `npm run test:run` — todos los tests pasan
- [ ] `npm run test:coverage` — umbrales cumplidos
- [ ] `npm run test:mutation` — tasa ≥ 85%

### 🔲 Build
- [ ] `npm run build` exitoso
- [ ] Assets comprimidos correctamente
- [ ] Service Worker generado (PWA)

### 🔲 E2E
- [ ] `npm run test:e2e` — todos los tests pasan
- [ ] Navegación móvil funcional
- [ ] Formulario de contacto funcional
- [ ] Sin scroll horizontal en ningún viewport

### 🔲 SEO / Metadatos
- [ ] Open Graph tags presentes en cada página
- [ ] JSON-LD structured data válido
- [ ] Sitemap.xml generado con todas las rutas
- [ ] Robots.txt configurado

### 🔲 Performance
- [ ] Lighthouse mobile ≥ 80 en todas las categorías
- [ ] Imágenes optimizadas (Cloudinary f_auto, q_auto)
- [ ] Code splitting aplicado (lazy loading)
- [ ] Sin render blocking resources críticos

---

## 6. Reporte de Calidad

```bash
# Generar reporte unificado
npm run test:coverage          # coverage/  → HTML + JSON
npm run test:mutation          # reports/stryker/ → HTML
npm run test:e2e               # reports/e2e-report/ → HTML
```

Los reportes se generan en:
- `coverage/` — Cobertura de tests unitarios
- `reports/stryker/` — Resultados de mutation testing
- `reports/e2e-report/` — Reporte E2E

---

## 7. Actualización de Tests

Siempre que se:
- **Agregue una nueva ruta** → Agregar test de navegación
- **Modifique un componente** → Verificar/actualizar sus tests
- **Agregue una dependencia** → Verificar que los mocks existentes sigan funcionando
- **Cambie la interfaz de datos** → Actualizar tipos en tests
