/** Escala con divisiones redondas (0, 5, 10… / 0, 50, 100…). */
export function niceScale(peak: number, divisions = 4) {
  const raw = Math.max(1, peak) / divisions;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const step =
    [1, 2, 2.5, 5, 10]
      .map((m) => m * magnitude)
      .find((s) => s >= raw && Number.isInteger(s)) ?? Math.ceil(raw);
  return {
    max: step * divisions,
    ticks: Array.from(
      { length: divisions + 1 },
      (_, i) => step * (divisions - i),
    ),
  };
}
