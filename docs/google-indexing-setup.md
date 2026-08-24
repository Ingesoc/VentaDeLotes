# 🚀 Guía: Aparecer en Google — Configuración Completa

## Resumen Rápido

Tu sitio tiene TODO el SEO técnico configurado:
- ✅ Meta tags optimizados por página
- ✅ Schema.org (LocalBusiness, Product, BreadcrumbList, FAQ)
- ✅ Sitemap.xml con 30 URLs
- ✅ robots.txt correcto
- ✅ Blog con 7 artículos pilar (~9,000 palabras)
- ✅ Canonical tags apuntando a `laholanda.ingesocc.com`
- ✅ SPA fallback en Vercel

**Lo que falta**: Configurar Google para que sepa que existes.

---

## PASO 1: Google Search Console (CRÍTICO)

Sin Search Console estás "ciego" — no sabes si Google indexa tu sitio.

### 1.1 Crear/Search Console
1. Ve a [search.google.com/search-console](https://search.google.com/search-console)
2. Inicia sesión con la cuenta de Google de INGESOCC (preferiblemente `gerencia.ingesocc@gmail.com`)
3. Haz clic en **"Agregar propiedad"**
4. Selecciona **"Prefijo de URL"** (NO "Dominio" — requiere DNS)
5. Escribe: `https://laholanda.ingesocc.com`

### 1.2 Verificar propiedad
Opción más fácil — **Verificación por DNS**:
1. Search Console te dará un código de verificación (empieza con `google-site-verification=...`)
2. Ve al panel de DNS de tu dominio (donde compraste `ingesocc.com`)
3. Agrega un registro **TXT**:
   - **Nombre/Host:** `@` (o deja vacío según el registrador)
   - **Tipo:** `TXT`
   - **Valor:** `google-site-verification=XXXXXXXXXX` (el código de Search Console)
   - **TTL:** 3600 (1 hora)
4. Guarda y espera 5-15 minutos
5. Vuelve a Search Console y haz clic en **"Verificar"**

### 1.3 Enviar sitemap
1. En Search Console, ve a **"Sitemaps"** (menú izquierdo)
2. Escribe: `sitemap.xml`
3. Haz clic en **"Enviar"**
4. Verás: "Sitemap enviado exitosamente"

### 1.4 Solicitar indexación de páginas clave
1. En Search Console, ve a **"Inspección de URLs"**
2. Ingresa: `https://laholanda.ingesocc.com/`
3. Haz clic en **"Probar URL en vivo"** → espera
4. Si dice "URL está en Google" → ✅
5. Si dice "URL no está en Google" → haz clic en **"Solicitar indexación"**
6. **Repite para estas páginas** (las más importantes):
   - `https://laholanda.ingesocc.com/`
   - `https://laholanda.ingesocc.com/projects`
   - `https://laholanda.ingesocc.com/investment`
   - `https://laholanda.ingesocc.com/blog`
   - `https://laholanda.ingesocc.com/blog/guia-compra-lote-rural-quindio`
   - `https://laholanda.ingesocc.com/blog/escrituracion-lotes-colombia`

> ⚠️ **Límite**: Google permite ~10 solicitudes de indexación por día. Empieza con las páginas más importantes.

---

## PASO 2: Google Business Profile (SEO Local)

Esto te posiciona en **búsquedas locales** ("lotes Quimbaya", "finca raíz cerca de mí").

### 2.1 Crear perfil
1. Ve a [business.google.com](https://business.google.com)
2. Inicia sesión con `gerencia.ingesocc@gmail.com`
3. Haz clic en **"Agregar negocio"**
4. Sigue la guía completa en: `docs/google-business-profile-setup.md`

### 2.2 Datos exactos para copiar (NAP)

| Campo | Valor exacto |
|-------|-------------|
| **Nombre** | La Holanda — Parcelación Campestre |
| **Dirección** | Vía Quimbaya - Alcalá, Vereda Jazmín, Quimbaya, Quindío |
| **Teléfono** | +57 321 715 1831 |
| **Email** | gerencia.ingesocc@gmail.com |
| **Sitio web** | https://laholanda.ingesocc.com |
| **Categoría principal** | Agencia inmobiliaria |

### 2.3 Verificación
Google te verificará por:
- **Teléfono** (más rápido): Llaman al +57 321 715 1831
- **Tarjeta postal** (lento): Envían una tarjeta a la dirección

---

## PASO 3: Indexación Rápida (Inmediato)

### 3.1 Ping al sitemap
Google ofrece un endpoint para notificar sobre tu sitemap. Abre esta URL en tu navegador:

```
https://www.google.com/ping?sitemap=https://laholanda.ingesocc.com/sitemap.xml
```

### 3.2 URL Inspection Tool (Search Console)
Como se describió en el Paso 1.4, inspecciona y solicita indexación de las páginas más importantes.

---

## PASO 4: Backlinks Inmediatos (Presencia Externa)

Los backlinks le dicen a Google que tu sitio es "importante". Crea estos perfiles GRATIS:

| Plataforma | URL | Acción |
|------------|-----|--------|
| **Google Business Profile** | business.google.com | Crear perfil (Paso 2) |
| **Fincaraíz** | fincaraiz.com.co | Publicar lotes como vendedor directo |
| **Metrocuadrado** | metrocuadrado.com.co | Crear perfil de vendedor |
| **Properati** | properati.com.co | Publicar propiedades |
| **Ciencuadras** | ciencuadras.com | Publicar propiedades |
| **Olx** | olx.com.co | Publicar lotes |
| **Facebook Marketplace** | facebook.com/marketplace | Publicar lotes |
| **Instagram** | instagram.com | Crear perfil @laholanda.quimbaya |
| **Cámara de Comercio Armenia** | camaraarmenia.org.co | Registrar el negocio |

> Cada perfil externo genera un **backlink gratuito** a tu sitio.

---

## PASO 5: Contenido en Redes Sociales

### 5.1 Facebook
1. Crear página: **"La Holanda — Parcelación Campestre"**
2. Agregar enlace al sitio: `https://laholanda.ingesocc.com`
3. Publicar 2-3 veces por semana:
   - Fotos de los lotes
   - Videos de recorrido virtual
   - Testimonios de clientes
   - Información de la zona

### 5.2 Instagram
1. Crear perfil: `@laholanda.quimbaya`
2. Bio: "Lotes campestres en Quimbaya, Quindío 🌿 Con escritura pública"
3. Enlace en bio: `https://laholanda.ingesocc.com`
4. Usar hashtags: #LotesCampestres #Quimbaya #Quindío #EjeCafetero #FincaRaíz

---

## PASO 6: Monitoreo Semanal

### 6.1 Cada semana (lunes):
1. Abrir **Search Console**
2. Revisar **"Rendimiento"**: impresiones, clics, posición promedio
3. Revisar **"Cobertura"**: páginas indexadas vs errores
4. Revisar **"Core Web Vitals"**: LCP, CLS, INP

### 6.2 Métricas objetivo (primeros 3 meses):

| Métrica | Objetivo |
|---------|----------|
| Páginas indexadas | 20+ páginas |
| Impresiones mensuales | 500+ |
| Posición promedio (keywords principales) | Top 20 |
| CTR promedio | 2%+ |
| Core Web Vitals (LCP) | < 2.5s |

---

## Checklist Rápido

- [ ] Google Search Console creado y verificado
- [ ] Sitemap enviado en Search Console
- [ ] Indexación solicitada para 6 páginas clave
- [ ] Google Business Profile creado
- [ ] Ping al sitemap enviado
- [ ] Perfil en Fincaraíz creado
- [ ] Perfil en Metrocuadrado creado
- [ ] Página de Facebook creada
- [ ] Perfil de Instagram creado
- [ ] Primer post en redes sociales publicado

---

## ⚠️ Importante

- **No compres backlinks** — Google penaliza esto
- **No uses texto invisible** — Google penaliza esto
- **No hagas keyword stuffing** — Google penaliza esto
- **Sé paciente** — SEO toma 3-6 meses para mostrar resultados
- **Publica contenido nuevo** regularmente — Google favorece sitios activos

---

## 📊 Resultados Esperados

| Tiempo | Resultado esperado |
|--------|-------------------|
| **1 semana** | GoogleSearch Console muestra tu sitio, páginas comenzando a indexarse |
| **1 mes** | 15-20 páginas indexadas, apareciendo en búsquedas long-tail |
| **3 meses** | Top 20 para "lotes campestres Quimbaya", 500+ impresiones/mes |
| **6 meses** | Top 10 para keywords principales, 2000+ impresiones/mes |
| **12 meses** | Competir con portales genéricos en búsquedas locales |
