/** True when the visitor asked the OS for less motion. Safe where `matchMedia` is missing (SSR, jsdom). */
export function prefersReducedMotion(): boolean {
  return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}
