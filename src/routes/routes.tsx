import MainLayout from "@/layouts/main-layout/main-layout";
import { DEFAULT_ROUTE } from "@/lib/menu";
import { pages } from "@/lib/page-registry";
import { rootRoute } from "@/routes/root";
import { createRoute, redirect } from "@tanstack/react-router";

// Main Layout
const mainRouteLayout = createRoute({
  getParentRoute: () => rootRoute,
  id: "main-route",
  component: MainLayout,
});

// "/" lleva al primer módulo del menú conservando los filtros de la URL.
const indexRoute = createRoute({
  getParentRoute: () => mainRouteLayout,
  path: "/",
  beforeLoad: ({ search }) => {
    throw redirect({ to: DEFAULT_ROUTE, search });
  },
});

const pageRoutes = pages.map(({ path, component }) =>
  createRoute({
    getParentRoute: () => mainRouteLayout,
    path,
    component,
  }),
);

export const routeTree = rootRoute.addChildren([
  mainRouteLayout.addChildren([indexRoute, ...pageRoutes]),
]);
