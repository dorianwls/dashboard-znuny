import {
  ChartColumn,
  FileSpreadsheet,
  MapPinned,
  Users,
  type LucideIcon,
} from "lucide-react";

export type MenuItem = {
  id: string;
  name: string;
  route: string;
  icon: LucideIcon;
  section: string;
};

/** Menú lateral. La app no tiene usuarios, así que el menú es fijo. */
export const menu: MenuItem[] = [
  {
    id: "analisis",
    name: "Análisis",
    route: "/analisis",
    icon: ChartColumn,
    section: "Gestión de servicio",
  },
  {
    id: "agentes",
    name: "Agentes",
    route: "/agentes",
    icon: Users,
    section: "Gestión de servicio",
  },
  {
    id: "reportes",
    name: "Reportes",
    route: "/reportes",
    icon: FileSpreadsheet,
    section: "Gestión de servicio",
  },
  {
    id: "mapa",
    name: "Mapa institucional",
    route: "/mapa",
    icon: MapPinned,
    section: "Gestión de servicio",
  },
];

export const DEFAULT_ROUTE = menu[0].route;
