import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import { router } from './router'
import { AuthProvider } from './hooks/useAuth'

/* ─── Service Worker (PWA) ───────────────────────────── */
if ('serviceWorker' in navigator) {
  // El plugin VitePWA con registerType: 'autoUpdate' inyecta
  // el registro automáticamente. Este bloque es un respaldo
  // para manejar actualizaciones y mostrar notificación al usuario.
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    // Nueva versión del SW activa — recargar para aplicar cambios
    window.location.reload()
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
