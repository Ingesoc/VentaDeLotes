import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router/dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,       // 5 min — datos del admin no cambian cada segundo
      gcTime: 10 * 60 * 1000,          // 10 min — mantener en cache después de desmontar
      refetchOnWindowFocus: true,        // refrescar al volver a la pestaña
      retry: 1,                          // un retry en caso de error de red
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
