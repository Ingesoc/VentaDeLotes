---
tags:
  - diagrams
  - architecture
created: 2026-07-21
updated: 2026-08-12
---

# Diagramas del proyecto

Este directorio contiene los diagramas de arquitectura del proyecto en dos formatos: diagramas HTML editables con el navegador y archivos fuente de Draw.io para edición avanzada.

---

## Diagramas HTML (recomendados)

Se abren en cualquier navegador y usan el sistema de diseño del proyecto (paleta La Holanda). Son la versión actualizada de la documentación.

| Diagrama | Contenido |
| --- | --- |
| [Arquitectura del sistema](./arquitectura.html) | Vista general: navegador, lógica compartida y servicios en la nube |
| [Flujo de autenticación](./auth-flow.html) | Inicio de sesión del panel admin y verificación del rol |
| [Panel de administración](./admin-panel.html) | Estructura del panel: guard de rutas, páginas y servicios |
| [Sistema de autenticación](./authentication.html) | AuthProvider, Supabase Auth, verificación de rol y recuperación |
| [Base de datos](./database.html) | Modelo de datos en Supabase: lotes, contactos, visitas y administradores |
| [Árbol de rutas](./routing.html) | Rutas públicas y rutas del panel admin (carga perezosa) |
| [Pipeline de CI](./ci-cd.html) | Flujo de integración continua: calidad, pruebas y despliegue |
| [Estructura del proyecto](./estructura.html) | Organización de carpetas de `src/` |
| [Subida de imágenes](./upload.html) | Cómo se sube una imagen de lote con Cloudinary |

---

## Archivos fuente de Draw.io (edición)

Para editar los diagramas con el editor visual de [draw.io](https://app.diagrams.net) o con la extensión de VS Code "Draw.io Integration". Estos archivos son los que se usan como fuente para generar los HTML.

| Archivo | Contenido |
| --- | --- |
| [arquitectura.drawio](./arquitectura.drawio) | Arquitectura general del sistema |
| [auth-flow.drawio](./auth-flow.drawio) | Flujo de autenticación paso a paso |
| [database-routing.drawio](./database-routing.drawio) | Esquema de base de datos y árbol de rutas |

> Nota: si se edita un archivo Draw.io, conviene regenerar el HTML correspondiente para que la documentación quede sincronizada.

---

## Enlaces relacionados

- [Índice de documentación](../index.md)
- [Arquitectura del proyecto](../architecture/overview.md)
- [Guía de onboarding](../guides/onboarding.md)
- [Sistema de autenticación](../features/authentication.md)
- [Base de datos](../features/database.md)
- [Sistema de enrutamiento](../features/routing.md)
