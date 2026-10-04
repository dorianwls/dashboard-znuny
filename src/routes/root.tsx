import {
  filterKeys,
  validateAppSearch,
} from "@/modules/filters/types/filter-types";
import {
  createRootRoute,
  Outlet,
  retainSearchParams,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const rootRoute = createRootRoute({
  validateSearch: validateAppSearch,
  // Los filtros acompañan al usuario entre módulos; el ticket abierto no.
  search: { middlewares: [retainSearchParams([...filterKeys])] },
  component: () => (
    <>
      <Outlet />
      {import.meta.env.DEV && (
        <TanStackRouterDevtools position="bottom-right" initialIsOpen={false} />
      )}
    </>
  ),
});
