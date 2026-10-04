import { useMemo } from "react";
import { createPortal } from "react-dom";
import {
  LayerGroup,
  LayersControl,
  MapContainer,
  Marker,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import { divIcon, latLngBounds } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatInt } from "@/lib/formats";
import type { Located } from "../types/location-types";

// Teselas gratuitas sin clave de API. Esri World Imagery tiene buena resolución en Managua (UNI incluida).
const ESRI = "https://server.arcgisonline.com/ArcGIS/rest/services";
const ESRI_ATTRIBUTION =
  'Imágenes &copy; <a href="https://www.esri.com">Esri</a>, Maxar, Earthstar Geographics';
const OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

/** Vista aérea (satélite con etiquetas) de los recintos, con un marcador por ubicación. */
export function CampusMap({
  locations,
  selectedKey,
  onSelect,
}: {
  locations: Located[];
  selectedKey: string;
  onSelect: (key: string) => void;
}) {
  const bounds = latLngBounds(
    locations.map((l) => [l.latitude, l.longitude]),
  ).pad(0.15);

  return (
    <MapContainer
      className="lmap z-0 h-[420px] overflow-hidden rounded-lg lg:h-[520px]"
      bounds={bounds}
      maxZoom={20}
      scrollWheelZoom={false}
    >
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="Vista aérea">
          <LayerGroup>
            <TileLayer
              url={`${ESRI}/World_Imagery/MapServer/tile/{z}/{y}/{x}`}
              attribution={ESRI_ATTRIBUTION}
              maxNativeZoom={19}
              maxZoom={20}
            />
            <TileLayer
              url={`${ESRI}/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}`}
              maxNativeZoom={19}
              maxZoom={20}
            />
            <TileLayer
              url={`${ESRI}/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}`}
              maxNativeZoom={19}
              maxZoom={20}
            />
          </LayerGroup>
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Calles (OpenStreetMap)">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution={OSM_ATTRIBUTION}
            maxNativeZoom={19}
            maxZoom={20}
          />
        </LayersControl.BaseLayer>
      </LayersControl>

      {locations.map((l) => (
        <PinMarker
          key={l.key}
          location={l}
          selected={l.key === selectedKey}
          onSelect={onSelect}
        />
      ))}
    </MapContainer>
  );
}

/** Marcador con el Pin de React montado (vía portal) dentro del divIcon de Leaflet; al elegirlo, acerca el mapa al recinto. */
function PinMarker({
  location: l,
  selected,
  onSelect,
}: {
  location: Located;
  selected: boolean;
  onSelect: (key: string) => void;
}) {
  const map = useMap();
  const container = useMemo(() => document.createElement("div"), []);
  const icon = useMemo(
    () =>
      divIcon({ className: "lmap-pin", iconSize: undefined, html: container }),
    [container],
  );
  return (
    <Marker
      position={[l.latitude, l.longitude]}
      icon={icon}
      zIndexOffset={selected ? 1000 : 0}
      eventHandlers={{
        click: () => {
          onSelect(l.key);
          map.flyTo([l.latitude, l.longitude], 18);
        },
      }}
    >
      {createPortal(
        <Pin label={l.key} count={l.total} selected={selected} />,
        container,
      )}
      <Tooltip direction="top" offset={[0, -14]}>
        {l.name}: {formatInt(l.total)} tickets
      </Tooltip>
    </Marker>
  );
}

export function Pin({
  label,
  count,
  selected,
}: {
  label: string;
  count: number;
  selected: boolean;
}) {
  return (
    <span
      className={cn(
        "flex w-max items-center gap-1.5 rounded-full border-2 py-1 pr-1 pl-2 text-xs font-semibold shadow-lg transition-transform",
        selected
          ? "scale-110 border-white bg-primary text-white"
          : "border-white bg-[#14283a] text-white",
      )}
    >
      <Building2 className="size-3.5" aria-hidden="true" />
      {label}
      <em className="rounded-full bg-white/20 px-1.5 font-figures not-italic">
        {formatInt(count)}
      </em>
    </span>
  );
}
