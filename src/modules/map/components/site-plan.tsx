import { useState } from "react";
import { ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LocationSummary } from "../types/location-types";
import { Pin } from "./campus-map";

/** Posiciones del plano ilustrativo, usado cuando los recintos no tienen coordenadas. */
const positions: Record<string, { left: string; top: string }> = {
  RUSB: { left: "28%", top: "34%" },
  RUPAP: { left: "70%", top: "28%" },
  DGTI: { left: "48%", top: "68%" },
};

export function SitePlan({
  locations,
  selectedKey,
  onSelect,
}: {
  locations: LocationSummary[];
  selectedKey: string;
  onSelect: (key: string) => void;
}) {
  const [zoom, setZoom] = useState(1);
  return (
    <div className="relative h-[360px] overflow-hidden rounded-lg border border-border bg-muted lg:h-[460px]">
      <div
        className="absolute inset-0 transition-transform duration-300"
        style={{ transform: `scale(${zoom})` }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] bg-[size:32px_32px] opacity-70"
        />
        <div
          aria-hidden="true"
          className="absolute top-[52%] -left-10 h-3 w-[120%] -rotate-6 bg-input/70"
        />
        <div
          aria-hidden="true"
          className="absolute -top-10 left-[58%] h-[120%] w-3 rotate-12 bg-input/70"
        />
        {locations.map((l) => (
          <button
            key={l.key}
            type="button"
            onClick={() => onSelect(l.key)}
            aria-pressed={l.key === selectedKey}
            aria-label={`${l.name}: ${l.total} tickets`}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={positions[l.key] ?? { left: "50%", top: "50%" }}
          >
            <Pin
              label={l.key}
              count={l.total}
              selected={l.key === selectedKey}
            />
          </button>
        ))}
      </div>
      <div className="absolute right-3 bottom-3 flex flex-col gap-1 rounded-lg border border-border bg-card p-1 shadow-card">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setZoom(Math.min(1.3, zoom + 0.1))}
          aria-label="Acercar"
        >
          <ZoomIn />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setZoom(Math.max(0.8, zoom - 0.1))}
          aria-label="Alejar"
        >
          <ZoomOut />
        </Button>
      </div>
    </div>
  );
}
