import { useState } from "react";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  /** Ej: "aspect-[4/3]", "aspect-video" — evita saltos de layout */
  aspectClassName?: string;
  /** Para imágenes visibles sin scroll (Hero, primera) */
  priority?: boolean;
}

export function LazyImage({
  src,
  alt,
  className = "",
  aspectClassName = "aspect-[4/3]",
  priority = false,
}: LazyImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${aspectClassName} ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-surface-container-high" />
      )}
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        onLoad={() => setLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
