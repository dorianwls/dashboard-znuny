import { RouteErrorComponent } from "@/routes/route-error-component";
import { routeTree } from "@/routes/routes";
import { queryClient } from "@/lib/query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";

// Search params planos (?agentId=22) en lugar del JSON por defecto (?agentId=%2222%22): todos los filtros son texto.
const parseSearch = (search: string) =>
  Object.fromEntries(new URLSearchParams(search));

const stringifySearch = (search: Record<string, unknown>) => {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(search)) {
    if (value != null && value !== "") params.set(key, String(value));
  }
  const query = params.toString();
  return query ? `?${query}` : "";
};

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultErrorComponent: RouteErrorComponent,
  parseSearch,
  stringifySearch,
});

function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey="theme"
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
