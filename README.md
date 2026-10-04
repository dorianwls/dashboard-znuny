# Dashboard estadístico (TanStack + shadcn/ui)

Frontend del panel de Service Desk sobre la API ZnunyStats (.NET).
La estructura sigue la de [sisprenic_frontend](https://github.com/mateyr/sisprenic_frontend).

- **Vite + React 19 + TypeScript**
- **TanStack Router** con rutas por código (`src/routes`) y registro de páginas (`src/lib/page-registry.ts`). Los filtros viven en la URL (`?from=…&agentId=…&ticket=…`), así cada vista se comparte con un enlace.
- **TanStack Query** para caché y carga de datos; claves centralizadas en `src/lib/query-keys.ts`.
- **TanStack Table** para la tabla de tickets (paginación en el backend).
- **shadcn/ui** (Radix + Tailwind CSS v4) para los componentes base; tema claro/oscuro con `next-themes`.

## Ejecutar

```bash
cp .env.example .env.local
npm install
npm run dev                  # http://localhost:3001
```

En desarrollo `/api` se reenvía por proxy al backend (`VITE_API_BASE_URL`, por defecto `http://localhost:5080`), así que no depende del CORS del backend.
Para producción (`npm run build`), definí `VITE_API_BASE_URL` y agregá el origen del frontend en `appsettings.json → Estadisticas:CorsOrigins`.

Otros scripts: `npm run lint`, `npm run typecheck`, `npm run preview`.

## Estructura

```
src/
  App.tsx           providers (tema, QueryClient) y router
  main.tsx          punto de entrada
  index.css         tokens de diseño (shadcn) y tema oscuro
  components/
    ui/             componentes base de shadcn/ui (button, card, sheet, sidebar, table…)
    *.tsx           componentes compartidos de la app (panel, gráficos, estados…)
  hooks/            hooks compartidos (breadcrumbs, móvil, estado de conexión…)
  layouts/
    main-layout/    sidebar, encabezado, breadcrumb y selector de tema
  lib/              http, errores de API, env, formatos, query keys, menú y registro de páginas
  routes/           árbol de rutas, ruta raíz y componente de error
  types/            tipos de la API compartidos
  modules/          un módulo por capacidad
    <modulo>/
      pages/        páginas (cargadas con lazy desde el registro)
      components/   componentes propios del módulo
      hooks/        hooks de TanStack Query (useX)
      services/     llamadas a la API (fetch)
      types/        tipos del módulo
```

Módulos: `analytics` (Análisis), `agents` (Agentes), `reports` (Reportes), `map` (Mapa institucional), `tickets`, `filters`, `catalogs`, `sync`, `common`.

Para agregar una página: crearla en `modules/<modulo>/pages`, registrarla en `lib/page-registry.ts` y, si va en el menú, en `lib/menu.ts`.
