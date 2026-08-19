import { useCallback, useEffect, useRef } from "react";
import {
  trackEvent,
  type EventType,
  type TrackEventPayload,
} from "@/lib/analytics";

/**
 * Hook para tracking declarativo de eventos de producto.
 *
 * Proporciona dos formas de uso:
 *
 * 1. **Tracking imperativo** — devuelve `track` para llamar en handlers:
 *    ```tsx
 *    const { track } = useTrackEvent();
 *    <button onClick={() => track("contacto_iniciado", { lotId: "03" })}>
 *    ```
 *
 * 2. **Tracking automático** — mount/unmount o dependencias:
 *    ```tsx
 *    useTrackEvent({ eventType: "lote_visto", lotId: id, auto: true });
 *    ```
 *
 * El hook es seguro para usar en cualquier componente. Las llamadas son
 * fire-and-forget y nunca afectan el render.
 */
export function useTrackEvent(
  options?: TrackEventPayload & { auto?: boolean },
) {
  const optionsRef = useRef(options);

  // Sync ref inside effect to avoid updating during render
  useEffect(() => {
    optionsRef.current = options;
  });

  // Tracking automático al montar (o cuando cambian las dependencias)
  useEffect(() => {
    if (!options?.auto) return;

    // Pequeño delay para asegurar que el DOM está listo
    const timer = setTimeout(() => {
      trackEvent({
        eventType: options.eventType,
        lotId: options.lotId,
        pagePath: options.pagePath,
        metadata: options.metadata,
      });
    }, 100);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options?.auto, options?.eventType, options?.lotId]);

  /**
   * Track un evento manualmente.
   * Usa los valores por defecto del hook si no se proporcionan overrides.
   */
  const track = useCallback(
    (
      eventType?: EventType,
      overrides?: Partial<TrackEventPayload>,
    ) => {
      const base = optionsRef.current;
      trackEvent({
        eventType: eventType ?? base?.eventType ?? "page_view",
        lotId: overrides?.lotId ?? base?.lotId,
        pagePath: overrides?.pagePath ?? base?.pagePath,
        metadata: overrides?.metadata ?? base?.metadata,
        timeOnPageMs: overrides?.timeOnPageMs ?? base?.timeOnPageMs,
      });
    },
    [],
  );

  return { track };
}


