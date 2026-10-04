// Duraciones en segundos, porcentajes 0–100, null = no calculable.

const intFormat = new Intl.NumberFormat("es-NI");

export const formatInt = (n: number | null | undefined) =>
  n == null ? "—" : intFormat.format(n);

export const formatPercent = (n: number | null | undefined) =>
  n == null
    ? "—"
    : `${n.toLocaleString("es-NI", { maximumFractionDigits: 1 })}%`;

export function formatDuration(seconds: number | null | undefined) {
  if (seconds == null) return "—";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 48)
    return `${hours} h ${String(minutes % 60).padStart(2, "0")} m`;
  return `${Math.floor(hours / 24)} d ${hours % 24} h`;
}

export function formatDate(iso: string, withTime = false) {
  return new Date(iso).toLocaleString("es-NI", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
    timeZone: "America/Managua",
  });
}

/** "2026-09-02" → "02 sep 2026" sin desplazamientos por zona horaria. */
export function formatDay(day: string) {
  const [y, m, d] = day.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("es-NI", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function timeAgo(ms: number) {
  const minutes = Math.max(0, Math.round((Date.now() - ms) / 60000));
  if (minutes < 1) return "hace instantes";
  if (minutes < 60) return `hace ${minutes} min`;
  return `hace ${Math.round(minutes / 60)} h`;
}

/** Variación relativa entre períodos; null si la base es cero. */
export function percentChange(current: number | null, previous: number | null) {
  if (current == null || previous == null || previous === 0) return null;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

export const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
