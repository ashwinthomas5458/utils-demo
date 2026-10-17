/**
 * Samples `fn` over [from, to] and returns an SVG path string. `toX` and
 * `toY` map domain values into viewBox coordinates.
 */
export function plotPath(fn, from, to, samples, toX, toY) {
  let d = '';
  for (let i = 0; i <= samples; i++) {
    const v = from + ((to - from) * i) / samples;
    d += `${i ? 'L' : 'M'}${+toX(v).toFixed(1)} ${+toY(fn(v)).toFixed(1)}`;
  }
  return d;
}

/**
 * Loop used by the hero and easing demos: ramp 0→1 over `period` seconds,
 * hold, ramp back, hold.
 */
export function pingPong(time, period, hold = 0.6) {
  const u = time % (2 * period + 2 * hold);
  if (u < period) return u / period;
  if (u < period + hold) return 1;
  if (u < 2 * period + hold) return 1 - (u - period - hold) / period;
  return 0;
}

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
