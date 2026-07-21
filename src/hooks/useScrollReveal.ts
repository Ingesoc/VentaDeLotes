import { useEffect, useRef } from "react";

type RevealVariant =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "scale"
  | "none";

interface ScrollRevealOptions {
  /** Variante de animación. Por defecto: "fade-up" */
  variant?: RevealVariant;
  /** Umbral del IntersectionObserver. Por defecto: 0.1 */
  threshold?: number;
  /** Margen del IntersectionObserver. Por defecto: "0px 0px -40px 0px" */
  rootMargin?: string;
  /** Selector para animar hijos individualmente (ej: "section", ".card", "li") */
  childSelector?: string;
  /** Retardo entre cada animación hijo en ms. Por defecto: 100 */
  staggerDelay?: number;
}

const variantClass: Record<RevealVariant, string> = {
  "fade-up": "reveal-fade-up",
  "fade-down": "reveal-fade-down",
  "fade-left": "reveal-fade-left",
  "fade-right": "reveal-fade-right",
  scale: "reveal-scale",
  none: "",
};

export function useScrollReveal(options: ScrollRevealOptions = {}) {
  const {
    variant = "fade-up",
    threshold = 0.1,
    rootMargin = "0px 0px -40px 0px",
    childSelector,
    staggerDelay = 100,
  } = options;

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.style.opacity = "1";
            el.style.transform = "translate(0) scale(1)";
            el.style.transitionDelay = "";
            observer.unobserve(el);
          }
        });
      },
      { threshold, rootMargin }
    );

    const container = containerRef.current;
    const elements = container
      ? childSelector
        ? Array.from(container.querySelectorAll(childSelector))
        : [container]
      : [];

    const variantClassStr = variantClass[variant];

    for (const el of elements) {
      const htmlEl = el as HTMLElement;
      htmlEl.classList.add("reveal");
      htmlEl.style.opacity = "0";
      if (variantClassStr) {
        htmlEl.classList.add(variantClassStr);
      } else {
        htmlEl.style.transform = "none";
      }
    }

    // Stagger: retardos incrementales
    if (childSelector && staggerDelay > 0) {
      for (let i = 0; i < elements.length; i++) {
        (elements[i] as HTMLElement).style.transitionDelay = `${i * staggerDelay}ms`;
      }
    }

    for (const el of elements) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, [variant, threshold, rootMargin, childSelector, staggerDelay]);

  return containerRef;
}
