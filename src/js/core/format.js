/** Rounds for display and drops trailing zeros; keeps NaN/Infinity readable. */
export function fmt(n, digits = 3) {
  if (!Number.isFinite(n)) return String(n);
  const value = +n.toFixed(digits);
  return String(Object.is(value, -0) ? 0 : value);
}

export function fmtVec(v, digits = 2) {
  return `{ x: ${fmt(v.x, digits)}, y: ${fmt(v.y, digits)} }`;
}
