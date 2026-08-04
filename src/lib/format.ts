export function formatPrice(price: number): string {
  const millones = price / 1_000_000;
  if (millones >= 100) {
    return `$${Math.round(millones).toLocaleString("es-CO")}M`;
  }
  return `$${millones.toLocaleString("es-CO", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })}M`;
}

export function formatExactPrice(price: number): string {
  return `$${price.toLocaleString("es-CO")} COP`;
}
