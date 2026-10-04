import { useRouterState } from "@tanstack/react-router";
import { pages } from "@/lib/page-registry";

export type BreadcrumbSegment = {
  label: string;
  href: string;
  isLast: boolean;
};

const breadcrumbMap = new Map(
  pages
    .filter((p) => p.breadcrumb !== undefined)
    .map((p) => [p.path, p.breadcrumb!]),
);

/** Segmentos del breadcrumb para la ruta actual (todas las rutas son de un nivel). */
export function useBreadcrumbs(): BreadcrumbSegment[] {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const parts = pathname.split("/").filter(Boolean);
  const segments: BreadcrumbSegment[] = [];

  for (let i = 0; i < parts.length; i++) {
    const href = "/" + parts.slice(0, i + 1).join("/");
    const label = breadcrumbMap.get(href);
    if (label) segments.push({ label, href, isLast: false });
  }

  if (segments.length > 0) segments[segments.length - 1].isLast = true;

  return segments;
}
