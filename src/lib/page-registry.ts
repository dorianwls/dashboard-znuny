import { lazy } from "react";

export type PageEntry = {
  path: string;
  component: React.LazyExoticComponent<React.ComponentType>;
  breadcrumb?: string;
};

export const pages: PageEntry[] = [
  {
    path: "/analisis",
    breadcrumb: "Análisis",
    component: lazy(() => import("@/modules/analytics/pages/analytics-index")),
  },
  {
    path: "/agentes",
    breadcrumb: "Agentes",
    component: lazy(() => import("@/modules/agents/pages/agent-index")),
  },
  {
    path: "/reportes",
    breadcrumb: "Reportes",
    component: lazy(() => import("@/modules/reports/pages/report-index")),
  },
  {
    path: "/mapa",
    breadcrumb: "Mapa institucional",
    component: lazy(() => import("@/modules/map/pages/map-index")),
  },
  {
    path: "$",
    component: lazy(() => import("@/modules/common/pages/not-found")),
  },
];
