export function genNumArray(n) {
  return Array.apply(null, { length: n }).map(Number.call, Number);
}
