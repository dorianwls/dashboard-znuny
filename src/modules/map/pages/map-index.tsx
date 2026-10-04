import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ActiveFilters } from "@/modules/filters/components/active-filters";
import { useFilters } from "@/modules/filters/hooks/use-filters";
import type { AppSearch } from "@/modules/filters/types/filter-types";
import { ExportButton } from "@/modules/reports/components/export-button";
import { cn } from "@/lib/utils";
import { Empty, ErrorState, PageSkeleton } from "@/components/states";
import { PageHeader } from "@/components/page-header";
import { Panel } from "@/components/panel";
import { useLocations } from "../hooks/use-locations";
import { hasCoordinates } from "../types/location-types";
import { CampusMap } from "../components/campus-map";
import { LocationDetail } from "../components/location-detail";
import { SitePlan } from "../components/site-plan";

export default function MapIndex() {
  const { filters } = useFilters();
  const navigate = useNavigate();
  const { data, error, refetch, isPlaceholderData } = useLocations(filters);
  const [selectedKey, setSelectedKey] = useState(filters.location || "RUSB");

  const selected =
    data?.locations.find((l) => l.key === selectedKey) ?? data?.locations[0];
  const geo = data?.locations.filter(hasCoordinates) ?? [];
  const aerial = geo.length > 0;

  return (
    <>
      <PageHeader
        title="Mapa institucional"
        subtitle="Demanda e indicadores por recinto universitario."
        action={<ExportButton kind="servicio" />}
      />
      <ActiveFilters ignore={["location"]} />

      {error ? (
        <ErrorState message={error.message} onRetry={() => void refetch()} />
      ) : !data ? (
        <PageSkeleton />
      ) : data.locations.length === 0 ? (
        <Panel title="Sin recintos">
          <Empty>No hay ubicaciones configuradas en el backend.</Empty>
        </Panel>
      ) : (
        <div
          className={cn(
            "grid items-start gap-4 lg:grid-cols-[1.6fr_1fr]",
            isPlaceholderData && "opacity-60",
          )}
        >
          <Panel
            title={
              aerial ? "Vista aérea de la institución" : "Plano institucional"
            }
            subtitle="Tickets del período por recinto, según la cola que los atiende. Elegí un recinto para ver sus indicadores."
          >
            {aerial ? (
              <CampusMap
                locations={geo}
                selectedKey={selected?.key ?? ""}
                onSelect={setSelectedKey}
              />
            ) : (
              <SitePlan
                locations={data.locations}
                selectedKey={selected?.key ?? ""}
                onSelect={setSelectedKey}
              />
            )}
            <p className="mt-3 text-xs text-muted-foreground">
              {aerial
                ? "Imágenes satelitales de Esri y mapa de OpenStreetMap (gratuitos). Las coordenadas de cada recinto se configuran en el backend (appsettings.json → Estadisticas:Locations)."
                : "Plano ilustrativo. Para ver la vista aérea real, configurá Latitude y Longitude de cada recinto en el backend (appsettings.json → Estadisticas:Locations)."}
            </p>
          </Panel>
          {selected && (
            <LocationDetail
              location={selected}
              onViewTickets={() =>
                void navigate({
                  to: "/analisis",
                  search: (prev: AppSearch) => ({
                    ...prev,
                    location: selected.key,
                  }),
                })
              }
            />
          )}
        </div>
      )}
    </>
  );
}
